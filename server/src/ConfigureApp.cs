using Serilog;
using Server.Common.Api.Extensions;
using Microsoft.Extensions.FileProviders;

namespace Server;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        app.UseSerilogRequestLogging();
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseHttpsRedirection();
        app.UseProductUploadStaticFiles();
        app.UseCors("ClientCors");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapEndpoints();
        await app.EnsureDatabaseCreated();
    }

    private static async Task EnsureDatabaseCreated(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
        await db.SeedDefaultData();
    }

    private static void UseProductUploadStaticFiles(this WebApplication app)
    {
        var storageProvider = app.Configuration
            .GetValue<string>($"{Products.Services.ProductImageStorageOptions.SectionName}:Provider");

        if (!string.Equals(storageProvider, "Local", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
        Directory.CreateDirectory(uploadsPath);

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(uploadsPath),
            RequestPath = "/uploads"
        });
    }
}
