namespace Server.Users.Endpoints;

public class GetUsers : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Gets users with pagination and filters")
        .WithRequestValidation<Request>();

    public record Request(
        string? Search,
        int? RoleId,
        string? Sort,
        int? Page,
        int? PageSize) : IPagedRequest;

    public class RequestValidator : PagedRequestValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.RoleId).GreaterThan(0);
            RuleFor(x => x.Sort)
                .Must(x => string.IsNullOrWhiteSpace(x) || TryParseSort(x) is not null)
                .WithMessage("Sort must be recently created or recently updated.");
        }
    }

    public record Response(int Id, string DisplayName, string Username, string Email, int RoleId, string RoleName, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);

    private static async Task<PagedList<Response>> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var query = database.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x =>
                x.DisplayName.ToLower().Contains(search) ||
                x.Username.ToLower().Contains(search) ||
                x.Email.ToLower().Contains(search));
        }

        if (request.RoleId.HasValue)
        {
            query = query.Where(x => x.RoleId == request.RoleId.Value);
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
                x.DisplayName,
                x.Username,
                x.Email,
                x.RoleId,
                x.Role.Name,
                x.CreatedAtUtc,
                x.UpdatedAtUtc))
            .ToPagedListAsync(request, cancellationToken);
    }

    private static string? TryParseSort(string? sort) => sort?.Trim().ToLowerInvariant() switch
    {
        null or "" => null,
        "newest" or "recently created" or "latest created" => "newest",
        "updated" or "recently updated" or "latest updated" => "updated",
        _ => null
    };
}
