namespace Server.Categories.Endpoints;

public class UpdateCategory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithSummary("Updates a category")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Category, Request>(x => x.Id);

    public record Request(int Id, string Name);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var duplicateExists = await database.Categories
            .AnyAsync(x => x.Id != request.Id && x.Name == request.Name, cancellationToken);

        if (duplicateExists)
        {
            return new ValidationError("Category name is already in use.");
        }

        var category = await database.Categories.SingleAsync(x => x.Id == request.Id, cancellationToken);
        category.Name = request.Name;
        category.UpdatedAtUtc = DateTime.UtcNow;
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
