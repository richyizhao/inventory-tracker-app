variable "project_name" { type = string }
variable "environment" { type = string }
variable "location" { type = string }
variable "tags" { type = map(string) }
variable "api_image" { type = string }
variable "frontend_image" { type = string }
variable "server_container_port" { type = number }
variable "frontend_container_port" { type = number }
variable "container_app_cpu" { type = number }
variable "container_app_memory" { type = string }
variable "frontend_container_app_cpu" { type = number }
variable "frontend_container_app_memory" { type = string }
variable "container_app_min_replicas" { type = number }
variable "container_app_max_replicas" { type = number }
variable "frontend_container_app_min_replicas" { type = number }
variable "frontend_container_app_max_replicas" { type = number }
variable "container_registry_sku" { type = string }
variable "postgres_admin_username" { type = string }
variable "postgres_admin_password" {
  type      = string
  sensitive = true
}
variable "postgres_version" { type = string }
variable "postgres_sku_name" { type = string }
variable "postgres_storage_mb" { type = number }
variable "database_name" { type = string }
variable "blob_container_name" { type = string }
variable "jwt_key" {
  type      = string
  sensitive = true
}
