using Server.Analytics.Services;

namespace Server.Analytics.Endpoints;

public class GetProfitAndSpendingOverTime : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/profit-spending-over-time", Handle)
        .WithSummary("Gets profit and spending over time")
        .WithRequestValidation<Request>();

    public record Request(string? Range);
    public class RequestValidator : GetAnalyticsSummary.RequestValidator;

    public record PointResponse(DateTime Date, decimal Profit, decimal Spending);

    private static async Task<List<PointResponse>> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        AnalyticsRangeParser.TryParse(request.Range, out var range);
        var startDateUtc = AnalyticsRangeParser.GetStartDateUtc(range, DateTime.UtcNow);

        var query = database.Transactions.AsQueryable();
        if (startDateUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc >= startDateUtc.Value);
        }

        var transactions = await query
            .Select(x => new
            {
                x.CreatedAtUtc,
                x.Type,
                x.TotalProductCost,
                x.ProductQuantityChanged,
                x.Product.BuyPrice,
                x.Product.SellPrice
            })
            .ToListAsync(cancellationToken);

        return transactions
            .GroupBy(x => AnalyticsRangeParser.GetBucketStartUtc(range, x.CreatedAtUtc))
            .OrderBy(x => x.Key)
            .Select(x => new PointResponse(
                x.Key,
                x.Where(t => t.Type == TransactionType.Out)
                    .Sum(t => (t.SellPrice - t.BuyPrice) * t.ProductQuantityChanged),
                x.Where(t => t.Type == TransactionType.In)
                    .Sum(t => t.TotalProductCost)))
            .ToList();
    }
}
