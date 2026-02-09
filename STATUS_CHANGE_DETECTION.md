# 🔔 Status Change Detection Feature

## ✨ New Feature: Smart Email Alerts

The server monitoring system now includes **intelligent status change detection** that sends email alerts **only when server status changes**, not on every check!

---

## 🎯 What's New?

### 1. **Hourly Monitoring** ⏰
- Runs **every 1 hour** (instead of once daily)
- Cron schedule: `0 * * * *` (every hour at minute 0)
- Continuous monitoring 24/7

### 2. **Status Change Detection** 🔍
- Tracks previous server status
- Compares current status with previous status
- Detects 3 types of changes:
  - **🚨 CRITICAL**: Server went down (healthy/unhealthy → down)
  - **⚠️ DEGRADED**: Server became unhealthy (healthy → unhealthy)
  - **✅ IMPROVED**: Server recovered (down/unhealthy → healthy)

### 3. **Smart Email Alerts** 📧
- **Sends email ONLY when status changes**
- **No email** if all servers maintain same status
- Reduces email noise significantly
- Highlights what changed in the email

---

## 📊 How It Works

### **Status Tracking:**

1. **First Run**: 
   - Checks all servers
   - Saves current status to `previous-status.json`
   - **No email sent** (no previous status to compare)

2. **Subsequent Runs**:
   - Loads previous status from file
   - Checks all servers
   - Compares current vs previous status
   - Detects changes
   - **Sends email ONLY if changes detected**
   - Saves new status for next run

### **Status Types:**

| Status | Description | Example |
|--------|-------------|---------|
| **healthy** | Server responding with 200-399 status code | 200 OK, 301 Redirect |
| **unhealthy** | Server responding with 400+ status code | 404 Not Found, 500 Error |
| **down** | Server not responding (timeout/connection refused) | Timeout, Connection refused |

### **Change Types:**

| Change Type | Description | Email Priority |
|-------------|-------------|----------------|
| **🚨 CRITICAL** | healthy/unhealthy → down | Highest (Red alert) |
| **⚠️ DEGRADED** | healthy → unhealthy | Medium (Orange warning) |
| **✅ IMPROVED** | down/unhealthy → healthy | Low (Green success) |

---

## 📧 Email Behavior

### **When Email is Sent:**

✅ **Server goes down** (was healthy/unhealthy, now down)
✅ **Server becomes unhealthy** (was healthy, now unhealthy)
✅ **Server recovers** (was down/unhealthy, now healthy)
✅ **Any status change detected**

### **When Email is NOT Sent:**

❌ **No status changes** (all servers maintain same status)
❌ **First run** (no previous status to compare)

### **Email Content:**

When status changes are detected, the email includes:

1. **Subject Line** - Indicates severity:
   - `🚨 CRITICAL: X Server(s) Down!`
   - `⚠️ WARNING: X Server(s) Degraded`
   - `✅ Server Status Improved: X Change(s)`

2. **Status Changes Section** - Highlighted at top:
   - Server name
   - Previous status → Current status
   - Change type (CRITICAL/DEGRADED/IMPROVED)

3. **Full Server Report** - Complete status of all servers
4. **HTML Report Attachment** - Beautiful visual report

---

## ⚙️ Configuration

### **Environment Variables:**

```env
# Send email only when server status changes (true/false)
SEND_ONLY_ON_CHANGE=true

# Check interval (for reference, actual schedule in GitHub Actions)
CHECK_INTERVAL_MINUTES=60
```

### **GitHub Actions Schedule:**

```yaml
schedule:
  - cron: '0 * * * *'  # Every hour at minute 0
```

---

## 📂 Files

### **New Files:**

- `previous-status.json` - Stores previous server status (auto-generated, git-ignored)

### **Modified Files:**

- `checkMultipleServers.ts` - Added status change detection logic
- `.github/workflows/server-monitor.yml` - Updated to run hourly with caching
- `.env` - Added `SEND_ONLY_ON_CHANGE=true`
- `.gitignore` - Added `previous-status.json`

---

## 🧪 Testing

### **Test Scenario 1: First Run**
```bash
npm run check-multiple
```
**Expected:**
- ✅ Checks all servers
- ✅ Saves status to `previous-status.json`
- ✅ No email sent (first run)
- ✅ Message: "No status changes - skipping email"

### **Test Scenario 2: No Changes**
```bash
npm run check-multiple  # Run again immediately
```
**Expected:**
- ✅ Loads previous status
- ✅ Checks all servers
- ✅ No changes detected
- ✅ No email sent
- ✅ Message: "No status changes - skipping email"

### **Test Scenario 3: Status Change**
1. Stop a server that was running
2. Run: `npm run check-multiple`

**Expected:**
- ✅ Loads previous status
- ✅ Detects server went down
- ✅ Shows: "🔔 Status Changes Detected"
- ✅ **Email sent** with change highlighted
- ✅ Subject: "🚨 CRITICAL: 1 Server(s) Down!"

---

## 📈 Benefits

### **For QA Team:**
- ✅ **Reduced email noise** - Only get alerts when something changes
- ✅ **Immediate notifications** - Know within 1 hour when server status changes
- ✅ **Clear change tracking** - See exactly what changed
- ✅ **Historical tracking** - Status saved between runs

### **For DevOps:**
- ✅ **Faster incident response** - Notified immediately when server goes down
- ✅ **Recovery confirmation** - Get notified when server comes back up
- ✅ **Degradation alerts** - Know when server starts returning errors

### **For Management:**
- ✅ **Less inbox clutter** - No hourly emails if everything is stable
- ✅ **Important alerts only** - Only see emails when action needed
- ✅ **Clear status changes** - Easy to understand what happened

---

## 🔄 Workflow

```
Hour 1: Check servers → Save status → No previous status → No email
Hour 2: Check servers → Compare with Hour 1 → No changes → No email
Hour 3: Check servers → Compare with Hour 2 → No changes → No email
Hour 4: Check servers → Compare with Hour 3 → Server X went down → 🚨 EMAIL SENT!
Hour 5: Check servers → Compare with Hour 4 → No changes → No email
Hour 6: Check servers → Compare with Hour 5 → Server X recovered → ✅ EMAIL SENT!
```

---

## 🎨 Example Email

### **Subject:**
```
🚨 CRITICAL: 2 Server(s) Down!
```

### **Body:**
```
🔔 Status Changes Detected (3)

Partsouq          unhealthy → down       🚨 CRITICAL
Manual Search     healthy → unhealthy    ⚠️ DEGRADED
wavedin           down → healthy         ✅ IMPROVED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
✅ Healthy: 14
⚠️ Unhealthy: 7
🚨 Down: 1

[Full server details below...]
```

---

## ✅ Checklist

- [x] ✅ Hourly monitoring implemented (cron: `0 * * * *`)
- [x] ✅ Status change detection working
- [x] ✅ Previous status saved to file
- [x] ✅ Email sent only on changes
- [x] ✅ Change types categorized (CRITICAL/DEGRADED/IMPROVED)
- [x] ✅ Email subject reflects severity
- [x] ✅ Status changes highlighted in email
- [x] ✅ GitHub Actions configured with caching
- [x] ✅ Local testing successful
- [ ] ⏳ **YOU NEED TO DO:** Push changes to GitHub
- [ ] ⏳ **YOU NEED TO DO:** Test on GitHub Actions

---

**The system now monitors every hour and alerts you only when something changes!** 🎉

