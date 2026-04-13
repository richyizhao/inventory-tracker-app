using System.ComponentModel.DataAnnotations;
using inventory_management.Server.Common.Validation;

namespace inventory_management.Server.Contracts.Auth;

public sealed class UpdateProfileRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [PasswordPolicy(AllowEmpty = true)]
    public string NewPassword { get; set; } = string.Empty;
}


