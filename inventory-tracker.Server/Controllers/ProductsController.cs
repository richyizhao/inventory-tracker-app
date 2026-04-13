using inventory_management.Server.Common;
using inventory_management.Server.Services.Authorization;
using inventory_management.Server.Common.Mappings;
using inventory_management.Server.Entities;
using inventory_management.Server.Persistence;
using inventory_management.Server.Services.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ProductsController(
    AppDbContext dbContext,
    IProductImageStorageService productImageStorageService,
    IUserPermissionService userPermissionService) : ControllerBase
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IProductImageStorageService _productImageStorageService = productImageStorageService;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? q = null,
        [FromQuery(Name = "category_id")] Guid? categoryId = null,
        [FromQuery(Name = "sub_category_id")] Guid? subCategoryId = null,
        [FromQuery] string? sort = null)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.ProductsView))
        {
            return Forbid();
        }

        page = page < 1 ? 1 : page;
        limit = limit is < 1 or > 100 ? 20 : limit;

        var query = _dbContext.Products
            .Include(product => product.SubCategory)
            .ThenInclude(subCategory => subCategory.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            query = query.Where(product =>
                EF.Functions.ILike(product.Name, $"%{q}%") ||
                EF.Functions.ILike(product.Sku, $"%{q}%"));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(product => product.SubCategory.CategoryId == categoryId.Value);
        }

        if (subCategoryId.HasValue)
        {
            query = query.Where(product => product.SubCategoryId == subCategoryId.Value);
        }

        query = ApplySorting(query, sort);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(product => product.ToDto())
            .ToListAsync();

        return Ok(new PagedResult<ProductDto>
        {
            Items = items,
            Page = page,
            Limit = limit,
            Total = total
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetProduct(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.ProductsView))
        {
            return Forbid();
        }

        var product = await _dbContext.Products
            .Include(item => item.SubCategory)
            .ThenInclude(subCategory => subCategory.Category)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product.ToDto());
    }

    [HttpGet("{id:guid}/transactions")]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetProductTransactions(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.ProductsView))
        {
            return Forbid();
        }

        var productExists = await _dbContext.Products.AnyAsync(product => product.Id == id);

        if (!productExists)
        {
            return NotFound();
        }

        var transactions = await _dbContext.Transactions
            .Include(transaction => transaction.Product)
            .Include(transaction => transaction.User)
            .Where(transaction => transaction.ProductId == id)
            .OrderByDescending(transaction => transaction.CreatedAt)
            .Select(transaction => transaction.ToDto())
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.ProductsManage))
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Sku))
        {
            ModelState.AddModelError(nameof(request.Sku), "SKU is required.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var subCategory = await _dbContext.SubCategories
            .Include(item => item.Category)
            .FirstOrDefaultAsync(item => item.Id == request.SubCategoryId);

        if (subCategory is null)
        {
            ModelState.AddModelError(nameof(request.SubCategoryId), "Sub-category does not exist.");
            return ValidationProblem(ModelState);
        }

        var existingProduct = await _dbContext.Products
            .FirstOrDefaultAsync(product => EF.Functions.ILike(product.Sku, request.Sku));

        if (existingProduct is not null)
        {
            ModelState.AddModelError(nameof(request.Sku), "A product with this SKU already exists.");
            return ValidationProblem(ModelState);
        }

        var now = DateTime.UtcNow;
        var product = new Product
        {
            Name = request.Name.Trim(),
            Sku = request.Sku.Trim(),
            Description = request.Description.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            UnitCost = request.UnitCost,
            SellingPrice = request.SellingPrice,
            SubCategoryId = request.SubCategoryId,
            CreatedAt = now,
            UpdatedAt = now
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();

        product.SubCategory = subCategory;
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product.ToDto());
    }

    [HttpPost("upload-image")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<ProductImageUploadResponse>> UploadImage([FromForm] IFormFile? file)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.ProductsManage))
        {
            return Forbid();
        }

        if (file is null || file.Length == 0)
        {
            ModelState.AddModelError(nameof(file), "Please choose an image file to upload.");
            return ValidationProblem(ModelState);
        }

        var allowedContentTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        };

        if (!allowedContentTypes.Contains(file.ContentType))
        {
            ModelState.AddModelError(nameof(file), "Only PNG, JPG, WEBP, and GIF images are supported.");
            return ValidationProblem(ModelState);
        }

        var imageUrl = await _productImageStorageService.UploadAsync(file, HttpContext.RequestAborted);
        return Ok(new ProductImageUploadResponse { ImageUrl = imageUrl });
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.ProductsManage))
        {
            return Forbid();
        }

        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == id);

        if (product is null)
        {
            return NotFound();
        }

        if (request.Name is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                ModelState.AddModelError(nameof(request.Name), "Name cannot be empty.");
            }
            else
            {
                product.Name = request.Name.Trim();
            }
        }

        if (request.Sku is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Sku))
            {
                ModelState.AddModelError(nameof(request.Sku), "SKU cannot be empty.");
            }
            else
            {
                var duplicate = await _dbContext.Products.FirstOrDefaultAsync(item =>
                    item.Id != id && EF.Functions.ILike(item.Sku, request.Sku));

                if (duplicate is not null)
                {
                    ModelState.AddModelError(nameof(request.Sku), "A product with this SKU already exists.");
                }
                else
                {
                    product.Sku = request.Sku.Trim();
                }
            }
        }

        if (request.Description is not null)
        {
            product.Description = request.Description.Trim();
        }

        if (request.ImageUrl is not null)
        {
            product.ImageUrl = request.ImageUrl.Trim();
        }

        if (request.UnitCost.HasValue)
        {
            if (request.UnitCost.Value < 0)
            {
                ModelState.AddModelError(nameof(request.UnitCost), "Unit cost cannot be negative.");
            }
            else
            {
                product.UnitCost = request.UnitCost.Value;
            }
        }

        if (request.SellingPrice.HasValue)
        {
            if (request.SellingPrice.Value < 0)
            {
                ModelState.AddModelError(nameof(request.SellingPrice), "Selling price cannot be negative.");
            }
            else
            {
                product.SellingPrice = request.SellingPrice.Value;
            }
        }

        if (request.SubCategoryId.HasValue)
        {
            var subCategoryExists = await _dbContext.SubCategories.AnyAsync(subCategory => subCategory.Id == request.SubCategoryId.Value);

            if (!subCategoryExists)
            {
                ModelState.AddModelError(nameof(request.SubCategoryId), "Sub-category does not exist.");
            }
            else
            {
                product.SubCategoryId = request.SubCategoryId.Value;
            }
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        product.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.ProductsDelete))
        {
            return Forbid();
        }

        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == id);

        if (product is null)
        {
            return NotFound();
        }

        _dbContext.Products.Remove(product);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    private static IQueryable<Product> ApplySorting(IQueryable<Product> query, string? sort)
    {
        if (string.IsNullOrWhiteSpace(sort))
        {
            return query.OrderByDescending(product => product.CreatedAt);
        }

        var parts = sort.Split(':', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var field = parts[0].ToLowerInvariant();
        var descending = parts.Length > 1 && string.Equals(parts[1], "desc", StringComparison.OrdinalIgnoreCase);

        return (field, descending) switch
        {
            ("created_at", true) => query.OrderByDescending(product => product.CreatedAt),
            ("created_at", false) => query.OrderBy(product => product.CreatedAt),
            ("quantity", true) => query.OrderByDescending(product => product.Quantity).ThenBy(product => product.Name),
            ("quantity", false) => query.OrderBy(product => product.Quantity).ThenBy(product => product.Name),
            ("updated_at", true) => query.OrderByDescending(product => product.UpdatedAt),
            ("updated_at", false) => query.OrderBy(product => product.UpdatedAt),
            ("name", true) => query.OrderByDescending(product => product.Name),
            ("name", false) => query.OrderBy(product => product.Name),
            ("sku", true) => query.OrderByDescending(product => product.Sku),
            ("sku", false) => query.OrderBy(product => product.Sku),
            _ => query.OrderByDescending(product => product.CreatedAt)
        };
    }
}


