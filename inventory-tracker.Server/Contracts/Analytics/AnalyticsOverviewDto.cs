namespace inventory_management.Server.Contracts.Analytics;

public sealed class AnalyticsOverviewDto
{
    public decimal TotalInventoryValue { get; set; }

    public decimal TotalRestockSpend { get; set; }

    public decimal TotalProfit { get; set; }

    public IReadOnlyList<SpendingPointDto> SpendingOverTime { get; set; } = [];

    public IReadOnlyList<SpendingPointDto> ProfitOverTime { get; set; } = [];

    public IReadOnlyList<CategorySpendPointDto> SpendingByCategory { get; set; } = [];

    public IReadOnlyList<CategorySpendPointDto> ProfitByCategory { get; set; } = [];

    public IReadOnlyList<InventoryValueSliceDto> InventoryValueDistribution { get; set; } = [];
}


