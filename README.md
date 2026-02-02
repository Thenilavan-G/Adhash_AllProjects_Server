# Server Health Check with Playwright & Email Alerts

This project uses Playwright to check if a server is active and sends email alerts when the server is down or unhealthy.

## Features

✅ Server health monitoring
📧 Email alerts when server is down or returns errors
🔄 Continuous monitoring mode
⚡ Fast checks without browser overhead

## 🚀 Automated Monitoring (Choose One)

You have **two options** for automated daily monitoring at 4:00 PM IST:

### Option 1: GitHub Actions (RECOMMENDED) ⭐
- ✅ Cloud-based - runs even if computer is off
- ✅ No admin rights needed
- ✅ Easy to manage from GitHub UI
- 📖 See `GITHUB_ACTIONS_SETUP.md` for setup

### Option 2: Windows Task Scheduler
- ✅ Local control
- ⚠️ Requires computer to be on at 4 PM
- ⚠️ Requires admin rights
- 📖 See `SCHEDULED_TASK_SETUP.md` for setup

**Full comparison:** See `DEPLOYMENT_OPTIONS.md`

---

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure email settings:**

Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` with your email configuration:
```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=recipient@example.com

# Server Configuration
SERVER_URL=http://20.7.146.191:3000/
CHECK_INTERVAL_MINUTES=5
```

### Gmail Setup (Recommended)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this password in `EMAIL_PASSWORD`

### Other Email Services

You can use other services like Outlook, Yahoo, etc. Just change `EMAIL_SERVICE`:
- `gmail` - Gmail
- `outlook` - Outlook/Hotmail
- `yahoo` - Yahoo Mail
- Or use custom SMTP settings

## Usage

### 1. Quick Check (No Email)
```bash
npm run check-server-simple
```
Simple health check without email alerts.

### 2. Check with Email Alert
```bash
npm run check-with-email
```
Checks server once and sends email if server is down or unhealthy.

### 3. Continuous Monitoring - Single Server
```bash
npm run monitor
```
Continuously monitors one server at the interval specified in `.env` (default: 5 minutes).
- Sends email only when status changes (down → up or up → down)
- Runs indefinitely until stopped (Ctrl+C)

### 4. Continuous Monitoring - Multiple Servers (Recommended)
```bash
npm run monitor-multiple
```
Continuously monitors ALL servers configured in `SERVER_URLS`.
- Checks all servers every 5 minutes (configurable)
- Sends email ONLY when a server's status changes:
  - ✅ Healthy → ⚠️ Unhealthy (sends email)
  - ✅ Healthy → 🚨 Down (sends email)
  - ⚠️ Unhealthy → 🚨 Down (sends email)
  - 🚨 Down → ✅ Healthy (no email, just logs recovery)
  - Still down/unhealthy (no duplicate emails)
- Perfect for production monitoring of multiple servers
- Runs indefinitely until stopped (Ctrl+C)

## Output Examples

**When server is active and healthy:**
```
✅ Server is ACTIVE
   Status Code: 200 OK
   Response Time: 245ms
   Health: HEALTHY ✓
   No email alert needed.
```

**When server is down:**
```
❌ Server is NOT ACTIVE or UNREACHABLE
   Error: connect ECONNREFUSED
   Status changed to DOWN - sending email alert...
   📧 Email alert sent to: recipient@example.com
```

**When server returns error:**
```
✅ Server is ACTIVE
   Status Code: 404 Not Found
   Response Time: 580ms
   Health: UNHEALTHY (Status 404) ⚠️
   Sending email alert...
   📧 Email alert sent to: recipient@example.com
```

## Email Alert Content

The email includes:
- Server URL
- Status (Active/Down)
- Timestamp
- Status code and response time (if active)
- Error message (if down)
- Color-coded HTML formatting

## Running as Background Service

### Windows (Task Scheduler)
Create a scheduled task to run `npm run monitor` on system startup.

### Linux (systemd)
Create a systemd service file to run the monitor continuously.

### Docker
Build and run as a Docker container for easy deployment.

## Troubleshooting

**Email not sending:**
- Check your email credentials in `.env`
- For Gmail, make sure you're using an App Password, not your regular password
- Check if 2-Step Verification is enabled
- Verify EMAIL_TO is correct

**Server check failing:**
- Verify SERVER_URL is correct
- Check network connectivity
- Ensure firewall allows outbound connections

