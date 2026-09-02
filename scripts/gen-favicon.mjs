// One-off: render the Langflow logo SVG into a real multi-size .ico file.
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("src/assets/docs-logo.svg");

const png32 = await sharp(svg, { density: 300 })
  .resize(32, 32)
  .png()
  .toBuffer();
const png48 = await sharp(svg, { density: 300 })
  .resize(48, 48)
  .png()
  .toBuffer();

const images = [
  { size: 32, data: png32 },
  { size: 48, data: png48 },
];

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

const entries = [];
let offset = header.length + images.length * 16;
for (const { size, data } of images) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += data.length;
  entries.push(entry);
}

const ico = Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
await writeFile("public/favicon.ico", ico);
console.log(`favicon.ico written (${ico.length} bytes)`);
