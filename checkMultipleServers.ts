import { request } from '@playwright/test';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user: string;
  password: string;
  to: string;
}

interface ServerStatus {
  url: string;
  isActive: boolean;
  statusCode?: number;
  statusText?: string;
  responseTime?: number;
  error?: string;
  timestamp: Date;
}

function generateModernHTMLReport(statuses: ServerStatus[]): string {
  const downServers = statuses.filter(s => !s.isActive);
  const unhealthyServers = statuses.filter(s => s.isActive && s.statusCode && s.statusCode >= 400);
  const healthyServers = statuses.filter(s => s.isActive && s.statusCode && s.statusCode < 400);
  const hasIssues = downServers.length > 0 || unhealthyServers.length > 0;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'long'
  });

  const generateServerCards = (servers: ServerStatus[], statusColor: string, statusLabel: string, icon: string) => {
    return servers.map(s => `
      <div class="server-card ${statusLabel.toLowerCase()}">
        <div class="server-header">
          <span class="server-icon">${icon}</span>
          <span class="server-url">${s.url}</span>
        </div>
        <div class="server-details">
          <div class="detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value" style="color: ${statusColor}; font-weight: bold;">${statusLabel}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Response:</span>
            <span class="detail-value">${s.isActive ? `${s.statusCode} ${s.statusText}` : s.error || 'No response'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Response Time:</span>
            <span class="detail-value">${s.responseTime ? `${s.responseTime}ms` : 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Checked:</span>
            <span class="detail-value">${s.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    `).join('');
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Health Report - ${new Date().toLocaleDateString()}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }

    .header {
      background: ${hasIssues ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)' : 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)'};
      color: white;
      padding: 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .header .subtitle {
      font-size: 1.1em;
      opacity: 0.95;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }

    .summary-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }

    .summary-card .icon {
      font-size: 3em;
      margin-bottom: 15px;
    }

    .summary-card .label {
      font-size: 0.9em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .summary-card .count {
      font-size: 3em;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .summary-card.healthy .count { color: #4caf50; }
    .summary-card.unhealthy .count { color: #ff9800; }
    .summary-card.down .count { color: #f44336; }

    .content {
      padding: 40px;
    }

    .section {
      margin-bottom: 40px;
    }

    .section-title {
      font-size: 1.8em;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #e0e0e0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title.healthy { border-color: #4caf50; color: #4caf50; }
    .section-title.unhealthy { border-color: #ff9800; color: #ff9800; }
    .section-title.down { border-color: #f44336; color: #f44336; }

    .servers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .server-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 5px solid;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .server-card:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .server-card.active { border-color: #4caf50; }
    .server-card.unhealthy { border-color: #ff9800; }
    .server-card.inactive { border-color: #f44336; }

    .server-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    .server-icon {
      font-size: 1.5em;
    }

    .server-url {
      font-weight: 600;
      color: #333;
      word-break: break-all;
      flex: 1;
    }

    .server-details {
      display: grid;
      gap: 10px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }

    .detail-label {
      color: #666;
      font-size: 0.9em;
    }

    .detail-value {
      color: #333;
      font-weight: 500;
    }

    .footer {
      background: #2c3e50;
      color: white;
      padding: 30px;
      text-align: center;
    }

    .footer p {
      margin: 5px 0;
      opacity: 0.9;
    }

    .timestamp {
      background: #ecf0f1;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      font-size: 0.95em;
      color: #555;
    }

    @media (max-width: 768px) {
      .servers-grid {
        grid-template-columns: 1fr;
      }

      .header h1 {
        font-size: 1.8em;
      }

      .summary {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
      }

      .server-card:hover {
        transform: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${hasIssues ? '🚨 Server Status Alert' : '✅ Server Health Report'}</h1>
      <p class="subtitle">Automated Server Monitoring System</p>
    </div>

    <div class="timestamp">
      <strong>📅 Report Generated:</strong> ${timestamp}
    </div>

    <div class="summary">
      <div class="summary-card healthy">
        <div class="icon">✅</div>
        <div class="label">Healthy Servers</div>
        <div class="count">${healthyServers.length}</div>
        <div style="color: #666; font-size: 0.9em;">Working Perfectly</div>
      </div>

      <div class="summary-card unhealthy">
        <div class="icon">⚠️</div>
        <div class="label">Unhealthy Servers</div>
        <div class="count">${unhealthyServers.length}</div>
        <div style="color: #666; font-size: 0.9em;">Active but Errors</div>
      </div>

      <div class="summary-card down">
        <div class="icon">🚨</div>
        <div class="label">Down Servers</div>
        <div class="count">${downServers.length}</div>
        <div style="color: #666; font-size: 0.9em;">Not Responding</div>
      </div>

      <div class="summary-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div class="icon">🖥️</div>
        <div class="label" style="color: white; opacity: 0.9;">Total Servers</div>
        <div class="count" style="color: white;">${statuses.length}</div>
        <div style="opacity: 0.9; font-size: 0.9em;">Being Monitored</div>
      </div>
    </div>

    <div class="content">
      ${downServers.length > 0 ? `
      <div class="section">
        <h2 class="section-title down">🚨 Down/Inactive Servers (${downServers.length})</h2>
        <div class="servers-grid">
          ${generateServerCards(downServers, '#f44336', 'INACTIVE', '🚨')}
        </div>
      </div>
      ` : ''}

      ${unhealthyServers.length > 0 ? `
      <div class="section">
        <h2 class="section-title unhealthy">⚠️ Unhealthy Servers (${unhealthyServers.length})</h2>
        <div class="servers-grid">
          ${generateServerCards(unhealthyServers, '#ff9800', 'ACTIVE', '⚠️')}
        </div>
      </div>
      ` : ''}

      ${healthyServers.length > 0 ? `
      <div class="section">
        <h2 class="section-title healthy">✅ Healthy Servers (${healthyServers.length})</h2>
        <div class="servers-grid">
          ${generateServerCards(healthyServers, '#4caf50', 'ACTIVE', '✅')}
        </div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p><strong>Adhash Technologies - Server Monitoring System</strong></p>
      <p>This is an automated report generated by the Server Health Monitor</p>
      <p>Monitoring ${statuses.length} server(s) • Report ID: ${Date.now()}</p>
      <p style="margin-top: 15px; font-size: 0.9em;">
        For questions or issues, contact: <a href="mailto:qateam@adhashtech.com" style="color: #3498db;">qateam@adhashtech.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

async function sendMultiServerEmail(config: EmailConfig, statuses: ServerStatus[]) {
  const transportConfig: any = {
    auth: {
      user: config.user,
      pass: config.password,
    },
  };

  if (config.host) {
    transportConfig.host = config.host;
    transportConfig.port = config.port || 465;
    transportConfig.secure = config.secure !== undefined ? config.secure : true;
  } else if (config.service) {
    transportConfig.service = config.service;
  }

  const transporter = nodemailer.createTransport(transportConfig);

  const downServers = statuses.filter(s => !s.isActive);
  const unhealthyServers = statuses.filter(s => s.isActive && s.statusCode && s.statusCode >= 400);
  const healthyServers = statuses.filter(s => s.isActive && s.statusCode && s.statusCode < 400);

  const hasIssues = downServers.length > 0 || unhealthyServers.length > 0;

  const subject = hasIssues
    ? `🚨 Server Alert: ${downServers.length} Down, ${unhealthyServers.length} Unhealthy`
    : `✅ All Servers Healthy (${healthyServers.length} servers)`;

  const generateServerRows = (servers: ServerStatus[], statusColor: string, statusLabel: string) => {
    return servers.map(s => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px 8px; color: #333;">${s.url}</td>
        <td style="padding: 12px 8px; color: ${statusColor}; font-weight: bold;">${statusLabel}</td>
        <td style="padding: 12px 8px; color: #666;">
          ${s.isActive ? `${s.statusCode} ${s.statusText}` : s.error || 'No response'}
        </td>
        <td style="padding: 12px 8px; color: #666;">
          ${s.responseTime ? `${s.responseTime}ms` : 'N/A'}
        </td>
      </tr>
    `).join('');
  };

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: ${hasIssues ? '#f44336' : '#4caf50'}; margin-top: 0;">
            ${hasIssues ? '🚨 Server Status Alert' : '✅ Server Health Report'}
          </h2>

          <p style="color: #666; margin-bottom: 20px;">
            <strong>Timestamp:</strong> ${new Date().toLocaleString()}<br>
            <strong>Total Servers Monitored:</strong> ${statuses.length}
          </p>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 200px;">✅ Healthy Servers:</td>
                <td style="padding: 8px 0; color: #4caf50; font-weight: bold; font-size: 18px;">${healthyServers.length}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">⚠️ Unhealthy Servers:</td>
                <td style="padding: 8px 0; color: #ff9800; font-weight: bold; font-size: 18px;">${unhealthyServers.length}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">🚨 Down/Inactive Servers:</td>
                <td style="padding: 8px 0; color: #f44336; font-weight: bold; font-size: 18px;">${downServers.length}</td>
              </tr>
            </table>
          </div>

          ${downServers.length > 0 ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #f44336; margin-bottom: 10px;">🚨 Down/Inactive Servers</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
              <thead>
                <tr style="background-color: #f44336; color: white;">
                  <th style="padding: 12px 8px; text-align: left;">Server Address</th>
                  <th style="padding: 12px 8px; text-align: left;">Status</th>
                  <th style="padding: 12px 8px; text-align: left;">Error</th>
                  <th style="padding: 12px 8px; text-align: left;">Response Time</th>
                </tr>
              </thead>
              <tbody>
                ${generateServerRows(downServers, '#f44336', 'INACTIVE')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${unhealthyServers.length > 0 ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #ff9800; margin-bottom: 10px;">⚠️ Unhealthy Servers</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
              <thead>
                <tr style="background-color: #ff9800; color: white;">
                  <th style="padding: 12px 8px; text-align: left;">Server Address</th>
                  <th style="padding: 12px 8px; text-align: left;">Status</th>
                  <th style="padding: 12px 8px; text-align: left;">Status Code</th>
                  <th style="padding: 12px 8px; text-align: left;">Response Time</th>
                </tr>
              </thead>
              <tbody>
                ${generateServerRows(unhealthyServers, '#ff9800', 'ACTIVE')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${healthyServers.length > 0 ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #4caf50; margin-bottom: 10px;">✅ Healthy Servers</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
              <thead>
                <tr style="background-color: #4caf50; color: white;">
                  <th style="padding: 12px 8px; text-align: left;">Server Address</th>
                  <th style="padding: 12px 8px; text-align: left;">Status</th>
                  <th style="padding: 12px 8px; text-align: left;">Status Code</th>
                  <th style="padding: 12px 8px; text-align: left;">Response Time</th>
                </tr>
              </thead>
              <tbody>
                ${generateServerRows(healthyServers, '#4caf50', 'ACTIVE')}
              </tbody>
            </table>
          </div>
          ` : ''}


          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px; margin-bottom: 0;">
            This is an automated alert from your Server Health Monitor.<br>
            Monitoring ${statuses.length} server(s)
          </p>
        </div>
      </body>
    </html>
  `;

  // Generate modern HTML report
  const modernReport = generateModernHTMLReport(statuses);
  const reportFileName = `server-health-report-${new Date().toISOString().split('T')[0]}.html`;
  const reportPath = path.join(process.cwd(), 'reports', reportFileName);

  // Create reports directory if it doesn't exist
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Save the HTML report to file
  fs.writeFileSync(reportPath, modernReport, 'utf-8');
  console.log(`   📄 HTML report saved: ${reportPath}`);

  const mailOptions = {
    from: config.user,
    to: config.to,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: reportFileName,
        path: reportPath,
        contentType: 'text/html'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`   📧 Email alert sent to: ${config.to}`);
    console.log(`   📎 Attached: ${reportFileName}`);
    return true;
  } catch (error: any) {
    console.log(`   ❌ Failed to send email: ${error.message}`);
    return false;
  }
}

async function checkServerHealth(url: string): Promise<ServerStatus> {
  const context = await request.newContext();

  try {
    const startTime = Date.now();

    const response = await context.get(url, {
      timeout: 10000,
      ignoreHTTPSErrors: true
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const status = response.status();
    const statusText = response.statusText();

    await context.dispose();

    return {
      url,
      isActive: true,
      statusCode: status,
      statusText: statusText,
      responseTime: responseTime,
      timestamp: new Date()
    };

  } catch (error: any) {
    await context.dispose();

    return {
      url,
      isActive: false,
      error: error.message,
      timestamp: new Date()
    };
  }
}

async function main() {
  const emailConfig: EmailConfig = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : undefined,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    to: process.env.EMAIL_TO || '',
  };

  const serverUrlsString = process.env.SERVER_URLS || 'http://20.7.146.191:3000/';
  const serverUrls = serverUrlsString.split(',').map(url => url.trim());

  if (!emailConfig.user || !emailConfig.password || !emailConfig.to) {
    console.error('❌ Error: Email configuration is missing!');
    console.error('Please create a .env file with EMAIL_USER, EMAIL_PASSWORD, and EMAIL_TO');
    process.exit(1);
  }

  console.log('📧 Email Configuration:');
  console.log(`   From: ${emailConfig.user}`);
  console.log(`   To: ${emailConfig.to}`);
  console.log(`   SMTP: ${emailConfig.host || emailConfig.service}`);
  console.log('');
  console.log(`🔍 Checking ${serverUrls.length} server(s)...\n`);

  const statuses: ServerStatus[] = [];

  for (const url of serverUrls) {
    console.log(`Checking: ${url}`);
    const status = await checkServerHealth(url);

    if (status.isActive) {
      if (status.statusCode && status.statusCode >= 200 && status.statusCode < 400) {
        console.log(`   ✅ HEALTHY - ${status.statusCode} ${status.statusText} (${status.responseTime}ms)`);
      } else {
        console.log(`   ⚠️ UNHEALTHY - ${status.statusCode} ${status.statusText} (${status.responseTime}ms)`);
      }
    } else {
      console.log(`   🚨 DOWN - ${status.error}`);
    }

    statuses.push(status);
  }

  console.log('\n📊 Summary:');
  const healthy = statuses.filter(s => s.isActive && s.statusCode && s.statusCode < 400).length;
  const unhealthy = statuses.filter(s => s.isActive && s.statusCode && s.statusCode >= 400).length;
  const down = statuses.filter(s => !s.isActive).length;

  console.log(`   ✅ Healthy: ${healthy}`);
  console.log(`   ⚠️ Unhealthy: ${unhealthy}`);
  console.log(`   🚨 Down: ${down}`);
  console.log('');

  console.log('📧 Sending email report...');
  const emailSent = await sendMultiServerEmail(emailConfig, statuses);

  if (emailSent) {
    console.log('✨ Email sent successfully!\n');
  } else {
    console.log('❌ Failed to send email\n');
  }
}

main();
