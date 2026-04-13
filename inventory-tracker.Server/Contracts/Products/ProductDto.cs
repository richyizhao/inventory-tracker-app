namespace inventory_management.Server.Contracts.Products;

public sealed class ProductDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Sku { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitCost { get; set; }

    public decimal SellingPrice { get; set; }

    public decimal InventoryValue { get; set; }

    public CategoryDto Category { get; set; } = new();

    public SubCategoryDto SubCategory { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}


