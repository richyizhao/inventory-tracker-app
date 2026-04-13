using System.Security.Claims;

namespace inventory_management.Server.Services.Authorization;

public interface IUserPermissionService
{
    Task<bool> HasPermissionAsync(ClaimsPrincipal principal, string permission);
}


