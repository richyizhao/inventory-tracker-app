namespace Server.Data.Types;

public class Category : IEntity
{
    public int Id { get; private init; }
    public Guid ReferenceId { get; private init; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public List<SubCategory> SubCategories { get; init; } = [];
    public List<Product> Products { get; init; } = [];
}

public class SubCategory : IEntity
{
    public int Id { get; private init; }
    public Guid ReferenceId { get; private init; } = Guid.NewGuid();
    public required int CategoryId { get; init; }
    public Category Category { get; init; } = null!;
    public required string Name { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public List<Product> Products { get; init; } = [];
}
