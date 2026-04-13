namespace inventory_management.Server.Entities;

public class SubCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public Guid? CategoryId { get; set; }

    public Category? Category { get; set; }

    public ICollection<Product> Products { get; set; } = [];
}

