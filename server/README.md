# Backend Project Structure
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

## Feature module pattern

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
