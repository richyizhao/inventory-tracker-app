namespace Server.Roles.Endpoints;

public class CreateRole : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithSummary("Creates a role")
        .WithRequestValidation<Request>();

    public record PermissionRequest(PermissionPage Page, bool CanView, bool CanEdit);
    public record Request(string Name, List<PermissionRequest>? Permissions);
    public record Response(int Id);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var exists = await database.Roles
            .AnyAsync(x => x.Name.ToLower() == request.Name.ToLower(), cancellationToken);
        if (exists)
        {
            return new ValidationError("Role name is already in use.");
        }

        var role = new Role
        {
            Name = request.Name,
        };

        if (request.Permissions is not null)
        {
            foreach (var permission in request.Permissions
                         .GroupBy(x => x.Page)
                         .Select(x => x.Last()))
            {
                role.Permissions.Add(new RolePermission
                {
                    Role = role,
                    Page = permission.Page,
                    CanView = permission.CanView,
                    CanEdit = permission.CanEdit
                });
            }
        }

        await database.Roles.AddAsync(role, cancellationToken);
        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new Response(role.Id));
    }
}
