using Server.Analytics.Services;

namespace Server.Analytics.Endpoints;

public class GetProfitByCategory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/profit-by-category", Handle)
        .WithSummary("Gets profit by category")
        .WithRequestValidation<Request>();

    public record Request(string? Range);
    public class RequestValidator : GetAnalyticsSummary.RequestValidator;
    public record Response(int CategoryId, string CategoryName, decimal Profit);

    private static async Task<List<Response>> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        AnalyticsRangeParser.TryParse(request.Range, out var range);
        var startDateUtc = AnalyticsRangeParser.GetStartDateUtc(range, DateTime.UtcNow);

        var query = database.Transactions.Where(x => x.Type == TransactionType.Out);
        if (startDateUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc >= startDateUtc.Value);
        }

        return await query
            .GroupBy(x => new { x.Product.CategoryId, x.Product.Category.Name })
            .OrderByDescending(x => x.Sum(t => (t.Product.SellPrice - t.Product.BuyPrice) * t.ProductQuantityChanged))
            .Select(x => new Response(
                x.Key.CategoryId,
                x.Key.Name,
                x.Sum(t => (t.Product.SellPrice - t.Product.BuyPrice) * t.ProductQuantityChanged)))
            .ToListAsync(cancellationToken);
    }
}
