namespace inventory_management.Server.Contracts.Analytics;

public sealed class CategorySpendPointDto
{
    public string Period { get; set; } = string.Empty;

    public decimal Total { get; set; }

    public IReadOnlyDictionary<string, decimal> Categories { get; set; } = new Dictionary<string, decimal>();
}


