const canvas = document.getElementById("blinkieCanvas");
const ctx = canvas.getContext("2d");

const textInput = document.getElementById("textInput");
const textColor = document.getElementById("textColor");
const fontSize = document.getElementById("fontSize");
const backgroundColor = document.getElementById("backgroundColor");
const borderUpload = document.getElementById("borderUpload");
const animationSelect = document.getElementById("animationSelect");
const speedInput = document.getElementById("speedInput");

let borderImage = null;
let animationFrame = 0;
let animationStart = performance.now();

function drawBlinkie(time = performance.now()) {
const text = textInput.value;
const color = textColor.value;
const size = Number(fontSize.value);

// Background
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = backgroundColor.value;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Animation values
const animation = animationSelect.value;
const speed = Number(speedInput.value);

let alpha = 1;
let scale = 1;
let textFill = color;

if (animation === "blink") {
const interval = 300 - speed * 20;
alpha = Math.floor(time / interval) % 2 === 0 ? 1 : 0.15;
}

if (animation === "pulse") {
const pulse = Math.sin(time / (300 - speed * 15));
scale = 1 + pulse * 0.08;
}

if (animation === "rainbow") {
const hue = (time / (30 - speed * 2)) % 360;
textFill = hsl(${hue}, 100%, 70%);
}

// Text
ctx.save();

ctx.globalAlpha = alpha;
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(scale, scale);

ctx.font = 800 ${size}px Arial, sans-serif;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// Text shadow
ctx.fillStyle = "rgba(0, 70, 110, 0.35)";
ctx.fillText(text, 2, 2);

// Main text
ctx.fillStyle = textFill;
ctx.fillText(text, 0, 0);

ctx.restore();

// Custom border
if (borderImage) {
ctx.drawImage(
borderImage,
0,
0,
canvas.width,
canvas.height
);
}

animationFrame = requestAnimationFrame(drawBlinkie);
}

borderUpload.addEventListener("change", (event) => {
const file = event.target.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = () => {
const image = new Image();

image.onload = () => {
  borderImage = image;
};

image.src = reader.result;


};

reader.readAsDataURL(file);
});

document.getElementById("removeBorder").addEventListener("click", () => {
borderImage = null;
borderUpload.value = "";
});

document.getElementById("clearBtn").addEventListener("click", () => {
textInput.value = "";
borderImage = null;
borderUpload.value = "";
animationSelect.value = "none";
backgroundColor.value = "#73c9f5";
});

document.getElementById("exportBtn").addEventListener("click", () => {
const link = document.createElement("a");

link.download = "my-blinkie.png";
link.href = canvas.toDataURL("image/png");

link.click();
});

// Restart animation timing when settings change
animationSelect.addEventListener("change", () => {
animationStart = performance.now();
});

speedInput.addEventListener("input", () => {
animationStart = performance.now();
});

// Redraw whenever an editor setting changes
[
textInput,
textColor,
fontSize,
backgroundColor
].forEach(element => {
element.addEventListener("input", () => {
// The animation loop automatically picks up the new values.
});
});

// Start renderer
requestAnimationFrame(drawBlinkie);
