using inventory_management.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<SubCategory> SubCategories => Set<SubCategory>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<InventoryTransaction> Transactions => Set<InventoryTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);
            entity.Property(user => user.Name).IsRequired();
            entity.Property(user => user.Email).IsRequired();
            entity.Property(user => user.PasswordHash).IsRequired();
            entity.Property(user => user.CreatedAt).IsRequired();
            entity.HasIndex(user => user.Email).IsUnique();
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(role => role.Id);
            entity.Property(role => role.Name).IsRequired();
            entity.Property(role => role.Permissions)
                .HasColumnType("text[]")
                .HasDefaultValueSql("ARRAY[]::text[]");
            entity.HasIndex(role => role.Name).IsUnique();
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(userRole => new { userRole.UserId, userRole.RoleId });

            entity.HasOne(userRole => userRole.User)
                .WithMany(user => user.UserRoles)
                .HasForeignKey(userRole => userRole.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(userRole => userRole.Role)
                .WithMany(role => role.UserRoles)
                .HasForeignKey(userRole => userRole.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("ProductCategories");
            entity.HasKey(category => category.Id);
            entity.Property(category => category.Name).IsRequired();
            entity.HasIndex(category => category.Name).IsUnique();
        });

        modelBuilder.Entity<SubCategory>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(subCategory => subCategory.Id);
            entity.Property(subCategory => subCategory.Name).IsRequired();
            entity.HasIndex(subCategory => new { subCategory.CategoryId, subCategory.Name }).IsUnique();

            entity.HasOne(subCategory => subCategory.Category)
                .WithMany(category => category.SubCategories)
                .HasForeignKey(subCategory => subCategory.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable(tableBuilder =>
                tableBuilder.HasCheckConstraint("CK_Products_Quantity_NonNegative", "\"Quantity\" >= 0"));
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Name).IsRequired();
            entity.Property(product => product.Sku).IsRequired();
            entity.Property(product => product.Description).HasDefaultValue(string.Empty);
            entity.Property(product => product.ImageUrl).HasDefaultValue(string.Empty);
            entity.Property(product => product.Quantity).HasDefaultValue(0);
            entity.Property(product => product.UnitCost).HasColumnType("numeric(18,2)").HasDefaultValue(0m);
            entity.Property(product => product.SellingPrice).HasColumnType("numeric(18,2)").HasDefaultValue(0m);
            entity.Property(product => product.CreatedAt).IsRequired();
            entity.Property(product => product.UpdatedAt).IsRequired();
            entity.HasIndex(product => product.Sku).IsUnique();

            entity.Property(product => product.SubCategoryId).HasColumnName("CategoryId");

            entity.HasOne(product => product.SubCategory)
                .WithMany(subCategory => subCategory.Products)
                .HasForeignKey(product => product.SubCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<InventoryTransaction>(entity =>
        {
            entity.ToTable(tableBuilder =>
                tableBuilder.HasCheckConstraint("CK_Transactions_Quantity_Positive", "\"Quantity\" > 0"));
            entity.HasKey(transaction => transaction.Id);
            entity.Property(transaction => transaction.Type)
                .HasConversion<string>()
                .IsRequired();
            entity.Property(transaction => transaction.Quantity).IsRequired();
            entity.Property(transaction => transaction.UnitCost).HasColumnType("numeric(18,2)").HasDefaultValue(0m);
            entity.Property(transaction => transaction.UnitPrice).HasColumnType("numeric(18,2)").HasDefaultValue(0m);
            entity.Property(transaction => transaction.ExpenseAmount).HasColumnType("numeric(18,2)").HasDefaultValue(0m);
            entity.Property(transaction => transaction.Reason).HasDefaultValue(string.Empty);
            entity.Property(transaction => transaction.Note).HasDefaultValue(string.Empty);
            entity.Property(transaction => transaction.CreatedAt).IsRequired();

            entity.HasOne(transaction => transaction.Product)
                .WithMany(product => product.Transactions)
                .HasForeignKey(transaction => transaction.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(transaction => transaction.User)
                .WithMany(user => user.Transactions)
                .HasForeignKey(transaction => transaction.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

