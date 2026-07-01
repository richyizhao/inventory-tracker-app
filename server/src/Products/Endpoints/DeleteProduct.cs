namespace Server.Products.Endpoints;

public class DeleteProduct : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{id:int}", Handle)
        .WithSummary("Deletes a product and its transaction history")
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

    private static async Task<Ok> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var product = await database.Products.SingleAsync(x => x.Id == request.Id, cancellationToken);
        database.Products.Remove(product);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
