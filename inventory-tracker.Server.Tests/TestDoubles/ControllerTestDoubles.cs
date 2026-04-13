using System.Security.Claims;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;
using inventory_management.Server.Services.Authentication;
using inventory_management.Server.Services.Authorization;

namespace inventory_management.Server.Tests.TestDoubles;

internal sealed class InMemoryRepo : IRepo
{
    public List<User> Users { get; } = [];
    public List<Role> Roles { get; } = [];
    public List<UserRole> UserRoles { get; } = [];

    public IReadOnlyCollection<User> GetUsers() => Users;
    public IReadOnlyCollection<Role> GetRoles() => Roles;
    public IReadOnlyCollection<UserRole> GetUserRoles() => UserRoles;
    public User? GetUserById(Guid id) => Users.FirstOrDefault(user => user.Id == id);
    public User? GetUserByEmail(string email) => Users.FirstOrDefault(user => string.Equals(user.Email, email, StringComparison.OrdinalIgnoreCase));
    public Role? GetRoleById(Guid id) => Roles.FirstOrDefault(role => role.Id == id);
    public Role? GetRoleByName(string name) => Roles.FirstOrDefault(role => string.Equals(role.Name, name, StringComparison.OrdinalIgnoreCase));

    public User CreateUser(string name, string email, string passwordHash, string roleName)
    {
        var role = GetRoleByName(roleName) ?? throw new InvalidOperationException("Role does not exist.");
        var user = new User
        {
            Name = name,
            Email = email,
            PasswordHash = passwordHash,
        };

        Users.Add(user);
        ReplaceUserRole(user, role);
        return user;
    }

    public Role AddRole(Role role)
    {
        if (Roles.Any(existing => string.Equals(existing.Name, role.Name, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("A role with this name already exists.");
        }

        Roles.Add(role);
        return role;
    }

    public bool DeleteRole(Guid id)
    {
        var role = GetRoleById(id);
        if (role is null)
        {
            return false;
        }

        foreach (var userRole in UserRoles.Where(link => link.RoleId == id).ToList())
        {
            userRole.User.UserRoles.Remove(userRole);
            userRole.Role.UserRoles.Remove(userRole);
            UserRoles.Remove(userRole);
        }

        return Roles.Remove(role);
    }

    public Role UpdateRolePermissions(Role role, IEnumerable<string> permissions)
    {
        role.Permissions = [.. permissions];
        return role;
    }

    public UserRole AddUserRole(UserRole userRole)
    {
        UserRoles.Add(userRole);
        userRole.User.UserRoles.Add(userRole);
        userRole.Role.UserRoles.Add(userRole);
        return userRole;
    }

    public void ReplaceUserRole(User user, Role role)
    {
        foreach (var userRole in UserRoles.Where(link => link.UserId == user.Id).ToList())
        {
            userRole.User.UserRoles.Remove(userRole);
            userRole.Role.UserRoles.Remove(userRole);
            UserRoles.Remove(userRole);
        }

        AddUserRole(new UserRole
        {
            UserId = user.Id,
            User = user,
            RoleId = role.Id,
            Role = role,
        });
    }

    public void UpdateUserIdentity(User user, string name) => user.Name = name;

    public void UpdateUserProfile(User user, string name, string newEmail, string? newPasswordHash = null)
    {
        user.Name = name;
        user.Email = newEmail;

        if (!string.IsNullOrWhiteSpace(newPasswordHash))
        {
            user.PasswordHash = newPasswordHash;
        }
    }

    public void UpdateUserEmail(User user, string newEmail) => user.Email = newEmail;
    public void UpdateUserPassword(User user, string newPasswordHash) => user.PasswordHash = newPasswordHash;

    public bool DeleteUser(Guid id)
    {
        var user = GetUserById(id);
        if (user is null)
        {
            return false;
        }

        foreach (var userRole in UserRoles.Where(link => link.UserId == id).ToList())
        {
            userRole.User.UserRoles.Remove(userRole);
            userRole.Role.UserRoles.Remove(userRole);
            UserRoles.Remove(userRole);
        }

        return Users.Remove(user);
    }
}

internal sealed class TestPasswordService : IPasswordService
{
    public string HashPassword(string password) => $"hashed::{password}";
    public bool VerifyPassword(string password, string passwordHash) => passwordHash == HashPassword(password);
}

internal sealed class TestTokenService : ITokenService
{
    public string Token { get; set; } = "test-token";
    public DateTime ExpiresAtUtc { get; set; } = new(2030, 1, 1, 0, 0, 0, DateTimeKind.Utc);
    public (string Token, DateTime ExpiresAtUtc) CreateToken(User user) => (Token, ExpiresAtUtc);
}

internal sealed class TestUserPermissionService : IUserPermissionService
{
    public HashSet<string> GrantedPermissions { get; } = new(StringComparer.OrdinalIgnoreCase);
    public Task<bool> HasPermissionAsync(ClaimsPrincipal principal, string permission) => Task.FromResult(GrantedPermissions.Contains(permission));
}

internal sealed class TestUserContextService : IUserContextService
{
    public User? CurrentUser { get; set; }

    public bool TryGetUserId(ClaimsPrincipal principal, out Guid userId)
    {
        userId = CurrentUser?.Id ?? Guid.Empty;
        return CurrentUser is not null;
    }

    public User? GetCurrentUser(ClaimsPrincipal principal) => CurrentUser;
}

internal static class TestDataFactory
{
    public static Role CreateRole(string name, params string[] permissions)
    {
        return new Role
        {
            Name = name,
            Permissions = permissions,
        };
    }

    public static User CreateUser(string name, string email, string passwordHash, params Role[] roles)
    {
        var user = new User
        {
            Name = name,
            Email = email,
            PasswordHash = passwordHash,
        };

        foreach (var role in roles)
        {
            var userRole = new UserRole
            {
                UserId = user.Id,
                User = user,
                RoleId = role.Id,
                Role = role,
            };

            user.UserRoles.Add(userRole);
            role.UserRoles.Add(userRole);
        }

        return user;
    }
}
