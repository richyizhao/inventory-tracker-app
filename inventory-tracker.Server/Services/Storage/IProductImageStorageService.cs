namespace inventory_management.Server.Services.Storage;

public interface IProductImageStorageService
{
    Task<string> UploadAsync(IFormFile file, CancellationToken cancellationToken = default);
}
