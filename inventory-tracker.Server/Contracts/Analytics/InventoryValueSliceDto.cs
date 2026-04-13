namespace inventory_management.Server.Contracts.Analytics;

public sealed class InventoryValueSliceDto
{
    public string CategoryName { get; set; } = string.Empty;

    public decimal InventoryValue { get; set; }

    public int UnitsInStock { get; set; }

    public int ProductCount { get; set; }
}


