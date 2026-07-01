using Server.Authentication.Services;
using Server.Products.Services;
using Microsoft.IdentityModel.Tokens;
using Serilog;

namespace Server;

public static class ConfigureServices
{
    public static void AddServices(this WebApplicationBuilder builder)
    {
        builder.AddSerilog();
        builder.AddSwagger();
        builder.AddCorsPolicy();
        builder.AddDatabase();
        builder.AddProductImageStorage();
        builder.Services.AddValidatorsFromAssembly(typeof(ConfigureServices).Assembly);
        builder.AddJwtAuthentication();
    }

    private static void AddSwagger(this WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.CustomSchemaIds(type => type.FullName?.Replace('+', '.'));
            options.InferSecuritySchemes();
        });
    }

    private static void AddSerilog(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, configuration) =>
        {
            configuration.ReadFrom.Configuration(context.Configuration);
        });
    }

    private static void AddDatabase(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(builder.Configuration.GetConnectionString("Default"));
        });
    }

    private static void AddCorsPolicy(this WebApplicationBuilder builder)
    {
        var allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("ClientCors", policy =>
            {
                if (allowedOrigins is { Length: > 0 })
                {
                    policy.WithOrigins(allowedOrigins);
                }

                policy
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
    }

    private static void AddProductImageStorage(this WebApplicationBuilder builder)
    {
        builder.Services
            .Configure<ProductImageStorageOptions>(
                builder.Configuration.GetSection(ProductImageStorageOptions.SectionName));

        var provider = builder.Configuration
            .GetValue<string>($"{ProductImageStorageOptions.SectionName}:Provider");

        if (string.Equals(provider, "AzureBlob", StringComparison.OrdinalIgnoreCase))
        {
            builder.Services.AddSingleton<IProductImageStorage, AzureBlobProductImageStorage>();
            return;
        }

        builder.Services.AddSingleton<IProductImageStorage, LocalProductImageStorage>();
    }

    private static void AddJwtAuthentication(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication().AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = Jwt.SecurityKey(builder.Configuration["Jwt:Key"]!),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero
            };
        });
        builder.Services.AddAuthorization();

        builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
        builder.Services.AddTransient<Jwt>();
    }
}
