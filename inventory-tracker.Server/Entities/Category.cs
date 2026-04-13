namespace inventory_management.Server.Entities;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public ICollection<SubCategory> SubCategories { get; set; } = [];
}

