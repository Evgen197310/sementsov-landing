const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

// SVG with overlapping СП letters
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0b1c2b"/>
  <text x="100" y="395" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="400" fill="#c9a962" letter-spacing="-30">С</text>
  <text x="230" y="395" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="400" fill="#efebe8" letter-spacing="-30">П</text>
</svg>`;

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

async function generate() {
  // Save the SVG
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), svg);
  console.log("Saved favicon.svg");

  // Generate PNGs
  for (const { name, size } of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Generate ICO from 48x48 PNG
  const png48 = await sharp(Buffer.from(svg))
    .resize(48, 48)
    .png()
    .toBuffer();
  
  // ICO format: simple single-image ICO
  const ico = createIco(png48, 48);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);
  console.log("Generated favicon.ico");

  console.log("\nDone! All favicons generated.");
}

// Create a minimal ICO file from a PNG buffer
function createIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size < 256 ? size : 0, 0);  // width
  entry.writeUInt8(size < 256 ? size : 0, 1);  // height
  entry.writeUInt8(0, 2);   // color palette
  entry.writeUInt8(0, 3);   // reserved
  entry.writeUInt16LE(1, 4);  // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);  // size of image data
  entry.writeUInt32LE(6 + 16, 12); // offset to image data

  return Buffer.concat([header, entry, pngBuffer]);
}

generate().catch(console.error);
