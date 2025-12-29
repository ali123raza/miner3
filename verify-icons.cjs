/**
 * Verify that all required icons are present
 */

const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

console.log('');
console.log('='.repeat(60));
console.log('Icon Verification');
console.log('='.repeat(60));
console.log('');

let allPresent = true;
let totalSize = 0;

ICON_SIZES.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);

  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    console.log(`✅ ${filename.padEnd(25)} (${sizeKB} KB)`);
  } else {
    console.log(`❌ ${filename.padEnd(25)} MISSING`);
    allPresent = false;
  }
});

console.log('');
console.log('─'.repeat(60));

if (allPresent) {
  console.log(`✅ All ${ICON_SIZES.length} icons present!`);
  console.log(`📦 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log('');
  console.log('✅ Ready to proceed with deployment!');
} else {
  console.log('❌ Some icons are missing.');
  console.log('');
  console.log('Run: node generate-icons.js');
  console.log('');
  console.log('Then follow the instructions to generate icons.');
}

console.log('');
console.log('='.repeat(60));
console.log('');

process.exit(allPresent ? 0 : 1);
