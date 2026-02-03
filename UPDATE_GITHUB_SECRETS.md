# 🔄 UPDATE REQUIRED: GitHub Secrets

## ⚠️ IMPORTANT: You Need to Update GitHub Secrets

The server list has been expanded from **3 servers** to **22 servers**.

You need to update the `SERVER_URLS` secret in GitHub to include all the new domains.

---

## 📋 Step-by-Step Instructions

### Step 1: Go to GitHub Secrets

Visit: https://github.com/Thenilavan-G/Adhash_AutoChecker_Server/settings/secrets/actions

### Step 2: Update SERVER_URLS Secret

1. Find the **`SERVER_URLS`** secret in the list
2. Click on it
3. Click **"Update"** button
4. Replace the old value with the new value below

### Step 3: New SERVER_URLS Value

**Copy this entire value** (one long line, no line breaks):

```
http://20.7.146.191:3000/,http://20.15.121.70:3000,http://20.62.109.239:3000,https://superadmin.wavedin.app/,https://mobileliveapi.wavedin.app/,https://gopocket.algomax.co/,https://metcalf.ai/,https://zapcrm.io/,https://lead.zapcrm.io/,https://api.zapcrm.io/,https://adhashtech.com/,https://www.zapai.us/,https://humee.com/,https://api.humee.com/,https://spark.synctag.com/,https://api.sendmovieclips.com/,https://admin.aisignpro.com/,https://api.aisignpro.com/,https://manage.autochecker.com/,https://manageadminapi.autochecker.com/,https://managemobileapi.autochecker.com/,https://ebaydev.autochecker.com/
```

### Step 4: Save

Click **"Update secret"** button

---

## ✅ Verification

After updating, test the workflow:

1. Go to: https://github.com/Thenilavan-G/Adhash_AutoChecker_Server/actions
2. Click "Server Health Monitor"
3. Click "Run workflow"
4. Wait 2-3 minutes (checking 22 servers takes longer)
5. Check email at qateam@adhashtech.com

You should see a report with **22 servers** listed.

---

## 📊 Current Server Status (as of test)

### ✅ Healthy Servers (13):
1. https://gopocket.algomax.co/
2. https://metcalf.ai/
3. https://zapcrm.io/
4. https://lead.zapcrm.io/
5. https://adhashtech.com/
6. https://www.zapai.us/
7. https://humee.com/
8. https://api.humee.com/
9. https://spark.synctag.com/
10. https://api.sendmovieclips.com/
11. https://admin.aisignpro.com/
12. https://api.aisignpro.com/
13. https://manage.autochecker.com/

### ⚠️ Unhealthy Servers (6) - ACTIVE but returning 404:
1. http://20.7.146.191:3000/
2. http://20.15.121.70:3000
3. https://api.zapcrm.io/
4. https://manageadminapi.autochecker.com/
5. https://managemobileapi.autochecker.com/
6. https://ebaydev.autochecker.com/

### 🚨 Down Servers (3) - INACTIVE/Not Responding:
1. http://20.62.109.239:3000
2. https://superadmin.wavedin.app/
3. https://mobileliveapi.wavedin.app/

---

## 🔔 Email Alert Behavior

### Daily at 4:00 PM IST:
- ✅ Email sent with status of all 22 servers
- ✅ Shows Healthy, Unhealthy, and Down servers separately
- ✅ Includes response times and error details

### If Any ACTIVE Server Goes Down:
- ✅ Email will show it in "🚨 Down/Inactive Servers" section
- ✅ Subject will say "🚨 Server Alert: X Down, Y Unhealthy"
- ✅ You'll be notified immediately in the daily report

### If Any DOWN Server Comes Back:
- ✅ Email will show it in "✅ Healthy Servers" or "⚠️ Unhealthy Servers" section
- ✅ Subject will reflect the updated status

---

## ⏱️ Monitoring Schedule

- **Frequency:** Daily at 4:00 PM IST
- **Total Servers:** 22
- **Check Duration:** ~2-3 minutes (increased from ~30 seconds due to more servers)
- **Email Recipient:** qateam@adhashtech.com

---

## 🚨 Critical Servers to Watch

Based on the test, these servers are currently **ACTIVE but UNHEALTHY** (returning 404):

1. **https://api.zapcrm.io/** - ACTIVE (404)
2. **https://manageadminapi.autochecker.com/** - ACTIVE (404)
3. **https://managemobileapi.autochecker.com/** - ACTIVE (404)
4. **https://ebaydev.autochecker.com/** - ACTIVE (404)

**If any of these stop responding, you'll receive an email alert showing them as INACTIVE.**

---

## ✅ What's Already Done

- [x] ✅ Local `.env` file updated with 22 servers
- [x] ✅ Tested locally - all servers checked successfully
- [x] ✅ Email sent with 22 servers report
- [x] ✅ Code committed and ready to push
- [ ] ⏳ **YOU NEED TO DO:** Update GitHub Secret `SERVER_URLS`
- [ ] ⏳ **YOU NEED TO DO:** Test workflow on GitHub Actions

---

## 📧 Sample Email Subject

Based on current status, the email subject will be:

**"🚨 Server Alert: 3 Down, 6 Unhealthy"**

This will change as server statuses change.

---

**After updating the GitHub Secret, your monitoring system will check all 22 servers daily at 4:00 PM IST!** 🚀

