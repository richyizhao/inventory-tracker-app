namespace Server.Data.Seeds;

public static class DemoProducts
{
    public static async Task SeedAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var seedProducts = await SeedJsonReader.ReadAsync<List<SeedDemoProductModel>>("demo-products.json", cancellationToken);
        var categories = await database.Categories
            .Include(x => x.SubCategories)
            .ToListAsync(cancellationToken);
        var products = await database.Products.ToListAsync(cancellationToken);

        foreach (var seedProduct in seedProducts)
        {
            var category = categories.SingleOrDefault(x =>
                string.Equals(x.Name, seedProduct.CategoryName, StringComparison.OrdinalIgnoreCase))
                ?? throw new InvalidOperationException(
                    $"Category '{seedProduct.CategoryName}' for demo product '{seedProduct.Sku}' does not exist.");

            var subCategoryId = ResolveSubCategoryId(category, seedProduct.SubCategoryName, seedProduct.Sku);
            var product = products.SingleOrDefault(x =>
                string.Equals(x.Sku, seedProduct.Sku, StringComparison.OrdinalIgnoreCase));
            var totalUnitInventoryValue = seedProduct.TotalUnitInventoryValue
                ?? seedProduct.TotalUnitStock * seedProduct.BuyPrice;

            if (product is null)
            {
                product = new Product
                {
                    Name = seedProduct.Name,
                    Sku = seedProduct.Sku,
                    CategoryId = category.Id,
                    SubCategoryId = subCategoryId,
                    TotalUnitStock = seedProduct.TotalUnitStock,
                    LowStockThreshold = seedProduct.LowStockThreshold,
                    BuyPrice = seedProduct.BuyPrice,
                    SellPrice = seedProduct.SellPrice,
                    TotalUnitInventoryValue = totalUnitInventoryValue,
                    ImageUrl = seedProduct.ImageUrl
                };

                await database.Products.AddAsync(product, cancellationToken);
                products.Add(product);
            }
            else
            {
                product.Name = seedProduct.Name;
                product.Sku = seedProduct.Sku;
                product.CategoryId = category.Id;
                product.SubCategoryId = subCategoryId;
                product.TotalUnitStock = seedProduct.TotalUnitStock;
                product.LowStockThreshold = seedProduct.LowStockThreshold;
                product.BuyPrice = seedProduct.BuyPrice;
                product.SellPrice = seedProduct.SellPrice;
                product.TotalUnitInventoryValue = totalUnitInventoryValue;
                product.ImageUrl = seedProduct.ImageUrl;
            }
        }

        await database.SaveChangesAsync(cancellationToken);
    }

    public static async Task DeleteAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var skus = await GetSkusAsync(cancellationToken);
        var products = await database.Products
            .Where(x => skus.Contains(x.Sku))
            .ToListAsync(cancellationToken);

        if (products.Count == 0)
        {
            return;
        }

        database.Products.RemoveRange(products);
        await database.SaveChangesAsync(cancellationToken);
    }

    internal static async Task<HashSet<string>> GetSkusAsync(CancellationToken cancellationToken = default)
    {
        var seedProducts = await SeedJsonReader.ReadAsync<List<SeedDemoProductModel>>("demo-products.json", cancellationToken);
        return seedProducts.Select(x => x.Sku).ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    private static int? ResolveSubCategoryId(Category category, string? subCategoryName, string sku)
    {
        if (string.IsNullOrWhiteSpace(subCategoryName))
        {
            return null;
        }

        var subCategory = category.SubCategories.SingleOrDefault(x =>
            string.Equals(x.Name, subCategoryName, StringComparison.OrdinalIgnoreCase));

        if (subCategory is null)
        {
            throw new InvalidOperationException(
                $"Sub-category '{subCategoryName}' for demo product '{sku}' does not exist.");
        }

        return subCategory.Id;
    }

    private sealed record SeedDemoProductModel(
        string Name,
        string Sku,
        string CategoryName,
        string? SubCategoryName,
        int TotalUnitStock,
        int LowStockThreshold,
        decimal BuyPrice,
        decimal SellPrice,
        decimal? TotalUnitInventoryValue,
        string? ImageUrl);
}
