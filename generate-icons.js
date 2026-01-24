const sharp = require('sharp');

// Create a professional Teacher Notes icon
async function generateIcons() {
  // Professional icon SVG - Book with pen design
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
          <feOffset dx="0" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background with rounded corners -->
      <rect width="512" height="512" rx="110" fill="url(#grad)"/>
      
      <!-- Book -->
      <g filter="url(#shadow)">
        <!-- Book pages -->
        <rect x="140" y="120" width="232" height="280" rx="12" fill="white" opacity="0.95"/>
        
        <!-- Book spine shadow -->
        <rect x="253" y="120" width="6" height="280" fill="#667eea" opacity="0.2"/>
        
        <!-- Lines on page -->
        <line x1="170" y1="180" x2="342" y2="180" stroke="#764ba2" stroke-width="3" opacity="0.3"/>
        <line x1="170" y1="220" x2="342" y2="220" stroke="#764ba2" stroke-width="3" opacity="0.3"/>
        <line x1="170" y1="260" x2="342" y2="260" stroke="#764ba2" stroke-width="3" opacity="0.3"/>
        <line x1="170" y1="300" x2="280" y2="300" stroke="#764ba2" stroke-width="3" opacity="0.3"/>
        
        <!-- Pen -->
        <g transform="translate(320, 280) rotate(-45)">
          <!-- Pen body -->
          <rect x="0" y="0" width="80" height="16" rx="8" fill="#FFD700"/>
          <!-- Pen tip -->
          <polygon points="80,0 95,8 80,16" fill="#C0C0C0"/>
          <!-- Pen clip -->
          <rect x="10" y="2" width="8" height="12" rx="2" fill="#667eea"/>
        </g>
      </g>
      
      <!-- Subtle shine effect -->
      <circle cx="180" cy="160" r="40" fill="white" opacity="0.15"/>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  // Generate 192x192 icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');

  // Generate 512x512 icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');

  console.log('✅ Professional Teacher Notes icons generated!');
  console.log('📚 Icon: Book with pen design');
  console.log('🎨 Colors: Purple to Pink gradient');
}

generateIcons().catch(console.error);
