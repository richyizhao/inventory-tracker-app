using inventory_management.Server.Services.Authentication;
using inventory_management.Server.Common;
using inventory_management.Server.Services.Authorization;
using inventory_management.Server.Common.Mappings;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace inventory_management.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController(
    IRepo repo,
    IPasswordService passwordService,
    ITokenService tokenService,
    IUserContextService userContextService,
    IUserPermissionService userPermissionService) : ControllerBase
{
    private readonly IRepo _repo = repo;
    private readonly IPasswordService _passwordService = passwordService;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IUserContextService _userContextService = userContextService;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.UsersView))
        {
            return Forbid();
        }

        return Ok(_repo.GetUsers().Select(user => user.ToDto()));
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult<UserDto> Me()
    {
        var user = _userContextService.GetCurrentUser(User);

        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(user.ToDto());
    }

    [HttpPut("me/profile")]
    [Authorize]
    public ActionResult<LoginResponse> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            ModelState.AddModelError(nameof(request.Email), "Email is required.");
        }

        if (string.IsNullOrWhiteSpace(request.CurrentPassword))
        {
            ModelState.AddModelError(nameof(request.CurrentPassword), "Current password is required.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var user = _userContextService.GetCurrentUser(User);

        if (user is null)
        {
            return Unauthorized();
        }

        if (!_passwordService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            ModelState.AddModelError(nameof(request.CurrentPassword), "Current password is incorrect.");
            return ValidationProblem(ModelState);
        }

        var existingUser = _repo.GetUserByEmail(request.Email);

        if (existingUser is not null && existingUser.Id != user.Id)
        {
            ModelState.AddModelError(nameof(request.Email), "A user with this email already exists.");
            return ValidationProblem(ModelState);
        }

        var newPasswordHash = string.IsNullOrWhiteSpace(request.NewPassword)
            ? null
            : _passwordService.HashPassword(request.NewPassword);

        _repo.UpdateUserProfile(user, request.Name, request.Email, newPasswordHash);

        var refreshedUser = _repo.GetUserById(user.Id);

        if (refreshedUser is null)
        {
            return NotFound();
        }

        var (token, expiresAtUtc) = _tokenService.CreateToken(refreshedUser);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            User = refreshedUser.ToDto()
        });
    }

    [HttpPut("{id:guid}/email")]
    [Authorize]
    public async Task<IActionResult> UpdateEmail(Guid id, [FromBody] UpdateUserEmailRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.UsersEditEmail))
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            ModelState.AddModelError(nameof(request.Email), "Email is required.");
            return ValidationProblem(ModelState);
        }

        var targetUser = _repo.GetUserById(id);

        if (targetUser is null)
        {
            return NotFound();
        }

        var existingUser = _repo.GetUserByEmail(request.Email);

        if (existingUser is not null && existingUser.Id != id)
        {
            ModelState.AddModelError(nameof(request.Email), "A user with this email already exists.");
            return ValidationProblem(ModelState);
        }

        _repo.UpdateUserEmail(targetUser, request.Email);
        return NoContent();
    }

    [HttpPut("{id:guid}/name")]
    [Authorize]
    public async Task<IActionResult> UpdateName(Guid id, [FromBody] UpdateUserNameRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.UsersEditName))
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var targetUser = _repo.GetUserById(id);

        if (targetUser is null)
        {
            return NotFound();
        }

        _repo.UpdateUserIdentity(targetUser, request.Name);
        return NoContent();
    }

    [HttpPut("{id:guid}/role")]
    [Authorize]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateUserRoleRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.UsersSwitchRole))
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Role))
        {
            ModelState.AddModelError(nameof(request.Role), "Role is required.");
            return ValidationProblem(ModelState);
        }

        var actingUser = _userContextService.GetCurrentUser(User);

        if (actingUser is null)
        {
            return Unauthorized();
        }

        var targetUser = _repo.GetUserById(id);

        if (targetUser is null)
        {
            return NotFound();
        }

        if (actingUser.Id == targetUser.Id)
        {
            ModelState.AddModelError(nameof(id), "You cannot change your own role while signed in.");
            return ValidationProblem(ModelState);
        }

        var role = _repo.GetRoleByName(request.Role);

        if (role is null)
        {
            ModelState.AddModelError(nameof(request.Role), "Role does not exist.");
            return ValidationProblem(ModelState);
        }

        _repo.ReplaceUserRole(targetUser, role);
        return NoContent();
    }

    [HttpPut("{id:guid}/password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            ModelState.AddModelError(nameof(request.NewPassword), "New password is required.");
            return ValidationProblem(ModelState);
        }

        var actingUser = _userContextService.GetCurrentUser(User);

        if (actingUser is null)
        {
            return Unauthorized();
        }

        var targetUser = _repo.GetUserById(id);

        if (targetUser is null)
        {
            return NotFound();
        }

        var isSelf = actingUser.Id == targetUser.Id;

        if (!isSelf &&
            !await _userPermissionService.HasPermissionAsync(User, AppPermissions.UsersManagePasswords))
        {
            return Forbid();
        }

        _repo.UpdateUserPassword(targetUser, _passwordService.HashPassword(request.NewPassword));
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.UsersDelete))
        {
            return Forbid();
        }

        var deleted = _repo.DeleteUser(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}


