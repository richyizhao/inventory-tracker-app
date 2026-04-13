using System.Security.Claims;
using inventory_management.Server.Entities;

namespace inventory_management.Server.Services.Authorization;

public interface IUserContextService
{
    bool TryGetUserId(ClaimsPrincipal principal, out Guid userId);
    User? GetCurrentUser(ClaimsPrincipal principal);
}
