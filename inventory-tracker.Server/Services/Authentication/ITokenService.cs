using inventory_management.Server.Entities;

namespace inventory_management.Server.Services.Authentication;

public interface ITokenService
{
    (string Token, DateTime ExpiresAtUtc) CreateToken(User user);
}


