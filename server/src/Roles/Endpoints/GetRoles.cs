namespace Server.Roles.Endpoints;

public class GetRoles : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Gets roles and permission summaries");

    public record PermissionResponse(PermissionPage Page, bool CanView, bool CanEdit);
    public record Response(int Id, string Name, int TotalAssignedUsers, int TotalPermissions, string AccessSummary, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc, List<PermissionResponse> Permissions);

    private static async Task<List<Response>> Handle(AppDbContext database, CancellationToken cancellationToken)
    {
        return await database.Roles
            .OrderByDescending(x => x.Name == "Admin")
            .ThenByDescending(x =>
                x.Permissions.Sum(p => (p.CanView ? 1 : 0) + (p.CanEdit ? 1 : 0))
            )
            .ThenBy(x => x.Name)
            .Select(x => new Response(
                x.Id,
                x.Name,
                x.Users.Count,
                x.Permissions.Sum(p => (p.CanView ? 1 : 0) + (p.CanEdit ? 1 : 0)),
                string.Join(", ", x.Permissions
                    .Where(p => p.CanView || p.CanEdit)
                    .OrderBy(p => p.Page)
                    .Select(p => p.Page + $"({(p.CanView ? "View" : "")}{(p.CanEdit ? "/Edit" : "")})")),
                x.CreatedAtUtc,
                x.UpdatedAtUtc,
                x.Permissions
                    .OrderBy(p => p.Page)
                    .Select(p => new PermissionResponse(p.Page, p.CanView, p.CanEdit))
                    .ToList()))
            .ToListAsync(cancellationToken);
    }
}
