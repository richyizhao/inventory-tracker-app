namespace inventory_management.Server.Contracts.Categories;

public sealed class SubCategoryDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;
}


