namespace Server.Analytics.Endpoints;

public class GetInventoryValueDistribution : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/inventory-value-distribution", Handle)
        .WithSummary("Gets inventory value distribution by category");

    public record Response(int CategoryId, string CategoryName, decimal InventoryValue);

    private static async Task<List<Response>> Handle(AppDbContext database, CancellationToken cancellationToken)
    {
        return await database.Products
            .GroupBy(x => new { x.CategoryId, x.Category.Name })
            .OrderByDescending(x => x.Sum(p => p.TotalUnitStock * p.BuyPrice))
            .Select(x => new Response(
                x.Key.CategoryId,
                x.Key.Name,
                x.Sum(p => p.TotalUnitStock * p.BuyPrice)))
            .ToListAsync(cancellationToken);
    }
}
