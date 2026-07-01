namespace Server.Data.Types;

public class Product : IEntity
{
    public int Id { get; private init; }
    public Guid ReferenceId { get; private init; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Sku { get; set; }
    public required int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public int? SubCategoryId { get; set; }
    public SubCategory? SubCategory { get; set; }
    public int TotalUnitStock { get; set; }
    public int LowStockThreshold { get; set; } = 5;
    public decimal BuyPrice { get; set; }
    public decimal SellPrice { get; set; }
    public decimal TotalUnitInventoryValue { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public bool IsLowStock => TotalUnitStock <= LowStockThreshold;
    public List<Transaction> Transactions { get; init; } = [];
}
