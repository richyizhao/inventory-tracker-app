using Server.Transactions.Services;

namespace Server.Transactions.Endpoints;

public class UpdateTransaction : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithSummary("Updates a transaction")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Transaction, Request>(x => x.Id)
        .WithEnsureEntityExists<Product, Request>(x => x.ProductId)
        .WithEnsureEntityExists<User, Request>(x => x.UserId);

    public record Request(
        int Id,
        int ProductId,
        int UserId,
        TransactionType Type,
        int ProductQuantityChanged,
        decimal UnitProductCost,
        decimal? TotalProductCost,
        string? Note,
        DateTime? CreatedAtUtc);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
            RuleFor(x => x.ProductId).GreaterThan(0);
            RuleFor(x => x.UserId).GreaterThan(0);
            RuleFor(x => x.ProductQuantityChanged).GreaterThan(0);
            RuleFor(x => x.UnitProductCost).GreaterThanOrEqualTo(0);
            RuleFor(x => x.TotalProductCost).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Note).MaximumLength(1000);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var transaction = await database.Transactions.SingleAsync(x => x.Id == request.Id, cancellationToken);
        var oldProduct = await database.Products.SingleAsync(x => x.Id == transaction.ProductId, cancellationToken);
        var newProduct = transaction.ProductId == request.ProductId
            ? oldProduct
            : await database.Products.SingleAsync(x => x.Id == request.ProductId, cancellationToken);

        try
        {
            TransactionInventoryMath.Apply(oldProduct, transaction.Type, -transaction.ProductQuantityChanged);
            TransactionInventoryMath.Apply(newProduct, request.Type, request.ProductQuantityChanged);
        }
        catch (InvalidOperationException ex)
        {
            return new ValidationError(ex.Message);
        }

        transaction.ProductId = request.ProductId;
        transaction.UserId = request.UserId;
        transaction.Type = request.Type;
        transaction.ProductQuantityChanged = request.ProductQuantityChanged;
        transaction.UnitProductCost = request.UnitProductCost;
        transaction.TotalProductCost = request.TotalProductCost ?? request.UnitProductCost * request.ProductQuantityChanged;
        transaction.Note = request.Note;
        transaction.CreatedAtUtc = request.CreatedAtUtc ?? transaction.CreatedAtUtc;
        transaction.UpdatedAtUtc = DateTime.UtcNow;

        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
