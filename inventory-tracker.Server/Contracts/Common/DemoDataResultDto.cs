namespace inventory_management.Server.Contracts.Common;

public sealed class DemoDataResultDto
{
    public int UsersCreated { get; set; }

    public int ProductsCreated { get; set; }

    public int TransactionsCreated { get; set; }

    public int UsersRemoved { get; set; }

    public int ProductsRemoved { get; set; }

    public int TransactionsRemoved { get; set; }

    public string Message { get; set; } = string.Empty;
}
