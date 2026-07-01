namespace Server.Users.Endpoints;

public class GetCurrentUserProfile : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/profile", Handle)
        .WithSummary("Gets the current user's profile");

    public record Response(
        string DisplayName,
        string Username,
        string Email,
        DateTime CreatedAtUtc,
        DateTime? UpdatedAtUtc
    );

    private static async Task<Response> Handle(
        ClaimsPrincipal claimsPrincipal,
        AppDbContext database,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = claimsPrincipal.GetUserId();

        return await database.Users
            .Where(x => x.Id == currentUserId)
            .Select(x => new Response(
                x.DisplayName,
                x.Username,
                x.Email,
                x.CreatedAtUtc,
                x.UpdatedAtUtc
            ))
            .SingleAsync(cancellationToken);
    }
}
