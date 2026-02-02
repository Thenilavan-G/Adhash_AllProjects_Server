# 🚀 Deployment Options - Choose Your Monitoring Method

You have **TWO options** for running the server monitoring at 4:00 PM IST daily:

---

## 📊 Comparison Table

| Feature | GitHub Actions ⭐ | Windows Task Scheduler |
|---------|-------------------|------------------------|
| **Setup Difficulty** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Moderate |
| **Requires Local Computer** | ❌ No | ✅ Yes (must be on) |
| **Requires Admin Rights** | ❌ No | ✅ Yes |
| **Cloud-based** | ✅ Yes | ❌ No |
| **Cost** | 💰 FREE | 💰 FREE |
| **Reliability** | ⭐⭐⭐⭐⭐ Very High | ⭐⭐⭐ Medium |
| **View Logs** | ✅ Easy (GitHub UI) | ⭐⭐ Harder |
| **Manual Trigger** | ✅ One click | ⭐⭐ Multiple steps |
| **Email Alerts** | ✅ Yes | ✅ Yes |
| **Internet Required** | ✅ Yes | ✅ Yes |
| **Setup Time** | 5 minutes | 10 minutes |

---

## 🌟 Option 1: GitHub Actions (RECOMMENDED) ⭐

### ✅ Advantages:
- **Cloud-based** - Runs even if your computer is off
- **No admin rights needed** - Just add GitHub Secrets
- **Easy to manage** - View logs and trigger runs from GitHub UI
- **Reliable** - GitHub's infrastructure ensures it runs on time
- **Free** - Unlimited for public repositories
- **Already created** - Workflow file is ready to use

### ❌ Disadvantages:
- Requires GitHub account (you already have one)
- Runs in cloud (not local)

### 📋 Setup Steps:

1. **Add GitHub Secrets** (5 minutes):
   - Go to: https://github.com/Thenilavan-G/Adhash_AutoChecker_Server/settings/secrets/actions
   - Add these secrets:
     - `EMAIL_USER` = `thenilavan@adhashtech.com`
     - `EMAIL_PASSWORD` = `G8sYN8MRCWpM`
     - `EMAIL_TO` = `qateam@adhashtech.com`
     - `SERVER_URLS` = `http://20.7.146.191:3000/,http://20.15.121.70:3000,http://20.62.109.239:3000`

2. **Push workflow file**:
   ```bash
   git add .github/workflows/server-monitor.yml
   git commit -m "Add GitHub Actions workflow"
   git push
   ```

3. **Test manually**:
   - Go to Actions tab
   - Click "Run workflow"
   - Check email

4. **Done!** It will run automatically at 4:00 PM IST daily

### 📖 Full Guide:
See `GITHUB_ACTIONS_SETUP.md` for detailed instructions.

---

## 💻 Option 2: Windows Task Scheduler

### ✅ Advantages:
- **Local control** - Runs on your computer
- **No cloud dependency** - Everything runs locally
- **Familiar** - Standard Windows feature

### ❌ Disadvantages:
- **Computer must be on** - Won't run if computer is off/sleeping
- **Requires admin rights** - Must run PowerShell as Administrator
- **Less reliable** - Depends on your computer being available
- **Harder to debug** - Logs are in Task Scheduler

### 📋 Setup Steps:

1. **Run PowerShell as Administrator**:
   - Right-click PowerShell
   - Select "Run as Administrator"

2. **Navigate to project**:
   ```powershell
   cd "d:\Thenilavan\Automation\eclipse-workspace\AutoChecker_Server"
   ```

3. **Create the task**:
   ```powershell
   .\createTask.ps1
   ```

4. **Test the task**:
   ```powershell
   Start-ScheduledTask -TaskName "Adhash_Server_Monitor"
   ```

5. **Verify**:
   - Open Task Scheduler (`taskschd.msc`)
   - Find "Adhash_Server_Monitor"
   - Check it's enabled

### 📖 Full Guide:
See `SCHEDULED_TASK_SETUP.md` for detailed instructions.

---

## 🎯 Which Should You Choose?

