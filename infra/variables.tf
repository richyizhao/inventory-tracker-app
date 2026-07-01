variable "project_name" {
  description = "Base project name used in Azure resource naming."
  type        = string
  default     = "inventory-tracker"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
}

variable "location" {
  description = "Azure region for the deployment."
  type        = string
  default     = "australiaeast"
}

variable "tags" {
  description = "Tags applied to supported resources."
  type        = map(string)
  default     = {}
}

variable "api_image" {
  description = "Initial image used by the Container App before the first CI/CD deployment."
  type        = string
  default     = "mcr.microsoft.com/dotnet/samples:aspnetapp"
}

variable "server_container_port" {
  description = "HTTP port exposed by the ASP.NET container."
  type        = number
  default     = 8080
}

variable "container_app_cpu" {
  description = "CPU allocated to the API container."
  type        = number
  default     = 0.5
}

variable "container_app_memory" {
  description = "Memory allocated to the API container."
  type        = string
  default     = "1Gi"
}

variable "container_app_min_replicas" {
  description = "Minimum API replicas."
  type        = number
  default     = 1
}

variable "container_app_max_replicas" {
  description = "Maximum API replicas."
  type        = number
  default     = 3
}

variable "container_registry_sku" {
  description = "ACR SKU."
  type        = string
  default     = "Basic"
}

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username."
  type        = string
  default     = "inventoryadmin"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password."
  type        = string
  sensitive   = true
}

variable "postgres_version" {
  description = "PostgreSQL Flexible Server version."
  type        = string
  default     = "16"
}

variable "postgres_sku_name" {
  description = "PostgreSQL Flexible Server SKU."
  type        = string
  default     = "B_Standard_B1ms"
}

variable "postgres_storage_mb" {
  description = "PostgreSQL storage size in MB."
  type        = number
  default     = 32768
}

variable "database_name" {
  description = "Application database name."
  type        = string
  default     = "inventorytrackerdb"
}

variable "blob_container_name" {
  description = "Blob container used for product image uploads."
  type        = string
  default     = "product-images"
}

variable "jwt_key" {
  description = "JWT signing key for the API."
  type        = string
  sensitive   = true
}

variable "static_web_app_sku_tier" {
  description = "Static Web App SKU tier."
  type        = string
  default     = "Free"
}

variable "static_web_app_sku_size" {
  description = "Static Web App SKU size."
  type        = string
  default     = "Free"
}
