# Create Scheduled Task for Server Monitoring - Non-Interactive Version

$taskName = "Adhash_Server_Monitor"
$scriptPath = Join-Path $PSScriptRoot "runMonitor.bat"
$workingDir = $PSScriptRoot

Write-Host "Creating scheduled task: $taskName"
Write-Host "Script: $scriptPath"
Write-Host "Schedule: Daily at 4:00 PM IST"

# Remove existing task if it exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Removing existing task..."
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create the action
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath`"" -WorkingDirectory $workingDir

# Create the trigger - 4:00 PM daily
$trigger = New-ScheduledTaskTrigger -Daily -At "16:00"

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Create the principal
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest

# Register the task
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Daily server health check at 4PM IST. Monitors servers and sends email alerts."

Write-Host "Task created successfully!"
Write-Host ""
Write-Host "To test now, run: Start-ScheduledTask -TaskName '$taskName'"

