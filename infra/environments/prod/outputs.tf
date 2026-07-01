output "resource_group_name" {
  value = module.application_platform.resource_group_name
}

output "container_registry_name" {
  value = module.application_platform.container_registry_name
}

output "container_registry_login_server" {
  value = module.application_platform.container_registry_login_server
}

output "api_container_app_name" {
  value = module.application_platform.api_container_app_name
}

output "api_container_app_url" {
  value = module.application_platform.api_container_app_url
}

output "frontend_container_app_name" {
  value = module.application_platform.frontend_container_app_name
}

output "frontend_url" {
  value = module.application_platform.frontend_url
}

output "storage_account_name" {
  value = module.application_platform.storage_account_name
}

output "blob_container_name" {
  value = module.application_platform.blob_container_name
}

output "postgres_server_fqdn" {
  value = module.application_platform.postgres_server_fqdn
}

output "postgres_database_name" {
  value = module.application_platform.postgres_database_name
}
