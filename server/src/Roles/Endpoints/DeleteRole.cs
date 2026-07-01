namespace Server.Roles.Endpoints;

public class DeleteRole : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{id:int}", Handle)
        .WithSummary("Deletes a role")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Role, Request>(x => x.Id);

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
        var role = await database.Roles
            .Where(x => x.Id == request.Id)
            .Select(x => new
            {
                Entity = x,
                x.Name,
                AssignedUsers = x.Users.Count
            })
            .SingleAsync(cancellationToken);

        if (string.Equals(role.Name, "admin", StringComparison.OrdinalIgnoreCase))
        {
            return new ValidationError("The admin role cannot be deleted.");
        }

        if (role.AssignedUsers > 0)
        {
            return new ValidationError("Role cannot be deleted while users are still assigned to it.");
        }

        database.Roles.Remove(role.Entity);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
