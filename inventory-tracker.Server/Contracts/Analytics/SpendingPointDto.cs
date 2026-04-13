namespace inventory_management.Server.Contracts.Analytics;

public sealed class SpendingPointDto
{
    public string Period { get; set; } = string.Empty;

    public decimal Amount { get; set; }
}


