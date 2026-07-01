namespace Server.Products.Services;

public interface IProductImageStorage
{
    Task<string> SaveAsync(IFormFile image, HttpRequest request, CancellationToken cancellationToken);
}
