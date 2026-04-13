locals {
  name_suffix                = "${var.project_name}-${var.environment}"
  global_name_suffix         = "${var.project_name}${var.environment}${var.suffix}"
  resource_group_name        = "rg-${local.name_suffix}"
  app_service_plan_name      = "asp-${local.name_suffix}"
  web_app_name               = substr(lower(local.global_name_suffix), 0, 60)
  storage_account_name       = substr(lower("st${local.global_name_suffix}"), 0, 24)
  postgres_server_name       = substr(lower("pg-${local.global_name_suffix}"), 0, 63)
  key_vault_name             = substr(lower("kv-${local.global_name_suffix}"), 0, 24)
  database_name              = "inventory_management"
  postgres_connection_string = "Host=${azurerm_postgresql_flexible_server.this.fqdn};Port=5432;Database=${local.database_name};Username=${var.postgres_admin_login};Password=${var.postgres_admin_password};Ssl Mode=Require;Trust Server Certificate=true"

  direct_app_settings = {
    "ConnectionStrings__DefaultConnection"      = local.postgres_connection_string
    "Jwt__SigningKey"                           = var.jwt_signing_key
    "ProductImageStorage__BlobConnectionString" = azurerm_storage_account.this.primary_connection_string
  }

  key_vault_app_settings = var.enable_key_vault ? {
    "ConnectionStrings__DefaultConnection"      = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.connection_string[0].versionless_id})"
    "Jwt__SigningKey"                           = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.jwt_signing_key[0].versionless_id})"
    "ProductImageStorage__BlobConnectionString" = azurerm_storage_account.this.primary_connection_string
  } : {}

  base_app_settings = {
    "ASPNETCORE_ENVIRONMENT"                   = "Production"
    "Jwt__Issuer"                              = var.jwt_issuer
    "Jwt__Audience"                            = var.jwt_audience
    "Jwt__ExpiryMinutes"                       = "120"
    "ProductImageStorage__UseAzureBlobStorage" = "true"
    "ProductImageStorage__ContainerName"       = azurerm_storage_container.product_images.name
    "ProductImageStorage__BlobServiceUrl"      = azurerm_storage_account.this.primary_blob_endpoint
    "WEBSITE_RUN_FROM_PACKAGE"                 = "1"
  }

  web_app_settings = merge(
    local.base_app_settings,
    var.enable_key_vault ? local.key_vault_app_settings : local.direct_app_settings
  )

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

resource "azurerm_resource_group" "this" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.tags
}
