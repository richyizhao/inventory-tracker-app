using inventory_management.Server.Common;
using inventory_management.Server.Services.Authorization;
using inventory_management.Server.Common.Mappings;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using inventory_management.Server.Services.Authentication;

namespace inventory_management.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class RolesController(IRepo repo, IUserPermissionService userPermissionService) : ControllerBase
{
    private readonly IRepo _repo = repo;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;
    private static readonly string[] ProtectedRoleNames =
    [
        SeedData.AdminRoleName,
        SeedData.ManagerRoleName,
        SeedData.StaffRoleName
    ];

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.RolesView))
        {
            return Forbid();
        }

        return Ok(_repo.GetRoles().Select(role => role.ToDto()));
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto>> CreateRole([FromBody] CreateRoleRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.RolesCreate))
        {
            return Forbid();
        }

        try
        {
            var createdRole = _repo.AddRole(new Role
            {
                Name = request.Name
            });
            return Created($"/Roles/{createdRole.Id}", createdRole.ToDto());
        }
        catch (InvalidOperationException ex)
        {
            ModelState.AddModelError(nameof(request.Name), ex.Message);
            return ValidationProblem(ModelState);
        }
    }

    [HttpPut("{id:guid}/permissions")]
    public async Task<ActionResult<RoleDto>> UpdatePermissions(Guid id, [FromBody] UpdateRolePermissionsRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.RolesManagePermissions))
        {
            return Forbid();
        }

        var role = _repo.GetRoleById(id);

        if (role is null)
        {
            return NotFound();
        }

        var normalizedPermissions = AppPermissions.Normalize(request.Permissions);

        if (string.Equals(role.Name, "Admin", StringComparison.OrdinalIgnoreCase) &&
            (!normalizedPermissions.Contains(AppPermissions.RolesView, StringComparer.OrdinalIgnoreCase) ||
             !normalizedPermissions.Contains(AppPermissions.RolesManagePermissions, StringComparer.OrdinalIgnoreCase)))
        {
            ModelState.AddModelError(nameof(request.Permissions), "Admin must retain role visibility and permission management access.");
            return ValidationProblem(ModelState);
        }

        var updatedRole = _repo.UpdateRolePermissions(role, normalizedPermissions);
        return Ok(updatedRole.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.RolesDelete))
        {
            return Forbid();
        }

        var role = _repo.GetRoleById(id);

        if (role is null)
        {
            return NotFound();
        }

        if (ProtectedRoleNames.Contains(role.Name, StringComparer.OrdinalIgnoreCase))
        {
            ModelState.AddModelError(nameof(id), "Built-in roles cannot be deleted.");
            return ValidationProblem(ModelState);
        }

        if (role.UserRoles.Count > 0)
        {
            ModelState.AddModelError(nameof(id), "Remove or reassign all users from this role before deleting it.");
            return ValidationProblem(ModelState);
        }

        _repo.DeleteRole(id);
        return NoContent();
    }
}
