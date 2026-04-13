using inventory_management.Server.Common;
using inventory_management.Server.Services.Authorization;
using inventory_management.Server.Common.Mappings;
using inventory_management.Server.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class DashboardController(AppDbContext dbContext, IUserPermissionService userPermissionService) : ControllerBase
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;
    private const int LowStockThreshold = 3;

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary([FromQuery] int recentCount = 10)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.DashboardView))
        {
            return Forbid();
        }

        recentCount = recentCount is < 1 or > 50 ? 10 : recentCount;

        var totalProducts = await _dbContext.Products.CountAsync();
        var totalStock = await _dbContext.Products.SumAsync(product => (int?)product.Quantity) ?? 0;
        var lowStockCount = await _dbContext.Products.CountAsync(product => product.Quantity <= LowStockThreshold);

        var recentTransactions = await _dbContext.Transactions
            .Include(transaction => transaction.Product)
            .Include(transaction => transaction.User)
            .OrderByDescending(transaction => transaction.CreatedAt)
            .Take(recentCount)
            .Select(transaction => transaction.ToDto())
            .ToListAsync();

        return Ok(new DashboardSummaryDto
        {
            TotalProducts = totalProducts,
            TotalStock = totalStock,
            LowStockCount = lowStockCount,
            RecentTransactions = recentTransactions
        });
    }
}


