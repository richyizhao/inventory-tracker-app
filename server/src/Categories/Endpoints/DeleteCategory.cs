namespace Server.Categories.Endpoints;

public class DeleteCategory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{id:int}", Handle)
        .WithSummary("Deletes a category")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Category, Request>(x => x.Id);

    public record Request(int Id);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var category = await database.Categories
            .Where(x => x.Id == request.Id)
            .Select(x => new
            {
                Entity = x,
                HasProducts = x.Products.Any(),
                HasSubCategoriesWithProducts = x.SubCategories.Any(sc => sc.Products.Any())
            })
            .SingleAsync(cancellationToken);

        if (category.HasProducts || category.HasSubCategoriesWithProducts)
        {
            return new ValidationError("Category cannot be deleted while products still use it.");
        }

        database.Categories.Remove(category.Entity);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
