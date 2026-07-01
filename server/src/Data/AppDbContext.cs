using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<SubCategory> SubCategories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseIdentityByDefaultColumns();

        ConfigureCategoriesTable(modelBuilder);
        ConfigureSubCategoriesTable(modelBuilder);
        ConfigureProductsTable(modelBuilder);
        ConfigureTransactionsTable(modelBuilder);
        ConfigureUsersTable(modelBuilder);
        ConfigureRolesTable(modelBuilder);
        ConfigureRolePermissionsTable(modelBuilder);
        base.OnModelCreating(modelBuilder);
    }

    private static void ConfigureCategoriesTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Category>();

        builder.HasIndex(x => x.ReferenceId)
            .IsUnique();

        builder.HasIndex(x => x.Name)
            .IsUnique();

        builder.Property(x => x.Name)
            .HasMaxLength(100);

        builder.HasMany(x => x.SubCategories)
            .WithOne(x => x.Category)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Products)
            .WithOne(x => x.Category)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureSubCategoriesTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<SubCategory>();

        builder.HasIndex(x => x.ReferenceId)
            .IsUnique();

        builder.HasIndex(x => new { x.CategoryId, x.Name })
            .IsUnique();

        builder.Property(x => x.Name)
            .HasMaxLength(100);

        builder.HasMany(x => x.Products)
            .WithOne(x => x.SubCategory)
            .HasForeignKey(x => x.SubCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureProductsTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Product>();

        builder.HasIndex(x => x.ReferenceId)
            .IsUnique();

        builder.HasIndex(x => x.Sku)
            .IsUnique();

        builder.Property(x => x.Name)
            .HasMaxLength(200);

        builder.Property(x => x.Sku)
            .HasMaxLength(100);

        builder.Property(x => x.BuyPrice)
            .HasPrecision(18, 2);

        builder.Property(x => x.SellPrice)
            .HasPrecision(18, 2);

        builder.Property(x => x.TotalUnitInventoryValue)
            .HasPrecision(18, 2);

        builder.HasMany(x => x.Transactions)
            .WithOne(x => x.Product)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureTransactionsTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Transaction>();

        builder.HasIndex(x => x.ReferenceId)
            .IsUnique();

        builder.Property(x => x.UnitProductCost)
            .HasPrecision(18, 2);

        builder.Property(x => x.TotalProductCost)
            .HasPrecision(18, 2);

        builder.Property(x => x.Note)
            .HasMaxLength(1000);

        builder.HasOne(x => x.User)
            .WithMany(x => x.Transactions)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureUsersTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<User>();

        builder.HasIndex(x => x.Username)
            .IsUnique();

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.HasIndex(x => x.ReferenceId)
            .IsUnique();

        builder.Property(x => x.DisplayName)
            .HasMaxLength(150);

        builder.Property(x => x.Username)
            .HasMaxLength(100);

        builder.Property(x => x.Email)
            .HasMaxLength(255);

        builder.Property(x => x.Password)
            .HasMaxLength(500);

        builder.HasOne(x => x.Role)
            .WithMany(x => x.Users)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureRolesTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Role>();

        builder.HasIndex(x => x.ReferenceId)
            .IsUnique();

        builder.HasIndex(x => x.Name)
            .IsUnique();

        builder.Property(x => x.Name)
            .HasMaxLength(100);
    }

    private static void ConfigureRolePermissionsTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<RolePermission>();

        builder.HasIndex(x => x.ReferenceId)
            .IsUnique();

        builder.HasIndex(x => new { x.RoleId, x.Page })
            .IsUnique();

        builder.HasOne(x => x.Role)
            .WithMany(x => x.Permissions)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
