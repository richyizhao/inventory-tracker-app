namespace inventory_management.Server.Contracts.Users;

public sealed class UpdateUserRoleRequest
{
    public string Role { get; set; } = string.Empty;
}
