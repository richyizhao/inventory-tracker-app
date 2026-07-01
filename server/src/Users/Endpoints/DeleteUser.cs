namespace Server.Users.Endpoints;

public class DeleteUser : IEndpoint
{
    private const string SeededAdminUsername = "admin";

    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{id:int}", Handle)
        .WithSummary("Deletes a user")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<User, Request>(x => x.Id);

    public record Request(int Id);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle([AsParameters] Request request, ClaimsPrincipal claimsPrincipal, AppDbContext database, CancellationToken cancellationToken)
    {
        var currentUserId = claimsPrincipal.GetUserId();

        if (request.Id == currentUserId)
        {
            return new ValidationError("You cannot delete your own account.");
        }

        var user = await database.Users
            .Where(x => x.Id == request.Id)
            .Select(x => new
            {
                Entity = x,
                x.Username,
                HasTransactions = x.Transactions.Any()
            })
            .SingleAsync(cancellationToken);

        if (string.Equals(user.Username, SeededAdminUsername, StringComparison.OrdinalIgnoreCase))
        {
            return new ValidationError("The seeded admin account cannot be deleted.");
        }

        if (user.HasTransactions)
        {
            return new ValidationError("User cannot be deleted while transactions still reference it.");
        }

        database.Users.Remove(user.Entity);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
