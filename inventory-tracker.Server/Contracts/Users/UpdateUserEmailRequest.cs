using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Contracts.Users;

public sealed class UpdateUserEmailRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}


