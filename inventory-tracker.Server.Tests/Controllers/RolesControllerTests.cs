using inventory_management.Server.Common;
using inventory_management.Server.Controllers;
using inventory_management.Server.Contracts.Roles;
using inventory_management.Server.Services.Authentication;
using inventory_management.Server.Tests.TestDoubles;
using Microsoft.AspNetCore.Mvc;

namespace inventory_management.Server.Tests.Controllers;

public sealed class RolesControllerTests
{
    [Fact]
    public async Task CreateRole_returns_created_role_when_permission_is_granted()
    {
        var repo = new InMemoryRepo();
        var permissions = new TestUserPermissionService();
        permissions.GrantedPermissions.Add(AppPermissions.RolesCreate);
        var controller = new RolesController(repo, permissions);

        var result = await controller.CreateRole(new CreateRoleRequest
        {
            Name = "Auditor",
        });

        var created = Assert.IsType<CreatedResult>(result.Result);
        var payload = Assert.IsType<RoleDto>(created.Value);
        Assert.Equal("Auditor", payload.Name);
    }

    [Fact]
    public async Task UpdatePermissions_rejects_admin_role_if_required_permissions_are_removed()
    {
        var adminRole = TestDataFactory.CreateRole(SeedData.AdminRoleName, AppPermissions.RolesView, AppPermissions.RolesManagePermissions, AppPermissions.UsersView);
        var repo = new InMemoryRepo();
        repo.Roles.Add(adminRole);
        var permissions = new TestUserPermissionService();
        permissions.GrantedPermissions.Add(AppPermissions.RolesManagePermissions);
        var controller = new RolesController(repo, permissions);

        var result = await controller.UpdatePermissions(adminRole.Id, new UpdateRolePermissionsRequest
        {
            Permissions = [AppPermissions.UsersView],
        });

        var objectResult = Assert.IsType<ObjectResult>(result.Result);
        var problem = Assert.IsType<ValidationProblemDetails>(objectResult.Value);
        Assert.Contains("Admin must retain role visibility and permission management access.", problem.Errors["Permissions"]);
    }

    [Fact]
    public async Task DeleteRole_returns_validation_problem_for_built_in_roles()
    {
        var protectedRole = TestDataFactory.CreateRole(SeedData.ManagerRoleName, AppPermissions.RolesDelete);
        var repo = new InMemoryRepo();
        repo.Roles.Add(protectedRole);
        var permissions = new TestUserPermissionService();
        permissions.GrantedPermissions.Add(AppPermissions.RolesDelete);
        var controller = new RolesController(repo, permissions);

        var result = await controller.DeleteRole(protectedRole.Id);

        var objectResult = Assert.IsType<ObjectResult>(result);
        var problem = Assert.IsType<ValidationProblemDetails>(objectResult.Value);
        Assert.Contains("Built-in roles cannot be deleted.", problem.Errors["id"]);
    }
}
