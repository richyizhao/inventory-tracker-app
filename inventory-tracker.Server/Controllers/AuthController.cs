using inventory_management.Server.Services.Authentication;
using inventory_management.Server.Common;
using inventory_management.Server.Services.Authorization;
using inventory_management.Server.Common.Mappings;
using inventory_management.Server.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace inventory_management.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(
    IRepo repo,
    IPasswordService passwordService,
    ITokenService tokenService,
    IUserPermissionService userPermissionService,
    IUserContextService userContextService) : ControllerBase
{
    private readonly IRepo _repo = repo;
    private readonly IPasswordService _passwordService = passwordService;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;
    private readonly IUserContextService _userContextService = userContextService;

    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        var user = _repo.GetUserByEmail(request.Email);

        if (user is null || !_passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid email or password.");
        }

        var (token, expiresAtUtc) = _tokenService.CreateToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            User = user.ToDto()
        });
    }

    [Authorize]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] CreateUserRequest request)
    {
        var actingUser = _userContextService.GetCurrentUser(User);

        if (actingUser is null)
        {
            return Unauthorized();
        }

        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.UsersCreate))
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            ModelState.AddModelError(nameof(request.Email), "Email is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            ModelState.AddModelError(nameof(request.Password), "Password is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Role))
        {
            ModelState.AddModelError(nameof(request.Role), "Role is required.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var existingUser = _repo.GetUserByEmail(request.Email);

        if (existingUser is not null)
        {
            ModelState.AddModelError(nameof(request.Email), "A user with this email already exists.");
            return ValidationProblem(ModelState);
        }

        try
        {
            var createdUser = _repo.CreateUser(
                request.Name,
                request.Email,
                _passwordService.HashPassword(request.Password),
                request.Role);

            return Created($"/Users/{createdUser.Id}", createdUser.ToDto());
        }
        catch (InvalidOperationException ex)
        {
            ModelState.AddModelError(nameof(request.Role), ex.Message);
            return ValidationProblem(ModelState);
        }
    }
}


