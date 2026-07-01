namespace Server.Users.Endpoints;

public class CreateUser : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithSummary("Creates a user")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Role, Request>(x => x.RoleId);

    public record Request(string DisplayName, string Username, string Email, int RoleId, string Password, DateTime? CreatedAtUtc);
    public record Response(int Id);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Username).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
            RuleFor(x => x.RoleId).GreaterThan(0);
            RuleFor(x => x.Password).NotEmpty().MaximumLength(500);
        }
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var usernameTaken = await database.Users.AnyAsync(x => x.Username == request.Username, cancellationToken);
        if (usernameTaken)
        {
            return new ValidationError("Username is already in use.");
        }

        var emailTaken = await database.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
        if (emailTaken)
        {
            return new ValidationError("Email is already in use.");
        }

        var user = new User
        {
            DisplayName = request.DisplayName,
            Username = request.Username,
            Email = request.Email,
            RoleId = request.RoleId,
            Password = request.Password,
            CreatedAtUtc = request.CreatedAtUtc ?? DateTime.UtcNow
        };

        await database.Users.AddAsync(user, cancellationToken);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new Response(user.Id));
    }
}
