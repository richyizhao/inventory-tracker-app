using Server.Transactions.Services;

namespace Server.Transactions.Endpoints;

public class DeleteTransaction : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{id:int}", Handle)
        .WithSummary("Deletes a transaction")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Transaction, Request>(x => x.Id);

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
        var transaction = await database.Transactions.SingleAsync(x => x.Id == request.Id, cancellationToken);
        var product = await database.Products.SingleAsync(x => x.Id == transaction.ProductId, cancellationToken);

        try
        {
            TransactionInventoryMath.Apply(product, transaction.Type, -transaction.ProductQuantityChanged);
        }
        catch (InvalidOperationException ex)
        {
            return new ValidationError(ex.Message);
        }

        database.Transactions.Remove(transaction);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
