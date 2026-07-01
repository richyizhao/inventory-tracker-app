namespace Server.Categories.Endpoints;

public class DeleteSubCategory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/subcategories/{id:int}", Handle)
        .WithSummary("Deletes a sub-category")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<SubCategory, Request>(x => x.Id);

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
        var subCategory = await database.SubCategories
            .Where(x => x.Id == request.Id)
            .Select(x => new
            {
                Entity = x,
                HasProducts = x.Products.Any()
            })
            .SingleAsync(cancellationToken);

        if (subCategory.HasProducts)
        {
            return new ValidationError("Sub-category cannot be deleted while products still use it.");
        }

        database.SubCategories.Remove(subCategory.Entity);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
