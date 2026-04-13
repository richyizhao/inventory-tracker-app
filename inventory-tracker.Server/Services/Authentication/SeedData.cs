using inventory_management.Server.Common;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Services.Authentication;

public static class SeedData
{
    public const string AdminRoleName = "Admin";
    public const string ManagerRoleName = "Manager";
    public const string StaffRoleName = "Staff";
    public const string SeedAdminEmail = "admin@inventory.local";
    public const string SeedAdminPassword = "Admin123!";

    public static void Seed(AppDbContext dbContext, IPasswordService passwordService)
    {
        SeedRoles(dbContext);
        SeedCategoryHierarchy(dbContext);
        SeedAdminUser(dbContext, passwordService);
    }

    private static void SeedRoles(AppDbContext dbContext)
    {
        var defaultRoles = new[] { AdminRoleName, ManagerRoleName, StaffRoleName };
        var changed = false;

        foreach (var roleName in defaultRoles)
        {
            var existingRole = dbContext.Roles.FirstOrDefault(role =>
                EF.Functions.ILike(role.Name, roleName));

            if (existingRole is not null)
            {
                if (AppPermissions.DefaultRolePermissions.TryGetValue(roleName, out var defaultPermissions))
                {
                    var mergedPermissions = existingRole.Permissions
                        .Union(defaultPermissions, StringComparer.OrdinalIgnoreCase)
                        .OrderBy(permission => permission, StringComparer.OrdinalIgnoreCase)
                        .ToArray();

                    if (!mergedPermissions.SequenceEqual(existingRole.Permissions, StringComparer.OrdinalIgnoreCase))
                    {
                        existingRole.Permissions = mergedPermissions;
                        changed = true;
                    }
                }

                continue;
            }

            dbContext.Roles.Add(new Role
            {
                Name = roleName,
                Permissions = AppPermissions.DefaultRolePermissions[roleName]
            });

            changed = true;
        }

        if (changed)
        {
            dbContext.SaveChanges();
        }
    }

    private static void SeedAdminUser(AppDbContext dbContext, IPasswordService passwordService)
    {
        var existingAdmin = dbContext.Users
            .Where(user => EF.Functions.ILike(user.Email, SeedAdminEmail))
            .Select(user => new
            {
                User = user,
                HasAdminRole = user.UserRoles.Any(userRole => userRole.Role.Name == AdminRoleName),
                PasswordHash = user.PasswordHash
            })
            .FirstOrDefault();

        var adminRole = dbContext.Roles.First(role => role.Name == AdminRoleName);

        if (existingAdmin is not null)
        {
            if (!existingAdmin.HasAdminRole)
            {
                dbContext.UserRoles.Add(new UserRole
                {
                    UserId = existingAdmin.User.Id,
                    RoleId = adminRole.Id
                });
            }

            if (!passwordService.VerifyPassword(SeedAdminPassword, existingAdmin.PasswordHash))
            {
                existingAdmin.User.PasswordHash = passwordService.HashPassword(SeedAdminPassword);
            }

            dbContext.SaveChanges();

            return;
        }

        var adminUser = new User
        {
            Name = "Admin User",
            Email = SeedAdminEmail,
            PasswordHash = passwordService.HashPassword(SeedAdminPassword)
        };

        dbContext.Users.Add(adminUser);
        dbContext.UserRoles.Add(new UserRole
        {
            User = adminUser,
            Role = adminRole
        });
        dbContext.SaveChanges();
    }

    private static void SeedCategoryHierarchy(AppDbContext dbContext)
    {
        var hierarchy = new Dictionary<string, string[]>
        {
            ["PC Components"] = [
                "CPU", "GPU", "RAM", "Motherboard", "Storage", "PSU", "PC Cases",
                "CPU Cooler", "Case Fans", "Thermal Paste", "Expansion Cards"
            ],
            ["Computers"] = [
                "Laptops", "Workstations", "Gaming PCs", "Mini PCs",
                "All-in-One PCs", "Refurbished Systems"
            ],
            ["Mobile Devices"] = [
                "Smartphones", "Tablets", "Smartwatches"
            ],
            ["Peripherals"] = [
                "Keyboards", "Mice", "Mouse Pads", "Speakers",
                "Microphones", "Webcams", "Drawing Tablets"
            ],
            ["Networking"] = [
                "Routers", "Modems", "Network Switches", "Access Points"
            ],
            ["Accessories"] = [
                "Cables", "Adapters", "Chargers", "Power Banks",
                "Cable Management", "Mounts & Stands"
            ]
        };

        var changed = false;
        var flattenedHierarchy = hierarchy
            .SelectMany(pair => pair.Value.Select(subCategoryName => new
            {
                CategoryName = pair.Key,
                SubCategoryName = subCategoryName
            }))
            .ToList();

        foreach (var (categoryName, subCategoryNames) in hierarchy)
        {
            var category = dbContext.Categories
                .Include(item => item.SubCategories)
                .FirstOrDefault(item => EF.Functions.ILike(item.Name, categoryName));

            if (category is null)
            {
                category = new Category
                {
                    Name = categoryName
                };
                dbContext.Categories.Add(category);
                changed = true;
            }

            foreach (var subCategoryName in subCategoryNames)
            {
                var existingSubCategory = category.SubCategories.FirstOrDefault(item =>
                    string.Equals(item.Name, subCategoryName, StringComparison.OrdinalIgnoreCase));

                if (existingSubCategory is not null)
                {
                    continue;
                }

                var legacySubCategory = dbContext.SubCategories.FirstOrDefault(item =>
                    item.CategoryId == null &&
                    EF.Functions.ILike(item.Name, subCategoryName));

                if (legacySubCategory is not null)
                {
                    legacySubCategory.CategoryId = category.Id;
                    changed = true;
                    continue;
                }

                category.SubCategories.Add(new SubCategory
                {
                    Name = subCategoryName
                });
                changed = true;
            }
        }

        if (changed)
        {
            dbContext.SaveChanges();
        }
    }
}



