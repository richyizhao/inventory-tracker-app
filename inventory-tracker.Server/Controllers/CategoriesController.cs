using inventory_management.Server.Common;
using inventory_management.Server.Services.Authorization;
using inventory_management.Server.Common.Mappings;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class CategoriesController(AppDbContext dbContext, IUserPermissionService userPermissionService) : ControllerBase
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.CategoriesView))
        {
            return Forbid();
        }

        var categories = await _dbContext.Categories
            .Include(category => category.SubCategories)
            .OrderBy(category => category.Name)
            .Select(category => category.ToDto())
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.CategoriesManage))
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
            return ValidationProblem(ModelState);
        }

        var existingCategory = await _dbContext.Categories
            .FirstOrDefaultAsync(category => EF.Functions.ILike(category.Name, request.Name));

        if (existingCategory is not null)
        {
            ModelState.AddModelError(nameof(request.Name), "A category with this name already exists.");
            return ValidationProblem(ModelState);
        }

        var category = new Category
        {
            Name = request.Name.Trim()
        };

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync();

        return Created($"/Categories/{category.Id}", category.ToSummaryDto());
    }

    [HttpPost("subcategories")]
    public async Task<ActionResult<SubCategoryDto>> CreateSubCategory([FromBody] CreateSubCategoryRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.CategoriesManage))
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
            return ValidationProblem(ModelState);
        }

        var category = await _dbContext.Categories
            .Include(item => item.SubCategories)
            .FirstOrDefaultAsync(item => item.Id == request.CategoryId);

        if (category is null)
        {
            ModelState.AddModelError(nameof(request.CategoryId), "Category does not exist.");
            return ValidationProblem(ModelState);
        }

        var duplicate = category.SubCategories.FirstOrDefault(item =>
            string.Equals(item.Name, request.Name.Trim(), StringComparison.OrdinalIgnoreCase));

        if (duplicate is not null)
        {
            ModelState.AddModelError(nameof(request.Name), "A sub-category with this name already exists in the selected category.");
            return ValidationProblem(ModelState);
        }

        var subCategory = new SubCategory
        {
            Name = request.Name.Trim(),
            CategoryId = category.Id,
            Category = category
        };

        _dbContext.SubCategories.Add(subCategory);
        await _dbContext.SaveChangesAsync();

        return Created($"/Categories/subcategories/{subCategory.Id}", subCategory.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.CategoriesManage))
        {
            return Forbid();
        }

        var category = await _dbContext.Categories
            .Include(item => item.SubCategories)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (category is null)
        {
            return NotFound();
        }

        if (category.SubCategories.Count > 0)
        {
            ModelState.AddModelError(nameof(id), "Cannot delete a category that still has sub-categories.");
            return ValidationProblem(ModelState);
        }

        _dbContext.Categories.Remove(category);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("subcategories/{id:guid}")]
    public async Task<IActionResult> DeleteSubCategory(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.CategoriesManage))
        {
            return Forbid();
        }

        var subCategory = await _dbContext.SubCategories
            .Include(item => item.Products)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (subCategory is null)
        {
            return NotFound();
        }

        if (subCategory.Products.Count > 0)
        {
            ModelState.AddModelError(nameof(id), "Cannot delete a sub-category that still has products.");
            return ValidationProblem(ModelState);
        }

        _dbContext.SubCategories.Remove(subCategory);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}


