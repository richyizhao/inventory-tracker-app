using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Common.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class PasswordPolicyAttribute : ValidationAttribute
{
    public bool AllowEmpty { get; init; }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        var password = value as string ?? string.Empty;

        if (string.IsNullOrWhiteSpace(password))
        {
            if (AllowEmpty)
            {
                return ValidationResult.Success;
            }

            return ValidationResult.Success;
        }

        if (password.Length < 8)
        {
            return new ValidationResult("Password must be at least 8 characters");
        }

        if (password.Length > 100)
        {
            return new ValidationResult("Password is too long");
        }

        if (!password.Any(char.IsUpper))
        {
            return new ValidationResult("Must contain at least one uppercase letter");
        }

        if (!password.Any(char.IsLower))
        {
            return new ValidationResult("Must contain at least one lowercase letter");
        }

        if (!password.Any(char.IsDigit))
        {
            return new ValidationResult("Must contain at least one number");
        }

        const string allowedSpecialCharacters = "!@#$%^&*";
        if (!password.Any(allowedSpecialCharacters.Contains))
        {
            return new ValidationResult("Must contain at least one special character");
        }

        return ValidationResult.Success;
    }
}


