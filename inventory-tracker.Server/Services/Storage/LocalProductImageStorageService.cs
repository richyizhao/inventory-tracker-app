using Microsoft.Extensions.Options;

namespace inventory_management.Server.Services.Storage;

public sealed class LocalProductImageStorageService(
    IWebHostEnvironment environment,
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

    private readonly IWebHostEnvironment _environment = environment;
    private readonly ProductImageStorageOptions _options = options.Value;

    public async Task<string> UploadAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        var uploadsDirectory = Path.Combine(
            _environment.WebRootPath,
            _options.LocalUploadsPath.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(uploadsDirectory);

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = DefaultExtensions.GetValueOrDefault(file.ContentType, ".jpg");
        }

        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var filePath = Path.Combine(uploadsDirectory, fileName);

        await using (var stream = File.Create(filePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var normalizedPath = _options.LocalUploadsPath.Trim('/').Replace('\\', '/');
        return $"/{normalizedPath}/{fileName}";
    }
}
