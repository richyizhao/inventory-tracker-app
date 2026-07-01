using Server.Data.Seeds;

namespace Server.Common.Api.Extensions;

public static class AppDbContextSeedExtensions
{
    public static async Task SeedDefaultData(this AppDbContext database, CancellationToken cancellationToken = default)
    {
        await SeedRoles.SeedAsync(database, cancellationToken);
        await SeedUsers.SeedAsync(database, cancellationToken);
        await SeedCategories.SeedAsync(database, cancellationToken);
    }

    public static async Task SeedDemoData(this AppDbContext database, CancellationToken cancellationToken = default)
    {
        await SeedDefaultData(database, cancellationToken);
        await DemoUsers.SeedAsync(database, cancellationToken);
        await DemoProducts.SeedAsync(database, cancellationToken);
        await DemoTransactions.SeedAsync(database, cancellationToken);
    }

    public static async Task DeleteDemoData(this AppDbContext database, CancellationToken cancellationToken = default)
    {
        await DemoTransactions.DeleteAsync(database, cancellationToken);
        await DemoProducts.DeleteAsync(database, cancellationToken);
        await DemoUsers.DeleteAsync(database, cancellationToken);
    }
}
