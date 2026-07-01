namespace Server.Settings.Endpoints;

public class CreateDemoData : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/demo-data", Handle)
        .WithSummary("Creates demo data")
        .WithAdminUser();

    private static async Task<Ok<Response>> Handle(AppDbContext database, CancellationToken cancellationToken)
    {
        await database.SeedDemoData(cancellationToken);
        return TypedResults.Ok(new Response("Demo data created."));
    }

    public record Response(string Message);
}
