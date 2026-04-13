namespace inventory_management.Server.Contracts.Roles;

public sealed class UpdateRolePermissionsRequest
{
    public IReadOnlyList<string> Permissions { get; set; } = [];
}


