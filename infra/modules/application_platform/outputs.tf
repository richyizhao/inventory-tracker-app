output "resource_group_name" {
  description = "Name of the Azure resource group for the environment."
  value       = azurerm_resource_group.main.name
}

output "container_registry_name" {
  description = "Name of the Azure Container Registry."
  value       = azurerm_container_registry.main.name
}

output "container_registry_login_server" {
  description = "Login server for the Azure Container Registry."
  value       = azurerm_container_registry.main.login_server
}

output "api_container_app_name" {
  description = "Name of the API Container App."
  value       = azurerm_container_app.api.name
}

output "api_container_app_url" {
  description = "Public URL of the API Container App."
  value       = local.api_url
}

output "frontend_container_app_name" {
  description = "Name of the frontend Container App."
  value       = azurerm_container_app.frontend.name
}

output "frontend_url" {
  description = "Public URL of the frontend Container App."
  value       = local.frontend_url
}

output "storage_account_name" {
  description = "Name of the storage account used for product images."
  value       = azurerm_storage_account.main.name
}

output "blob_container_name" {
  description = "Blob container that stores product images."
  value       = azurerm_storage_container.product_images.name
}

output "postgres_server_fqdn" {
  description = "FQDN of the PostgreSQL Flexible Server."
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgres_database_name" {
  description = "Name of the application PostgreSQL database."
  value       = azurerm_postgresql_flexible_server_database.main.name
}
