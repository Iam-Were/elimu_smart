/**
 * Chrome DevTools MCP - Console Error Checker
 * Connects to Chrome DevTools Protocol to inspect elimu-smart.co.ke
 */

const { spawn } = require('child_process');
const http = require('http');

async function checkConsoleErrors() {
  console.log('🚀 Launching Chrome with DevTools Protocol...\n');
  
  // Launch Chrome with remote debugging
  const chrome = spawn('chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    'https://elimu-smart.co.ke'
  ], {
    shell: true,
    stdio: 'pipe'
  });

  // Wait for Chrome to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    // Get WebSocket endpoint
    const response = await fetch('http://localhost:9222/json/version');
    const data = await response.json();
    const wsUrl = data.webSocketDebuggerUrl;

    console.log('✅ Connected to Chrome DevTools Protocol\n');
    console.log('🌐 Navigating to: https://elimu-smart.co.ke\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 CONSOLE ERRORS & WARNINGS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const WebSocket = require('ws');
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      // Enable Runtime and Console domains
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Console.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));
      ws.send(JSON.stringify({ id: 4, method: 'Page.enable' }));
    });

    const errors = [];
    const warnings = [];
    const networkErrors = [];

    ws.on('message', (data) => {
      const message = JSON.parse(data);
      
      // Console API calls
      if (message.method === 'Runtime.consoleAPICalled') {
        const { type, args, stackTrace } = message.params;
        
        if (type === 'error') {
          const errorText = args.map(arg => arg.value || arg.description).join(' ');
          errors.push(errorText);
          console.log(`❌ ERROR: ${errorText}`);
          if (stackTrace) {
            console.log(`   Location: ${stackTrace.callFrames[0]?.url}:${stackTrace.callFrames[0]?.lineNumber}`);
          }
        } else if (type === 'warning') {
          const warnText = args.map(arg => arg.value || arg.description).join(' ');
          warnings.push(warnText);
          console.log(`⚠️  WARNING: ${warnText}`);
        }
      }

      // Runtime exceptions
      if (message.method === 'Runtime.exceptionThrown') {
        const { exceptionDetails } = message.params;
        const errorMsg = exceptionDetails.text || exceptionDetails.exception?.description;
        errors.push(errorMsg);
        console.log(`❌ EXCEPTION: ${errorMsg}`);
        console.log(`   at ${exceptionDetails.url}:${exceptionDetails.lineNumber}:${exceptionDetails.columnNumber}`);
      }

      // Network errors
      if (message.method === 'Network.loadingFailed') {
        const { errorText, requestId } = message.params;
        networkErrors.push(errorText);
        console.log(`🌐 NETWORK ERROR: ${errorText}`);
      }
    });

    // Wait for page to load and collect errors
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`Console Errors: ${errors.length}`);
    console.log(`Console Warnings: ${warnings.length}`);
    console.log(`Network Errors: ${networkErrors.length}`);

    if (errors.length === 0 && warnings.length === 0 && networkErrors.length === 0) {
      console.log('\n✅ No errors detected! Site is running cleanly.\n');
    } else {
      console.log('\n⚠️  Issues detected - see details above.\n');
    }

    ws.close();
    chrome.kill();

  } catch (error) {
    console.error('❌ Error connecting to Chrome:', error.message);
    chrome.kill();
  }
}

checkConsoleErrors().catch(console.error);
