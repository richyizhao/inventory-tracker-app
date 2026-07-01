namespace Server.Data.Types;

public class Transaction : IEntity
{
    public int Id { get; private init; }
    public Guid ReferenceId { get; private init; } = Guid.NewGuid();
    public required int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public required int UserId { get; set; }
    public User User { get; set; } = null!;
    public TransactionType Type { get; set; }
    public int ProductQuantityChanged { get; set; }
    public decimal UnitProductCost { get; set; }
    public decimal TotalProductCost { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}

public enum TransactionType
{
    In = 1,
    Out = 2,
    Adjustment = 3,
}
