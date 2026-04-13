namespace inventory_management.Server.Contracts.Analytics;

public sealed class DashboardSummaryDto
{
    public int TotalProducts { get; set; }

    public int TotalStock { get; set; }

    public int LowStockCount { get; set; }

    public IReadOnlyList<TransactionDto> RecentTransactions { get; set; } = [];
}


