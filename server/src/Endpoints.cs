using Server.Authentication.Endpoints;
using Server.Analytics.Endpoints;
using Server.Categories.Endpoints;
using Server.Common.Api.Filters;
using Server.Dashboard.Endpoints;
using Server.Products.Endpoints;
using Server.Products.Services;
using Server.Roles.Endpoints;
using Server.Settings.Endpoints;
using Server.Transactions.Endpoints;
using Server.Users.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi;

namespace Server;

public static class Endpoints
{
    private static readonly OpenApiSecuritySchemeReference BearerSecurityScheme =
        new(JwtBearerDefaults.AuthenticationScheme, null, null);

    public static void MapEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("")
            .AddEndpointFilter<RequestLoggingFilter>();

        endpoints.MapAuthenticationEndpoints();
        endpoints.MapDashboardEndpoints();
        endpoints.MapAnalyticsEndpoints();
        endpoints.MapCategoryEndpoints();
        endpoints.MapProductEndpoints();
        endpoints.MapTransactionEndpoints();
        endpoints.MapUserEndpoints();
        endpoints.MapRoleEndpoints();
        endpoints.MapSettingsEndpoints();
    }

    private static void MapAuthenticationEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/auth")
            .WithTags("Authentication");
            
        endpoints.MapPublicGroup()
            .MapEndpoint<Signup>()
            .MapEndpoint<Login>();
    }

    private static void MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/dashboard")
            .WithTags("Dashboard");

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Dashboard, PagePermissionAccess.View)
            .MapEndpoint<GetDashboardOverview>();
    }

    private static void MapAnalyticsEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/analytics")
            .WithTags("Analytics");

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Analytics, PagePermissionAccess.View)
            .MapEndpoint<GetAnalyticsSummary>()
            .MapEndpoint<GetProfitAndSpendingOverTime>()
            .MapEndpoint<GetInventoryValueDistribution>()
            .MapEndpoint<GetProfitByCategory>()
            .MapEndpoint<GetRestockExpenseByCategory>();
    }

    private static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/categories")
            .WithTags("Categories");

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Categories, PagePermissionAccess.View)
            .MapEndpoint<GetCategories>();

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Categories, PagePermissionAccess.Edit)
            .MapEndpoint<CreateCategory>()
            .MapEndpoint<UpdateCategory>()
            .MapEndpoint<DeleteCategory>()
            .MapEndpoint<CreateSubCategory>()
            .MapEndpoint<UpdateSubCategory>()
            .MapEndpoint<DeleteSubCategory>();
    }

    private static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/products")
            .WithTags("Products");

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Products, PagePermissionAccess.View)
            .MapEndpoint<GetProducts>()
            .MapEndpoint<GetProductById>();

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Products, PagePermissionAccess.Edit)
            .MapEndpoint<UploadProductImage>()
            .MapEndpoint<CreateProduct>()
            .MapEndpoint<UpdateProduct>()
            .MapEndpoint<DeleteProduct>();
    }

    private static void MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/transactions")
            .WithTags("Transactions");

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Transactions, PagePermissionAccess.View)
            .MapEndpoint<GetTransactions>()
            .MapEndpoint<GetTransactionById>();

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Transactions, PagePermissionAccess.Edit)
            .MapEndpoint<CreateTransaction>()
            .MapEndpoint<UpdateTransaction>()
            .MapEndpoint<DeleteTransaction>();
    }

    private static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/users")
            .WithTags("Users");

        endpoints.MapAuthorizedGroup()
            .MapEndpoint<GetCurrentUserProfile>()
            .MapEndpoint<UpdateCurrentUserProfile>();

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Users, PagePermissionAccess.View)
            .MapEndpoint<GetUsers>()
            .MapEndpoint<GetUserById>();

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Users, PagePermissionAccess.Edit)
            .MapEndpoint<CreateUser>()
            .MapEndpoint<UpdateUser>()
            .MapEndpoint<DeleteUser>();
    }

    private static void MapRoleEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/roles")
            .WithTags("Roles");

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Roles, PagePermissionAccess.View)
            .MapEndpoint<GetRoles>();

        endpoints.MapAuthorizedGroup()
            .WithPagePermission(PermissionPage.Roles, PagePermissionAccess.Edit)
            .MapEndpoint<CreateRole>()
            .MapEndpoint<UpdateRole>()
            .MapEndpoint<DeleteRole>();
    }

    private static void MapSettingsEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/settings")
            .WithTags("Settings");

        endpoints.MapAuthorizedGroup()
            .MapEndpoint<CreateDemoData>()
            .MapEndpoint<DeleteDemoData>();
    }

    private static RouteGroupBuilder MapPublicGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        return app.MapGroup(prefix ?? string.Empty)
            .AllowAnonymous();
    }

    private static RouteGroupBuilder MapAuthorizedGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        var group = app.MapGroup(prefix ?? string.Empty)
            .RequireAuthorization();

        group.RequireBearerTokenInDocs();

        return group;
    }

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app) where TEndpoint : IEndpoint
    {
        TEndpoint.Map(app);
        return app;
    }

    private static TBuilder RequireBearerTokenInDocs<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder
    {
        return builder.AddOpenApiOperationTransformer((operation, _, _) =>
        {
            operation.Security ??= [];
            operation.Security.Add(new OpenApiSecurityRequirement
            {
                [BearerSecurityScheme] = []
            });

            return Task.CompletedTask;
        });
    }
}
