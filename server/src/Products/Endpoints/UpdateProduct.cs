namespace Server.Products.Endpoints;

public class UpdateProduct : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithSummary("Updates a product")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Product, Request>(x => x.Id)
        .WithEnsureEntityExists<Category, Request>(x => x.CategoryId)
        .WithEnsureEntityExists<SubCategory, Request>(x => x.SubCategoryId);

    public record Request(
        int Id,
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
        DateTime? UpdatedAtUtc);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
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

    private static async Task<Results<Ok, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var duplicateSku = await database.Products
            .AnyAsync(x => x.Id != request.Id && x.Sku == request.Sku, cancellationToken);

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

        var product = await database.Products.SingleAsync(x => x.Id == request.Id, cancellationToken);
        product.Name = request.Name;
        product.Sku = request.Sku;
        product.CategoryId = request.CategoryId;
        product.SubCategoryId = request.SubCategoryId;
        product.TotalUnitStock = request.TotalUnitStock;
        product.LowStockThreshold = request.LowStockThreshold;
        product.BuyPrice = request.BuyPrice;
        product.SellPrice = request.SellPrice;
        product.TotalUnitInventoryValue = request.TotalUnitInventoryValue ?? request.TotalUnitStock * request.BuyPrice;
        product.ImageUrl = request.ImageUrl;
        product.UpdatedAtUtc = request.UpdatedAtUtc ?? DateTime.UtcNow;
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
