using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;

namespace Server.Products.Services;

public class AzureBlobProductImageStorage(
    IOptions<ProductImageStorageOptions> options) : IProductImageStorage
{
    private readonly ProductImageStorageOptions _options = options.Value;

    public async Task<string> SaveAsync(
        IFormFile image,
        HttpRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ConnectionString))
        {
            throw new InvalidOperationException(
                "ProductImageStorage:ConnectionString must be configured for AzureBlob storage.");
        }

        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        var blobFileName = $"products/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}{extension}";

        var containerClient = new BlobContainerClient(
            _options.ConnectionString,
            _options.ContainerName);

        await containerClient.CreateIfNotExistsAsync(
            PublicAccessType.Blob,
            cancellationToken: cancellationToken);

        var blobClient = containerClient.GetBlobClient(blobFileName);

        await using (var stream = image.OpenReadStream())
        {
            await blobClient.UploadAsync(
                stream,
                new BlobUploadOptions
                {
                    HttpHeaders = new BlobHttpHeaders
                    {
                        ContentType = image.ContentType
                    }
                },
                cancellationToken);
        }

        return blobClient.Uri.ToString();
    }
}
