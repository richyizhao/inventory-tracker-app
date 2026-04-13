data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "this" {
  count                      = var.enable_key_vault ? 1 : 0
  name                       = local.key_vault_name
  location                   = azurerm_resource_group.this.location
  resource_group_name        = azurerm_resource_group.this.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = var.key_vault_sku_name
  purge_protection_enabled   = false
  soft_delete_retention_days = 7
  rbac_authorization_enabled = true
  tags                       = local.tags
}

resource "azurerm_key_vault_secret" "connection_string" {
  count        = var.enable_key_vault ? 1 : 0
  name         = "connection-string-default"
  value        = local.postgres_connection_string
  key_vault_id = azurerm_key_vault.this[0].id
}

resource "azurerm_key_vault_secret" "jwt_signing_key" {
  count        = var.enable_key_vault ? 1 : 0
  name         = "jwt-signing-key"
  value        = var.jwt_signing_key
  key_vault_id = azurerm_key_vault.this[0].id
}

resource "azurerm_role_assignment" "web_app_key_vault_secrets_user" {
  count                = var.enable_key_vault ? 1 : 0
  scope                = azurerm_key_vault.this[0].id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.this.identity[0].principal_id
}
