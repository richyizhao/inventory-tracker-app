namespace Server.Roles.Endpoints;

public class UpdateRole : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithSummary("Updates a role and its permissions")
        .WithRequestValidation<Request>()
        .WithEnsureEntityExists<Role, Request>(x => x.Id);

    public record PermissionRequest(PermissionPage Page, bool CanView, bool CanEdit);
    public record Request(int Id, string Name, List<PermissionRequest> Permissions);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }

    private static async Task<Results<Ok, ValidationError>> Handle(Request request, AppDbContext database, CancellationToken cancellationToken)
    {
        var duplicateExists = await database.Roles
            .AnyAsync(
                x => x.Id != request.Id && x.Name.ToLower() == request.Name.ToLower(),
                cancellationToken
            );

        if (duplicateExists)
        {
            return new ValidationError("Role name is already in use.");
        }

        var role = await database.Roles
            .Include(x => x.Permissions)
            .SingleAsync(x => x.Id == request.Id, cancellationToken);

        if (string.Equals(role.Name, "admin", StringComparison.OrdinalIgnoreCase))
        {
            return new ValidationError("The admin role cannot be changed.");
        }

        role.Name = request.Name;
        role.UpdatedAtUtc = DateTime.UtcNow;

        database.RolePermissions.RemoveRange(role.Permissions);
        role.Permissions.Clear();

        foreach (var permission in request.Permissions
                     .GroupBy(x => x.Page)
                     .Select(x => x.Last()))
        {
            role.Permissions.Add(new RolePermission
            {
                RoleId = role.Id,
                Page = permission.Page,
                CanView = permission.CanView,
                CanEdit = permission.CanEdit
            });
        }

        await database.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok();
    }
}
