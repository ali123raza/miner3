/**
 * Verify TWA Deployment
 * Checks if all required files are accessible on production server
 */

const https = require('https');
const http = require('http');

// CONFIGURE YOUR DOMAIN HERE
const DOMAIN = process.argv[2] || 'yourdomain.com';
const USE_HTTPS = true;

console.log('');
console.log('='.repeat(60));
console.log('CloudMiner TWA Deployment Verification');
console.log('='.repeat(60));
console.log('');
console.log(`Domain: ${DOMAIN}`);
console.log(`Protocol: ${USE_HTTPS ? 'HTTPS' : 'HTTP'}`);
console.log('');

const FILES_TO_CHECK = [
  '/manifest.json',
  '/sw.js',
  '/offline.html',
  '/.well-known/assetlinks.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const client = USE_HTTPS ? https : http;
    const fullUrl = `${USE_HTTPS ? 'https' : 'http'}://${DOMAIN}${url}`;

    const req = client.get(fullUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CloudMiner-TWA-Verification/1.0'
      }
    }, (res) => {
      const status = res.statusCode;
      const contentType = res.headers['content-type'] || '';

      resolve({
        url,
        status,
        contentType,
        ok: status === 200
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 0,
        contentType: '',
        ok: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        contentType: '',
        ok: false,
        error: 'Timeout'
      });
    });
  });
}

async function verifyDeployment() {
  const results = [];
  let allOk = true;

  console.log('Checking files...');
  console.log('');

  for (const file of FILES_TO_CHECK) {
    process.stdout.write(`Checking ${file}... `);
    const result = await checkUrl(file);
    results.push(result);

    if (result.ok) {
      console.log(`✅ OK (${result.status})`);
    } else {
      console.log(`❌ FAILED (${result.error || result.status})`);
      allOk = false;
    }
  }

  console.log('');
  console.log('─'.repeat(60));
  console.log('');

  if (allOk) {
    console.log('✅ All files are accessible!');
    console.log('');
    console.log('Your deployment is ready for TWA.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: twa-setup.bat');
    console.log('2. Build Android app with Bubblewrap');
    console.log('3. Test on device');
  } else {
    console.log('❌ Some files are not accessible.');
    console.log('');
    console.log('Please ensure:');
    console.log('1. Files are uploaded to production server');
    console.log('2. Server is configured to serve these files');
    console.log('3. HTTPS is properly configured');
    console.log('4. No .htaccess blocking .well-known directory');
  }

  console.log('');
  console.log('─'.repeat(60));
  console.log('');
  console.log('Additional checks:');
  console.log('');
  console.log(`Manifest:     ${USE_HTTPS ? 'https' : 'http'}://${DOMAIN}/manifest.json`);
  console.log(`Asset Links:  ${USE_HTTPS ? 'https' : 'http'}://${DOMAIN}/.well-known/assetlinks.json`);
  console.log(`Icon (512px): ${USE_HTTPS ? 'https' : 'http'}://${DOMAIN}/icons/icon-512x512.png`);
  console.log('');
  console.log('Test in Chrome DevTools:');
  console.log('1. Open your site in Chrome');
  console.log('2. DevTools → Application → Manifest');
  console.log('3. All icons should load');
  console.log('');
  console.log('='.repeat(60));
  console.log('');

  return allOk;
}

// Usage
if (require.main === module) {
  if (DOMAIN === 'yourdomain.com') {
    console.log('⚠️  Please specify your domain:');
    console.log('');
    console.log('Usage: node verify-deployment.js yourdomain.com');
    console.log('');
    console.log('Example: node verify-deployment.js cloudminer.app');
    console.log('');
    process.exit(1);
  }

  verifyDeployment()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
