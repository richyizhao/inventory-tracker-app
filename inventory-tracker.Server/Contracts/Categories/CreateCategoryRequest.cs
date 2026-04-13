using System.ComponentModel.DataAnnotations;

namespace inventory_management.Server.Contracts.Categories;

public sealed class CreateCategoryRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
}


