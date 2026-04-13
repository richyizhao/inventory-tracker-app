namespace inventory_management.Server.Services.Authentication;

public interface IPasswordService
{
    string HashPassword(string password);

    bool VerifyPassword(string password, string passwordHash);
}


