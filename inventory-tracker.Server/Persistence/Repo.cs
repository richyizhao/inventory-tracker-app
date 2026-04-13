using inventory_management.Server.Common;
using inventory_management.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Persistence;

public sealed class Repo(AppDbContext dbContext) : IRepo
{
    private readonly AppDbContext _dbContext = dbContext;

    public IReadOnlyCollection<User> GetUsers()
    {
        return [.. _dbContext.Users
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)];
    }

    public IReadOnlyCollection<Role> GetRoles()
    {
        return [.. _dbContext.Roles
            .Include(role => role.UserRoles)
            .ThenInclude(userRole => userRole.User)];
    }

    public IReadOnlyCollection<UserRole> GetUserRoles()
    {
        return [.. _dbContext.UserRoles
            .Include(userRole => userRole.User)
            .Include(userRole => userRole.Role)];
    }

    public User? GetUserById(Guid id)
    {
        return _dbContext.Users
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .FirstOrDefault(user => user.Id == id);
    }

    public User? GetUserByEmail(string email)
    {
        return _dbContext.Users
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .FirstOrDefault(user => EF.Functions.ILike(user.Email, email));
    }

    public Role? GetRoleById(Guid id)
    {
        return _dbContext.Roles
            .Include(role => role.UserRoles)
            .ThenInclude(userRole => userRole.User)
            .FirstOrDefault(role => role.Id == id);
    }

    public Role? GetRoleByName(string name)
    {
        return _dbContext.Roles
            .Include(role => role.UserRoles)
            .ThenInclude(userRole => userRole.User)
            .FirstOrDefault(role => EF.Functions.ILike(role.Name, name));
    }

    public User CreateUser(string name, string email, string passwordHash, string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            throw new InvalidOperationException("Role is required.");
        }

        var role = GetRoleByName(roleName.Trim()) ?? throw new InvalidOperationException("Role does not exist.");
        var trimmedName = name.Trim();

        var user = new User
        {
            Name = trimmedName,
            Email = email.Trim(),
            PasswordHash = passwordHash
        };
        var userRole = new UserRole
        {
            User = user,
            Role = role
        };

        _dbContext.Users.Add(user);
        _dbContext.UserRoles.Add(userRole);
        user.UserRoles.Add(userRole);
        role.UserRoles.Add(userRole);
        _dbContext.SaveChanges();
        return user;
    }

    public Role AddRole(Role role)
    {
        if (string.IsNullOrWhiteSpace(role.Name))
        {
            throw new InvalidOperationException("Role name is required.");
        }

        var normalizedName = role.Name.Trim();

        var existingRole = GetRoleByName(normalizedName);

        if (existingRole is not null)
        {
            return existingRole;
        }

        role.Name = normalizedName;
        role.Permissions = AppPermissions.Normalize(role.Permissions);
        _dbContext.Roles.Add(role);
        _dbContext.SaveChanges();
        return role;
    }

    public bool DeleteRole(Guid id)
    {
        var role = GetRoleById(id);

        if (role is null)
        {
            return false;
        }

        var userRoles = _dbContext.UserRoles
            .Where(link => link.RoleId == id)
            .ToList();

        foreach (var userRole in userRoles)
        {
            userRole.User.UserRoles.Remove(userRole);
            role.UserRoles.Remove(userRole);
            _dbContext.UserRoles.Remove(userRole);
        }

        _dbContext.Roles.Remove(role);
        _dbContext.SaveChanges();

        return true;
    }

    public Role UpdateRolePermissions(Role role, IEnumerable<string> permissions)
    {
        role.Permissions = AppPermissions.Normalize(permissions);
        _dbContext.SaveChanges();
        return role;
    }

    public UserRole AddUserRole(UserRole userRole)
    {
        var user = GetUserById(userRole.UserId) ?? throw new InvalidOperationException("User does not exist.");
        var role = GetRoleById(userRole.RoleId) ?? throw new InvalidOperationException("Role does not exist.");

        var existingLink = _dbContext.UserRoles.FirstOrDefault(link =>
            link.UserId == userRole.UserId && link.RoleId == userRole.RoleId);

        if (existingLink is not null)
        {
            return existingLink;
        }

        userRole.User = user;
        userRole.Role = role;

        _dbContext.UserRoles.Add(userRole);
        user.UserRoles.Add(userRole);
        role.UserRoles.Add(userRole);
        _dbContext.SaveChanges();

        return userRole;
    }

    public void ReplaceUserRole(User user, Role role)
    {
        var existingLinks = _dbContext.UserRoles
            .Where(link => link.UserId == user.Id)
            .ToList();

        foreach (var link in existingLinks)
        {
            link.User.UserRoles.Remove(link);
            link.Role.UserRoles.Remove(link);
            _dbContext.UserRoles.Remove(link);
        }

        var userRole = new UserRole
        {
            UserId = user.Id,
            RoleId = role.Id,
            User = user,
            Role = role
        };

        _dbContext.UserRoles.Add(userRole);
        user.UserRoles.Add(userRole);
        role.UserRoles.Add(userRole);
        _dbContext.SaveChanges();
    }

    public void UpdateUserProfile(User user, string name, string newEmail, string? newPasswordHash = null)
    {
        UpdateUserIdentity(user, name);
        user.Email = newEmail.Trim();

        if (!string.IsNullOrWhiteSpace(newPasswordHash))
        {
            user.PasswordHash = newPasswordHash;
        }

        _dbContext.SaveChanges();
    }

    public void UpdateUserIdentity(User user, string name)
    {
        user.Name = name.Trim();
        _dbContext.SaveChanges();
    }

    public void UpdateUserPassword(User user, string newPasswordHash)
    {
        user.PasswordHash = newPasswordHash;
        _dbContext.SaveChanges();
    }

    public void UpdateUserEmail(User user, string newEmail)
    {
        user.Email = newEmail.Trim();
        _dbContext.SaveChanges();
    }

    public bool DeleteUser(Guid id)
    {
        var user = GetUserById(id);

        if (user is null)
        {
            return false;
        }

        var userRoles = _dbContext.UserRoles
            .Where(link => link.UserId == id)
            .ToList();

        foreach (var userRole in userRoles)
        {
            user.UserRoles.Remove(userRole);
            userRole.Role.UserRoles.Remove(userRole);
            _dbContext.UserRoles.Remove(userRole);
        }

        _dbContext.Users.Remove(user);
        _dbContext.SaveChanges();

        return true;
    }
}


