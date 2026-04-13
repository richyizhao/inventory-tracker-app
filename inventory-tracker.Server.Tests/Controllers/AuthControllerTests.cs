using inventory_management.Server.Common;
using inventory_management.Server.Controllers;
using inventory_management.Server.Contracts.Auth;
using inventory_management.Server.Contracts.Users;
using inventory_management.Server.Tests.TestDoubles;
using Microsoft.AspNetCore.Mvc;

namespace inventory_management.Server.Tests.Controllers;

public sealed class AuthControllerTests
{
    [Fact]
    public void Login_returns_unauthorized_when_credentials_are_invalid()
    {
        var passwordService = new TestPasswordService();
        var role = TestDataFactory.CreateRole("Admin", AppPermissions.UsersCreate);
        var user = TestDataFactory.CreateUser("Admin User", "admin@inventory.local", passwordService.HashPassword("Admin123!"), role);
        var repo = new InMemoryRepo();
        repo.Roles.Add(role);
        repo.Users.Add(user);
        var controller = new AuthController(repo, passwordService, new TestTokenService(), new TestUserPermissionService(), new TestUserContextService());

        var result = controller.Login(new LoginRequest
        {
            Email = "admin@inventory.local",
            Password = "wrong-password",
        });

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        Assert.Equal("Invalid email or password.", unauthorized.Value);
    }

    [Fact]
    public void Login_returns_token_and_user_payload_when_credentials_are_valid()
    {
        var passwordService = new TestPasswordService();
        var role = TestDataFactory.CreateRole("Admin", AppPermissions.UsersCreate);
        var user = TestDataFactory.CreateUser("Admin User", "admin@inventory.local", passwordService.HashPassword("Admin123!"), role);
        var repo = new InMemoryRepo();
        repo.Roles.Add(role);
        repo.Users.Add(user);
        var tokenService = new TestTokenService
        {
            Token = "issued-token",
            ExpiresAtUtc = new DateTime(2031, 5, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        var controller = new AuthController(repo, passwordService, tokenService, new TestUserPermissionService(), new TestUserContextService());

        var result = controller.Login(new LoginRequest
        {
            Email = "admin@inventory.local",
            Password = "Admin123!",
        });

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var payload = Assert.IsType<LoginResponse>(ok.Value);
        Assert.Equal("issued-token", payload.Token);
        Assert.Equal(user.Email, payload.User.Email);
        Assert.Contains("Admin", payload.User.Roles);
    }

    [Fact]
    public async Task Register_returns_validation_problem_when_email_is_already_taken()
    {
        var passwordService = new TestPasswordService();
        var adminRole = TestDataFactory.CreateRole("Admin", AppPermissions.UsersCreate);
        var existingUser = TestDataFactory.CreateUser("Existing User", "existing@inventory.local", passwordService.HashPassword("Existing123!"), adminRole);
        var actingUser = TestDataFactory.CreateUser("Acting Admin", "admin@inventory.local", passwordService.HashPassword("Admin123!"), adminRole);
        var repo = new InMemoryRepo();
        repo.Roles.Add(adminRole);
        repo.Users.AddRange([existingUser, actingUser]);
        repo.UserRoles.AddRange(existingUser.UserRoles);
        repo.UserRoles.AddRange(actingUser.UserRoles);
        var permissions = new TestUserPermissionService();
        permissions.GrantedPermissions.Add(AppPermissions.UsersCreate);
        var userContext = new TestUserContextService { CurrentUser = actingUser };
        var controller = new AuthController(repo, passwordService, new TestTokenService(), permissions, userContext);

        var result = await controller.Register(new CreateUserRequest
        {
            Name = "New User",
            Email = "existing@inventory.local",
            Password = "Password123!",
            Role = "Admin",
        });

        var objectResult = Assert.IsType<ObjectResult>(result.Result);
        var problem = Assert.IsType<ValidationProblemDetails>(objectResult.Value);
        Assert.Contains("A user with this email already exists.", problem.Errors["Email"]);
    }
}
