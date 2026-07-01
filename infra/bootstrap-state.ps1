param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory = $true)]
    [string]$StorageAccountName,

    [string]$Location = "australiaeast",

    [string]$ContainerName = "tfstate",

    [string]$AzureConfigDir
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    throw "Azure CLI (az) is required but was not found on PATH."
}

if ($AzureConfigDir) {
    $env:AZURE_CONFIG_DIR = $AzureConfigDir
    Write-Host "Using AZURE_CONFIG_DIR=$env:AZURE_CONFIG_DIR"
}
elseif ($env:AZURE_CONFIG_DIR) {
    Write-Host "Using AZURE_CONFIG_DIR=$env:AZURE_CONFIG_DIR"
}
else {
    Write-Host "Using default Azure CLI config directory."
}

try {
    $account = az account show --output json | ConvertFrom-Json
}
catch {
    if (-not $AzureConfigDir -and -not $env:AZURE_CONFIG_DIR) {
        $repoAzureConfigDir = Join-Path (Get-Location) ".azure"
        if (Test-Path $repoAzureConfigDir) {
            $env:AZURE_CONFIG_DIR = $repoAzureConfigDir
            Write-Host "Falling back to repo Azure config directory: $env:AZURE_CONFIG_DIR"
            $account = az account show --output json | ConvertFrom-Json
        }
        else {
            throw "Azure CLI is not logged in. Run 'az login' and try again."
        }
    }
    else {
        throw "Azure CLI is not logged in for AZURE_CONFIG_DIR=$env:AZURE_CONFIG_DIR. Run 'az login' and try again."
    }
}

if (-not $account) {
    throw "Azure CLI is not logged in. Run 'az login' and try again."
}

Write-Host "Using subscription: $($account.name) ($($account.id))"

az group create `
  --name $ResourceGroupName `
  --location $Location | Out-Null

az storage account create `
  --name $StorageAccountName `
  --resource-group $ResourceGroupName `
  --location $Location `
  --sku Standard_LRS `
  --encryption-services blob | Out-Null

$accountKey = az storage account keys list `
  --resource-group $ResourceGroupName `
  --account-name $StorageAccountName `
  --query "[0].value" `
  --output tsv

az storage container create `
  --name $ContainerName `
  --account-name $StorageAccountName `
  --account-key $accountKey | Out-Null

Write-Host ""
Write-Host "Terraform state backend created."
Write-Host "Resource group: $ResourceGroupName"
Write-Host "Storage account: $StorageAccountName"
Write-Host "Container: $ContainerName"
Write-Host ""
Write-Host "GitHub Environment Variables"
Write-Host "AZURE_TENANT_ID=$($account.tenantId)"
Write-Host "AZURE_SUBSCRIPTION_ID=$($account.id)"
Write-Host "TFSTATE_RESOURCE_GROUP=$ResourceGroupName"
Write-Host "TFSTATE_STORAGE_ACCOUNT=$StorageAccountName"
Write-Host "TFSTATE_CONTAINER=$ContainerName"
Write-Host ""
Write-Host "GitHub Environment Secrets"
Write-Host "AZURE_CLIENT_ID=<your GitHub Actions Azure app client ID>"
Write-Host "TFSTATE_ACCESS_KEY=$accountKey"
Write-Host "TF_VAR_postgres_admin_password=<set per environment>"
Write-Host "TF_VAR_jwt_key=<set per environment>"
