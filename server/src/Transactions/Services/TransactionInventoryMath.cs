namespace Server.Transactions.Services;

public static class TransactionInventoryMath
{
    public static int GetStockDelta(TransactionType type, int quantity) => type switch
    {
        TransactionType.In => quantity,
        TransactionType.Out => -quantity,
        TransactionType.Adjustment => quantity,
        _ => 0
    };

    public static void Apply(Product product, TransactionType type, int quantity)
    {
        product.TotalUnitStock += GetStockDelta(type, quantity);
        if (product.TotalUnitStock < 0)
        {
            throw new InvalidOperationException("Transaction would result in negative stock.");
        }

        product.TotalUnitInventoryValue = product.TotalUnitStock * product.BuyPrice;
        product.UpdatedAtUtc = DateTime.UtcNow;
    }
}
