namespace Server.Categories.Endpoints;

public class CreateSubCategory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/subcategories", Handle)
        .WithSummary("Creates a sub-category")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Category, Request>(x => x.CategoryId);

    public record Request(int CategoryId, string Name);
    public record Response(int Id);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.CategoryId).GreaterThan(0);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var exists = await database.SubCategories
            .AnyAsync(x => x.CategoryId == request.CategoryId && x.Name == request.Name, cancellationToken);

        if (exists)
        {
            return new ValidationError("Sub-category name is already in use for this category.");
        }

        var subCategory = new SubCategory
        {
            CategoryId = request.CategoryId,
            Name = request.Name,
        };

        await database.SubCategories.AddAsync(subCategory, cancellationToken);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new Response(subCategory.Id));
    }
}
