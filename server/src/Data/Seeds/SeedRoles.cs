namespace Server.Data.Seeds;

public static class SeedRoles
{
    public static async Task<Role> SeedAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var seedRoles = await SeedJsonReader.ReadAsync<List<SeedRoleModel>>("roles.json", cancellationToken);
        var roles = await database.Roles
            .Include(x => x.Permissions)
            .ToListAsync(cancellationToken);

        Role? adminRole = null;

        foreach (var seedRole in seedRoles)
        {
            var role = roles.SingleOrDefault(x =>
                string.Equals(x.Name, seedRole.Name, StringComparison.OrdinalIgnoreCase));

            if (role is null)
            {
                role = new Role
                {
                    Name = seedRole.Name
                };

                foreach (var seedPermission in seedRole.Permissions)
                {
                    role.Permissions.Add(new RolePermission
                    {
                        Page = ParsePermissionPage(seedPermission.Page),
                        CanView = seedPermission.CanView,
                        CanEdit = seedPermission.CanEdit
                    });
                }

                await database.Roles.AddAsync(role, cancellationToken);
                roles.Add(role);
            }
            else
            {
                role.Name = seedRole.Name;

                var seededPermissions = seedRole.Permissions
                    .ToDictionary(
                        x => ParsePermissionPage(x.Page),
                        x => x,
                        EqualityComparer<PermissionPage>.Default);

                foreach (var permission in role.Permissions)
                {
                    if (seededPermissions.TryGetValue(permission.Page, out var seededPermission))
                    {
                        permission.CanView = seededPermission.CanView;
                        permission.CanEdit = seededPermission.CanEdit;
                    }
                }

                var existingPages = role.Permissions.Select(x => x.Page).ToHashSet();
                foreach (var seedPermission in seedRole.Permissions)
                {
                    var page = ParsePermissionPage(seedPermission.Page);
                    if (existingPages.Contains(page))
                    {
                        continue;
                    }

                    role.Permissions.Add(new RolePermission
                    {
                        RoleId = role.Id,
                        Page = page,
                        CanView = seedPermission.CanView,
                        CanEdit = seedPermission.CanEdit
                    });
                }
            }

            if (string.Equals(role.Name, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                adminRole = role;
            }
        }

        await database.SaveChangesAsync(cancellationToken);

        return adminRole
            ?? throw new InvalidOperationException("Default Admin role was not found in roles.json.");
    }

    private static PermissionPage ParsePermissionPage(string value)
    {
        if (!Enum.TryParse<PermissionPage>(value, true, out var page))
        {
            throw new InvalidOperationException($"Unknown permission page '{value}' in seed data.");
        }

        return page;
    }

    private sealed record SeedRoleModel(string Name, List<SeedRolePermissionModel> Permissions);
    private sealed record SeedRolePermissionModel(string Page, bool CanView, bool CanEdit);
}
