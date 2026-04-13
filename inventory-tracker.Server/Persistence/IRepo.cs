using inventory_management.Server.Entities;

namespace inventory_management.Server.Persistence;

public interface IRepo
{
    IReadOnlyCollection<User> GetUsers();
    IReadOnlyCollection<Role> GetRoles();
    IReadOnlyCollection<UserRole> GetUserRoles();
    User? GetUserById(Guid id);
    User? GetUserByEmail(string email);
    Role? GetRoleById(Guid id);
    Role? GetRoleByName(string name);
    User CreateUser(string name, string email, string passwordHash, string roleName);
    Role AddRole(Role role);
    bool DeleteRole(Guid id);
    Role UpdateRolePermissions(Role role, IEnumerable<string> permissions);
    UserRole AddUserRole(UserRole userRole);
    void ReplaceUserRole(User user, Role role);
    void UpdateUserIdentity(User user, string name);
    void UpdateUserProfile(User user, string name, string newEmail, string? newPasswordHash = null);
    void UpdateUserEmail(User user, string newEmail);
    void UpdateUserPassword(User user, string newPasswordHash);
    bool DeleteUser(Guid id);
}

