using System.Security.Claims;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;

namespace inventory_management.Server.Services.Authorization;

public sealed class UserContextService(IRepo repo) : IUserContextService
{
    private readonly IRepo _repo = repo;

    public bool TryGetUserId(ClaimsPrincipal principal, out Guid userId)
    {
        var userIdClaim = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdClaim, out userId);
    }

    public User? GetCurrentUser(ClaimsPrincipal principal)
    {
        if (TryGetUserId(principal, out var userId))
        {
            return _repo.GetUserById(userId);
        }

        var email = principal.FindFirstValue(ClaimTypes.Email);

        if (string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        return _repo.GetUserByEmail(email);
    }
}
