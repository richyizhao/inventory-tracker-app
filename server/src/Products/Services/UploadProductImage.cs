namespace Server.Products.Services;

public class UploadProductImage : IEndpoint
{
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;
    private static readonly HashSet<string> AllowedExtensions =
    [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
    ];

    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/image", Handle)
        .WithSummary("Uploads a product image");

    public record Response(string ImageUrl);

    private static async Task<Results<Ok<Response>, ValidationError>> Handle(
        HttpRequest request,
        IProductImageStorage imageStorage,
        CancellationToken cancellationToken)
    {
        if (!request.HasFormContentType)
        {
            return new ValidationError("Image upload must use form data.");
        }

        var form = await request.ReadFormAsync(cancellationToken);
        var image = form.Files["image"];

        if (image is null || image.Length == 0)
        {
            return new ValidationError("Please choose an image to upload.");
        }

        if (image.Length > MaxFileSizeBytes)
        {
            return new ValidationError("Image must be 5 MB or smaller.");
        }

        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            return new ValidationError("Image must be a JPG, PNG, WEBP, or GIF file.");
        }

        var imageUrl = await imageStorage.SaveAsync(image, request, cancellationToken);
        return TypedResults.Ok(new Response(imageUrl));
    }
}
