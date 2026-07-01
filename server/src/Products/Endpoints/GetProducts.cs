namespace Server.Products.Endpoints;

public class GetProducts : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Gets products with pagination and filters")
        .WithRequestValidation<Request>();

    public record Request(
        string? Search,
        int? CategoryId,
        int? SubCategoryId,
        string? Sort,
        int? Page,
        int? PageSize) : IPagedRequest;

    public class RequestValidator : PagedRequestValidator<Request>
    {
        private static readonly string[] AllowedSorts = ["newest", "stock-low-high", "name-a-z", "sku-a-z"];

        public RequestValidator()
        {
            RuleFor(x => x.CategoryId).GreaterThan(0);
            RuleFor(x => x.SubCategoryId).GreaterThan(0);
            RuleFor(x => x.Sort)
                .Must(x => string.IsNullOrWhiteSpace(x) || AllowedSorts.Contains(x.Trim().ToLowerInvariant()))
                .WithMessage("Sort must be one of newest, stock-low-high, name-a-z, sku-a-z.");
        }
    }

    public record Response(
        int Id,
        string Name,
        string Sku,
        int CategoryId,
        string CategoryName,
        int? SubCategoryId,
        string? SubCategoryName,
        int TotalUnitStock,
        int LowStockThreshold,
        bool IsLowStock,
        decimal BuyPrice,
        decimal SellPrice,
        decimal TotalUnitInventoryValue,
        string? ImageUrl,
        DateTime CreatedAtUtc,
        DateTime? UpdatedAtUtc);

    private static async Task<PagedList<Response>> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var query = database.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(search) || x.Sku.ToLower().Contains(search));
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == request.CategoryId.Value);
        }

        if (request.SubCategoryId.HasValue)
        {
            query = query.Where(x => x.SubCategoryId == request.SubCategoryId.Value);
        }

        query = (request.Sort ?? "newest").Trim().ToLowerInvariant() switch
        {
            "stock-low-high" => query.OrderBy(x => x.TotalUnitStock).ThenBy(x => x.Name),
            "name-a-z" => query.OrderBy(x => x.Name),
            "sku-a-z" => query.OrderBy(x => x.Sku),
            _ => query.OrderByDescending(x => x.CreatedAtUtc)
        };

        return await query
            .Select(x => new Response(
                x.Id,
                x.Name,
                x.Sku,
                x.CategoryId,
                x.Category.Name,
                x.SubCategoryId,
                x.SubCategory != null ? x.SubCategory.Name : null,
                x.TotalUnitStock,
                x.LowStockThreshold,
                x.TotalUnitStock <= x.LowStockThreshold,
                x.BuyPrice,
                x.SellPrice,
                x.TotalUnitInventoryValue,
                x.ImageUrl,
                x.CreatedAtUtc,
                x.UpdatedAtUtc))
            .ToPagedListAsync(request, cancellationToken);
    }
}
