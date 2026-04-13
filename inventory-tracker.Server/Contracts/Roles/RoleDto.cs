namespace inventory_management.Server.Contracts.Roles;

public sealed class RoleDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public IReadOnlyList<string> Permissions { get; set; } = [];

    public int UserCount { get; set; }
}


