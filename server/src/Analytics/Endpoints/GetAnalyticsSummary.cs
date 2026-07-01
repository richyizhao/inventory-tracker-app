using Server.Analytics.Services;

namespace Server.Analytics.Endpoints;

public class GetAnalyticsSummary : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/summary", Handle)
        .WithSummary("Gets analytics summary metrics")
        .WithRequestValidation<Request>();

    public record Request(string? Range);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Range)
                .Must(x => string.IsNullOrWhiteSpace(x) || AnalyticsRangeParser.TryParse(x, out _))
                .WithMessage(AnalyticsRangeParser.GetAllowedRangeMessage());
        }
    }

    public record Response(decimal TotalRestockSpend, decimal TotalProfitGained, decimal TotalInventoryValue);

    private static async Task<Response> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        AnalyticsRangeParser.TryParse(request.Range, out var range);
        var startDateUtc = AnalyticsRangeParser.GetStartDateUtc(range, DateTime.UtcNow);

        var transactionsQuery = database.Transactions.AsQueryable();
        if (startDateUtc.HasValue)
        {
            transactionsQuery = transactionsQuery.Where(x => x.CreatedAtUtc >= startDateUtc.Value);
        }

        var totalRestockSpend = await transactionsQuery
            .Where(x => x.Type == TransactionType.In)
            .SumAsync(x => x.TotalProductCost, cancellationToken);

        var totalProfitGained = await transactionsQuery
            .Where(x => x.Type == TransactionType.Out)
            .SumAsync(x => (x.Product.SellPrice - x.Product.BuyPrice) * x.ProductQuantityChanged, cancellationToken);

        var totalInventoryValue = await database.Products
            .SumAsync(x => x.TotalUnitStock * x.BuyPrice, cancellationToken);

        return new Response(totalRestockSpend, totalProfitGained, totalInventoryValue);
    }
}
