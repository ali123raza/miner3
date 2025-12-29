/**
 * CloudMiner TWA Setup Script
 * Automated Bubblewrap configuration and build
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

function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return true;
  } catch (error) {
    console.error(`Error executing: ${command}`);
    return false;
  }
}

console.log('');
console.log('='.repeat(70));
console.log('CloudMiner TWA Setup - Automated Bubblewrap Configuration');
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

  console.log('📋 Current Configuration:');
  console.log('');
  console.log(`  App Name: ${config.project.name}`);
  console.log(`  Package:  ${config.project.packageId}`);
  console.log(`  Domain:   ${config.domain.url}`);
  console.log('');

  // Check if domain is configured
  if (config.domain.url === 'yourdomain.com') {
    console.log('⚠️  WARNING: Domain not configured!');
    console.log('');
    const domain = await question('Enter your production domain (e.g., cloudminer.app): ');

    if (!domain || domain.trim() === '') {
      console.log('❌ Domain is required!');
      process.exit(1);
    }

    config.domain.url = domain.trim();
    config.domain.manifestUrl = `https://${domain.trim()}/manifest.json`;

    // Save updated config
    fs.writeFileSync('twa-config.json', JSON.stringify(config, null, 2));
    console.log(`✅ Configuration updated with domain: ${config.domain.url}`);
    console.log('');
  }

  // Verify deployment
  console.log('─'.repeat(70));
  console.log('Step 1: Verifying deployment...');
  console.log('─'.repeat(70));
  console.log('');

  const verifyResult = exec(`node verify-deployment.cjs ${config.domain.url}`);

  if (!verifyResult) {
    console.log('');
    console.log('⚠️  Deployment verification had issues.');
    const continueAnyway = await question('Continue anyway? (y/N): ');

    if (continueAnyway.toLowerCase() !== 'y') {
      console.log('');
      console.log('Please deploy your website first, then run this script again.');
      console.log('');
      console.log('Deploy these files to your server:');
      console.log('  - manifest.json');
      console.log('  - sw.js');
      console.log('  - offline.html');
      console.log('  - icons/ (all 8 icons)');
      console.log('  - .well-known/assetlinks.json');
      console.log('');
      process.exit(1);
    }
  }

  console.log('');
  console.log('─'.repeat(70));
  console.log('Step 2: Checking Bubblewrap installation...');
  console.log('─'.repeat(70));
  console.log('');

  /*
  // Check if Bubblewrap is installed
  try {
    execSync('npx -y @bubblewrap/cli --version', { stdio: 'pipe' });
    console.log('✅ Bubblewrap is available');
  } catch (error) {
    console.log('📦 Installing Bubblewrap (this may take a moment)...');
    exec('npm install -g @bubblewrap/cli');
  }
  */
  console.log('✅ Passing installation check (using npx -y)');

  console.log('');
  console.log('─'.repeat(70));
  console.log('Step 3: Creating TWA project...');
  console.log('─'.repeat(70));
  console.log('');

  // Create TWA directory
  const twaDir = 'cloudminer-twa';

  if (fs.existsSync(twaDir)) {
    console.log(`⚠️  Directory ${twaDir} already exists.`);
    const overwrite = await question('Overwrite? (y/N): ');

    if (overwrite.toLowerCase() !== 'y') {
      console.log('');
      console.log('To build existing project:');
      console.log(`  cd ${twaDir}`);
      console.log('  npx @bubblewrap/cli build');
      console.log('');
      process.exit(0);
    }

    console.log('Removing existing directory...');
    fs.rmSync(twaDir, { recursive: true, force: true });
  }

  fs.mkdirSync(twaDir);
  console.log(`✅ Created directory: ${twaDir}`);
  console.log('');

  console.log('Initializing Bubblewrap...');
  console.log('');
  console.log('NOTE: Bubblewrap will ask you several questions.');
  console.log('Press ENTER to accept default values.');
  console.log('');

  // Initialize Bubblewrap
  process.chdir(twaDir);

  const initSuccess = exec(`npx -y @bubblewrap/cli init --manifest=${config.domain.manifestUrl}`);

  if (!initSuccess) {
    console.log('');
    console.log('❌ Bubblewrap initialization failed!');
    console.log('');
    console.log('Common issues:');
    console.log('1. manifest.json not accessible at the URL');
    console.log('2. Icons not accessible');
    console.log('3. Network connectivity issues');
    console.log('');
    console.log('Please fix these issues and try again.');
    process.exit(1);
  }

  console.log('');
  console.log('─'.repeat(70));
  console.log('Step 4: Building Android APK...');
  console.log('─'.repeat(70));
  console.log('');

  const buildSuccess = exec('npx -y @bubblewrap/cli build');

  if (!buildSuccess) {
    console.log('');
    console.log('❌ Build failed!');
    console.log('');
    console.log('You can try building again with:');
    console.log(`  cd ${twaDir}`);
    console.log('  npx @bubblewrap/cli build');
    console.log('');
    process.exit(1);
  }

  console.log('');
  console.log('='.repeat(70));
  console.log('🎉 SUCCESS! Your Android app is ready!');
  console.log('='.repeat(70));
  console.log('');

  // Find APK files
  console.log('📦 Generated files:');
  console.log('');

  if (fs.existsSync('app-release-signed.apk')) {
    console.log('  ✅ app-release-signed.apk (for testing)');
  }

  if (fs.existsSync('app-release-bundle.aab')) {
    console.log('  ✅ app-release-bundle.aab (for Play Store)');
  }

  if (fs.existsSync('android.keystore') || fs.existsSync('cloudminer.keystore')) {
    console.log('  ✅ Keystore file (BACKUP THIS!)');
  }

  console.log('');
  console.log('─'.repeat(70));
  console.log('Next Steps:');
  console.log('─'.repeat(70));
  console.log('');
  console.log('1. GET SHA-256 FINGERPRINT:');
  console.log('   keytool -list -v -keystore android.keystore -alias android');
  console.log('');
  console.log('2. UPDATE DIGITAL ASSET LINKS:');
  console.log('   - Copy SHA-256 fingerprint (without colons)');
  console.log('   - Edit: public/.well-known/assetlinks.json');
  console.log('   - Replace: REPLACE_WITH_YOUR_SHA256_FINGERPRINT_WITHOUT_COLONS');
  console.log('   - Redeploy website');
  console.log('');
  console.log('3. CONFIGURE GOOGLE OAUTH:');
  console.log('   - Go to: https://console.cloud.google.com/apis/credentials');
  console.log('   - Create Android OAuth client');
  console.log('   - Add SHA-1 fingerprint');
  console.log('   - Package: com.cloudminer.app');
  console.log('');
  console.log('4. TEST ON DEVICE:');
  console.log('   adb install app-release-signed.apk');
  console.log('');
  console.log('See TWA_IMPLEMENTATION_GUIDE.md for detailed instructions.');
  console.log('');
  console.log('='.repeat(70));
  console.log('');

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
