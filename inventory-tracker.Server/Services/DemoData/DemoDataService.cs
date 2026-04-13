using inventory_management.Server.Contracts.Common;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;
using inventory_management.Server.Services.Authentication;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Services.DemoData;

public sealed class DemoDataService(AppDbContext dbContext, IPasswordService passwordService) : IDemoDataService
{
    private const string DemoSkuPrefix = "DEMO-";
    private const string DemoEmailDomain = "@demo.invtra.local";
    private const string DemoUserPassword = "Demo123!";
    private const decimal TargetInventoryValue = 120000m;
    private const decimal TargetProfitMargin = 0.15m;
    private const int ProductCount = 72;

    public async Task<DemoDataResultDto> GenerateAsync()
    {
        var resetResult = await ResetAsync();
        var summary = CreateSummary(resetResult);

        var subCategories = await LoadSeededSubCategoriesAsync();
        if (subCategories.Count == 0)
        {
            summary.Message = "No seeded categories were found. Demo data was not generated.";
            return summary;
        }

        await EnsureDemoUsersAsync(summary);

        var availableUsers = await LoadAvailableUsersAsync();
        if (availableUsers.Count == 0)
        {
            summary.Message = "Demo users could not be created. Demo products and transactions were skipped.";
            return summary;
        }

        var context = new DemoDataGenerationContext(summary, subCategories, availableUsers);

        await CreateProductsAsync(context);
        BuildInventoryTargets(context);
        GenerateTransactions(context);
        ApplyShowcaseAdjustments(context);

        dbContext.Transactions.AddRange(context.Transactions);
        await dbContext.SaveChangesAsync();

        summary.ProductsCreated = context.Products.Count;
        summary.TransactionsCreated = context.Transactions.Count;
        summary.Message = "Fresh demo data was generated using seeded categories, subcategories, and roles.";

        return summary;
    }

    public async Task<DemoDataResultDto> ResetAsync()
    {
        var demoTransactions = await dbContext.Transactions
            .Where(transaction =>
                transaction.Product.Sku.StartsWith(DemoSkuPrefix) ||
                transaction.User.Email.EndsWith(DemoEmailDomain))
            .ToListAsync();

        var demoProducts = await dbContext.Products
            .Where(product => product.Sku.StartsWith(DemoSkuPrefix))
            .ToListAsync();

        var demoUsers = await dbContext.Users
            .Include(user => user.UserRoles)
            .Where(user => user.Email.EndsWith(DemoEmailDomain))
            .ToListAsync();

        var demoUserRoles = demoUsers
            .SelectMany(user => user.UserRoles)
            .ToList();

        dbContext.Transactions.RemoveRange(demoTransactions);
        dbContext.UserRoles.RemoveRange(demoUserRoles);
        dbContext.Products.RemoveRange(demoProducts);
        dbContext.Users.RemoveRange(demoUsers);
        await dbContext.SaveChangesAsync();

        return new DemoDataResultDto
        {
            TransactionsRemoved = demoTransactions.Count,
            ProductsRemoved = demoProducts.Count,
            UsersRemoved = demoUsers.Count,
            Message = "Existing demo data was removed.",
        };
    }

    private static DemoDataResultDto CreateSummary(DemoDataResultDto resetResult)
    {
        return new DemoDataResultDto
        {
            UsersRemoved = resetResult.UsersRemoved,
            ProductsRemoved = resetResult.ProductsRemoved,
            TransactionsRemoved = resetResult.TransactionsRemoved,
        };
    }

    private async Task<List<SubCategory>> LoadSeededSubCategoriesAsync()
    {
        return await dbContext.SubCategories
            .Include(item => item.Category)
            .Where(item => item.CategoryId != null)
            .OrderBy(item => item.Category!.Name)
            .ThenBy(item => item.Name)
            .ToListAsync();
    }

