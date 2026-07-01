namespace Server.Data.Types;

public class Role : IEntity
{
    public int Id { get; private init; }
    public Guid ReferenceId { get; private init; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public List<RolePermission> Permissions { get; init; } = [];
    public List<User> Users { get; init; } = [];
}

public class RolePermission : IEntity
{
    public int Id { get; private init; }
    public Guid ReferenceId { get; private init; } = Guid.NewGuid();
    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public PermissionPage Page { get; set; }
    public bool CanView { get; set; }
    public bool CanEdit { get; set; }
}

public enum PermissionPage
{
    Dashboard = 1,
    Analytics = 2,
    Categories = 3,
    Products = 4,
    Transactions = 5,
    Users = 6,
    Roles = 7,
}

public enum PagePermissionAccess
{
    View = 1,
    Edit = 2,
}
