namespace Server.Data.Seeds;

public static class SeedUsers
{
    public static async Task SeedAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var seedUsers = await SeedJsonReader.ReadAsync<List<SeedUserModel>>("users.json", cancellationToken);
        var rolesByName = await database.Roles
            .ToDictionaryAsync(x => x.Name, StringComparer.OrdinalIgnoreCase, cancellationToken);
        var users = await database.Users.ToListAsync(cancellationToken);

        foreach (var seedUser in seedUsers)
        {
            if (!rolesByName.TryGetValue(seedUser.RoleName, out var role))
            {
                throw new InvalidOperationException(
                    $"Role '{seedUser.RoleName}' for seeded user '{seedUser.Username}' does not exist.");
            }

            var user = users.SingleOrDefault(x =>
                string.Equals(x.Username, seedUser.Username, StringComparison.OrdinalIgnoreCase));

            if (user is null)
            {
                user = new User
                {
                    DisplayName = seedUser.DisplayName,
                    Username = seedUser.Username,
                    Email = seedUser.Email,
                    Password = seedUser.Password,
                    RoleId = role.Id
                };

                await database.Users.AddAsync(user, cancellationToken);
                users.Add(user);
            }
            else
            {
                user.DisplayName = seedUser.DisplayName;
                user.Username = seedUser.Username;
                user.Email = seedUser.Email;
                user.Password = seedUser.Password;
                user.RoleId = role.Id;
            }
        }

        await database.SaveChangesAsync(cancellationToken);
    }

    private sealed record SeedUserModel(
        string DisplayName,
        string Username,
        string Email,
        string Password,
        string RoleName);
}
