# Export Local Database Script
# Run this from PowerShell in the backend directory

$env:PGPASSWORD = "password"
& "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres -h localhost -d elimu_smart_dev -F c -f elimu_smart_backup.dump

if (Test-Path "elimu_smart_backup.dump") {
    Write-Host "✓ Database exported successfully!" -ForegroundColor Green
    Write-Host "File size: $((Get-Item elimu_smart_backup.dump).Length / 1MB) MB" -ForegroundColor Cyan
} else {
    Write-Host "✗ Database export failed!" -ForegroundColor Red
}
