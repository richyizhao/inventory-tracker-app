using Server.Common.Api.Filters;

namespace Server.Common.Api.Extensions;

public static class RouteHandlerBuilderValidationExtensions
{
    public static RouteHandlerBuilder WithRequestValidation<TRequest>(this RouteHandlerBuilder builder)
    {
        return builder
            .AddEndpointFilter<RequestValidationFilter<TRequest>>()
            .ProducesValidationProblem();
    }

    public static RouteHandlerBuilder WithEnsureEntityExists<TEntity, TRequest>(this RouteHandlerBuilder builder, Func<TRequest, int?> idSelector) where TEntity : class, IEntity
    {
        return builder
            .AddEndpointFilterFactory((_, next) => async context =>
            {
                var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                var filter = new EnsureEntityExistsFilter<TRequest, TEntity>(db, idSelector);
                return await filter.InvokeAsync(context, next);
            })
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    public static RouteHandlerBuilder WithEnsureUserOwnsEntity<TEntity, TRequest>(this RouteHandlerBuilder builder, Func<TRequest, int> idSelector) where TEntity : class, IEntity, IOwnedEntity
    {
        return builder
            .AddEndpointFilterFactory((_, next) => async context =>
            {
                var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                var filter = new EnsureUserOwnsEntityFilter<TRequest, TEntity>(db, idSelector);
                return await filter.InvokeAsync(context, next);
            })
            .ProducesProblem(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status403Forbidden);
    }

    public static RouteHandlerBuilder WithPagePermission(this RouteHandlerBuilder builder, PermissionPage page, PagePermissionAccess access)
    {
        return builder
            .AddEndpointFilterFactory((_, next) =>
            {
                var filter = new EnsurePagePermissionFilter(page, access);
                return context => filter.InvokeAsync(context, next);
            })
            .Produces(StatusCodes.Status403Forbidden);
    }

    public static RouteGroupBuilder WithPagePermission(this RouteGroupBuilder builder, PermissionPage page, PagePermissionAccess access)
    {
        return builder
            .AddEndpointFilterFactory((_, next) =>
            {
                var filter = new EnsurePagePermissionFilter(page, access);
                return context => filter.InvokeAsync(context, next);
            });
    }

    public static RouteHandlerBuilder WithAdminUser(this RouteHandlerBuilder builder)
    {
        return builder
            .AddEndpointFilterFactory((_, next) =>
            {
                var filter = new EnsureAdminUserFilter();
                return context => filter.InvokeAsync(context, next);
            })
            .Produces(StatusCodes.Status403Forbidden);
    }

    public static RouteGroupBuilder WithAdminUser(this RouteGroupBuilder builder)
    {
        return builder
            .AddEndpointFilterFactory((_, next) =>
            {
                var filter = new EnsureAdminUserFilter();
                return context => filter.InvokeAsync(context, next);
            });
    }
}
