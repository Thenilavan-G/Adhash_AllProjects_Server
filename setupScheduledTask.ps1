# PowerShell Script to Create Scheduled Task for Server Monitoring
# This creates a task that runs at 4:00 PM IST every day

$taskName = "Adhash_Server_Monitor"
$scriptPath = Join-Path $PSScriptRoot "runMonitor.bat"
$workingDir = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Scheduled Task" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Task Name: $taskName" -ForegroundColor Yellow
Write-Host "Script: $scriptPath" -ForegroundColor Yellow
Write-Host "Schedule: Daily at 4:00 PM IST" -ForegroundColor Yellow
Write-Host "Working Directory: $workingDir" -ForegroundColor Yellow
Write-Host ""

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "Task already exists. Removing old task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Old task removed." -ForegroundColor Green
}

# Create the action (what to run)
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath`"" -WorkingDirectory $workingDir

# Create the trigger (when to run) - 4:00 PM IST daily
$trigger = New-ScheduledTaskTrigger -Daily -At "16:00"

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Create the principal (run with highest privileges)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest

# Register the task
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Daily server health check at 4PM IST. Monitors servers and sends email alerts if any server goes down."
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Scheduled Task Created Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Task Details:" -ForegroundColor Cyan
    Write-Host "  - Name: $taskName" -ForegroundColor White
    Write-Host "  - Schedule: Daily at 4:00 PM IST" -ForegroundColor White
    Write-Host "  - Script: $scriptPath" -ForegroundColor White
    Write-Host ""
    Write-Host "To view the task:" -ForegroundColor Yellow
    Write-Host "  1. Open Task Scheduler (taskschd.msc)" -ForegroundColor White
    Write-Host "  2. Look for '$taskName' in Task Scheduler Library" -ForegroundColor White
    Write-Host ""
    Write-Host "To test the task now:" -ForegroundColor Yellow
    Write-Host "  Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
    Write-Host ""
    Write-Host "To remove the task:" -ForegroundColor Yellow
    Write-Host "  Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ Error Creating Scheduled Task" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run this script as Administrator." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Ask if user wants to test the task now
Write-Host ""
$response = Read-Host "Would you like to test the task now? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host ""
    Write-Host "Running task now..." -ForegroundColor Cyan
    Start-ScheduledTask -TaskName $taskName
    Write-Host "Task started! Check your email at qateam@adhashtech.com" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""

