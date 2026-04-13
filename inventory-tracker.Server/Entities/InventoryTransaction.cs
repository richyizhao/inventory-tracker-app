namespace inventory_management.Server.Entities;

public class InventoryTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public TransactionType Type { get; set; }

    public int Quantity { get; set; }

    public decimal UnitCost { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal ExpenseAmount { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public string Reason { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

