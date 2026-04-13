resource "azurerm_service_plan" "this" {
  name                = local.app_service_plan_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  os_type             = "Linux"
  sku_name            = var.app_service_sku_name
  tags                = local.tags
}

resource "azurerm_linux_web_app" "this" {
  name                = local.web_app_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  service_plan_id     = azurerm_service_plan.this.id
  https_only          = true
  tags                = local.tags

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on     = var.app_service_always_on
    http2_enabled = true
    ftps_state    = "Disabled"

    application_stack {
      dotnet_version = "10.0"
    }
  }

  app_settings = local.web_app_settings
}
