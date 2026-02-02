# 🚀 Deployment Guide - Server Monitoring System

## ✅ Setup Complete

Your server monitoring system has been successfully created and pushed to GitHub!

**Repository:** https://github.com/Thenilavan-G/Adhash_AutoChecker_Server

---

## 📋 System Overview

### Monitored Servers:
1. **http://20.7.146.191:3000/** - Currently ACTIVE (UNHEALTHY - 404)
2. **http://20.15.121.70:3000** - Currently ACTIVE (UNHEALTHY - 404)
3. **http://20.62.109.239:3000** - Currently DOWN

### Email Configuration:
- **From:** thenilavan@adhashtech.com (Zoho SMTP)
- **To:** qateam@adhashtech.com
- **Status:** ✅ Verified and Working

---

## 🎯 Critical Guarantee

### ✅ Email Alerts WILL Be Sent When:

1. **Any ACTIVE server goes DOWN** ✅
   - Example: Server 1 or 2 (currently returning 404) stops responding
   - Email Subject: "🚨 Server DOWN Alert - [server url]"
   - Email Body: Shows "INACTIVE" status

2. **Any HEALTHY server becomes UNHEALTHY** ✅
   - Example: Server starts returning 4xx/5xx errors
   - Email Subject: "⚠️ Server Unhealthy Alert - [server url]"

3. **Any HEALTHY server goes DOWN** ✅
   - Email Subject: "🚨 Server DOWN Alert - [server url]"

### ❌ Email Alerts Will NOT Be Sent When:
- Server stays in same bad state (prevents spam)
- Server recovers (good news, just logged)

---

## 📅 Schedule Setup - 4:00 PM IST Daily

### Step 1: Run PowerShell as Administrator

Right-click on PowerShell and select **"Run as Administrator"**

### Step 2: Navigate to Project Directory

```powershell
cd "d:\Thenilavan\Automation\eclipse-workspace\AutoChecker_Server"
```

### Step 3: Create the Scheduled Task

```powershell
.\createTask.ps1
```

This creates a task named **"Adhash_Server_Monitor"** that runs daily at 4:00 PM IST.

### Step 4: Verify Task Creation

```powershell
Get-ScheduledTask -TaskName "Adhash_Server_Monitor"
```

You should see the task details.

### Step 5: Test the Task Now

```powershell
Start-ScheduledTask -TaskName "Adhash_Server_Monitor"
```

Check your email at **qateam@adhashtech.com** within 1-2 minutes.

---

## 🧪 Manual Testing

### Test Once (Recommended for Testing)
```bash
npm run check-multiple
```

This will:
- Check all 3 servers once
- Send a comprehensive email report
- Exit after completion

### Continuous Monitoring (For Development)
```bash
npm run monitor-multiple
```

This will:
- Check all servers every 5 minutes
- Send emails only when status changes
- Run continuously until stopped (Ctrl+C)

---

## 📧 Email Report Format

Each daily report includes:

### Summary Section:
- ✅ Healthy servers count
- ⚠️ Unhealthy servers count
- 🚨 Down servers count

### Detailed Status for Each Server:
- Server URL
- Status: ACTIVE or INACTIVE
- Status Code (if responding)
- Response Time (if responding)
- Error details (if down)
- Timestamp

---

## 🔍 Verify Everything Works

### Checklist:

- [x] ✅ Code pushed to GitHub
- [x] ✅ Email configuration verified (Zoho SMTP)
- [x] ✅ All 3 servers configured
- [x] ✅ Email alert logic confirmed (active servers going down WILL send email)
- [ ] ⏳ Scheduled task created (requires admin privileges)
- [ ] ⏳ Task tested manually
- [ ] ⏳ Email received at qateam@adhashtech.com

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `monitorMultipleServers.ts` | Continuous monitoring script |
| `checkMultipleServers.ts` | One-time check script (used by scheduled task) |
| `runMonitor.bat` | Batch file to run the check (used by Task Scheduler) |
| `createTask.ps1` | PowerShell script to create scheduled task |
| `.env` | Configuration (email credentials, server URLs) |
| `SCHEDULED_TASK_SETUP.md` | Detailed scheduled task guide |
| `TEST_SCENARIOS.md` | Email alert scenarios documentation |

---

## 🛠️ Troubleshooting

### Scheduled Task Not Created
**Issue:** "Access is denied" error  
**Solution:** Run PowerShell as Administrator

### No Email Received
**Issue:** Email not arriving  
**Solution:**
1. Check `.env` file has correct credentials
2. Verify internet connection
3. Check spam folder
4. Run `npm run check-multiple` manually to test

### Task Runs But Fails
**Issue:** Task shows error in Task Scheduler  
**Solution:**
1. Verify npm dependencies: `npm install`
2. Check Task Scheduler history for error details
3. Test manually: `.\runMonitor.bat`

---

## 🔄 Update Server List

To add/remove servers, edit `.env` file:

```env
SERVER_URLS=http://20.7.146.191:3000/,http://20.15.121.70:3000,http://20.62.109.239:3000,http://new-server:3000
```

Separate multiple URLs with commas.

---

## 📊 View Task History

1. Open Task Scheduler (`Win + R` → `taskschd.msc`)
2. Find "Adhash_Server_Monitor"
3. Click "History" tab
4. View all execution logs

---

## 🎯 Next Steps

1. **Create the scheduled task** (requires admin privileges):
   ```powershell
   # Run PowerShell as Administrator
   cd "d:\Thenilavan\Automation\eclipse-workspace\AutoChecker_Server"
   .\createTask.ps1
   ```

2. **Test the task manually**:
   ```powershell
   Start-ScheduledTask -TaskName "Adhash_Server_Monitor"
   ```

3. **Check your email** at qateam@adhashtech.com

4. **Wait for 4:00 PM IST** to verify automatic execution

---

## ✅ Success Criteria

- ✅ Task runs daily at 4:00 PM IST
- ✅ Email report sent to qateam@adhashtech.com
- ✅ Email shows all server statuses (ACTIVE/INACTIVE)
- ✅ If any ACTIVE server goes DOWN, email is sent immediately
- ✅ No duplicate emails for servers that stay in same state

---

**Your server monitoring system is ready for production!** 🎉

For detailed information, see:
- `SCHEDULED_TASK_SETUP.md` - Scheduled task details
- `TEST_SCENARIOS.md` - Email alert scenarios
- `SETUP_COMPLETE.md` - Initial setup documentation
- `README.md` - General usage guide

