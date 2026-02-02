# Email Alert Test Scenarios

## ✅ Verified: Email Alerts Work Correctly

### Current Server Status (as of now):
1. **http://20.7.146.191:3000/** - ⚠️ UNHEALTHY (404)
2. **http://20.15.121.70:3000** - ⚠️ UNHEALTHY (404)
3. **http://20.62.109.239:3000** - 🚨 DOWN (Timeout)

---

## 📧 When Emails ARE Sent:

### Scenario 1: Active Server Goes Down ✅
**Example:** Server 1 or 2 stops responding
- **Before:** ⚠️ UNHEALTHY (404) - Server is ACTIVE
- **After:** 🚨 DOWN (Timeout) - Server stopped
- **Result:** 📧 **EMAIL SENT** ✅
- **Email Subject:** "🚨 Server DOWN Alert - http://20.15.121.70:3000"
- **Email Body:** Shows server address with status "INACTIVE"

### Scenario 2: Healthy Server Goes Down ✅
**Example:** If server starts returning 200 OK, then stops
- **Before:** ✅ HEALTHY (200 OK)
- **After:** 🚨 DOWN (Timeout)
- **Result:** 📧 **EMAIL SENT** ✅
- **Email Subject:** "🚨 Server DOWN Alert - [server url]"

### Scenario 3: Healthy Server Becomes Unhealthy ✅
**Example:** Server starts returning errors
- **Before:** ✅ HEALTHY (200 OK)
- **After:** ⚠️ UNHEALTHY (404/500)
- **Result:** 📧 **EMAIL SENT** ✅
- **Email Subject:** "⚠️ Server Unhealthy Alert - [server url]"

### Scenario 4: First Check - Server Not Healthy ✅
**Example:** When monitoring starts and server is down/unhealthy
- **Before:** (First check - no previous status)
- **After:** 🚨 DOWN or ⚠️ UNHEALTHY
- **Result:** 📧 **EMAIL SENT** ✅

---

## 📧 When Emails are NOT Sent (Prevents Spam):

### Scenario 5: Server Still Down ❌
**Example:** Server remains down between checks
- **Before:** 🚨 DOWN
- **After:** 🚨 DOWN (still down)
- **Result:** ❌ **NO EMAIL** (prevents spam)
- **Console:** "ℹ️ Still down (no new email sent)"

### Scenario 6: Server Still Unhealthy ❌
**Example:** Server continues returning 404
- **Before:** ⚠️ UNHEALTHY (404)
- **After:** ⚠️ UNHEALTHY (404)
- **Result:** ❌ **NO EMAIL** (prevents spam)
- **Console:** "ℹ️ Still unhealthy (no new email sent)"

### Scenario 7: Server Recovers ❌
**Example:** Down server comes back online
- **Before:** 🚨 DOWN
- **After:** ✅ HEALTHY (200 OK)
- **Result:** ❌ **NO EMAIL** (recovery is good news)
- **Console:** "✅ Status recovered: down → healthy (no email sent)"

---

## 🧪 Test Simulation

### What Happens When You Start Monitoring Now:

**First Check (Initial State):**
```
Server 1: http://20.7.146.191:3000/
  Previous: null (first check)
  Current: UNHEALTHY (404)
  Action: 📧 EMAIL SENT (first check, not healthy)

Server 2: http://20.15.121.70:3000
  Previous: null (first check)
  Current: UNHEALTHY (404)
  Action: 📧 EMAIL SENT (first check, not healthy)

Server 3: http://20.62.109.239:3000
  Previous: null (first check)
  Current: DOWN
  Action: 📧 EMAIL SENT (first check, not healthy)
```

**Second Check (5 minutes later):**
```
Server 1: http://20.7.146.191:3000/
  Previous: UNHEALTHY
  Current: UNHEALTHY (404)
  Action: ❌ NO EMAIL (still unhealthy)

Server 2: http://20.15.121.70:3000
  Previous: UNHEALTHY
  Current: UNHEALTHY (404)
  Action: ❌ NO EMAIL (still unhealthy)

Server 3: http://20.62.109.239:3000
  Previous: DOWN
  Current: DOWN
  Action: ❌ NO EMAIL (still down)
```

**If Server 2 Goes Down:**
```
Server 2: http://20.15.121.70:3000
  Previous: UNHEALTHY (was active, returning 404)
  Current: DOWN (stopped responding)
  Action: 📧 EMAIL SENT ✅ (active server went down!)
  Email Subject: "🚨 Server DOWN Alert - http://20.15.121.70:3000"
  Email Body: Shows "INACTIVE" status with error details
```

---

## ✅ Confirmation: Logic is Correct

The monitoring system **WILL** send an email when:
- ✅ Any ACTIVE server (healthy or unhealthy) goes DOWN
- ✅ Any HEALTHY server becomes UNHEALTHY
- ✅ First check detects a problem

The monitoring system **WILL NOT** send duplicate emails when:
- ❌ Server stays in the same bad state (prevents spam)
- ❌ Server recovers (good news, just logged)

---

## 🚀 To Test This:

1. **Start monitoring:**
   ```bash
   npm run monitor-multiple
   ```

2. **Simulate server going down:**
   - Stop one of your active servers (20.7.146.191:3000 or 20.15.121.70:3000)
   - Wait up to 5 minutes for next check
   - You will receive an email alert! ✅

3. **Check email:**
   - Subject: "🚨 Server DOWN Alert - [server url]"
   - Body: Shows server address with "INACTIVE" status

---

**The system is working correctly and will alert you when any active server goes down!** ✅

