variable "project_name" {
  description = "Base project name used in Azure resource naming."
  type        = string
  default     = "inventory-tracker"

  validation {
    condition     = length(trimspace(var.project_name)) > 0
    error_message = "project_name must not be empty."
  }
}

variable "environment" {
  description = "Deployment environment name."
  type        = string

  validation {
    condition     = var.environment == "prod"
    error_message = "environment must be prod."
  }
}

variable "location" {
  description = "Azure region for the deployment."
  type        = string
  default     = "australiaeast"

  validation {
    condition     = length(trimspace(var.location)) > 0
    error_message = "location must not be empty."
  }
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

  validation {
    condition     = length(trimspace(var.api_image)) > 0
    error_message = "api_image must not be empty."
  }
}

variable "frontend_image" {
  description = "Initial image used by the frontend Container App before the first CI/CD deployment."
  type        = string
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"

  validation {
    condition     = length(trimspace(var.frontend_image)) > 0
    error_message = "frontend_image must not be empty."
  }
}

variable "server_container_port" {
  description = "HTTP port exposed by the ASP.NET container."
  type        = number
  default     = 8080

  validation {
    condition     = var.server_container_port >= 1 && var.server_container_port <= 65535
    error_message = "server_container_port must be between 1 and 65535."
  }
}

variable "frontend_container_port" {
  description = "HTTP port exposed by the frontend container."
  type        = number
  default     = 3000

  validation {
    condition     = var.frontend_container_port >= 1 && var.frontend_container_port <= 65535
    error_message = "frontend_container_port must be between 1 and 65535."
  }
}

variable "container_app_cpu" {
  description = "CPU allocated to the API container."
  type        = number
  default     = 0.5

  validation {
    condition     = var.container_app_cpu > 0
    error_message = "container_app_cpu must be greater than 0."
  }
}

variable "container_app_memory" {
  description = "Memory allocated to the API container."
  type        = string
  default     = "1Gi"

  validation {
    condition     = can(regex("^[1-9][0-9]*(\\.5)?Gi$", var.container_app_memory))
    error_message = "container_app_memory must use Azure Container Apps Gi notation, for example 1Gi or 1.5Gi."
  }
}

variable "frontend_container_app_cpu" {
  description = "CPU allocated to the frontend container."
  type        = number
  default     = 0.5

  validation {
    condition     = var.frontend_container_app_cpu > 0
    error_message = "frontend_container_app_cpu must be greater than 0."
  }
}

variable "frontend_container_app_memory" {
  description = "Memory allocated to the frontend container."
  type        = string
  default     = "1Gi"

  validation {
    condition     = can(regex("^[1-9][0-9]*(\\.5)?Gi$", var.frontend_container_app_memory))
    error_message = "frontend_container_app_memory must use Azure Container Apps Gi notation, for example 1Gi or 1.5Gi."
  }
}

variable "container_app_min_replicas" {
  description = "Minimum API replicas."
  type        = number
  default     = 1

  validation {
    condition     = var.container_app_min_replicas >= 0
    error_message = "container_app_min_replicas must be 0 or greater."
  }
}

variable "container_app_max_replicas" {
  description = "Maximum API replicas."
  type        = number
  default     = 3

  validation {
    condition     = var.container_app_max_replicas >= 1
    error_message = "container_app_max_replicas must be at least 1."
  }
}

variable "frontend_container_app_min_replicas" {
  description = "Minimum frontend replicas."
  type        = number
  default     = 1

  validation {
    condition     = var.frontend_container_app_min_replicas >= 0
    error_message = "frontend_container_app_min_replicas must be 0 or greater."
  }
}

variable "frontend_container_app_max_replicas" {
  description = "Maximum frontend replicas."
  type        = number
  default     = 2

  validation {
    condition     = var.frontend_container_app_max_replicas >= 1
    error_message = "frontend_container_app_max_replicas must be at least 1."
  }
}

variable "container_registry_sku" {
  description = "ACR SKU."
  type        = string
  default     = "Basic"

  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.container_registry_sku)
    error_message = "container_registry_sku must be Basic, Standard, or Premium."
  }
}

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username."
  type        = string
  default     = "inventoryadmin"

  validation {
    condition     = length(trimspace(var.postgres_admin_username)) > 0
    error_message = "postgres_admin_username must not be empty."
  }
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

  validation {
    condition     = contains(["15", "16", "17"], var.postgres_version)
    error_message = "postgres_version must be a supported Azure PostgreSQL Flexible Server major version."
  }
}

variable "postgres_sku_name" {
  description = "PostgreSQL Flexible Server SKU."
  type        = string
  default     = "B_Standard_B1ms"

  validation {
    condition     = length(trimspace(var.postgres_sku_name)) > 0
    error_message = "postgres_sku_name must not be empty."
  }
}

variable "postgres_storage_mb" {
  description = "PostgreSQL storage size in MB."
  type        = number
  default     = 32768

  validation {
    condition     = var.postgres_storage_mb >= 32768
    error_message = "postgres_storage_mb must be at least 32768 MB."
  }
}

variable "database_name" {
  description = "Application database name."
  type        = string
  default     = "inventorytrackerdb"

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.database_name))
    error_message = "database_name must start with a letter and contain only letters, numbers, or underscores."
  }
}

variable "blob_container_name" {
  description = "Blob container used for product image uploads."
  type        = string
  default     = "product-images"

  validation {
    condition     = can(regex("^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$", var.blob_container_name))
    error_message = "blob_container_name must be a valid Azure blob container name."
  }
}

variable "jwt_key" {
  description = "JWT signing key for the API."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.jwt_key) >= 16
    error_message = "jwt_key must be at least 16 characters (128 bits) for HMAC-SHA256 signing."
  }
}
