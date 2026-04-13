namespace inventory_management.Server.Contracts.Roles;

public sealed class DeleteRoleRequest
{
    public Guid? ReassignUsersToRoleId { get; set; }
}
