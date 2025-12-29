/**
 * Configure Digital Asset Links
 * This script helps you update assetlinks.json with the correct SHA-256 fingerprint
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

console.log('');
console.log('='.repeat(70));
console.log('Digital Asset Links Configuration');
console.log('='.repeat(70));
console.log('');

async function main() {
  // Load config
  let config;
  try {
    config = JSON.parse(fs.readFileSync('twa-config.json', 'utf8'));
  } catch (error) {
    console.error('❌ Error loading twa-config.json');
    process.exit(1);
  }

  console.log('This script will help you configure Digital Asset Links.');
  console.log('');
  console.log('Step 1: Get SHA-256 Fingerprint');
  console.log('─'.repeat(70));
  console.log('');

  // Check if keystore exists
  const keystorePaths = [
    'cloudminer-twa/android.keystore',
    'cloudminer-twa/cloudminer.keystore',
    'android.keystore',
    'cloudminer.keystore'
  ];

  let keystorePath = null;
  for (const path of keystorePaths) {
    if (fs.existsSync(path)) {
      keystorePath = path;
      break;
    }
  }

  if (!keystorePath) {
    console.log('❌ Keystore file not found!');
    console.log('');
    console.log('Please build your Android app first:');
    console.log('  node setup-twa.js');
    console.log('');
    process.exit(1);
  }

  console.log(`✅ Found keystore: ${keystorePath}`);
  console.log('');

  const keystoreAlias = await question('Enter keystore alias (default: android): ') || 'android';

  console.log('');
  console.log('Getting SHA-256 fingerprint...');
  console.log('');

  try {
    const output = execSync(
      `keytool -list -v -keystore "${keystorePath}" -alias ${keystoreAlias}`,
      { encoding: 'utf8' }
    );

    // Extract SHA256 fingerprint
    const sha256Match = output.match(/SHA256:\s*([A-F0-9:]+)/i);

    if (!sha256Match) {
      console.log('❌ Could not extract SHA-256 fingerprint!');
      console.log('');
      console.log('Please run this command manually:');
      console.log(`  keytool -list -v -keystore "${keystorePath}" -alias ${keystoreAlias}`);
      console.log('');
      console.log('Look for the line starting with "SHA256:" and copy the value.');
      process.exit(1);
    }

    const sha256WithColons = sha256Match[1];
    const sha256WithoutColons = sha256WithColons.replace(/:/g, '');

    console.log('✅ SHA-256 Fingerprint (with colons):');
    console.log(`   ${sha256WithColons}`);
    console.log('');
    console.log('✅ SHA-256 Fingerprint (without colons):');
    console.log(`   ${sha256WithoutColons}`);
    console.log('');

    // Also get SHA1 for Google OAuth
    const sha1Match = output.match(/SHA1:\s*([A-F0-9:]+)/i);
    if (sha1Match) {
      console.log('✅ SHA-1 Fingerprint (for Google OAuth):');
      console.log(`   ${sha1Match[1]}`);
      console.log('');
    }

    console.log('─'.repeat(70));
    console.log('Step 2: Update assetlinks.json');
    console.log('─'.repeat(70));
    console.log('');

    const assetlinksPath = path.join('public', '.well-known', 'assetlinks.json');

    if (!fs.existsSync(assetlinksPath)) {
      console.log('❌ assetlinks.json not found!');
      process.exit(1);
    }

    // Read current assetlinks.json
    let assetlinks = JSON.parse(fs.readFileSync(assetlinksPath, 'utf8'));

    // Update with new fingerprint
    if (assetlinks[0] && assetlinks[0].target) {
      // Replace or add the fingerprint
      assetlinks[0].target.package_name = config.project.packageId;

      if (!assetlinks[0].target.sha256_cert_fingerprints.includes(sha256WithoutColons)) {
        if (assetlinks[0].target.sha256_cert_fingerprints[0] === 'REPLACE_WITH_YOUR_SHA256_FINGERPRINT_WITHOUT_COLONS') {
          assetlinks[0].target.sha256_cert_fingerprints[0] = sha256WithoutColons;
        } else {
          assetlinks[0].target.sha256_cert_fingerprints.push(sha256WithoutColons);
        }
      }

      // Save updated assetlinks.json
      fs.writeFileSync(assetlinksPath, JSON.stringify(assetlinks, null, 2));

      console.log(`✅ Updated: ${assetlinksPath}`);
      console.log('');
      console.log('Content:');
      console.log(JSON.stringify(assetlinks, null, 2));
      console.log('');
    }

    console.log('─'.repeat(70));
    console.log('Step 3: Deploy Updated File');
    console.log('─'.repeat(70));
    console.log('');

    console.log('You MUST upload the updated assetlinks.json to:');
    console.log(`  https://${config.domain.url}/.well-known/assetlinks.json`);
    console.log('');

    console.log('After uploading, verify with:');
    console.log(`  curl https://${config.domain.url}/.well-known/assetlinks.json`);
    console.log('');

    console.log('Or use Google\'s verification tool:');
    console.log(`  https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://${config.domain.url}&relation=delegate_permission/common.handle_all_urls`);
    console.log('');

    console.log('─'.repeat(70));
    console.log('Step 4: Configure Google OAuth');
    console.log('─'.repeat(70));
    console.log('');

    if (sha1Match) {
      console.log('Go to: https://console.cloud.google.com/apis/credentials');
      console.log('');
      console.log('Create Android OAuth Client with:');
      console.log(`  Package name: ${config.project.packageId}`);
      console.log(`  SHA-1 fingerprint: ${sha1Match[1]}`);
      console.log('');
    }

    console.log('='.repeat(70));
    console.log('✅ Configuration Complete!');
    console.log('='.repeat(70));
    console.log('');

    console.log('Summary:');
    console.log(`  ✅ SHA-256 extracted: ${sha256WithoutColons.substring(0, 20)}...`);
    console.log(`  ✅ assetlinks.json updated`);
    if (sha1Match) {
      console.log(`  ✅ SHA-1 for OAuth: ${sha1Match[1].substring(0, 20)}...`);
    }
    console.log('');

    console.log('Next Steps:');
    console.log('  1. Deploy updated assetlinks.json');
    console.log('  2. Wait 5-10 minutes for Google to verify');
    console.log('  3. Configure Google OAuth (if not done)');
    console.log('  4. Install APK on device and test');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('Please run the keytool command manually:');
    console.log(`  keytool -list -v -keystore "${keystorePath}" -alias ${keystoreAlias}`);
    console.log('');
    process.exit(1);
  }

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
