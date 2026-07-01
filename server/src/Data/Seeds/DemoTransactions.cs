using Server.Transactions.Endpoints;

namespace Server.Data.Seeds;

using Server.Transactions.Services;

public static class DemoTransactions
{
    public static async Task SeedAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        await DeleteAsync(database, cancellationToken);

        var seedTransactions = await SeedJsonReader.ReadAsync<List<SeedDemoTransactionModel>>("demo-transactions.json", cancellationToken);
        var nowUtc = DateTime.UtcNow;
        var latestSeedTimestampUtc = seedTransactions
            .Where(x => x.CreatedAtUtc.HasValue)
            .Select(x => x.CreatedAtUtc!.Value.ToUniversalTime())
            .DefaultIfEmpty(nowUtc)
            .Max();
        var timestampOffset = nowUtc - latestSeedTimestampUtc;
        var productsBySku = await database.Products
            .ToDictionaryAsync(x => x.Sku, StringComparer.OrdinalIgnoreCase, cancellationToken);
        var usersByUsername = await database.Users
            .ToDictionaryAsync(x => x.Username, StringComparer.OrdinalIgnoreCase, cancellationToken);

        foreach (var seedTransaction in seedTransactions
            .OrderBy(x => x.CreatedAtUtc ?? DateTime.UtcNow))
        {
            if (!productsBySku.TryGetValue(seedTransaction.ProductSku, out var product))
            {
                throw new InvalidOperationException(
                    $"Product '{seedTransaction.ProductSku}' for demo transaction was not found.");
            }

            if (!usersByUsername.TryGetValue(seedTransaction.Username, out var user))
            {
                throw new InvalidOperationException(
                    $"User '{seedTransaction.Username}' for demo transaction was not found.");
            }

            if (!Enum.TryParse<TransactionType>(seedTransaction.Type, true, out var transactionType))
            {
                throw new InvalidOperationException(
                    $"Transaction type '{seedTransaction.Type}' for demo transaction is invalid.");
            }

            TransactionInventoryMath.Apply(
                product,
                transactionType,
                seedTransaction.ProductQuantityChanged);

            await database.Transactions.AddAsync(new Transaction
            {
                ProductId = product.Id,
                UserId = user.Id,
                Type = transactionType,
                ProductQuantityChanged = seedTransaction.ProductQuantityChanged,
                UnitProductCost = seedTransaction.UnitProductCost,
                TotalProductCost = seedTransaction.TotalProductCost,
                Note = seedTransaction.Note,
                CreatedAtUtc = seedTransaction.CreatedAtUtc?.ToUniversalTime().Add(timestampOffset) ?? nowUtc
            }, cancellationToken);
        }

        await database.SaveChangesAsync(cancellationToken);
    }

    public static async Task DeleteAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var usernames = await DemoUsers.GetUsernamesAsync(cancellationToken);
        var skus = await DemoProducts.GetSkusAsync(cancellationToken);

        var transactions = await database.Transactions
            .Include(x => x.Product)
            .Include(x => x.User)
            .Where(x => skus.Contains(x.Product.Sku) || usernames.Contains(x.User.Username))
            .ToListAsync(cancellationToken);

        if (transactions.Count == 0)
        {
            return;
        }

        database.Transactions.RemoveRange(transactions);
        await database.SaveChangesAsync(cancellationToken);
    }

    private sealed record SeedDemoTransactionModel(
        string ProductSku,
        string Username,
        string Type,
        int ProductQuantityChanged,
        decimal UnitProductCost,
        decimal TotalProductCost,
        string? Note,
        DateTime? CreatedAtUtc);
}
