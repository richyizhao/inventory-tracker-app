namespace Server.Products.Endpoints;

public class CreateProduct : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithSummary("Creates a product")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Category, Request>(x => x.CategoryId)
        .WithEnsureEntityExists<SubCategory, Request>(x => x.SubCategoryId);

    public record Request(
        string Name,
        string Sku,
        int CategoryId,
        int? SubCategoryId,
        int TotalUnitStock,
        int LowStockThreshold,
        decimal BuyPrice,
        decimal SellPrice,
        decimal? TotalUnitInventoryValue,
        string? ImageUrl,
        DateTime? CreatedAtUtc,
        DateTime? UpdatedAtUtc);

    public record Response(int Id);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Sku).NotEmpty().MaximumLength(100);
            RuleFor(x => x.CategoryId).GreaterThan(0);
            RuleFor(x => x.SubCategoryId).GreaterThan(0);
            RuleFor(x => x.TotalUnitStock).GreaterThanOrEqualTo(0);
            RuleFor(x => x.LowStockThreshold).GreaterThanOrEqualTo(0);
            RuleFor(x => x.BuyPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.SellPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.TotalUnitInventoryValue).GreaterThanOrEqualTo(0);
        }
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var duplicateSku = await database.Products.AnyAsync(x => x.Sku == request.Sku, cancellationToken);
        if (duplicateSku)
        {
            return new ValidationError("SKU is already in use.");
        }

        if (request.SubCategoryId.HasValue)
        {
            var isSubCategoryInCategory = await database.SubCategories
                .AnyAsync(x => x.Id == request.SubCategoryId.Value && x.CategoryId == request.CategoryId, cancellationToken);

            if (!isSubCategoryInCategory)
            {
                return new ValidationError("Sub-category does not belong to the selected category.");
            }
        }

        var product = new Product
        {
            Name = request.Name,
            Sku = request.Sku,
            CategoryId = request.CategoryId,
            SubCategoryId = request.SubCategoryId,
            TotalUnitStock = request.TotalUnitStock,
            LowStockThreshold = request.LowStockThreshold,
            BuyPrice = request.BuyPrice,
            SellPrice = request.SellPrice,
            TotalUnitInventoryValue = request.TotalUnitInventoryValue ?? request.TotalUnitStock * request.BuyPrice,
            ImageUrl = request.ImageUrl,
            CreatedAtUtc = request.CreatedAtUtc ?? DateTime.UtcNow,
            UpdatedAtUtc = request.UpdatedAtUtc
        };

        await database.Products.AddAsync(product, cancellationToken);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new Response(product.Id));
    }
}
