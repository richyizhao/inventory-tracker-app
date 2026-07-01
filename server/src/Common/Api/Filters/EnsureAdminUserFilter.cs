namespace Server.Common.Api.Filters;

public class EnsureAdminUserFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var userId = context.HttpContext.User.GetUserId();
        var cancellationToken = context.HttpContext.RequestAborted;
        var database = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

        var user = await database.Users
            .Where(x => x.Id == userId)
            .Select(x => new
            {
                RoleName = x.Role.Name
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.Forbid();
        }

        return string.Equals(user.RoleName, "Admin", StringComparison.OrdinalIgnoreCase)
            ? await next(context)
            : TypedResults.Forbid();
    }
}
