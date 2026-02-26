const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext("2d");

// Background gradient
const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
grad.addColorStop(0, "#0b1c2b");
grad.addColorStop(0.5, "#1e3a51");
grad.addColorStop(1, "#0b1c2b");
ctx.fillStyle = grad;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Decorative accent line at top
ctx.fillStyle = "#c9a962";
ctx.fillRect(0, 0, WIDTH, 6);

// Decorative circle
ctx.beginPath();
ctx.arc(1050, 150, 200, 0, Math.PI * 2);
ctx.fillStyle = "rgba(201, 169, 98, 0.07)";
ctx.fill();

ctx.beginPath();
ctx.arc(150, 500, 150, 0, Math.PI * 2);
ctx.fillStyle = "rgba(30, 58, 81, 0.3)";
ctx.fill();

// Subtitle
ctx.fillStyle = "#c9a962";
ctx.font = "bold 22px sans-serif";
ctx.fillText("МОСКОВСКАЯ КОЛЛЕГИЯ АДВОКАТОВ", 80, 180);

// Accent line under subtitle
ctx.fillStyle = "#c9a962";
ctx.fillRect(80, 200, 100, 4);

// Main title line 1
ctx.fillStyle = "#efebe8";
ctx.font = "bold 64px serif";
ctx.fillText("Семенцов", 80, 280);

// Main title line 2
ctx.font = "bold 64px serif";
ctx.fillText("и Партнёры", 80, 355);

// Description
ctx.fillStyle = "#8b9caa";
ctx.font = "24px sans-serif";
ctx.fillText("Юридическая защита бизнеса и граждан с 1997 года", 80, 420);

// Stats
const stats = [
  { value: "27+", label: "лет практики" },
  { value: "11", label: "адвокатов" },
  { value: "18", label: "направлений" },
];

let sx = 80;
stats.forEach((s) => {
  ctx.fillStyle = "#c9a962";
  ctx.font = "bold 42px serif";
  ctx.fillText(s.value, sx, 510);
  ctx.fillStyle = "#8b9caa";
  ctx.font = "18px sans-serif";
  ctx.fillText(s.label, sx, 540);
  sx += 200;
});

// Phone
ctx.fillStyle = "#efebe8";
ctx.font = "bold 22px sans-serif";
ctx.fillText("+7 (495) 629-82-50", 80, 590);

// Domain
ctx.fillStyle = "#c9a962";
ctx.font = "20px sans-serif";
ctx.fillText("sementsov.trust.moscow", 900, 590);

// Bottom accent line
ctx.fillStyle = "#c9a962";
ctx.fillRect(0, HEIGHT - 6, WIDTH, 6);

// Save
const outPath = path.join(__dirname, "..", "public", "og-image.png");
const buf = canvas.toBuffer("image/png");
fs.writeFileSync(outPath, buf);
console.log("OG image saved to", outPath, "(" + buf.length + " bytes)");
