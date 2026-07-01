namespace Server.Data.Seeds;

public static class SeedCategories
{
    public static async Task SeedAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var seedCategories = await SeedJsonReader.ReadAsync<List<SeedCategoryModel>>("categories.json", cancellationToken);
        var categories = await database.Categories
            .Include(x => x.SubCategories)
            .ToListAsync(cancellationToken);

        foreach (var seedCategory in seedCategories)
        {
            var category = categories.SingleOrDefault(x =>
                string.Equals(x.Name, seedCategory.Name, StringComparison.OrdinalIgnoreCase));

            if (category is null)
            {
                category = new Category
                {
                    Name = seedCategory.Name
                };

                foreach (var subCategoryName in seedCategory.SubCategories)
                {
                    category.SubCategories.Add(new SubCategory
                    {
                        Category = category,
                        CategoryId = category.Id,
                        Name = subCategoryName
                    });
                }

                await database.Categories.AddAsync(category, cancellationToken);
                categories.Add(category);
                continue;
            }

            category.Name = seedCategory.Name;

            foreach (var subCategoryName in seedCategory.SubCategories)
            {
                var subCategory = category.SubCategories.SingleOrDefault(x =>
                    string.Equals(x.Name, subCategoryName, StringComparison.OrdinalIgnoreCase));

                if (subCategory is null)
                {
                    category.SubCategories.Add(new SubCategory
                    {
                        Category = category,
                        CategoryId = category.Id,
                        Name = subCategoryName
                    });
                }
                else
                {
                    subCategory.Name = subCategoryName;
                }
            }
        }

        await database.SaveChangesAsync(cancellationToken);
    }

    private sealed record SeedCategoryModel(string Name, List<string> SubCategories);
}
