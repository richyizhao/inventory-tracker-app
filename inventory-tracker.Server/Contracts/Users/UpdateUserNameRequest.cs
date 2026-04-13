using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Contracts.Users;

public sealed class UpdateUserNameRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
}


