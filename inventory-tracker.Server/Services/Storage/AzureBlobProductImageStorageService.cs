using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;

namespace inventory_management.Server.Services.Storage;

public sealed class AzureBlobProductImageStorageService(
    IOptions<ProductImageStorageOptions> options) : IProductImageStorageService
{
    private static readonly IReadOnlyDictionary<string, string> DefaultExtensions =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["image/png"] = ".png",
            ["image/webp"] = ".webp",
            ["image/gif"] = ".gif",
            ["image/jpeg"] = ".jpg",
        };

    private readonly ProductImageStorageOptions _options = options.Value;

    public async Task<string> UploadAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        BlobServiceClient blobServiceClient;

        if (!string.IsNullOrWhiteSpace(_options.BlobConnectionString))
        {
            blobServiceClient = new BlobServiceClient(_options.BlobConnectionString);
        }
        else if (!string.IsNullOrWhiteSpace(_options.BlobServiceUrl))
        {
            blobServiceClient = new BlobServiceClient(
                new Uri(_options.BlobServiceUrl),
                new DefaultAzureCredential());
        }
        else
        {
            throw new InvalidOperationException("Product image blob storage is not configured.");
        }

        var containerClient = blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: cancellationToken);

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = DefaultExtensions.GetValueOrDefault(file.ContentType, ".jpg");
        }

        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var blobClient = containerClient.GetBlobClient(fileName);

        await using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(
                stream,
                new BlobUploadOptions
                {
                    HttpHeaders = new BlobHttpHeaders
                    {
                        ContentType = file.ContentType
                    }
                },
                cancellationToken);
        }

        return blobClient.Uri.ToString();
    }
}
