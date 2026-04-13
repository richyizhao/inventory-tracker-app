using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Contracts.Categories;

public sealed class CreateSubCategoryRequest
{
    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;
}


