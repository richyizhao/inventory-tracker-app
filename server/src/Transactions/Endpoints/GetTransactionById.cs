namespace Server.Transactions.Endpoints;

public class GetTransactionById : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{id:int}", Handle)
        .WithSummary("Gets a transaction by id")
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

    public record Response(
        int Id,
        int ProductId,
        string ProductName,
        string Type,
        int ProductQuantityChanged,
        decimal UnitProductCost,
        decimal TotalProductCost,
        int UserId,
        string Username,
        string DisplayName,
        string? Note,
        DateTime CreatedAtUtc,
        DateTime? UpdatedAtUtc);

    private static async Task<Response> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        return await database.Transactions
            .Where(x => x.Id == request.Id)
            .Select(x => new Response(
                x.Id,
                x.ProductId,
                x.Product.Name,
                x.Type.ToString().ToUpperInvariant(),
                x.ProductQuantityChanged,
                x.UnitProductCost,
                x.TotalProductCost,
                x.UserId,
                x.User.Username,
                x.User.DisplayName,
                x.Note,
                x.CreatedAtUtc,
                x.UpdatedAtUtc))
            .SingleAsync(cancellationToken);
    }
}
