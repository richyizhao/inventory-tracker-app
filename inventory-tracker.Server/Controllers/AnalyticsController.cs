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
public class AnalyticsController(AppDbContext dbContext, IUserPermissionService userPermissionService) : ControllerBase
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;

    [HttpGet("overview")]
    public async Task<ActionResult<AnalyticsOverviewDto>> GetOverview(
        [FromQuery] int? days = 180,
        [FromQuery] bool max = false)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.AnalyticsView))
        {
            return Forbid();
        }

        var historyStartDate = await _dbContext.Transactions
            .Where(transaction => transaction.Type == TransactionType.In)
            .MinAsync(transaction => (DateTime?)transaction.CreatedAt);

        var normalizedDays = max
            ? (int?)null
            : days is null or 0 ? 180
            : Math.Clamp(days.Value, 1, 3650);

        var startDate = max
            ? (historyStartDate?.Date ?? DateTime.UtcNow.Date)
            : DateTime.UtcNow.Date.AddDays(-((normalizedDays ?? 180) - 1));

        var restocks = await _dbContext.Transactions
            .Include(transaction => transaction.Product)
            .ThenInclude(product => product.SubCategory)
            .ThenInclude(subCategory => subCategory.Category)
            .Where(transaction =>
                transaction.Type == TransactionType.In &&
                transaction.CreatedAt >= startDate)
            .OrderBy(transaction => transaction.CreatedAt)
            .ToListAsync();

        var sales = await _dbContext.Transactions
            .Include(transaction => transaction.Product)
            .ThenInclude(product => product.SubCategory)
            .ThenInclude(subCategory => subCategory.Category)
            .Where(transaction =>
                transaction.Type == TransactionType.Out &&
                transaction.CreatedAt >= startDate)
            .OrderBy(transaction => transaction.CreatedAt)
            .ToListAsync();

        var periodCount = Math.Max(1, (DateTime.UtcNow.Date - startDate).Days + 1);
        var periods = Enumerable.Range(0, periodCount)
            .Select(offset => startDate.AddDays(offset))
            .ToList();

        var categoryNames = restocks
            .Select(transaction => transaction.Product.SubCategory.Category?.Name ?? "Unassigned")
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(name => name)
            .ToList();

        var spendingByPeriod = restocks
            .GroupBy(transaction => transaction.CreatedAt.Date)
            .ToDictionary(
                group => group.Key,
                group => Math.Round(group.Sum(GetTransactionSpend), 2));

        var totalSpendingOverTime = periods
            .Select(period => new SpendingPointDto
            {
                Period = period.ToString("yyyy-MM-dd"),
                Amount = spendingByPeriod.GetValueOrDefault(period, 0m)
            })
            .ToList();

        var profitByPeriod = sales
            .GroupBy(transaction => transaction.CreatedAt.Date)
            .ToDictionary(
                group => group.Key,
                group => Math.Round(group.Sum(GetTransactionProfit), 2));

        var totalProfitOverTime = periods
            .Select(period => new SpendingPointDto
            {
                Period = period.ToString("yyyy-MM-dd"),
                Amount = profitByPeriod.GetValueOrDefault(period, 0m)
            })
            .ToList();

        var spendingByCategory = periods
            .Select(period =>
            {
                var perCategory = categoryNames.ToDictionary(name => name, _ => 0m);

                foreach (var transaction in restocks.Where(transaction => transaction.CreatedAt.Date == period))
                {
                    perCategory[transaction.Product.SubCategory.Category?.Name ?? "Unassigned"] += GetTransactionSpend(transaction);
                }

                return new CategorySpendPointDto
                {
                    Period = period.ToString("yyyy-MM-dd"),
                    Total = Math.Round(perCategory.Values.Sum(), 2),
                    Categories = perCategory.ToDictionary(
                        pair => pair.Key,
                        pair => Math.Round(pair.Value, 2))
                };
            })
            .ToList();

        var profitCategoryNames = sales
            .Select(transaction => transaction.Product.SubCategory.Category?.Name ?? "Unassigned")
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(name => name)
            .ToList();

        var profitByCategory = periods
            .Select(period =>
            {
                var perCategory = profitCategoryNames.ToDictionary(name => name, _ => 0m);

                foreach (var transaction in sales.Where(transaction => transaction.CreatedAt.Date == period))
                {
                    perCategory[transaction.Product.SubCategory.Category?.Name ?? "Unassigned"] += GetTransactionProfit(transaction);
                }

                return new CategorySpendPointDto
                {
                    Period = period.ToString("yyyy-MM-dd"),
                    Total = Math.Round(perCategory.Values.Sum(), 2),
                    Categories = perCategory.ToDictionary(
                        pair => pair.Key,
                        pair => Math.Round(pair.Value, 2))
                };
            })
            .ToList();

        var productsWithInventory = await _dbContext.Products
            .Include(product => product.SubCategory)
            .ThenInclude(subCategory => subCategory.Category)
            .Where(product => product.Quantity > 0)
            .ToListAsync();

        var inventoryValueDistribution = productsWithInventory
            .GroupBy(product => product.SubCategory.Category?.Name ?? "Unassigned", StringComparer.OrdinalIgnoreCase)
            .Select(group => new InventoryValueSliceDto
            {
                CategoryName = group.Key,
                InventoryValue = Math.Round(group.Sum(product => product.Quantity * product.UnitCost), 2),
                UnitsInStock = group.Sum(product => product.Quantity),
                ProductCount = group.Count()
            })
            .OrderByDescending(item => item.InventoryValue)
            .ToList();

        return Ok(new AnalyticsOverviewDto
        {
            TotalInventoryValue = inventoryValueDistribution.Sum(item => item.InventoryValue),
            TotalRestockSpend = totalSpendingOverTime.Sum(item => item.Amount),
            TotalProfit = totalProfitOverTime.Sum(item => item.Amount),
            SpendingOverTime = totalSpendingOverTime,
            ProfitOverTime = totalProfitOverTime,
            SpendingByCategory = spendingByCategory,
            ProfitByCategory = profitByCategory,
            InventoryValueDistribution = inventoryValueDistribution
        });
    }

    private static decimal GetTransactionSpend(InventoryTransaction transaction)
    {
        return (transaction.Quantity * transaction.UnitCost) + transaction.ExpenseAmount;
    }

    private static decimal GetTransactionProfit(InventoryTransaction transaction)
    {
        var unitPrice = transaction.UnitPrice > 0
            ? transaction.UnitPrice
            : transaction.Product.SellingPrice;

        return (transaction.Quantity * unitPrice) - (transaction.Quantity * transaction.UnitCost);
    }
}


