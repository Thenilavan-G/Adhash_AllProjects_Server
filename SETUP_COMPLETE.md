# ✅ Server Monitoring Setup Complete!

## 📧 Email Configuration
- **From:** thenilavan@adhashtech.com
- **To:** qateam@adhashtech.com
- **SMTP:** Zoho (smtp.zoho.com)
- **Status:** ✅ Verified and Working

## 🖥️ Servers Being Monitored

1. **http://20.7.146.191:3000/**
   - Current Status: ⚠️ ACTIVE but UNHEALTHY (404 Not Found)
   - Response Time: ~570ms
   - Server is running, but root path returns 404

2. **http://20.15.121.70:3000**
   - Current Status: ⚠️ ACTIVE but UNHEALTHY (404 Not Found)
   - Response Time: ~560ms
   - Server is running on port 3000, but root path returns 404

3. **http://20.62.109.239:3000**
   - Current Status: 🚨 DOWN (Timeout)
   - Not responding - server may be offline or unreachable

## 🚀 How to Start Continuous Monitoring

### Start the Monitor
```bash
npm run monitor-multiple
```

This will:
- ✅ Check all 3 servers every 5 minutes
- ✅ Send email alerts when server status changes
- ✅ Show real-time status in console
- ✅ Run continuously until you stop it (Ctrl+C)

### What Triggers Email Alerts

Emails are sent ONLY when status changes:

| Previous Status | New Status | Email Sent? |
|----------------|------------|-------------|
| ✅ Healthy | ⚠️ Unhealthy | ✅ YES |
| ✅ Healthy | 🚨 Down | ✅ YES |
| ⚠️ Unhealthy | 🚨 Down | ✅ YES |
| 🚨 Down | 🚨 Down | ❌ NO (prevents spam) |
| ⚠️ Unhealthy | ⚠️ Unhealthy | ❌ NO (prevents spam) |
| 🚨 Down | ✅ Healthy | ❌ NO (recovery logged) |

## 📧 Email Content

Each alert email includes:
- **Server Address** with ACTIVE/INACTIVE status clearly shown
- **Status Code** (if server is responding)
- **Response Time** (if server is responding)
- **Error Details** (if server is down)
- **Timestamp** of when the issue was detected
- **Color-coded formatting** (Red for DOWN, Orange for UNHEALTHY)

## 📊 Console Output Example

```
🚀 Multi-Server Monitor Started
   Servers: 3
   Check Interval: 5 minutes
   Email From: thenilavan@adhashtech.com
   Email To: qateam@adhashtech.com
   SMTP: smtp.zoho.com

🔍 Health Check - 2/2/2026, 8:00:00 am

⚠️ http://20.7.146.191:3000/
   Status: UNHEALTHY - 404 Not Found (574ms)
   🔔 Status changed: unknown → unhealthy
   📧 Sending email alert...
   📧 Email alert sent to: qateam@adhashtech.com

🚨 http://20.15.121.70
   Status: DOWN - Timeout
   🔔 Status changed: unknown → down
   📧 Sending email alert...
   📧 Email alert sent to: qateam@adhashtech.com
```

## 🛠️ Available Commands

```bash
# Check all servers once and send email report
npm run check-multiple

# Continuous monitoring of all servers (RECOMMENDED)
npm run monitor-multiple

# Check single server with email
npm run check-with-email

# Quick check without email
npm run check-server-simple
```

## ⚙️ Configuration

Edit `.env` file to change settings:

```env
# Add more servers (comma-separated)
SERVER_URLS=http://20.7.146.191:3000/,http://20.15.121.70,http://20.62.109.239

# Change check interval (in minutes)
CHECK_INTERVAL_MINUTES=5

# Change email recipient
EMAIL_TO=qateam@adhashtech.com
```

## 🎯 Next Steps

1. **Start the monitor:**
   ```bash
   npm run monitor-multiple
   ```

2. **Keep it running** - The monitor will run continuously and send emails when servers go down

3. **Check your email** - You should have already received 3 test emails (one for each server)

4. **Optional:** Set up as a Windows Service or use Task Scheduler to run on system startup

## ✅ Test Results

- ✅ Email configuration verified
- ✅ SMTP connection successful
- ✅ All 3 servers checked
- ✅ 3 email alerts sent successfully to qateam@adhashtech.com
- ✅ Monitoring script ready to run

## 📝 Notes

- The monitor will only send emails when status **changes**, preventing email spam
- If a server stays down, you won't get repeated emails
- When a server recovers, it's logged but no email is sent (you can change this if needed)
- All checks have a 10-second timeout
- Logs show timestamp, status, and response time for each check

---

**Monitor is ready to use! Run `npm run monitor-multiple` to start.**

