locals {
  name_prefix         = lower("${var.project_name}-${var.environment}")
  compact_name_prefix = lower(replace(var.project_name, "-", ""))
  resource_group_name = "${local.name_prefix}-rg"
  log_analytics_name  = "${local.name_prefix}-logs"
  container_env_name  = "${local.name_prefix}-cae"
  container_app_name  = "${local.name_prefix}-api"
  static_web_app_name = "${local.name_prefix}-frontend"
}

resource "random_string" "storage_suffix" {
  length  = 5
  lower   = true
  numeric = true
  special = false
  upper   = false
}

locals {
  storage_account_name = substr("${local.compact_name_prefix}${var.environment}sa${random_string.storage_suffix.result}", 0, 24)
  container_registry   = substr("${local.compact_name_prefix}${var.environment}acr${random_string.storage_suffix.result}", 0, 50)
  postgres_server_name = substr("${local.compact_name_prefix}-${var.environment}-psql-${random_string.storage_suffix.result}", 0, 63)
}

resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location
  tags     = var.tags
}

resource "azurerm_log_analytics_workspace" "main" {
  name                = local.log_analytics_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = var.tags
}

resource "azurerm_container_registry" "main" {
  name                = local.container_registry
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = var.container_registry_sku
  admin_enabled       = true
  tags                = var.tags
}

resource "azurerm_storage_account" "main" {
  name                     = local.storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"
  tags                     = var.tags

  blob_properties {
    versioning_enabled = true
  }
}

resource "azurerm_storage_container" "product_images" {
  name                  = var.blob_container_name
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = "blob"
}

resource "azurerm_postgresql_flexible_server" "main" {
  name                          = local.postgres_server_name
  resource_group_name           = azurerm_resource_group.main.name
  location                      = azurerm_resource_group.main.location
  version                       = var.postgres_version
  administrator_login           = var.postgres_admin_username
  administrator_password        = var.postgres_admin_password
  sku_name                      = var.postgres_sku_name
  storage_mb                    = var.postgres_storage_mb
  public_network_access_enabled = true
  tags                          = var.tags
}

resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.database_name
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_container_app_environment" "main" {
  name                       = local.container_env_name
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  tags                       = var.tags
}

resource "azurerm_static_web_app" "main" {
  name                = local.static_web_app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku_tier            = var.static_web_app_sku_tier
  sku_size            = var.static_web_app_sku_size
  tags                = var.tags
}

locals {
  frontend_url               = "https://${azurerm_static_web_app.main.default_host_name}"
  api_env_name               = var.environment == "prod" ? "Production" : "Staging"
  postgres_connection_string = "Host=${azurerm_postgresql_flexible_server.main.fqdn};Port=5432;Database=${azurerm_postgresql_flexible_server_database.main.name};Username=${var.postgres_admin_username};Password=${var.postgres_admin_password};Ssl Mode=Require;Trust Server Certificate=true"
}

resource "azurerm_container_app" "api" {
  name                         = local.container_app_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  tags                         = var.tags

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.main.admin_password
  }

  secret {
    name  = "db-connection-string"
    value = local.postgres_connection_string
  }

  secret {
    name  = "jwt-key"
    value = var.jwt_key
  }

  secret {
    name  = "blob-connection-string"
    value = azurerm_storage_account.main.primary_connection_string
  }

  registry {
    server               = azurerm_container_registry.main.login_server
    username             = azurerm_container_registry.main.admin_username
    password_secret_name = "acr-password"
  }

  ingress {
    external_enabled = true
    target_port      = var.server_container_port
    transport        = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = var.container_app_min_replicas
    max_replicas = var.container_app_max_replicas

    container {
      name   = "api"
      image  = var.api_image
      cpu    = var.container_app_cpu
      memory = var.container_app_memory

      env {
        name  = "ASPNETCORE_ENVIRONMENT"
        value = local.api_env_name
      }

      env {
        name  = "ASPNETCORE_HTTP_PORTS"
        value = tostring(var.server_container_port)
      }

      env {
        name        = "ConnectionStrings__Default"
        secret_name = "db-connection-string"
      }

      env {
        name  = "Cors__AllowedOrigins__0"
        value = local.frontend_url
      }

      env {
        name        = "Jwt__Key"
        secret_name = "jwt-key"
      }

      env {
        name  = "ProductImageStorage__Provider"
        value = "AzureBlob"
      }

      env {
        name        = "ProductImageStorage__ConnectionString"
        secret_name = "blob-connection-string"
      }

      env {
        name  = "ProductImageStorage__ContainerName"
        value = azurerm_storage_container.product_images.name
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].container[0].image,
    ]
  }
}
