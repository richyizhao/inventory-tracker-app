namespace Server.Categories.Endpoints;

public class UpdateSubCategory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/subcategories", Handle)
        .WithSummary("Updates a sub-category")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<SubCategory, Request>(x => x.Id)
        .WithEnsureEntityExists<Category, Request>(x => x.CategoryId);

    public record Request(int Id, int CategoryId, string Name);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
            RuleFor(x => x.CategoryId).GreaterThan(0);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var duplicateExists = await database.SubCategories
            .AnyAsync(x => x.Id != request.Id && x.CategoryId == request.CategoryId && x.Name == request.Name, cancellationToken);

        if (duplicateExists)
        {
            return new ValidationError("Sub-category name is already in use for this category.");
        }

        var subCategory = await database.SubCategories.SingleAsync(x => x.Id == request.Id, cancellationToken);
        subCategory.Name = request.Name;
        subCategory.UpdatedAtUtc = DateTime.UtcNow;
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
