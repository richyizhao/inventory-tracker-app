namespace Server.Products.Services;

public class LocalProductImageStorage(IWebHostEnvironment environment) : IProductImageStorage
{
    public async Task<string> SaveAsync(
        IFormFile image,
        HttpRequest request,
        CancellationToken cancellationToken)
    {
        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        var uploadsRoot = Path.Combine(environment.ContentRootPath, "uploads", "products");
        Directory.CreateDirectory(uploadsRoot);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = File.Create(filePath))
        {
            await image.CopyToAsync(stream, cancellationToken);
        }

        return $"{request.Scheme}://{request.Host}/uploads/products/{fileName}";
    }
}
