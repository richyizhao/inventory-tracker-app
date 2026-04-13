# Terraform Infrastructure

This directory provisions the Azure infrastructure for the application.

## Files

- `providers.tf`: Terraform and AzureRM provider configuration
- `main.tf`: shared locals, naming, tags, and composed app settings
- `appservice.tf`: App Service plan and Linux Web App
- `storage.tf`: Storage account and blob container for product images
- `postgres.tf`: Azure Database for PostgreSQL Flexible Server
- `keyvault.tf`: optional Key Vault resources
- `variables.tf`: input variables
- `outputs.tf`: useful deployment outputs
- `dev.tfvars`: development environment values

## Secrets

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `POSTGRES_ADMIN_LOGIN`
- `POSTGRES_ADMIN_PASSWORD`
- `JWT_SIGNING_KEY`

## Variables

- `AZURE_WEBAPP_NAME`
- `TF_STATE_RESOURCE_GROUP`
- `TF_STATE_STORAGE_ACCOUNT`
- `TF_STATE_CONTAINER`
- `TF_STATE_KEY`
- `TF_ENABLE_KEY_VAULT`

## Deployment Order

1. Create an Azure resource group for Terraform state.
2. Create a storage account and blob container for the Terraform backend.
3. Configure GitHub OIDC access to Azure.
4. Add the required GitHub environment secrets and variables.
5. Run the infrastructure workflow.

## Notes

- Product images are configured for direct blob URL delivery.
- PostgreSQL is the intended production database provider.
- The web app is configured for App Service on Linux with `.NET 10`.
- The optional `suffix` value is appended to globally unique Azure resource names such as the web app, storage account, PostgreSQL server, and Key Vault.
