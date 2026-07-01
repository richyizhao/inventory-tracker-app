project_name            = "inventory-tracker"
environment             = "prod"
location                = "australiaeast"
api_image               = "mcr.microsoft.com/dotnet/samples:aspnetapp"
frontend_image          = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
server_container_port   = 8080
frontend_container_port = 3000

container_app_cpu                   = 0.5
container_app_memory                = "1Gi"
frontend_container_app_cpu          = 0.5
frontend_container_app_memory       = "1Gi"
container_app_min_replicas          = 1
container_app_max_replicas          = 3
frontend_container_app_min_replicas = 1
frontend_container_app_max_replicas = 2

container_registry_sku  = "Basic"
postgres_admin_username = "inventoryadmin"
postgres_version        = "16"
postgres_sku_name       = "B_Standard_B1ms"
postgres_storage_mb     = 32768
database_name           = "inventorytrackerdb"
blob_container_name     = "product-images-prod"

tags = {
  environment = "prod"
  managed-by  = "terraform"
  project     = "inventory-tracker"
}
