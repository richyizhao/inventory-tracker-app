namespace Server.Users.Endpoints;

public class UpdateCurrentUserProfile : IEndpoint
{
    private const string SeededAdminUsername = "admin";

    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/profile", Handle)
        .WithSummary("Updates the current user's profile")
        .WithRequestValidation<Request>();

    public record Request(string DisplayName, string Username, string Email, string? Password);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Username).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
            RuleFor(x => x.Password).MaximumLength(500);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle(
        Request request,
        ClaimsPrincipal claimsPrincipal,
        AppDbContext database,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = claimsPrincipal.GetUserId();

        var currentUser = await database.Users
            .SingleAsync(x => x.Id == currentUserId, cancellationToken);

        if (string.Equals(
                currentUser.Username,
                SeededAdminUsername,
                StringComparison.OrdinalIgnoreCase
            ))
        {
            return new ValidationError("Cannot change admin profile.");
        }

        var usernameTaken = await database.Users
            .AnyAsync(
                x => x.Id != currentUserId && x.Username == request.Username,
                cancellationToken
            );
        if (usernameTaken)
        {
            return new ValidationError("Username is already in use.");
        }

        var emailTaken = await database.Users
            .AnyAsync(
                x => x.Id != currentUserId && x.Email == request.Email,
                cancellationToken
            );
        if (emailTaken)
        {
            return new ValidationError("Email is already in use.");
        }

        currentUser.DisplayName = request.DisplayName;
        currentUser.Username = request.Username;
        currentUser.Email = request.Email;
        currentUser.UpdatedAtUtc = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            currentUser.Password = request.Password;
        }

        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
