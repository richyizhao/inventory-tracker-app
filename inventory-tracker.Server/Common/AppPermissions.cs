namespace inventory_management.Server.Common;

public static class AppPermissions
{
    public const string DashboardView = "pages.dashboard.view";
    public const string AnalyticsView = "pages.analytics.view";
    public const string ProductsView = "pages.products.view";
    public const string ProductsManage = "products.manage";
    public const string ProductsDelete = "products.delete";
    public const string CategoriesView = "pages.categories.view";
    public const string CategoriesManage = "categories.manage";
    public const string TransactionsView = "pages.transactions.view";
    public const string TransactionsCreate = "transactions.create";
    public const string TransactionsHistoryView = "transactions.history.view";
    public const string TransactionsManage = "transactions.manage";
    public const string TransactionsDelete = "transactions.delete";
    public const string UsersView = "pages.users.view";
    public const string UsersCreate = "users.create";
    public const string UsersEditName = "users.edit.name";
    public const string UsersEditEmail = "users.edit.email";
    public const string UsersSwitchRole = "users.role.switch";
    public const string UsersManagePasswords = "users.password.manage";
    public const string UsersDelete = "users.delete";
    public const string RolesView = "pages.roles.view";
    public const string RolesCreate = "roles.create";
    public const string RolesDelete = "roles.delete";
    public const string RolesManagePermissions = "roles.permissions.manage";

    public static readonly string[] All =
    [
        DashboardView,
        AnalyticsView,
        ProductsView,
        ProductsManage,
        ProductsDelete,
        CategoriesView,
        CategoriesManage,
        TransactionsView,
        TransactionsCreate,
        TransactionsHistoryView,
        TransactionsManage,
        TransactionsDelete,
        UsersView,
        UsersCreate,
        UsersEditName,
        UsersEditEmail,
        UsersSwitchRole,
        UsersManagePasswords,
        UsersDelete,
        RolesView,
        RolesCreate,
        RolesDelete,
        RolesManagePermissions
    ];

    public static readonly IReadOnlyDictionary<string, string[]> DefaultRolePermissions =
        new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            ["Admin"] = [.. All],
            ["Manager"] =
            [
                DashboardView,
                AnalyticsView,
                ProductsView,
                ProductsManage,
                ProductsDelete,
                CategoriesView,
                CategoriesManage,
                TransactionsView,
                TransactionsCreate,
                TransactionsHistoryView,
                TransactionsManage,
                TransactionsDelete,
                UsersView,
                UsersEditName,
                UsersSwitchRole,
                UsersManagePasswords,
                UsersDelete,
                RolesView
            ],
            ["Staff"] =
            [
                DashboardView,
                ProductsView,
                ProductsManage,
                CategoriesView,
                TransactionsView,
                TransactionsCreate
            ]
        };

    public static string[] Normalize(IEnumerable<string>? permissions)
    {
        if (permissions is null)
        {
            return [];
        }

        return [.. permissions
            .Where(permission => !string.IsNullOrWhiteSpace(permission))
            .Select(permission => permission.Trim())
            .Where(permission => All.Contains(permission, StringComparer.OrdinalIgnoreCase))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(permission => permission, StringComparer.OrdinalIgnoreCase)];
    }
}


