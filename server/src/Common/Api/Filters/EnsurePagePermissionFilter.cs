namespace Server.Common.Api.Filters;

public class EnsurePagePermissionFilter(PermissionPage page, PagePermissionAccess access) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var userId = context.HttpContext.User.GetUserId();
        var cancellationToken = context.HttpContext.RequestAborted;
        var database = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

        var permission = await database.Users
            .Where(x => x.Id == userId)
            .Select(x => new
            {
                RoleName = x.Role.Name,
                Permission = x.Role.Permissions
                    .Where(p => p.Page == page)
                    .Select(p => new PermissionProjection(p.CanView, p.CanEdit))
                    .SingleOrDefault()
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (permission is null)
        {
            return TypedResults.Forbid();
        }

        if (string.Equals(permission.RoleName, "admin", StringComparison.OrdinalIgnoreCase))
        {
            return await next(context);
        }

        var pagePermission = permission.Permission;
        if (pagePermission is null)
        {
            return TypedResults.Forbid();
        }

        var hasAccess = access switch
        {
            PagePermissionAccess.View => pagePermission.CanView,
            PagePermissionAccess.Edit => pagePermission.CanEdit,
            _ => false
        };

        return hasAccess
            ? await next(context)
            : TypedResults.Forbid();
    }

    private sealed record PermissionProjection(bool CanView, bool CanEdit);
}
