namespace inventory_management.Server.Entities;

public class Role
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string[] Permissions { get; set; } = [];

    public ICollection<UserRole> UserRoles { get; set; } = [];
}

