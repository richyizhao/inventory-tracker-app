namespace Server.Dashboard.Endpoints;

public class GetDashboardOverview : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Gets dashboard overview metrics")
        .WithRequestValidation<Request>();

    public record Request(int? LowStockProductsCount, int? RecentTransactionsCount);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.LowStockProductsCount)
                .GreaterThan(0)
                .LessThanOrEqualTo(25);

            RuleFor(x => x.RecentTransactionsCount)
                .GreaterThan(0)
                .LessThanOrEqualTo(50);
        }
    }

    public record InventoryMovementPointResponse(DateTime Date, int StockIn, int StockOut);

    public record LowStockProductResponse(
        int Id,
        string Name,
        string Sku,
        int UnitsLeft,
        int Threshold);

    public record RecentTransactionResponse(
        int Id,
        int ProductId,
        string ProductName,
        string Type,
        int ProductQuantityChanged,
        decimal UnitProductCost,
        decimal TotalProductCost,
        int UserId,
        string Username,
        string DisplayName,
        string? Note,
        DateTime CreatedAtUtc);

    public record Response(
        decimal TotalInventoryValue,
        int TotalProductsInStock,
        int TotalLowStockProductTypes,
        int UnitsMovedLast7Days,
        List<InventoryMovementPointResponse> InventoryMovements,
        List<LowStockProductResponse> LowStockProducts,
        List<RecentTransactionResponse> RecentTransactions);

    private static async Task<Response> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var lowStockProductsCount = request.LowStockProductsCount ?? 8;
        var recentTransactionsCount = request.RecentTransactionsCount ?? 5;
        var todayUtc = DateTime.UtcNow.Date;
        var movementsStartDateUtc = todayUtc.AddDays(-6);
        var movementsEndDateUtc = todayUtc.AddDays(1);

        var movementTransactions = await database.Transactions
            .Where(x => x.CreatedAtUtc >= movementsStartDateUtc && x.CreatedAtUtc < movementsEndDateUtc)
            .Select(x => new
            {
                Date = x.CreatedAtUtc.Date,
                x.Type,
                x.ProductQuantityChanged,
            })
            .ToListAsync(cancellationToken);

        var movementsByDate = movementTransactions
            .GroupBy(x => x.Date)
            .ToDictionary(
                x => x.Key,
                x => new InventoryMovementPointResponse(
                    x.Key,
                    x.Where(t => t.Type == TransactionType.In)
                        .Sum(t => t.ProductQuantityChanged),
                    x.Where(t => t.Type == TransactionType.Out)
                        .Sum(t => t.ProductQuantityChanged)));

        var inventoryMovements = Enumerable.Range(0, 7)
            .Select(offset => movementsStartDateUtc.AddDays(offset))
            .Select(date => movementsByDate.TryGetValue(date, out var movement)
                ? movement
                : new InventoryMovementPointResponse(date, 0, 0))
            .ToList();

        var lowStockProducts = await database.Products
            .Where(x => x.TotalUnitStock <= x.LowStockThreshold)
            .OrderBy(x => x.TotalUnitStock)
            .ThenBy(x => x.Name)
            .Take(lowStockProductsCount)
            .Select(x => new LowStockProductResponse(
                x.Id,
                x.Name,
                x.Sku,
                x.TotalUnitStock,
                x.LowStockThreshold))
            .ToListAsync(cancellationToken);

        var recentTransactions = await database.Transactions
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(recentTransactionsCount)
            .Select(x => new RecentTransactionResponse(
                x.Id,
                x.ProductId,
                x.Product.Name,
                x.Type.ToString().ToUpperInvariant(),
                x.ProductQuantityChanged,
                x.UnitProductCost,
                x.TotalProductCost,
                x.UserId,
                x.User.Username,
                x.User.DisplayName,
                x.Note,
                x.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        var totalInventoryValue = await database.Products
            .SumAsync(x => x.TotalUnitStock * x.BuyPrice, cancellationToken);

        var totalProductsInStock = await database.Products
            .CountAsync(x => x.TotalUnitStock > 0, cancellationToken);

        var unitsMovedLast7Days = movementTransactions
            .Where(x => x.Type == TransactionType.In || x.Type == TransactionType.Out)
            .Sum(x => x.ProductQuantityChanged);

        return new Response(
            totalInventoryValue,
            totalProductsInStock,
            await database.Products.CountAsync(x => x.TotalUnitStock <= x.LowStockThreshold, cancellationToken),
            unitsMovedLast7Days,
            inventoryMovements,
            lowStockProducts,
            recentTransactions);
    }
}
