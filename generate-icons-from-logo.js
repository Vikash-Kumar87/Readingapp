const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function generateIcons() {
  const publicDir = path.join(__dirname, 'public');
  const logoPath = path.join(publicDir, 'logo.png');

  if (!fs.existsSync(logoPath)) {
    console.error('❌ Error: logo.png not found in public folder!');
    console.log('📝 Please save your logo as "logo.png" in the public folder');
    process.exit(1);
  }

  try {
    console.log('🎨 Generating PWA icons...');

    // Generate 192x192 icon
    await sharp(logoPath)
      .resize(192, 192, { fit: 'contain', background: { r: 102, g: 126, b: 234, alpha: 1 } })
      .toFile(path.join(publicDir, 'pwa-192x192.png'));
    console.log('✅ Generated pwa-192x192.png');

    // Generate 512x512 icon
    await sharp(logoPath)
      .resize(512, 512, { fit: 'contain', background: { r: 102, g: 126, b: 234, alpha: 1 } })
      .toFile(path.join(publicDir, 'pwa-512x512.png'));
    console.log('✅ Generated pwa-512x512.png');

    console.log('🎉 All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