    private async Task EnsureDemoUsersAsync(DemoDataResultDto summary)
    {
        var roles = await dbContext.Roles
            .Where(role => DemoDataSeedDefinitions.DemoRoleNames.Contains(role.Name))
            .ToDictionaryAsync(role => role.Name, StringComparer.OrdinalIgnoreCase);

        foreach (var (name, email, roleName) in DemoDataSeedDefinitions.DemoUsers)
        {
            if (await dbContext.Users.AnyAsync(user => EF.Functions.ILike(user.Email, email)))
            {
                continue;
            }

            if (!roles.TryGetValue(roleName, out var role))
            {
                continue;
            }

            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = passwordService.HashPassword(DemoUserPassword),
                CreatedAt = DateTime.UtcNow,
            };

            var userRole = new UserRole
            {
                User = user,
                Role = role,
            };

            dbContext.Users.Add(user);
            dbContext.UserRoles.Add(userRole);
            user.UserRoles.Add(userRole);
            role.UserRoles.Add(userRole);
            summary.UsersCreated += 1;
        }

        await dbContext.SaveChangesAsync();
    }

    private async Task<List<User>> LoadAvailableUsersAsync()
    {
        return await dbContext.Users
            .Include(user => user.UserRoles)
            .ThenInclude(link => link.Role)
            .Where(user => user.Email.EndsWith(DemoEmailDomain))
            .ToListAsync();
    }

    private async Task CreateProductsAsync(DemoDataGenerationContext context)
    {
        for (var i = 0; i < ProductCount; i += 1)
        {
            var subCategory = context.SubCategories[i % context.SubCategories.Count];
            var createdAt = context.DemoTimelineEnd.AddDays(-context.Random.Next(45, 180));
            var sku = $"{DemoSkuPrefix}{subCategory.Name[..Math.Min(3, subCategory.Name.Length)].ToUpperInvariant()}-{i + 1:000}";
            var productName = BuildDemoProductName(subCategory, i / context.SubCategories.Count);
            var baseCost = GenerateBaseCost(context.Random, subCategory.Name, productName);

            var product = new Product
            {
                Name = productName,
                Sku = sku,
                Description = $"Demo inventory item for {subCategory.Category?.Name} / {subCategory.Name}.",
                ImageUrl = string.Empty,
                Quantity = 0,
                UnitCost = baseCost,
                SellingPrice = Math.Round(baseCost * (decimal)(1.18 + (context.Random.NextDouble() * 0.42)), 2),
                SubCategoryId = subCategory.Id,
                SubCategory = subCategory,
                CreatedAt = createdAt,
                UpdatedAt = createdAt,
            };

            context.Products.Add(product);
            dbContext.Products.Add(product);
        }

        await dbContext.SaveChangesAsync();
    }

    private static void BuildInventoryTargets(DemoDataGenerationContext context)
    {
        var inventoryWeights = context.Products.ToDictionary(
            product => product.Id,
            product => product.UnitCost * (decimal)(0.75 + (context.Random.NextDouble() * 0.5)));
        var totalWeight = inventoryWeights.Values.Sum();

        foreach (var product in context.Products)
        {
            var inventoryShare = totalWeight == 0
                ? 0m
                : inventoryWeights[product.Id] / totalWeight;
            var targetValue = TargetInventoryValue * inventoryShare;
            var targetFinalQuantity = Math.Max(
                1,
                (int)Math.Round(targetValue / Math.Max(1m, product.UnitCost), MidpointRounding.AwayFromZero));
            var turnoverMultiplier = 3.05m + (decimal)(context.Random.NextDouble() * 0.4d);
            var targetPurchasedQuantity = Math.Max(
                targetFinalQuantity + 1,
                (int)Math.Round(targetFinalQuantity * turnoverMultiplier, MidpointRounding.AwayFromZero));

            context.TargetFinalQuantities[product.Id] = targetFinalQuantity;
            context.TargetPurchasedQuantities[product.Id] = targetPurchasedQuantity;
        }
    }

    private void GenerateTransactions(DemoDataGenerationContext context)
    {
        foreach (var product in context.Products)
        {
            var targetPurchasedQuantity = context.TargetPurchasedQuantities[product.Id];
            var targetFinalQuantity = context.TargetFinalQuantities[product.Id];

            GenerateIncomingTransactions(context, product, targetPurchasedQuantity);
            GenerateOutgoingTransactions(context, product, targetPurchasedQuantity, targetFinalQuantity);
            ApplyRandomAdjustment(context, product, targetFinalQuantity);
            ApplyFinalAdjustment(context, product, targetFinalQuantity);
        }
    }

    private void GenerateIncomingTransactions(DemoDataGenerationContext context, Product product, int targetPurchasedQuantity)
    {
        var recentRestockQuantity = Math.Max(1, (int)Math.Round(targetPurchasedQuantity * (decimal)(0.08 + (context.Random.NextDouble() * 0.08))));
        var plannedIncomingQuantity = Math.Max(1, targetPurchasedQuantity - recentRestockQuantity);
        var incomingBatches = SplitQuantity(context.Random, plannedIncomingQuantity, context.Random.Next(2, 5));

        foreach (var quantity in incomingBatches)
        {
            var unitCost = Math.Round(product.UnitCost * (decimal)(0.88 + (context.Random.NextDouble() * 0.34)), 2);
            var expenseAmount = Math.Round(quantity * (decimal)(0.35 + (context.Random.NextDouble() * 1.2)), 2);
            var transactionDate = ClampToNow(
                product.CreatedAt.AddDays(context.Random.Next(0, 60)).AddHours(context.Random.Next(8, 19)),
                context.DemoTimelineEnd);
            var user = PickRandomUser(context);

            ApplyIncomingInventory(product, quantity, unitCost, expenseAmount, transactionDate);
            context.Transactions.Add(BuildIncomingTransaction(product, user, quantity, unitCost, expenseAmount, transactionDate, "Demo restock shipment"));
        }

        var recentRestockDate = context.DemoTimelineEnd
            .AddDays(-context.Random.Next(0, 21))
            .AddHours(-context.Random.Next(0, 10));
        var recentRestockUnitCost = Math.Round(
            product.UnitCost * (decimal)(0.94 + (context.Random.NextDouble() * 0.12)),
            2);
        var recentRestockExpense = Math.Round(recentRestockQuantity * (decimal)(0.2 + (context.Random.NextDouble() * 0.9)), 2);
        var recentRestockUser = PickRandomUser(context);

        ApplyIncomingInventory(product, recentRestockQuantity, recentRestockUnitCost, recentRestockExpense, recentRestockDate);
        product.SellingPrice = Math.Round(
            product.UnitCost * (decimal)(1.22 + (context.Random.NextDouble() * 0.38)),
            2,
            MidpointRounding.AwayFromZero);

        context.Transactions.Add(BuildIncomingTransaction(
            product,
            recentRestockUser,
            recentRestockQuantity,
            recentRestockUnitCost,
            recentRestockExpense,
            recentRestockDate,
            "Demo featured restock"));
    }

    private void GenerateOutgoingTransactions(DemoDataGenerationContext context, Product product, int targetPurchasedQuantity, int targetFinalQuantity)
    {
        var targetSoldQuantity = Math.Max(1, targetPurchasedQuantity - targetFinalQuantity);
        var salesWindowStart = product.CreatedAt.AddDays(context.Random.Next(7, 18));
        var salesWindowEnd = ClampToNow(context.DemoTimelineEnd.AddDays(-context.Random.Next(2, 10)), context.DemoTimelineEnd);
        var outgoingQuantities = SplitQuantity(context.Random, targetSoldQuantity, context.Random.Next(4, 9));
        var outgoingDates = Enumerable.Range(0, outgoingQuantities.Count)
            .Select(_ =>
            {
                var totalSalesWindowDays = Math.Max(1, (salesWindowEnd.Date - salesWindowStart.Date).Days);
                return ClampToNow(
                    salesWindowStart
                        .AddDays(context.Random.Next(0, totalSalesWindowDays))
                        .AddHours(context.Random.Next(8, 19)),
                    context.DemoTimelineEnd);
            })
            .OrderBy(date => date)
            .ToList();

        for (var saleIndex = 0; saleIndex < outgoingDates.Count; saleIndex += 1)
        {
            if (product.Quantity == 0)
            {
                break;
            }

            var transactionDate = outgoingDates[saleIndex];
            var quantity = Math.Min(product.Quantity, outgoingQuantities[saleIndex]);
            var user = PickRandomUser(context);
            var unitPrice = CalculateRealizedUnitPrice(context.Random, product.UnitCost, product.SellingPrice);

            product.Quantity -= quantity;
            if (transactionDate > product.UpdatedAt)
            {
                product.UpdatedAt = transactionDate;
            }

            context.Transactions.Add(new InventoryTransaction
            {
                ProductId = product.Id,
                Product = product,
                Type = TransactionType.Out,
                Quantity = quantity,
                UnitCost = product.UnitCost,
                UnitPrice = unitPrice,
                ExpenseAmount = 0,
                UserId = user.Id,
                User = user,
                Reason = "Sale",
                Note = "Demo customer order",
                CreatedAt = transactionDate,
            });
        }
    }

    private void ApplyRandomAdjustment(DemoDataGenerationContext context, Product product, int targetFinalQuantity)
    {
        if (context.Random.NextDouble() >= 0.35)
        {
            return;
        }

        var adjustedQuantity = Math.Max(0, targetFinalQuantity + context.Random.Next(-2, 3));
        var adjustmentDelta = Math.Abs(adjustedQuantity - product.Quantity);
        if (adjustmentDelta == 0)
        {
            return;
        }

        var transactionDate = ClampToNow(
            product.UpdatedAt.AddDays(context.Random.Next(1, 10)).AddHours(context.Random.Next(8, 19)),
            context.DemoTimelineEnd);
        var user = PickRandomUser(context);

        product.Quantity = adjustedQuantity;
        product.UpdatedAt = transactionDate;
        context.Transactions.Add(BuildAdjustmentTransaction(product, user, adjustmentDelta, transactionDate, "Demo stock audit adjustment"));
    }

    private void ApplyFinalAdjustment(DemoDataGenerationContext context, Product product, int targetFinalQuantity)
    {
        if (product.Quantity == targetFinalQuantity)
        {
            return;
        }

        var finalAdjustmentDate = ClampToNow(
            product.UpdatedAt.AddDays(context.Random.Next(1, 4)).AddHours(context.Random.Next(8, 19)),
            context.DemoTimelineEnd);
        var adjustmentDelta = Math.Abs(targetFinalQuantity - product.Quantity);
        var user = PickRandomUser(context);

        product.Quantity = targetFinalQuantity;
        product.UpdatedAt = finalAdjustmentDate;
        context.Transactions.Add(BuildAdjustmentTransaction(product, user, adjustmentDelta, finalAdjustmentDate, "Demo cycle count reconciliation"));
    }

    private static void ApplyShowcaseAdjustments(DemoDataGenerationContext context)
    {
        if (context.Products.Count < 3)
        {
            return;
        }

        var outOfStockProduct = context.Products
            .OrderBy(product => product.UnitCost)
            .First();
        var lowStockProduct = context.Products
            .OrderByDescending(product => product.UnitCost)
            .Skip(1)
            .First();
        var premiumProduct = context.Products
            .OrderByDescending(product => product.UnitCost)
            .First();

        outOfStockProduct.Quantity = 0;
        outOfStockProduct.SellingPrice = Math.Round(outOfStockProduct.UnitCost * 1.24m, 2);

        lowStockProduct.Quantity = Math.Min(lowStockProduct.Quantity, 2);
        lowStockProduct.SellingPrice = Math.Round(lowStockProduct.UnitCost * 1.21m, 2);

        premiumProduct.SellingPrice = Math.Round(premiumProduct.UnitCost * 1.17m, 2);
    }

    private static User PickRandomUser(DemoDataGenerationContext context)
    {
        return context.AvailableUsers[context.Random.Next(context.AvailableUsers.Count)];
    }

    private static void ApplyIncomingInventory(Product product, int quantity, decimal unitCost, decimal expenseAmount, DateTime transactionDate)
    {
        var nextQuantity = product.Quantity + quantity;
        var existingInventoryValue = product.Quantity * product.UnitCost;
        var incomingInventoryValue = (quantity * unitCost) + expenseAmount;

        product.UnitCost = nextQuantity == 0
            ? 0
            : Math.Round((existingInventoryValue + incomingInventoryValue) / nextQuantity, 2, MidpointRounding.AwayFromZero);
        product.Quantity = nextQuantity;
        product.UpdatedAt = transactionDate;
    }

    private static InventoryTransaction BuildIncomingTransaction(
        Product product,
        User user,
        int quantity,
        decimal unitCost,
        decimal expenseAmount,
        DateTime transactionDate,
        string note)
    {
        return new InventoryTransaction
        {
            ProductId = product.Id,
            Product = product,
            Type = TransactionType.In,
            Quantity = quantity,
            UnitCost = unitCost,
            UnitPrice = 0,
            ExpenseAmount = expenseAmount,
            UserId = user.Id,
            User = user,
            Reason = "Restock",
            Note = note,
            CreatedAt = transactionDate,
        };
    }

    private static InventoryTransaction BuildAdjustmentTransaction(
        Product product,
        User user,
        int adjustmentDelta,
        DateTime transactionDate,
        string note)
    {
        return new InventoryTransaction
        {
            ProductId = product.Id,
            Product = product,
            Type = TransactionType.Adjustment,
            Quantity = adjustmentDelta,
            UnitCost = product.UnitCost,
            UnitPrice = 0,
            ExpenseAmount = 0,
            UserId = user.Id,
            User = user,
            Reason = "Correction",
            Note = note,
            CreatedAt = transactionDate,
        };
    }

    private static DateTime ClampToNow(DateTime value, DateTime now)
    {
        return value > now ? now.AddMinutes(-1) : value;
    }

    private static string BuildDemoProductName(SubCategory subCategory, int index)
    {
        if (DemoDataSeedDefinitions.ProductCatalog.TryGetValue(subCategory.Name, out var options) && options.Length > 0)
        {
            return options[index % options.Length];
        }

        return $"{subCategory.Name} Model {index + 1}";
    }

    private static decimal RandomPrice(Random random, decimal min, decimal max)
    {
        if (max <= min)
        {
            return min;
        }

        return Math.Round(min + ((decimal)random.NextDouble() * (max - min)), 2, MidpointRounding.AwayFromZero);
    }

    private static decimal GenerateBaseCost(Random random, string subCategoryName, string productName)
    {
        if (DemoDataSeedDefinitions.ProductCostOverrides.TryGetValue(productName, out var productRange))
        {
            return RandomPrice(random, productRange.Min, productRange.Max);
        }

        if (DemoDataSeedDefinitions.SubCategoryCostRanges.TryGetValue(subCategoryName, out var subCategoryRange))
        {
            return RandomPrice(random, subCategoryRange.Min, subCategoryRange.Max);
        }

        return RandomPrice(random, 15m, 350m);
    }

    private static List<int> SplitQuantity(Random random, int totalQuantity, int batchCount)
    {
        if (totalQuantity <= 0 || batchCount <= 0)
        {
            return [];
        }

        var quantities = Enumerable.Repeat(1, Math.Min(totalQuantity, batchCount)).ToList();
        while (quantities.Count < batchCount)
        {
            quantities.Add(0);
        }

        var remaining = totalQuantity - quantities.Sum();
        while (remaining > 0)
        {
            var index = random.Next(quantities.Count);
            quantities[index] += 1;
            remaining -= 1;
        }

        return quantities
            .Where(quantity => quantity > 0)
            .OrderBy(_ => random.Next())
            .ToList();
    }

    private static decimal CalculateRealizedUnitPrice(Random random, decimal unitCost, decimal sellingPrice)
    {
        var targetPrice = Math.Round(
            unitCost * (1m + TargetProfitMargin + (decimal)((random.NextDouble() - 0.5d) * 0.06d)),
            2,
            MidpointRounding.AwayFromZero);

        return Math.Max(unitCost, Math.Min(sellingPrice, targetPrice));
    }
}
