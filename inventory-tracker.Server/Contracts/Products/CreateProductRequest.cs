using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Contracts.Products;

public sealed class CreateProductRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Sku { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    public decimal UnitCost { get; set; }

    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    public decimal SellingPrice { get; set; }

    [Required]
    public Guid SubCategoryId { get; set; }
}


