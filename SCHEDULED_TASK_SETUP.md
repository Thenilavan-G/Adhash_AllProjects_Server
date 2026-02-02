# 📅 Scheduled Task Setup Guide

## ✅ Automated Daily Server Monitoring at 4:00 PM IST

This guide explains how to set up the server monitoring to run automatically every day at 4:00 PM IST.

---

## 🚀 Quick Setup (Recommended)

### Step 1: Run the Setup Script

**Right-click** on `setupScheduledTask.ps1` and select **"Run with PowerShell"**

OR

Open PowerShell as Administrator and run:
```powershell
cd "d:\Thenilavan\Automation\eclipse-workspace\AutoChecker_Server"
.\setupScheduledTask.ps1
```

### Step 2: Follow the Prompts

The script will:
- ✅ Create a scheduled task named "Adhash_Server_Monitor"
- ✅ Schedule it to run daily at 4:00 PM IST
- ✅ Ask if you want to test it immediately

---

## 📋 What the Scheduled Task Does

Every day at **4:00 PM IST**, the task will:

1. **Check all 3 servers:**
   - http://20.7.146.191:3000/
   - http://20.15.121.70:3000
   - http://20.62.109.239:3000

2. **Send email report to:** qateam@adhashtech.com

3. **Email includes:**
   - Summary of all servers (Healthy, Unhealthy, Down)
   - Detailed status for each server
   - Server addresses with ACTIVE/INACTIVE status
   - Response times and error details

---

## 🔍 Verify the Task is Created

### Option 1: Using Task Scheduler GUI
1. Press `Win + R`
2. Type `taskschd.msc` and press Enter
3. Look for **"Adhash_Server_Monitor"** in the Task Scheduler Library
4. Double-click to view details

### Option 2: Using PowerShell
```powershell
Get-ScheduledTask -TaskName "Adhash_Server_Monitor"
```

---

## 🧪 Test the Task Manually

### Option 1: Using Task Scheduler GUI
1. Open Task Scheduler (`taskschd.msc`)
2. Find "Adhash_Server_Monitor"
3. Right-click → **Run**

### Option 2: Using PowerShell
```powershell
Start-ScheduledTask -TaskName "Adhash_Server_Monitor"
```

After running, check your email at **qateam@adhashtech.com** within 1-2 minutes.

---

## 📧 Email Alert Behavior

### ✅ Emails ARE Sent When:
- Any **ACTIVE** server (healthy or unhealthy) goes **DOWN**
- Any **HEALTHY** server becomes **UNHEALTHY**
- First check detects a problem

### ❌ Emails are NOT Sent When:
- Server stays in the same bad state (prevents spam)
- Server recovers (good news, just logged)

---

## ⚙️ Modify the Schedule

### Change the Time
To run at a different time, edit the trigger in Task Scheduler:
1. Open Task Scheduler
2. Find "Adhash_Server_Monitor"
3. Right-click → Properties
4. Go to "Triggers" tab
5. Edit the trigger and change the time

### Change to Multiple Times Per Day
To run multiple times (e.g., every 6 hours):
1. Open Task Scheduler
2. Find "Adhash_Server_Monitor"
3. Right-click → Properties
4. Go to "Triggers" tab
5. Add new triggers for different times

---

## 🗑️ Remove the Scheduled Task

### Using PowerShell:
```powershell
Unregister-ScheduledTask -TaskName "Adhash_Server_Monitor" -Confirm:$false
```

### Using Task Scheduler GUI:
1. Open Task Scheduler (`taskschd.msc`)
2. Find "Adhash_Server_Monitor"
3. Right-click → Delete

---

## 📝 Task Configuration Details

| Setting | Value |
|---------|-------|
| **Task Name** | Adhash_Server_Monitor |
| **Schedule** | Daily at 4:00 PM IST |
| **Script** | runMonitor.bat |
| **Working Directory** | d:\Thenilavan\Automation\eclipse-workspace\AutoChecker_Server |
| **Run Level** | Highest privileges |
| **Run on Battery** | Yes |
| **Start if Missed** | Yes |

---

## 🔧 Troubleshooting

### Task doesn't run at scheduled time
1. Check if the computer is on at 4:00 PM
2. Verify the task is enabled in Task Scheduler
3. Check "Last Run Result" in Task Scheduler (should be 0x0 for success)

### No email received
1. Run the task manually to test
2. Check `.env` file has correct email credentials
3. Verify internet connection
4. Check spam folder in qateam@adhashtech.com

### Task runs but fails
1. Open Task Scheduler
2. Find "Adhash_Server_Monitor"
3. Check "Last Run Result" and "History" tab
4. Verify all npm dependencies are installed: `npm install`

---

## 📊 View Task History

1. Open Task Scheduler
2. Find "Adhash_Server_Monitor"
3. Click on "History" tab
4. View all execution logs

---

## ✅ Confirmation Checklist

- [ ] Scheduled task created successfully
- [ ] Task appears in Task Scheduler
- [ ] Tested task manually
- [ ] Received test email at qateam@adhashtech.com
- [ ] Verified task is enabled
- [ ] Verified task schedule is correct (4:00 PM IST)

---

## 🎯 Next Steps

1. **Test the task now** to ensure it works
2. **Check your email** at qateam@adhashtech.com
3. **Wait for 4:00 PM IST** to verify automatic execution
4. **Monitor the task history** in Task Scheduler

---

**The server monitoring is now fully automated!** 🎉

