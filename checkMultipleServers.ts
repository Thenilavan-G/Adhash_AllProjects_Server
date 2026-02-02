import { request } from '@playwright/test';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

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

  const mailOptions = {
    from: config.user,
    to: config.to,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`   📧 Email alert sent to: ${config.to}`);
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
