import { chromium } from '@playwright/test';

async function checkServerHealth(url: string) {
  console.log(`\n🔍 Checking server health at: ${url}\n`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    const startTime = Date.now();
    
    // Try to navigate to the server
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 10000 // 10 seconds timeout
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response) {
      const status = response.status();
      const statusText = response.statusText();
      
      console.log('✅ Server is ACTIVE');
      console.log(`   Status Code: ${status} ${statusText}`);
      console.log(`   Response Time: ${responseTime}ms`);
      console.log(`   URL: ${response.url()}`);
      
      // Check if status is successful (2xx or 3xx)
      if (status >= 200 && status < 400) {
        console.log(`   Health: HEALTHY ✓`);
      } else {
        console.log(`   Health: UNHEALTHY (Status ${status}) ⚠️`);
      }
      
      // Get page title if available
      try {
        const title = await page.title();
        if (title) {
          console.log(`   Page Title: ${title}`);
        }
      } catch (e) {
        // Ignore title errors
      }
      
    } else {
      console.log('❌ Server is NOT RESPONDING');
      console.log('   No response received from server');
    }
    
  } catch (error: any) {
    console.log('❌ Server is NOT ACTIVE or UNREACHABLE');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('Timeout')) {
      console.log('   Reason: Connection timeout (server took too long to respond)');
    } else if (error.message.includes('net::ERR')) {
      console.log('   Reason: Network error (server may be down or unreachable)');
    }
  } finally {
    await browser.close();
    console.log('\n✨ Health check completed\n');
  }
}

// Run the health check
const serverUrl = 'http://20.7.146.191:3000/';
checkServerHealth(serverUrl);

