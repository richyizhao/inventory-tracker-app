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
public class TransactionsController(
    AppDbContext dbContext,
    IUserPermissionService userPermissionService,
    IUserContextService userContextService) : ControllerBase
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IUserPermissionService _userPermissionService = userPermissionService;
    private readonly IUserContextService _userContextService = userContextService;

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> CreateTransaction([FromBody] CreateTransactionRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.TransactionsCreate))
        {
            return Forbid();
        }

        if (!TryValidateTransactionRequest(
            request.Type,
            request.Quantity,
            request.UnitCost,
            request.ExpenseAmount,
            request.Reason,
            out var transactionType))
        {
            return ValidationProblem(ModelState);
        }

        if (!_userContextService.TryGetUserId(User, out var userId))
        {
            return Unauthorized();
        }

        await using var dbTransaction = await _dbContext.Database.BeginTransactionAsync();

        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == request.ProductId);

        if (product is null)
        {
            return NotFound();
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(item => item.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        var transactionUnitCost = request.UnitCost ?? product.UnitCost;

        var inventoryTransaction = new InventoryTransaction
        {
            ProductId = product.Id,
            Product = product,
            Type = transactionType,
            Quantity = request.Quantity,
            UnitCost = transactionUnitCost,
            UnitPrice = transactionType == TransactionType.Out ? product.SellingPrice : 0,
            ExpenseAmount = request.ExpenseAmount,
            UserId = user.Id,
            User = user,
            Reason = request.Reason.Trim(),
            Note = request.Note.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Transactions.Add(inventoryTransaction);
        await _dbContext.SaveChangesAsync();

        if (!await TryRecalculateProductAsync(product.Id))
        {
            return ValidationProblem(ModelState);
        }

        await _dbContext.SaveChangesAsync();
        await dbTransaction.CommitAsync();

        inventoryTransaction.Product = product;
        return CreatedAtAction(nameof(GetTransaction), new { id = inventoryTransaction.Id }, inventoryTransaction.ToDto());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions()
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.TransactionsHistoryView))
        {
            return Forbid();
        }

        var transactions = await _dbContext.Transactions
            .Include(transaction => transaction.Product)
            .Include(transaction => transaction.User)
            .OrderByDescending(transaction => transaction.CreatedAt)
            .Select(transaction => transaction.ToDto())
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransactionDto>> GetTransaction(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.TransactionsHistoryView))
        {
            return Forbid();
        }

        var transaction = await _dbContext.Transactions
            .Include(item => item.Product)
            .Include(item => item.User)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (transaction is null)
        {
            return NotFound();
        }

        return Ok(transaction.ToDto());
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<TransactionDto>> UpdateTransaction(Guid id, [FromBody] UpdateTransactionRequest request)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.TransactionsManage))
        {
            return Forbid();
        }

        if (!TryValidateTransactionRequest(
            request.Type,
            request.Quantity,
            request.UnitCost,
            request.ExpenseAmount,
            request.Reason,
            out var transactionType))
        {
            return ValidationProblem(ModelState);
        }

        await using var dbTransaction = await _dbContext.Database.BeginTransactionAsync();

        var transaction = await _dbContext.Transactions
            .Include(item => item.Product)
            .Include(item => item.User)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (transaction is null)
        {
            return NotFound();
        }

        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == request.ProductId);

        if (product is null)
        {
            ModelState.AddModelError(nameof(request.ProductId), "Product does not exist.");
            return ValidationProblem(ModelState);
        }

        var previousProductId = transaction.ProductId;
        var affectedProductIds = new HashSet<Guid> { previousProductId, product.Id };

        transaction.ProductId = product.Id;
        transaction.Product = product;
        transaction.Type = transactionType;
        transaction.Quantity = request.Quantity;
        transaction.UnitCost = request.UnitCost ??
            (previousProductId == product.Id ? transaction.UnitCost : product.UnitCost);
        transaction.UnitPrice = transactionType == TransactionType.Out ? product.SellingPrice : 0;
        transaction.ExpenseAmount = request.ExpenseAmount;
        transaction.Reason = request.Reason.Trim();
        transaction.Note = request.Note.Trim();

        await _dbContext.SaveChangesAsync();

        foreach (var productId in affectedProductIds)
        {
            if (!await TryRecalculateProductAsync(productId))
            {
                return ValidationProblem(ModelState);
            }
        }

        await _dbContext.SaveChangesAsync();
        await dbTransaction.CommitAsync();

        return Ok(transaction.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        if (!await _userPermissionService.HasPermissionAsync(User, AppPermissions.TransactionsDelete))
        {
            return Forbid();
        }

        await using var dbTransaction = await _dbContext.Database.BeginTransactionAsync();

        var transaction = await _dbContext.Transactions.FirstOrDefaultAsync(item => item.Id == id);

        if (transaction is null)
        {
            return NotFound();
        }

        var affectedProductId = transaction.ProductId;

        _dbContext.Transactions.Remove(transaction);
        await _dbContext.SaveChangesAsync();

        if (!await TryRecalculateProductAsync(affectedProductId))
        {
            return ValidationProblem(ModelState);
        }

        await _dbContext.SaveChangesAsync();
        await dbTransaction.CommitAsync();

        return NoContent();
    }

    private bool TryValidateTransactionRequest(
        string type,
        int quantity,
        decimal? unitCost,
        decimal expenseAmount,
        string reason,
        out TransactionType transactionType)
    {
        transactionType = default;

        if (string.IsNullOrWhiteSpace(type))
        {
            ModelState.AddModelError(nameof(CreateTransactionRequest.Type), "Type is required.");
            return false;
        }

        if (!Enum.TryParse(type, true, out transactionType))
        {
            ModelState.AddModelError(nameof(CreateTransactionRequest.Type), "Type must be IN, OUT, or ADJUSTMENT.");
            return false;
        }

        if (quantity <= 0)
        {
            ModelState.AddModelError(nameof(CreateTransactionRequest.Quantity), "Quantity must be greater than zero.");
        }

        if (expenseAmount < 0)
        {
            ModelState.AddModelError(nameof(CreateTransactionRequest.ExpenseAmount), "Restock expense cannot be negative.");
        }

        if (unitCost.HasValue && unitCost.Value < 0)
        {
            ModelState.AddModelError(nameof(CreateTransactionRequest.UnitCost), "Unit cost cannot be negative.");
        }

        if (transactionType == TransactionType.In && !unitCost.HasValue)
        {
            ModelState.AddModelError(nameof(CreateTransactionRequest.UnitCost), "Unit cost is required for restocks.");
        }

        if (string.IsNullOrWhiteSpace(reason))
        {
            ModelState.AddModelError(nameof(CreateTransactionRequest.Reason), "Reason is required.");
        }

        return ModelState.IsValid;
    }

    private async Task<bool> TryRecalculateProductAsync(Guid productId)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == productId);

        if (product is null)
        {
            return false;
        }

        var transactions = await _dbContext.Transactions
            .Where(item => item.ProductId == productId)
            .OrderBy(item => item.CreatedAt)
            .ThenBy(item => item.Id)
            .ToListAsync();

        if (transactions.Count == 0)
        {
            product.Quantity = 0;
            product.UpdatedAt = DateTime.UtcNow;
            return true;
        }

        var quantity = 0;
        var unitCost = 0m;

        foreach (var transaction in transactions)
        {
            switch (transaction.Type)
            {
                case TransactionType.In:
                    {
                        var nextQuantity = quantity + transaction.Quantity;
                        var nextInventoryValue =
                            (quantity * unitCost) +
                            (transaction.Quantity * transaction.UnitCost) +
                            transaction.ExpenseAmount;

                        quantity = nextQuantity;
                        unitCost = nextQuantity == 0
                            ? 0
                            : Math.Round(nextInventoryValue / nextQuantity, 2, MidpointRounding.AwayFromZero);
                        break;
                    }
                case TransactionType.Out:
                    {
                        var nextQuantity = quantity - transaction.Quantity;

                        if (nextQuantity < 0)
                        {
                            ModelState.AddModelError(
                                nameof(CreateTransactionRequest.Quantity),
                                "Transaction history would result in negative stock for the selected product.");
                            return false;
                        }

                        quantity = nextQuantity;
                        break;
                    }
                case TransactionType.Adjustment:
                    quantity = transaction.Quantity;
                    unitCost = transaction.UnitCost;
                    break;
            }
        }

        product.Quantity = quantity;
        product.UnitCost = unitCost;
        product.UpdatedAt = DateTime.UtcNow;
        return true;
    }
}


