output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "web_app_name" {
  value = azurerm_linux_web_app.this.name
}

output "web_app_url" {
  value = "https://${azurerm_linux_web_app.this.default_hostname}"
}

output "blob_service_url" {
  value = azurerm_storage_account.this.primary_blob_endpoint
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.this.fqdn
}

output "key_vault_name" {
  value = var.enable_key_vault ? azurerm_key_vault.this[0].name : null
}
