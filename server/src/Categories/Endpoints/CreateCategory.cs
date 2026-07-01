namespace Server.Categories.Endpoints;

public class CreateCategory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithSummary("Creates a category")
        .WithRequestValidation<Request>();

    public record Request(string Name);
    public record Response(int Id);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var exists = await database.Categories.AnyAsync(x => x.Name == request.Name, cancellationToken);
        if (exists)
        {
            return new ValidationError("Category name is already in use.");
        }

        var category = new Category
        {
            Name = request.Name,
        };

        await database.Categories.AddAsync(category, cancellationToken);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new Response(category.Id));
    }
}
