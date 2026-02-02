# 🚀 Quick Start Guide

## ✅ Everything is Ready!

Your server monitoring system is **fully configured** and **pushed to GitHub**!

**Repository:** https://github.com/Thenilavan-G/Adhash_AutoChecker_Server

---

## 🎯 Choose Your Deployment Method

You have **TWO options** for automated monitoring at 4:00 PM IST daily:

---

## ⭐ Option 1: GitHub Actions (RECOMMENDED)

### Why Choose This?
- ✅ **Cloud-based** - Runs even if your computer is off
- ✅ **No admin rights** needed
- ✅ **Easy to manage** from GitHub UI
- ✅ **Free** for public repositories
- ✅ **More reliable** than local scheduling

### Setup (5 minutes):

#### Step 1: Add GitHub Secrets

Go to: https://github.com/Thenilavan-G/Adhash_AutoChecker_Server/settings/secrets/actions

Click "New repository secret" and add these **4 secrets**:

| Secret Name | Secret Value |
|-------------|--------------|
| `EMAIL_USER` | `thenilavan@adhashtech.com` |
| `EMAIL_PASSWORD` | `G8sYN8MRCWpM` |
| `EMAIL_TO` | `qateam@adhashtech.com` |
| `SERVER_URLS` | `http://20.7.146.191:3000/,http://20.15.121.70:3000,http://20.62.109.239:3000` |

#### Step 2: Workflow is Already Pushed!

The workflow file is already in the repository at `.github/workflows/server-monitor.yml`

It's configured to run at **4:00 PM IST (10:30 AM UTC)** daily.

#### Step 3: Test It Now!

1. Go to: https://github.com/Thenilavan-G/Adhash_AutoChecker_Server/actions
2. Click on **"Server Health Monitor"** (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Click the green **"Run workflow"** button
5. Wait 1-2 minutes
6. Check email at **qateam@adhashtech.com**

#### Step 4: Done! ✅

The workflow will now run automatically every day at 4:00 PM IST!

📖 **Full Guide:** See `GITHUB_ACTIONS_SETUP.md`

---

## 💻 Option 2: Windows Task Scheduler

### Why Choose This?
- ✅ **Local control** - Runs on your computer
- ✅ **No cloud dependency**
- ⚠️ Requires computer to be on at 4 PM
- ⚠️ Requires admin rights

### Setup (10 minutes):

#### Step 1: Run PowerShell as Administrator

1. Press `Win + X`
2. Select **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**

#### Step 2: Navigate to Project

```powershell
cd "d:\Thenilavan\Automation\eclipse-workspace\AutoChecker_Server"
```

#### Step 3: Create the Scheduled Task

```powershell
.\createTask.ps1
```

You should see:
```
✅ Task Created Successfully!
```

#### Step 4: Test the Task

```powershell
Start-ScheduledTask -TaskName "Adhash_Server_Monitor"
```

Wait 1-2 minutes, then check email at **qateam@adhashtech.com**

#### Step 5: Verify in Task Scheduler

1. Press `Win + R`
2. Type `taskschd.msc` and press Enter
3. Find **"Adhash_Server_Monitor"** in the list
4. Verify it's enabled and scheduled for 4:00 PM

#### Step 6: Done! ✅

The task will now run automatically every day at 4:00 PM IST!

📖 **Full Guide:** See `SCHEDULED_TASK_SETUP.md`

---

## 📊 Comparison

| Feature | GitHub Actions | Windows Task Scheduler |
|---------|----------------|------------------------|
| **Computer must be on** | ❌ No | ✅ Yes |
| **Admin rights needed** | ❌ No | ✅ Yes |
| **Setup time** | 5 min | 10 min |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **View logs** | Easy | Harder |
| **Cost** | FREE | FREE |

📖 **Full Comparison:** See `DEPLOYMENT_OPTIONS.md`

---

## 🧪 Manual Testing (Both Options)

Want to test the monitoring manually? Run:

```bash
npm run check-multiple
```

This will:
- Check all 3 servers immediately
- Send email report to qateam@adhashtech.com
- Show you what the daily report looks like

---

## 📧 What You'll Receive

### Email Details:
- **To:** qateam@adhashtech.com
- **From:** thenilavan@adhashtech.com (Zoho SMTP)
- **When:** Daily at 4:00 PM IST
- **Subject:** "🚨 Server Alert: X Down, Y Unhealthy" or "✅ All Servers Healthy"

### Email Content:
- ✅ Summary table (Healthy, Unhealthy, Down counts)
- ✅ Detailed status for each server
- ✅ Server addresses with **ACTIVE/INACTIVE** status
- ✅ Response times and error details
- ✅ Timestamp

---

## 🎯 Monitored Servers

1. **http://20.7.146.191:3000/** - Currently ACTIVE (UNHEALTHY - 404)
2. **http://20.15.121.70:3000** - Currently ACTIVE (UNHEALTHY - 404)
3. **http://20.62.109.239:3000** - Currently DOWN

---

## ✅ Critical Guarantee

### Emails WILL Be Sent When:

1. ✅ **Any ACTIVE server goes DOWN**
   - Example: Server 1 or 2 (currently returning 404) stops responding
   - Email: "🚨 Server DOWN Alert" with "INACTIVE" status

2. ✅ **Any HEALTHY server becomes UNHEALTHY**
   - Server starts returning 4xx/5xx errors

3. ✅ **Any HEALTHY server goes DOWN**

### Emails Will NOT Be Sent When:
- ❌ Server stays in same bad state (prevents spam)
- ❌ Server recovers (good news, just logged)

📖 **Full Scenarios:** See `TEST_SCENARIOS.md`

---

## 📂 Documentation

| Document | Purpose |
|----------|---------|
| **`QUICK_START.md`** | **👈 YOU ARE HERE** - Quick setup guide |
| `GITHUB_ACTIONS_SETUP.md` | Detailed GitHub Actions guide |
| `SCHEDULED_TASK_SETUP.md` | Detailed Windows Task Scheduler guide |
| `DEPLOYMENT_OPTIONS.md` | Compare both deployment methods |
| `TEST_SCENARIOS.md` | Email alert scenarios |
| `DEPLOYMENT_GUIDE.md` | General deployment information |
| `SETUP_COMPLETE.md` | Initial setup documentation |
| `README.md` | General usage guide |

---

## 🆘 Need Help?

### GitHub Actions Not Working?
- Check GitHub Secrets are added correctly
- View workflow logs in Actions tab
- See `GITHUB_ACTIONS_SETUP.md` troubleshooting section

### Windows Task Scheduler Not Working?
- Ensure you ran PowerShell as Administrator
- Check task is enabled in Task Scheduler
- See `SCHEDULED_TASK_SETUP.md` troubleshooting section

### No Email Received?
- Check spam folder
- Verify email credentials in `.env` or GitHub Secrets
- Test manually: `npm run check-multiple`

---

## 🎉 You're All Set!

Choose your preferred method and follow the steps above.

**We recommend GitHub Actions** for maximum reliability and ease of use!

---

**Happy Monitoring!** 🚀

