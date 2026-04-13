using inventory_management.Server.Common;
using inventory_management.Server.Controllers;
using inventory_management.Server.Contracts.Auth;
using inventory_management.Server.Contracts.Users;
using inventory_management.Server.Tests.TestDoubles;
using Microsoft.AspNetCore.Mvc;

namespace inventory_management.Server.Tests.Controllers;

public sealed class UsersControllerTests
{
    [Fact]
    public void Me_returns_unauthorized_when_no_current_user_is_available()
    {
        var controller = new UsersController(new InMemoryRepo(), new TestPasswordService(), new TestTokenService(), new TestUserContextService(), new TestUserPermissionService());

        var result = controller.Me();

        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    [Fact]
    public async Task UpdateRole_returns_validation_problem_when_user_attempts_to_change_their_own_role()
    {
        var adminRole = TestDataFactory.CreateRole("Admin", AppPermissions.UsersSwitchRole);
        var actingUser = TestDataFactory.CreateUser("Admin User", "admin@inventory.local", "hashed::Admin123!", adminRole);
        var repo = new InMemoryRepo();
        repo.Roles.Add(adminRole);
        repo.Users.Add(actingUser);
        repo.UserRoles.AddRange(actingUser.UserRoles);
        var permissions = new TestUserPermissionService();
        permissions.GrantedPermissions.Add(AppPermissions.UsersSwitchRole);
        var controller = new UsersController(repo, new TestPasswordService(), new TestTokenService(), new TestUserContextService { CurrentUser = actingUser }, permissions);

        var result = await controller.UpdateRole(actingUser.Id, new UpdateUserRoleRequest { Role = "Admin" });

        var objectResult = Assert.IsType<ObjectResult>(result);
        var problem = Assert.IsType<ValidationProblemDetails>(objectResult.Value);
        Assert.Contains("You cannot change your own role while signed in.", problem.Errors["id"]);
    }

    [Fact]
    public void UpdateProfile_returns_refreshed_login_payload_when_current_password_is_valid()
    {
        var passwordService = new TestPasswordService();
        var adminRole = TestDataFactory.CreateRole("Admin", AppPermissions.UsersView);
        var user = TestDataFactory.CreateUser("Admin User", "admin@inventory.local", passwordService.HashPassword("Admin123!"), adminRole);
        var repo = new InMemoryRepo();
        repo.Roles.Add(adminRole);
        repo.Users.Add(user);
        repo.UserRoles.AddRange(user.UserRoles);
        var tokenService = new TestTokenService { Token = "refreshed-token" };
        var controller = new UsersController(repo, passwordService, tokenService, new TestUserContextService { CurrentUser = user }, new TestUserPermissionService());

        var result = controller.UpdateProfile(new UpdateProfileRequest
        {
            Name = "Updated Admin",
            Email = "updated@inventory.local",
            CurrentPassword = "Admin123!",
            NewPassword = "NewPassword123!",
        });

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var payload = Assert.IsType<LoginResponse>(ok.Value);
        Assert.Equal("refreshed-token", payload.Token);
        Assert.Equal("Updated Admin", payload.User.Name);
        Assert.Equal("updated@inventory.local", payload.User.Email);
        Assert.Equal(passwordService.HashPassword("NewPassword123!"), user.PasswordHash);
    }
}
