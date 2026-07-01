namespace Server.Settings.Endpoints;

public class DeleteDemoData : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/demo-data", Handle)
        .WithSummary("Deletes demo data")
        .WithAdminUser();

    private static async Task<Ok<Response>> Handle(AppDbContext database, CancellationToken cancellationToken)
    {
        await database.DeleteDemoData(cancellationToken);
        return TypedResults.Ok(new Response("Demo data removed."));
    }

    public record Response(string Message);
}
