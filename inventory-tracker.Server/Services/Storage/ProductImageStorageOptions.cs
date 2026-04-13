namespace inventory_management.Server.Services.Storage;

public sealed class ProductImageStorageOptions
{
    public const string SectionName = "ProductImageStorage";

    public bool UseAzureBlobStorage { get; set; }
    public string ContainerName { get; set; } = "product-images";
    public string? BlobServiceUrl { get; set; }
    public string? BlobConnectionString { get; set; }
    public string LocalUploadsPath { get; set; } = "uploads/products";
}
