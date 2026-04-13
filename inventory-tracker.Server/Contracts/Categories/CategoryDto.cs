namespace inventory_management.Server.Contracts.Categories;

public sealed class CategoryDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public IReadOnlyList<SubCategoryDto> SubCategories { get; set; } = [];
}


