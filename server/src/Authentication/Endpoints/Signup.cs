using Server.Authentication.Services;

namespace Server.Authentication.Endpoints;

public class Signup : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/signup", Handle)
        .WithSummary("Creates a new user account")
        .WithRequestValidation<Request>();

    public record Request(string Username, string Password, string Name, string Email);
    public record Response(string Token);
    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Username).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(Request request, AppDbContext database, Jwt jwt, CancellationToken cancellationToken)
    {
        var isUsernameTaken = await database.Users
            .AnyAsync(x => x.Username == request.Username, cancellationToken);

        if (isUsernameTaken)
        {
            return new ValidationError("Username is already taken");
        }

        var isEmailTaken = await database.Users
            .AnyAsync(x => x.Email == request.Email, cancellationToken);

        if (isEmailTaken)
        {
            return new ValidationError("Email is already taken");
        }

        var defaultRole = await database.Roles
            .SingleOrDefaultAsync(x => x.Name.ToLower() == "staff", cancellationToken);

        if (defaultRole is null)
        {
            defaultRole = new Role
            {
                Name = "Staff"
            };

            await database.Roles.AddAsync(defaultRole, cancellationToken);
            await database.SaveChangesAsync(cancellationToken);
        }

        var user = new User
        {
            Username = request.Username,
            Password = request.Password,
            DisplayName = request.Name,
            Email = request.Email,
            RoleId = defaultRole.Id
        };
        await database.Users.AddAsync(user, cancellationToken);
        await database.SaveChangesAsync(cancellationToken);

        var token = jwt.GenerateToken(user);
        var response = new Response(token);
        return TypedResults.Ok(response);
    }
}
