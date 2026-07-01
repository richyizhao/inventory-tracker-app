namespace Server.Users.Endpoints;

public class GetUserById : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{id:int}", Handle)
        .WithSummary("Gets a user by id")
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

    public record Response(int Id, string DisplayName, string Username, string Email, int RoleId, string RoleName, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);

    private static async Task<Response> Handle([AsParameters] Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        return await database.Users
            .Where(x => x.Id == request.Id)
            .Select(x => new Response(
                x.Id,
                x.DisplayName,
                x.Username,
                x.Email,
                x.RoleId,
                x.Role.Name,
                x.CreatedAtUtc,
                x.UpdatedAtUtc))
            .SingleAsync(cancellationToken);
    }
}
