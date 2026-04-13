using inventory_management.Server.Common;
using inventory_management.Server.Entities;

namespace inventory_management.Server.Common.Mappings;

public static class ContractMappings
{
    public static CategoryDto ToDto(this Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            SubCategories = [.. category.SubCategories
                .OrderBy(subCategory => subCategory.Name)
                .Select(subCategory => subCategory.ToDto())]
        };
    }

    public static CategoryDto ToSummaryDto(this Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };
    }

    public static SubCategoryDto ToDto(this SubCategory subCategory)
    {
        return new SubCategoryDto
        {
            Id = subCategory.Id,
            Name = subCategory.Name,
            CategoryId = subCategory.CategoryId ?? Guid.Empty,
            CategoryName = subCategory.Category?.Name ?? "Unassigned"
        };
    }

    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            Roles = [.. user.UserRoles
                .Select(userRole => userRole.Role.Name)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(roleName => roleName)],
            Permissions = [.. user.UserRoles
                .SelectMany(userRole => userRole.Role.Permissions)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(permission => permission, StringComparer.OrdinalIgnoreCase)]
        };
    }

    public static RoleDto ToDto(this Role role)
    {
        return new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Permissions = AppPermissions.Normalize(role.Permissions),
            UserCount = role.UserRoles.Count
        };
    }

    public static ProductDto ToDto(this Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            Description = product.Description,
            ImageUrl = product.ImageUrl,
            Quantity = product.Quantity,
            UnitCost = product.UnitCost,
            SellingPrice = product.SellingPrice,
            InventoryValue = Math.Round(product.Quantity * product.UnitCost, 2),
            Category = product.SubCategory.Category is null
                ? new CategoryDto { Id = Guid.Empty, Name = "Unassigned" }
                : product.SubCategory.Category.ToSummaryDto(),
            SubCategory = product.SubCategory.ToDto(),
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }

    public static TransactionDto ToDto(this InventoryTransaction transaction)
    {
        return new TransactionDto
        {
            Id = transaction.Id,
            ProductId = transaction.ProductId,
            ProductName = transaction.Product.Name,
            Type = transaction.Type.ToString().ToUpperInvariant(),
            Quantity = transaction.Quantity,
            UnitCost = transaction.UnitCost,
            UnitPrice = transaction.UnitPrice,
            ExpenseAmount = transaction.ExpenseAmount,
            TotalCost = Math.Round((transaction.Quantity * transaction.UnitCost) + transaction.ExpenseAmount, 2),
            UserId = transaction.UserId,
            UserName = transaction.User.Name,
            UserEmail = transaction.User.Email,
            Reason = transaction.Reason,
            Note = transaction.Note,
            CreatedAt = transaction.CreatedAt
        };
    }
}



