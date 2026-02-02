# 🚀 GitHub Actions Setup Guide

## ✅ Automated Server Monitoring with GitHub Actions

This guide explains how to set up automated server monitoring using GitHub Actions that runs at **4:00 PM IST every day**.

---

## 🌟 Why GitHub Actions?

### Advantages over Windows Task Scheduler:
- ✅ **Cloud-based** - Runs even if your computer is off
- ✅ **No local setup** - No need for administrator privileges
- ✅ **Free** - GitHub Actions is free for public repositories
- ✅ **Reliable** - GitHub's infrastructure ensures it runs on time
- ✅ **Logs** - View execution history and logs in GitHub
- ✅ **Manual trigger** - Run checks anytime with one click

---

## 📋 Setup Steps

### Step 1: Add GitHub Secrets

You need to add your sensitive credentials as GitHub Secrets:

1. **Go to your GitHub repository:**
   https://github.com/Thenilavan-G/Adhash_AutoChecker_Server

2. **Click on "Settings"** (top menu)

3. **Click on "Secrets and variables"** → **"Actions"** (left sidebar)

4. **Click "New repository secret"** and add these secrets:

   | Secret Name | Secret Value |
   |-------------|--------------|
   | `EMAIL_USER` | `thenilavan@adhashtech.com` |
   | `EMAIL_PASSWORD` | `G8sYN8MRCWpM` |
   | `EMAIL_TO` | `qateam@adhashtech.com` |
   | `SERVER_URLS` | `http://20.7.146.191:3000/,http://20.15.121.70:3000,http://20.62.109.239:3000` |

   **For each secret:**
   - Click "New repository secret"
   - Enter the "Name" (e.g., `EMAIL_USER`)
   - Enter the "Secret" (the value)
   - Click "Add secret"

### Step 2: Push the Workflow File

The workflow file has already been created at `.github/workflows/server-monitor.yml`

Just commit and push it:
```bash
git add .github/workflows/server-monitor.yml
git commit -m "Add GitHub Actions workflow for automated monitoring"
git push
```

### Step 3: Verify Workflow is Active

1. Go to your repository on GitHub
2. Click on the **"Actions"** tab
3. You should see "Server Health Monitor" workflow listed

---

## 📅 Schedule Details

### When Does It Run?

- **Schedule:** Daily at **4:00 PM IST** (10:30 AM UTC)
- **Cron Expression:** `30 10 * * *`
- **Timezone:** UTC (GitHub Actions uses UTC)
- **IST Conversion:** 10:30 AM UTC = 4:00 PM IST

### First Run

- The workflow will run automatically at the next scheduled time (4:00 PM IST)
- You can also trigger it manually (see below)

---

## 🧪 Manual Testing

### Trigger Workflow Manually:

1. Go to your repository on GitHub
2. Click on **"Actions"** tab
3. Click on **"Server Health Monitor"** workflow (left sidebar)
4. Click **"Run workflow"** button (right side)
5. Click the green **"Run workflow"** button in the dropdown
6. Wait 1-2 minutes for completion
7. Check email at **qateam@adhashtech.com**

---

## 📊 View Workflow Results

### Check Execution Status:

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Click on **"monitor-servers"** job
4. Expand each step to see detailed logs

### What You'll See:

- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install dependencies
- ✅ Install Playwright
- ✅ Create .env file
- ✅ **Run server health check** ← Main step
- ✅ Upload logs

### Check Logs:

The "Run server health check" step will show:
```
📧 Email Configuration:
   From: thenilavan@adhashtech.com
   To: qateam@adhashtech.com

🔍 Checking 3 server(s)...

Checking: http://20.7.146.191:3000/
   ⚠️ UNHEALTHY - 404 Not Found (570ms)

📧 Sending email report...
✨ Email sent successfully!
```

---

## 📧 Email Behavior

### Emails ARE Sent:

Every day at 4:00 PM IST, an email report is sent to **qateam@adhashtech.com** with:

- ✅ Summary of all servers (Healthy, Unhealthy, Down)
- ✅ Detailed status for each server
- ✅ Server addresses with ACTIVE/INACTIVE status
- ✅ Response times and error details
- ✅ Timestamp

### Email Alert Logic:

