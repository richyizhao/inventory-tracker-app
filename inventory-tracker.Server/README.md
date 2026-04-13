# Backend Architecture

The backend is intentionally organized around the following folders:

- `Controllers`: HTTP endpoints and request handling
- `Contracts`: request and response DTOs
- `Entities`: persistence-facing domain entities
- `Persistence`: EF Core context, repository abstractions, and database helpers
- `Services`: authentication, authorization, and demo-data services
- `Common`: shared permissions, mappings, and validation utilities

This structure keeps transport models, domain models, data access, and shared infrastructure concerns clearly separated.

## Getting Started

### Run

Restore dependencies and run the API with the HTTPS launch profile:

```bash
dotnet restore
dotnet run --project inventory-tracker.Server.csproj --launch-profile https
```

Swagger is enabled in development for API exploration and testing.

### Testing

Replace with your username. From the repository root, restore and run the backend test suite with:

```bash
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE='1'
$env:DOTNET_CLI_HOME='C:\Users\{REPLACE_USERNAME}\Downloads\inventory-tracker\.dotnet-cli-home'
dotnet restore inventory-tracker.Server.Tests\inventory-tracker.Server.Tests.csproj --configfile NuGet.Config
dotnet test inventory-tracker.Server.Tests\inventory-tracker.Server.Tests.csproj --no-restore -p:UseAppHost=false
```

The `UseAppHost=false` flag helps avoid file-lock issues when the API is already running locally.

## Configuration

The development seed process creates a default administrative account:

- Email: `admin@inventory.local`
- Password: `Admin123!`

Primary application settings are stored in `appsettings.json`:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:SigningKey`
- `Jwt:ExpiryMinutes`

For local development, ensure PostgreSQL is available and the configured database connection is valid before starting the API.

## Functional Scope

- JWT-based authentication and profile updates
- role and permission management
- product, category, and transaction workflows
- dashboard and analytics endpoints
- demo-data generation and reset operations for development/testing

## Key Design Decisions

- Permission checks are centralized through authorization services rather than being hard-coded across the application.
- Contract models are separated from entity models to keep the API boundary explicit.
- Shared mappings and validation rules live in `Common` to reduce duplication across controllers.

## Operational Notes

- The backend serves static SPA assets and uploaded product images from `wwwroot`.
- Demo-data endpoints are intended for development and presentation workflows rather than production operation.
