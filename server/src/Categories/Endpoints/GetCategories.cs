namespace Server.Categories.Endpoints;

public class GetCategories : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Gets categories and sub-categories");

    public record SubCategoryResponse(int Id, string Name, int ProductCount, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);
    public record CategoryResponse(int Id, string Name, int ProductCount, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc, List<SubCategoryResponse> SubCategories);

    private static async Task<List<CategoryResponse>> Handle(AppDbContext database, CancellationToken cancellationToken)
    {
        return await database.Categories
            .OrderBy(x => x.Name)
            .Select(x => new CategoryResponse(
                x.Id,
                x.Name,
                x.Products.Count,
                x.CreatedAtUtc,
                x.UpdatedAtUtc,
                x.SubCategories
                    .OrderBy(sc => sc.Name)
                    .Select(sc => new SubCategoryResponse(
                        sc.Id,
                        sc.Name,
                        sc.Products.Count,
                        sc.CreatedAtUtc,
                        sc.UpdatedAtUtc))
                    .ToList()))
            .ToListAsync(cancellationToken);
    }
}