The workflow uses `check-multiple` script which sends a comprehensive report every time it runs.

If you want **smart alerts** (only when status changes), you would need to:
- Store previous state in GitHub repository
- Use `monitor-multiple` script instead
- Commit state changes back to repo

---

## 🔧 Modify the Schedule

### Change the Time:

Edit `.github/workflows/server-monitor.yml`:

```yaml
schedule:
  - cron: '30 10 * * *'  # Current: 10:30 AM UTC = 4:00 PM IST
```

**Examples:**

| Time (IST) | Time (UTC) | Cron Expression |
|------------|------------|-----------------|
| 9:00 AM IST | 3:30 AM UTC | `30 3 * * *` |
| 12:00 PM IST | 6:30 AM UTC | `30 6 * * *` |
| 4:00 PM IST | 10:30 AM UTC | `30 10 * * *` |
| 8:00 PM IST | 2:30 PM UTC | `30 14 * * *` |

**Note:** IST is UTC+5:30

### Run Multiple Times Per Day:

```yaml
schedule:
  - cron: '30 4 * * *'   # 10:00 AM IST
  - cron: '30 10 * * *'  # 4:00 PM IST
  - cron: '30 16 * * *'  # 10:00 PM IST
```

---

## 🛠️ Troubleshooting

### Workflow Not Running

**Issue:** Workflow doesn't run at scheduled time  
**Solutions:**
- Wait up to 15 minutes (GitHub Actions can have slight delays)
- Check if repository is public (private repos have limited free minutes)
- Verify workflow file is in `.github/workflows/` directory
- Check workflow is enabled in Actions tab

### No Email Received

**Issue:** Workflow runs but no email  
**Solutions:**
1. Check workflow logs for errors
2. Verify GitHub Secrets are set correctly
3. Check spam folder in qateam@adhashtech.com
4. Verify Zoho credentials are still valid

### Workflow Fails

**Issue:** Red X on workflow run  
**Solutions:**
1. Click on the failed run
2. Check which step failed
3. Read error message in logs
4. Common issues:
   - Missing GitHub Secrets
   - Invalid email credentials
   - Network timeout

---

## 📊 Monitoring Workflow Health

### Check Workflow Status:

```bash
# View recent workflow runs
gh run list --workflow=server-monitor.yml

# View specific run details
gh run view <run-id>
```

### Email Notifications for Workflow Failures:

GitHub can email you if the workflow fails:

1. Go to repository **Settings**
2. Click **Notifications** (left sidebar)
3. Enable **"Actions"** notifications
4. You'll get emails if workflow fails

---

## 💰 Cost

### GitHub Actions Pricing:

- **Public repositories:** FREE unlimited minutes ✅
- **Private repositories:** 2,000 free minutes/month

Your workflow uses approximately:
- **~2-3 minutes per run**
- **30 runs per month** (daily)
- **Total: ~60-90 minutes/month**

**Conclusion:** Completely FREE for public repos! ✅

---

## 🔄 Update Servers

### Add/Remove Servers:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click on **SERVER_URLS** secret
3. Click **Update**
4. Modify the value (comma-separated URLs)
5. Click **Update secret**

Example:
```
http://20.7.146.191:3000/,http://20.15.121.70:3000,http://20.62.109.239:3000,http://new-server:3000
```

---

## ✅ Verification Checklist

- [ ] GitHub Secrets added (EMAIL_USER, EMAIL_PASSWORD, EMAIL_TO, SERVER_URLS)
- [ ] Workflow file pushed to repository
- [ ] Workflow appears in Actions tab
- [ ] Manual test run successful
- [ ] Email received at qateam@adhashtech.com
- [ ] Workflow scheduled for 4:00 PM IST daily

---

## 🎯 Next Steps

1. **Add GitHub Secrets** (see Step 1 above)
2. **Push workflow file** to GitHub
3. **Test manually** using "Run workflow" button
4. **Check email** at qateam@adhashtech.com
5. **Wait for 4:00 PM IST** to verify automatic execution

---

**Your server monitoring is now fully automated in the cloud!** 🎉

No need for local computer to be running!
No need for Windows Task Scheduler!
Runs reliably every day at 4:00 PM IST!

