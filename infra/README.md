## Infrastructure Stack

- Terraform
- GitHub Actions
- Azure CLI / PowerShell
- Azure Container Apps
- Azure Container Registry
- Azure Blob Storage
- Azure Database for PostgreSQL Flexible Server

## Run Locally

```bash
terraform -chdir=infra fmt -check -recursive
terraform -chdir=infra/environments/prod init
terraform -chdir=infra/environments/prod validate
terraform -chdir=infra/environments/prod plan
```

Before the first real deploy, create the Terraform state backend:

```powershell
az login
./infra/bootstrap-state.ps1 `
  -ResourceGroupName inventory-tracker-tfstate-rg `
  -StorageAccountName inventorytrackertfstate `
  -Location australiaeast `
  -ContainerName tfstate
```

## Configuration

Create a GitHub environment named `prod`.

Use GitHub secrets for:

- `AZURE_CLIENT_ID`
- `TFSTATE_ACCESS_KEY`
- `TF_VAR_postgres_admin_password`
- `TF_VAR_jwt_key`

Use GitHub variables for:

- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `TFSTATE_RESOURCE_GROUP`
- `TFSTATE_STORAGE_ACCOUNT`
- `TFSTATE_CONTAINER`

## Folder Structure

```text
infra/
├─ bootstrap-state.ps1
├─ modules/
│   └─ application_platform/
│       ├─ main.tf
│       ├─ outputs.tf
│       ├─ variables.tf
│       └─ versions.tf
└── environments/
    └─ prod/
        ├─ backend.tf
        ├─ main.tf
        ├─ outputs.tf
        ├─ providers.tf
        ├─ terraform.tfvars
        ├─ variables.tf
        └─ versions.tf
```

## Architecture Notes

The infrastructure is currently prod-only. Shared Azure resource definitions live in `modules/application_platform`, while `environments/prod` is the active root Terraform directory used by both local commands and GitHub Actions.

The Terraform backend is stored in Azure Blob Storage. The workflows expect that backend to already exist before `deploy-infra.yaml` runs.

## Deployment

Recommended order:

1. Create the Terraform state backend.
2. Add the required GitHub variables and secrets to the `prod` environment.
3. Run `deploy-infra.yaml` with `apply`.
4. Run `deploy-server.yaml`.
5. Run `deploy-client.yaml`.

After deployment, Terraform outputs provide the production resource names and the frontend/API URLs.
