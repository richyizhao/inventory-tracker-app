output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "container_registry_name" {
  value = azurerm_container_registry.main.name
}

output "container_registry_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "container_app_name" {
  value = azurerm_container_app.api.name
}

output "container_app_url" {
  value = "https://${azurerm_container_app.api.latest_revision_fqdn}"
}

output "static_web_app_name" {
  value = azurerm_static_web_app.main.name
}

output "static_web_app_default_host_name" {
  value = azurerm_static_web_app.main.default_host_name
}

output "static_web_app_api_key" {
  value     = azurerm_static_web_app.main.api_key
  sensitive = true
}

output "storage_account_name" {
  value = azurerm_storage_account.main.name
}

output "blob_container_name" {
  value = azurerm_storage_container.product_images.name
}

output "postgres_server_fqdn" {
  value = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgres_database_name" {
  value = azurerm_postgresql_flexible_server_database.main.name
}
