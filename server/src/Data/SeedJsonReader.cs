using System.Text.Json;

namespace Server.Data;

internal static class SeedJsonReader
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task<T> ReadAsync<T>(string fileName, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(AppContext.BaseDirectory, "Data", "Json", fileName);

        await using var stream = File.OpenRead(filePath);
        var data = await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions, cancellationToken);

        if (data is null)
        {
            throw new InvalidOperationException($"Seed file '{fileName}' could not be deserialized.");
        }

        return data;
    }
}
