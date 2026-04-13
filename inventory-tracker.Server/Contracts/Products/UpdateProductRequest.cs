namespace inventory_management.Server.Contracts.Products;

public sealed class UpdateProductRequest
{
    public string? Name { get; set; }

    public string? Sku { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public decimal? UnitCost { get; set; }

    public decimal? SellingPrice { get; set; }

    public Guid? SubCategoryId { get; set; }
}


