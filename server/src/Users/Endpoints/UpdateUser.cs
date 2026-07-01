namespace Server.Users.Endpoints;

public class UpdateUser : IEndpoint
{
    private const string SeededAdminUsername = "admin";

    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithSummary("Updates a user")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<User, Request>(x => x.Id)
        .WithEnsureEntityExists<Role, Request>(x => x.RoleId);

    public record Request(int Id, string DisplayName, string Username, string Email, int RoleId, string? Password, DateTime? CreatedAtUtc);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
            RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Username).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
            RuleFor(x => x.RoleId).GreaterThan(0);
            RuleFor(x => x.Password).MaximumLength(500);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var usernameTaken = await database.Users
            .AnyAsync(x => x.Id != request.Id && x.Username == request.Username, cancellationToken);
        if (usernameTaken)
        {
            return new ValidationError("Username is already in use.");
        }

        var emailTaken = await database.Users
            .AnyAsync(x => x.Id != request.Id && x.Email == request.Email, cancellationToken);
        if (emailTaken)
        {
            return new ValidationError("Email is already in use.");
        }

        var user = await database.Users.SingleAsync(x => x.Id == request.Id, cancellationToken);

        if (string.Equals(user.Username, SeededAdminUsername, StringComparison.OrdinalIgnoreCase))
        {
            return new ValidationError("The seeded admin account cannot be changed.");
        }

        user.DisplayName = request.DisplayName;
        user.Username = request.Username;
        user.Email = request.Email;
        user.RoleId = request.RoleId;
        user.CreatedAtUtc = request.CreatedAtUtc ?? user.CreatedAtUtc;
        user.UpdatedAtUtc = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.Password = request.Password;
        }

        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
