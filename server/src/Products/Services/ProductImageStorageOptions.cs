namespace Server.Products.Services;

public class ProductImageStorageOptions
{
    public const string SectionName = "ProductImageStorage";

    public string Provider { get; set; } = "Local";
    public string ContainerName { get; set; } = "product-images";
    public string? ConnectionString { get; set; }
}
