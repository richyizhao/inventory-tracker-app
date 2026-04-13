variable "location" {
  type        = string
  description = "Azure region for all resources."
}

variable "environment" {
  type        = string
  description = "Short environment name such as dev or prod."
}

variable "app_service_sku_name" {
  type        = string
  description = "SKU for the Azure App Service plan."
  default     = "S1"
}

variable "app_service_always_on" {
  type        = bool
  description = "Whether App Service should keep the app warm."
  default     = true
}

variable "project_name" {
  type        = string
  description = "Project name prefix."
}

variable "suffix" {
  type        = string
  description = "Optional lowercase alphanumeric suffix to make the name globally unique."
  default     = ""
}

variable "postgres_sku_name" {
  type        = string
  description = "SKU for Azure Database for PostgreSQL Flexible Server."
  default     = "GP_Standard_D2s_v3"
}

variable "postgres_storage_mb" {
  type        = number
  description = "Allocated PostgreSQL storage in megabytes."
  default     = 32768
}

variable "postgres_admin_login" {
  type        = string
  description = "Administrator username for PostgreSQL."
  sensitive   = true
}

variable "postgres_admin_password" {
  type        = string
  description = "Administrator password for PostgreSQL."
  sensitive   = true
}

variable "jwt_signing_key" {
  type        = string
  description = "JWT signing key used by the application."
  sensitive   = true
}

variable "jwt_issuer" {
  type        = string
  description = "JWT issuer used by the application."
  default     = "inventory-tracker-api"
}

variable "jwt_audience" {
  type        = string
  description = "JWT audience used by the application."
  default     = "inventory-tracker-client"
}

variable "enable_key_vault" {
  type        = bool
  description = "Enable Azure Key Vault and App Service Key Vault references for secrets."
  default     = false
}

variable "key_vault_sku_name" {
  type        = string
  description = "SKU for Azure Key Vault."
  default     = "standard"
}
