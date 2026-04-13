export const permissionIds = {
  dashboardView: "pages.dashboard.view",
  analyticsView: "pages.analytics.view",
  productsView: "pages.products.view",
  productsManage: "products.manage",
  productsDelete: "products.delete",
  categoriesView: "pages.categories.view",
  categoriesManage: "categories.manage",
  transactionsView: "pages.transactions.view",
  transactionsCreate: "transactions.create",
  transactionsHistoryView: "transactions.history.view",
  transactionsManage: "transactions.manage",
  transactionsDelete: "transactions.delete",
  usersView: "pages.users.view",
  usersCreate: "users.create",
  usersEditName: "users.edit.name",
  usersEditEmail: "users.edit.email",
  usersSwitchRole: "users.role.switch",
  usersManagePasswords: "users.password.manage",
  usersDelete: "users.delete",
  rolesView: "pages.roles.view",
  rolesCreate: "roles.create",
  rolesDelete: "roles.delete",
  rolesManagePermissions: "roles.permissions.manage",
} as const;

export type PermissionId = (typeof permissionIds)[keyof typeof permissionIds];

export type PermissionDefinition = {
  id: PermissionId;
  label: string;
  description: string;
};

export type PermissionGroup = {
  id: string;
  label: string;
  permissions: PermissionDefinition[];
};

export const permissionGroups: PermissionGroup[] = [
  {
    id: "pages",
    label: "Pages",
    permissions: [
      {
        id: permissionIds.dashboardView,
        label: "Dashboard",
        description: "Open the dashboard overview page.",
      },
      {
        id: permissionIds.analyticsView,
        label: "Analytics",
        description: "Open analytics and spending insights.",
      },
      {
        id: permissionIds.productsView,
        label: "Products",
        description: "Browse the product catalog and details.",
      },
      {
        id: permissionIds.categoriesView,
        label: "Categories",
        description: "Browse category and sub-category lists.",
      },
      {
        id: permissionIds.transactionsView,
        label: "Transactions",
        description: "Open the transactions page.",
      },
      {
        id: permissionIds.usersView,
        label: "Users",
        description: "Open the users and team management page.",
      },
      {
        id: permissionIds.rolesView,
        label: "Roles",
        description: "Open the roles and permissions page.",
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory Actions",
    permissions: [
      {
        id: permissionIds.productsManage,
        label: "Manage products",
        description: "Create and edit product records.",
      },
      {
        id: permissionIds.productsDelete,
        label: "Delete products",
        description: "Remove product records.",
      },
      {
        id: permissionIds.categoriesManage,
        label: "Manage categories",
        description: "Create and delete categories and sub-categories.",
      },
      {
        id: permissionIds.transactionsCreate,
        label: "Record transactions",
        description: "Create stock movement entries.",
      },
      {
        id: permissionIds.transactionsHistoryView,
        label: "View transaction history",
        description: "See the full transaction ledger.",
      },
      {
        id: permissionIds.transactionsManage,
        label: "Manage transactions",
        description: "Edit existing stock movement entries.",
      },
      {
        id: permissionIds.transactionsDelete,
        label: "Delete transactions",
        description: "Remove stock movement entries.",
      },
    ],
  },
  {
    id: "team",
    label: "Team Actions",
    permissions: [
      {
        id: permissionIds.usersCreate,
        label: "Create users",
        description: "Register new users and assign a role.",
      },
      {
        id: permissionIds.usersEditName,
        label: "Edit user names",
        description: "Change another user's display name.",
      },
      {
        id: permissionIds.usersEditEmail,
        label: "Edit user emails",
        description: "Change another user's email address.",
      },
      {
        id: permissionIds.usersSwitchRole,
        label: "Switch user roles",
        description: "Change which role another user is assigned to.",
      },
      {
        id: permissionIds.usersManagePasswords,
        label: "Manage passwords",
        description: "Reset passwords for other users.",
      },
      {
        id: permissionIds.usersDelete,
        label: "Delete users",
        description: "Remove user accounts from the system.",
      },
      {
        id: permissionIds.rolesCreate,
        label: "Create roles",
        description: "Add new role records.",
      },
      {
        id: permissionIds.rolesDelete,
        label: "Delete roles",
        description: "Remove custom roles that are no longer in use.",
      },
      {
        id: permissionIds.rolesManagePermissions,
        label: "Manage role permissions",
        description: "Edit what each role can access and do.",
      },
    ],
  },
];

export function hasPermission(
  permissions: string[] | undefined,
  permission: string,
) {
  return (
    permissions?.some((item) => item.toLowerCase() === permission.toLowerCase()) ??
    false
  );
}

export function countEnabledPermissions(permissions: string[] | undefined) {
  return permissions?.length ?? 0;
}
