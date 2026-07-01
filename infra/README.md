# Azure Infrastructure

This folder provisions the Azure platform for the inventory tracker app:

- Azure Static Web Apps for the frontend
- Azure Container Apps for the ASP.NET API
- Azure Database for PostgreSQL Flexible Server
- Azure Blob Storage for product image uploads
- Azure Container Registry for API images
- Log Analytics for Container Apps diagnostics

## Layout

```text
infra/
├─ backend.tf
├─ main.tf
├─ outputs.tf
├─ variables.tf
├─ versions.tf
└─ environments/
   ├─ stage.tfvars
   └─ prod.tfvars
```

## GitHub Environment Secrets

Create GitHub environments named `stage` and `prod`, then add these secrets to each one:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `TFSTATE_RESOURCE_GROUP`
- `TFSTATE_STORAGE_ACCOUNT`
- `TFSTATE_CONTAINER`
- `TF_VAR_postgres_admin_password`
- `TF_VAR_jwt_key`

Optional GitHub environment variables:

## Terraform State

The workflows expect an existing Azure Storage backend for Terraform state. That state storage should exist before the first workflow run.

Each environment stores state at:

- `inventory-tracker-stage.tfstate`
- `inventory-tracker-prod.tfstate`

## Local Usage

Example stage plan:

```bash
terraform -chdir=infra init
terraform -chdir=infra plan -var-file=environments/stage.tfvars
```
