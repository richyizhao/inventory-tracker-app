namespace Server.Transactions.Endpoints;

public class GetTransactions : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Gets transactions with pagination and filters")
        .WithRequestValidation<Request>();

    public record Request(
        string? Search,
        string? Type,
        string? Sort,
        int? Page,
        int? PageSize) : IPagedRequest;

    public class RequestValidator : PagedRequestValidator<Request>
    {
        private static readonly string[] AllowedTypes = ["IN", "OUT", "ADJUSTMENT"];

        public RequestValidator()
        {
            RuleFor(x => x.Type)
                .Must(x => string.IsNullOrWhiteSpace(x) || AllowedTypes.Contains(x.Trim().ToUpperInvariant()))
                .WithMessage("Type must be one of IN, OUT, ADJUSTMENT.");
            RuleFor(x => x.Sort)
                .Must(x => string.IsNullOrWhiteSpace(x) || TryParseSort(x) is not null)
                .WithMessage("Sort must be latest created or latest updated.");
        }
    }

    public record Response(
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
        DateTime CreatedAtUtc,
        DateTime? UpdatedAtUtc);

    private static async Task<PagedList<Response>> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var query = database.Transactions.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x =>
                x.Product.Name.ToLower().Contains(search) ||
                x.User.DisplayName.ToLower().Contains(search) ||
                x.User.Username.ToLower().Contains(search) ||
                (x.Note != null && x.Note.ToLower().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(request.Type) &&
            Enum.TryParse<TransactionType>(request.Type, true, out var transactionType))
        {
            query = query.Where(x => x.Type == transactionType);
        }

        query = TryParseSort(request.Sort) switch
        {
            "updated" => query
                .OrderByDescending(x => x.UpdatedAtUtc.HasValue)
                .ThenByDescending(x => x.UpdatedAtUtc)
                .ThenByDescending(x => x.CreatedAtUtc),
            _ => query.OrderByDescending(x => x.CreatedAtUtc)
        };

        return await query
            .Select(x => new Response(
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
                x.CreatedAtUtc,
                x.UpdatedAtUtc))
            .ToPagedListAsync(request, cancellationToken);
    }

    private static string? TryParseSort(string? sort) => sort?.Trim().ToLowerInvariant() switch
    {
        null or "" => null,
        "newest" or "latest created" or "recently created" => "newest",
        "updated" or "latest updated" or "recently updated" => "updated",
        _ => null
    };
}
