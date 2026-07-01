namespace Server.Data.Seeds;

public static class DemoUsers
{
    public static async Task SeedAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var seedUsers = await SeedJsonReader.ReadAsync<List<SeedDemoUserModel>>("demo-users.json", cancellationToken);
        var rolesByName = await database.Roles
            .ToDictionaryAsync(x => x.Name, StringComparer.OrdinalIgnoreCase, cancellationToken);
        var users = await database.Users.ToListAsync(cancellationToken);

        foreach (var seedUser in seedUsers)
        {
            if (!rolesByName.TryGetValue(seedUser.RoleName, out var role))
            {
                throw new InvalidOperationException(
                    $"Role '{seedUser.RoleName}' for demo user '{seedUser.Username}' does not exist.");
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

    public static async Task DeleteAsync(AppDbContext database, CancellationToken cancellationToken = default)
    {
        var seedUsers = await SeedJsonReader.ReadAsync<List<SeedDemoUserModel>>("demo-users.json", cancellationToken);
        var usernames = seedUsers.Select(x => x.Username).ToHashSet(StringComparer.OrdinalIgnoreCase);

        var users = await database.Users
            .Where(x => usernames.Contains(x.Username))
            .ToListAsync(cancellationToken);

        if (users.Count == 0)
        {
            return;
        }

        database.Users.RemoveRange(users);
        await database.SaveChangesAsync(cancellationToken);
    }

    internal static async Task<HashSet<string>> GetUsernamesAsync(CancellationToken cancellationToken = default)
    {
        var seedUsers = await SeedJsonReader.ReadAsync<List<SeedDemoUserModel>>("demo-users.json", cancellationToken);
        return seedUsers.Select(x => x.Username).ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    private sealed record SeedDemoUserModel(
        string DisplayName,
        string Username,
        string Email,
        string Password,
        string RoleName);
}
