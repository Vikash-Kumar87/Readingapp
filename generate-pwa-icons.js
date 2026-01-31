const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generatePWAIcons() {
  const logoPath = path.join(__dirname, 'public', 'logo.png');
  const outputDir = path.join(__dirname, 'public');

  // Check if logo.png exists
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Error: logo.png not found in public folder');
    process.exit(1);
  }

  console.log('📱 Generating PWA icons from logo.png...\n');

  try {
    // Generate 192x192 icon
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'pwa-192x192.png'));
    
    console.log('✅ Generated: pwa-192x192.png');

    // Generate 512x512 icon
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'pwa-512x512.png'));
    
    console.log('✅ Generated: pwa-512x512.png');

    console.log('\n🎉 PWA icons successfully generated in public folder!');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generatePWAIcons();
