// This demonstrates the email alert logic

console.log('📧 EMAIL ALERT LOGIC DEMONSTRATION\n');
console.log('='.repeat(70));

const scenarios = [
  {
    name: 'Scenario 1: Active Server Goes Down',
    previous: 'unhealthy',
    current: 'down',
    description: 'Server was ACTIVE (returning 404), now STOPPED responding',
    emailSent: true,
    reason: 'ACTIVE server went DOWN - CRITICAL!'
  },
  {
    name: 'Scenario 2: Healthy Server Goes Down',
    previous: 'healthy',
    current: 'down',
    description: 'Server was HEALTHY (200 OK), now STOPPED responding',
    emailSent: true,
    reason: 'HEALTHY server went DOWN - CRITICAL!'
  },
  {
    name: 'Scenario 3: Healthy Server Becomes Unhealthy',
    previous: 'healthy',
    current: 'unhealthy',
    description: 'Server was HEALTHY, now returning errors (404/500)',
    emailSent: true,
    reason: 'Server started returning errors'
  },
  {
    name: 'Scenario 4: Server Still Down',
    previous: 'down',
    current: 'down',
    description: 'Server was DOWN, still DOWN',
    emailSent: false,
    reason: 'No change - prevents spam'
  },
  {
    name: 'Scenario 5: Server Still Unhealthy',
    previous: 'unhealthy',
    current: 'unhealthy',
    description: 'Server was UNHEALTHY, still UNHEALTHY',
    emailSent: false,
    reason: 'No change - prevents spam'
  },
  {
    name: 'Scenario 6: Server Recovers',
    previous: 'down',
    current: 'healthy',
    description: 'Server was DOWN, now HEALTHY',
    emailSent: false,
    reason: 'Recovery is good news - just logged'
  },
];

function checkEmailLogic(previous: string | null, current: string): boolean {
  // This is the EXACT logic from monitorMultipleServers.ts
  const shouldSendEmail =
    (previous === 'healthy' && current === 'down') ||
    (previous === 'unhealthy' && current === 'down') ||
    (previous === 'healthy' && current === 'unhealthy') ||
    (previous === null && current !== 'healthy');
  
  return shouldSendEmail;
}

scenarios.forEach((scenario, index) => {
  console.log(`\n${index + 1}. ${scenario.name}`);
  console.log('   ' + '-'.repeat(65));
  console.log(`   Description: ${scenario.description}`);
  console.log(`   Previous Status: ${scenario.previous.toUpperCase()}`);
  console.log(`   Current Status: ${scenario.current.toUpperCase()}`);
  
  const emailSent = checkEmailLogic(scenario.previous, scenario.current);
  const icon = emailSent ? '📧 ✅' : '❌';
  
  console.log(`   Email Sent: ${icon} ${emailSent ? 'YES' : 'NO'}`);
  console.log(`   Reason: ${scenario.reason}`);
  
  if (emailSent !== scenario.emailSent) {
    console.log(`   ⚠️ WARNING: Expected ${scenario.emailSent}, got ${emailSent}`);
  }
});

console.log('\n' + '='.repeat(70));
console.log('\n🎯 KEY POINT: If ANY active server goes down, EMAIL IS SENT! ✅\n');

// Specific test for your concern
console.log('🧪 YOUR SPECIFIC CONCERN TEST:\n');
console.log('Server: http://20.15.121.70:3000');
console.log('Current State: ACTIVE (returning 404 - UNHEALTHY)');
console.log('What if it STOPS responding?\n');

const previous = 'unhealthy'; // Currently active but returning 404
const current = 'down';        // Server stops responding

const willSendEmail = checkEmailLogic(previous, current);

console.log(`Previous: UNHEALTHY (server was ACTIVE, returning 404)`);
console.log(`Current: DOWN (server STOPPED responding)`);
console.log(`\nWill email be sent? ${willSendEmail ? '📧 ✅ YES!' : '❌ NO'}`);

if (willSendEmail) {
  console.log('\n✅ CONFIRMED: Email WILL be sent when active server goes down!');
  console.log('Email Subject: "🚨 Server DOWN Alert - http://20.15.121.70:3000"');
  console.log('Email Body: Shows server address with "INACTIVE" status');
} else {
  console.log('\n❌ ERROR: Email will NOT be sent - logic is broken!');
}

console.log('\n' + '='.repeat(70) + '\n');

