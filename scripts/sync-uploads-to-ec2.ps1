# Copy local product uploads to EC2 (run from your PC, Git Bash or PowerShell)
# Usage: adjust $KeyPath and $Ec2Host if needed

$KeyPath = "$PSScriptRoot\..\..\tuktuk-api.pem"
$Ec2Host = "ubuntu@13.60.211.231"
$LocalUploads = "$PSScriptRoot\..\uploads"
$RemotePath = "/home/ubuntu/nexcart-api/"

if (-not (Test-Path $LocalUploads)) {
    Write-Error "Local uploads folder not found: $LocalUploads"
    exit 1
}

Write-Host "Syncing uploads to EC2..."
scp -r "$LocalUploads" "${Ec2Host}:${RemotePath}"
Write-Host "Done. Images should be at ${RemotePath}uploads/products/ on EC2"
