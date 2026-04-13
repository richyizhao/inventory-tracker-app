using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Contracts.Roles;

public sealed class CreateRoleRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
}


