using Server.Transactions.Services;

namespace Server.Transactions.Endpoints;

public class CreateTransaction : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithSummary("Creates a transaction")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Product, Request>(x => x.ProductId)
        .WithEnsureEntityExists<User, Request>(x => x.UserId);

    public record Request(
        int ProductId,
        int UserId,
        TransactionType Type,
        int ProductQuantityChanged,
        decimal UnitProductCost,
        decimal? TotalProductCost,
        string? Note,
        DateTime? CreatedAtUtc);

    public record Response(int Id);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0);
            RuleFor(x => x.UserId).GreaterThan(0);
            RuleFor(x => x.ProductQuantityChanged).GreaterThan(0);
            RuleFor(x => x.UnitProductCost).GreaterThanOrEqualTo(0);
            RuleFor(x => x.TotalProductCost).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Note).MaximumLength(1000);
        }
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var product = await database.Products.SingleAsync(x => x.Id == request.ProductId, cancellationToken);

        try
        {
            TransactionInventoryMath.Apply(product, request.Type, request.ProductQuantityChanged);
        }
        catch (InvalidOperationException ex)
        {
            return new ValidationError(ex.Message);
        }

        var transaction = new Transaction
        {
            ProductId = request.ProductId,
            UserId = request.UserId,
            Type = request.Type,
            ProductQuantityChanged = request.ProductQuantityChanged,
            UnitProductCost = request.UnitProductCost,
            TotalProductCost = request.TotalProductCost ?? request.UnitProductCost * request.ProductQuantityChanged,
            Note = request.Note,
            CreatedAtUtc = request.CreatedAtUtc ?? DateTime.UtcNow
        };

        await database.Transactions.AddAsync(transaction, cancellationToken);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new Response(transaction.Id));
    }
}
