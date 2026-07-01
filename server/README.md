## Server Tech Stack

- ASP.NET
- PostgreSQL
- Entity Framework Core
- JWT Authentication
- Azure Blob Storage

## Run Locally

```bash
dotnet restore
dotnet run --project server/src/Server.csproj
```

The server uses `http://localhost:5000`.

## Configuration

The main local settings live in `server/src/appsettings.json`.

Important values:

- `ConnectionStrings__Default`: PostgreSQL connection string
- `Jwt__Key`: signing key for JWT tokens
- `Cors__AllowedOrigins__0`: allowed frontend origin
- `ProductImageStorage__Provider`: `Local` or `AzureBlob`
- `ProductImageStorage__ConnectionString`: required when using Azure Blob storage
- `ProductImageStorage__ContainerName`: blob container name for uploaded images

Database:

The application uses Entity Framework Core with PostgreSQL.  
On startup, any pending database migrations are applied automatically.

Seeding:

On startup, the application seeds default roles, users, and categories.  
Additional demo data can also be loaded through the project's existing seed configuration.

## Folder Structure

```text
server/
├─ src/
│  ├─ Analytics/
│  ├─ Authentication/          # Login, signup, JWT-related code
│  ├─ Categories/
│  ├─ Common/
│  │  └─ Api/
│  │     ├─ Extensions/        # Shared endpoint and seeding extensions
│  │     ├─ Filters/           # Reusable endpoint filters
│  │     ├─ Requests/          # Shared request models such as paging
│  │     ├─ Results/           # Shared typed API result helpers
│  │     └─ IEndpoint.cs       # Minimal API endpoint contract
│  ├─ Dashboard/
│  ├─ Data/
│  │  ├─ Json/                 # Seed/demo JSON files
│  │  ├─ Migrations/           # EF Core migrations
│  │  ├─ Seeds/                # Seed orchestration and demo loaders
│  │  ├─ Types/                # EF Core entity types
│  │  ├─ AppDbContext.cs       # Database context
│  │  └─ SeedJsonReader.cs     # JSON seed file reader
│  ├─ Products/
│  ├─ Properties/              # launchSettings and local debug properties
│  ├─ Roles/
│  ├─ Settings/
│  ├─ Transactions/
│  ├─ Users/
│  ├─ appsettings.json         # App configuration
│  ├─ ConfigureApp.cs          # Middleware and app pipeline setup
│  ├─ ConfigureServices.cs     # Dependency registration
│  ├─ Endpoints.cs             # Feature route mapping
│  ├─ Program.cs               # Application entry point
│  ├─ Server.csproj
│  └─ Server.slnx
└─ README.md
```

## Architecture Notes

The backend follows a vertical-slice style. Each feature owns its endpoints, services,  
and related logic instead of routing everything through a single layered service structure.

Most folders inside `src` follow a vertical-slice structure like:

```text
Products/
├─ Endpoints/
│  ├─ CreateProduct.cs
│  ├─ GetProducts.cs
│  └─ UpdateProduct.cs
└─ Services/
   ├─ AzureBlobProductImageStorage.cs
   ├─ IProductImageStorage.cs
   ├─ LocalProductImageStorage.cs
   ├─ ProductImageStorageOptions.cs
   └─ UploadProductImage.cs
```

## Deployment

The production API is deployed as a Docker container to Azure Container Apps. Infrastructure provisioning supplies the PostgreSQL connection string, JWT key, blob storage settings, and the public frontend origin.