### Choose GitHub Actions if:
- ✅ You want **cloud-based** monitoring
- ✅ You want it to run **even when computer is off**
- ✅ You want **easy management** and logs
- ✅ You don't want to deal with **admin rights**
- ✅ You want **maximum reliability**

### Choose Windows Task Scheduler if:
- ✅ You prefer **local control**
- ✅ Your computer is **always on** at 4 PM
- ✅ You have **admin rights**
- ✅ You don't want to use cloud services

---

## 💡 Recommendation

**We recommend GitHub Actions** because:

1. **More Reliable** - Doesn't depend on your computer being on
2. **Easier Setup** - No admin rights needed
3. **Better Logs** - Easy to view in GitHub UI
4. **Free** - No cost for public repositories
5. **Already Created** - Workflow file is ready to use

---

## 🔄 Can I Use Both?

Yes! You can use both methods simultaneously:
- **GitHub Actions** - Primary (cloud-based, 4:00 PM IST)
- **Windows Task Scheduler** - Backup (local, 4:00 PM IST)

This provides **redundancy** - if one fails, the other still runs.

---

## 📧 Email Behavior (Both Options)

Both options send the same email report:

### Email Content:
- **To:** qateam@adhashtech.com
- **From:** thenilavan@adhashtech.com
- **Subject:** "🚨 Server Alert: X Down, Y Unhealthy" or "✅ All Servers Healthy"
- **Body:**
  - Summary table (Healthy, Unhealthy, Down counts)
  - Detailed status for each server
  - Server addresses with ACTIVE/INACTIVE status
  - Response times and error details
  - Timestamp

### When Emails Are Sent:
- **Daily at 4:00 PM IST** - Comprehensive report
- **Shows current status** of all servers
- **Includes all servers** regardless of status

---

## 🧪 Testing Both Options

### Test GitHub Actions:
1. Go to: https://github.com/Thenilavan-G/Adhash_AutoChecker_Server/actions
2. Click "Server Health Monitor"
3. Click "Run workflow"
4. Wait 1-2 minutes
5. Check email

### Test Windows Task Scheduler:
1. Open PowerShell as Administrator
2. Run: `Start-ScheduledTask -TaskName "Adhash_Server_Monitor"`
3. Wait 1-2 minutes
4. Check email

---

## 📋 Setup Checklist

### GitHub Actions Setup:
- [ ] Add GitHub Secrets (EMAIL_USER, EMAIL_PASSWORD, EMAIL_TO, SERVER_URLS)
- [ ] Push workflow file to repository
- [ ] Test manually using "Run workflow" button
- [ ] Verify email received
- [ ] Confirm workflow is scheduled

### Windows Task Scheduler Setup:
- [ ] Run PowerShell as Administrator
- [ ] Execute createTask.ps1
- [ ] Verify task created in Task Scheduler
- [ ] Test task manually
- [ ] Verify email received
- [ ] Confirm task is enabled

---

## 🎯 Quick Start Guide

### For GitHub Actions (Recommended):
```bash
# 1. Add secrets on GitHub (see GITHUB_ACTIONS_SETUP.md)
# 2. Push workflow file
git add .github/workflows/server-monitor.yml GITHUB_ACTIONS_SETUP.md
git commit -m "Add GitHub Actions workflow"
git push

# 3. Test on GitHub Actions tab
# 4. Done!
```

### For Windows Task Scheduler:
```powershell
# 1. Run PowerShell as Administrator
# 2. Navigate to project
cd "d:\Thenilavan\Automation\eclipse-workspace\AutoChecker_Server"

# 3. Create task
.\createTask.ps1

# 4. Test task
Start-ScheduledTask -TaskName "Adhash_Server_Monitor"

# 5. Done!
```

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `GITHUB_ACTIONS_SETUP.md` | Complete GitHub Actions guide |
| `SCHEDULED_TASK_SETUP.md` | Complete Windows Task Scheduler guide |
| `DEPLOYMENT_GUIDE.md` | General deployment information |
| `TEST_SCENARIOS.md` | Email alert scenarios |

---

**Choose the option that works best for you!** 🚀

We recommend **GitHub Actions** for maximum reliability and ease of use.

