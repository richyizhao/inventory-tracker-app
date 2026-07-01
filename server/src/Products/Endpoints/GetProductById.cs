namespace Server.Products.Endpoints;

public class GetProductById : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{id:int}", Handle)
        .WithSummary("Gets a product by id")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Product, Request>(x => x.Id);

    public record Request(int Id);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
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

    private static async Task<Response> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        return await database.Products
            .Where(x => x.Id == request.Id)
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
            .SingleAsync(cancellationToken);
    }
}
