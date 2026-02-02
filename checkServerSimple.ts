import { request } from '@playwright/test';

async function checkServerHealth(url: string) {
  console.log(`\n🔍 Checking server health at: ${url}\n`);
  
  const context = await request.newContext();
  
  try {
    const startTime = Date.now();
    
    // Make a GET request to the server
    const response = await context.get(url, {
      timeout: 10000, // 10 seconds timeout
      ignoreHTTPSErrors: true
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
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
    
    // Get response headers
    const headers = response.headers();
    if (headers['content-type']) {
      console.log(`   Content-Type: ${headers['content-type']}`);
    }
    if (headers['server']) {
      console.log(`   Server: ${headers['server']}`);
    }
    
    // Get response body (first 200 chars)
    try {
      const body = await response.text();
      if (body) {
        const preview = body.substring(0, 200).replace(/\n/g, ' ');
        console.log(`   Body Preview: ${preview}${body.length > 200 ? '...' : ''}`);
      }
    } catch (e) {
      // Ignore body errors
    }
    
  } catch (error: any) {
    console.log('❌ Server is NOT ACTIVE or UNREACHABLE');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('Timeout')) {
      console.log('   Reason: Connection timeout (server took too long to respond)');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('   Reason: Connection refused (server may be down)');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.log('   Reason: Network timeout (server unreachable)');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('   Reason: Host not found (DNS resolution failed)');
    }
  } finally {
    await context.dispose();
    console.log('\n✨ Health check completed\n');
  }
}

// Run the health check
const serverUrl = 'http://20.7.146.191:3000/';
checkServerHealth(serverUrl);

