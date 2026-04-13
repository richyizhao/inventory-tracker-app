using System.ComponentModel.DataAnnotations;
using inventory_management.Server.Common.Validation;

namespace inventory_management.Server.Contracts.Auth;

public sealed class ChangePasswordRequest
{
    [Required]
    [PasswordPolicy]
    public string NewPassword { get; set; } = string.Empty;
}


