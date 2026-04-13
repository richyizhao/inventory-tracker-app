using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Contracts.Transactions;

public sealed class UpdateTransactionRequest
{
    [Required]
    public Guid ProductId { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    public decimal? UnitCost { get; set; }

    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    public decimal ExpenseAmount { get; set; }

    [Required]
    public string Reason { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;
}
