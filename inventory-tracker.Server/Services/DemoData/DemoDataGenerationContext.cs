using inventory_management.Server.Contracts.Common;
using inventory_management.Server.Entities;

namespace inventory_management.Server.Services.DemoData;

internal sealed class DemoDataGenerationContext
{
    public DemoDataGenerationContext(DemoDataResultDto summary, List<SubCategory> subCategories, List<User> availableUsers)
    {
        Summary = summary;
        SubCategories = subCategories;
        AvailableUsers = availableUsers;
    }

    public DemoDataResultDto Summary { get; }
    public List<SubCategory> SubCategories { get; }
    public List<User> AvailableUsers { get; }
    public Random Random { get; } = new();
    public DateTime DemoTimelineEnd { get; } = DateTime.UtcNow.Date.AddDays(-1).AddHours(18);
    public List<Product> Products { get; } = [];
    public List<InventoryTransaction> Transactions { get; } = [];
    public Dictionary<Guid, int> TargetFinalQuantities { get; } = [];
    public Dictionary<Guid, int> TargetPurchasedQuantities { get; } = [];
}
