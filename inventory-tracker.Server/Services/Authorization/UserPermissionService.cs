using System.Security.Claims;
using inventory_management.Server.Common;
using inventory_management.Server.Persistence;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Services.Authorization;

public sealed class UserPermissionService(
    AppDbContext dbContext,
    IUserContextService userContextService) : IUserPermissionService
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IUserContextService _userContextService = userContextService;

    public async Task<bool> HasPermissionAsync(ClaimsPrincipal principal, string permission)
    {
        if (!_userContextService.TryGetUserId(principal, out var userId))
        {
            return false;
        }

        var user = await _dbContext.Users
            .AsNoTracking()
            .Include(item => item.UserRoles)
            .ThenInclude(link => link.Role)
            .FirstOrDefaultAsync(item => item.Id == userId);

        if (user is null)
        {
            return false;
        }

        return user.UserRoles.Any(link =>
            link.Role.Permissions.Contains(permission, StringComparer.OrdinalIgnoreCase));
    }
}



