// Referensi
console.log(
  "🚀 Referensi Tutorial: https://youtu.be/vxljFhP2krI?si=VVap9yV2dZezWV99"
);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
let maxRadius = 40;

// Functions

// let mouse = { x: undefined, y: undefined };

// function updatePointer(e) {
//   mouse.x = e.clientX;
//   mouse.y = e.clientY;
// }

// function resetPointer() {
//   mouse.x = undefined;
//   mouse.y = undefined;
// }

// window.addEventListener("pointerdown", updatePointer);
// window.addEventListener("pointermove", updatePointer);
// window.addEventListener("pointerup", resetPointer);
// window.addEventListener("pointercancel", resetPointer);

// Menyimpan semua jari/pointer yang aktif: Map<pointerId, {x, y}>
const pointers = new Map();

window.addEventListener("pointerdown", (e) => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
});

window.addEventListener("pointermove", (e) => {
  // Untuk mouse biasa, tetap update meski tidak diklik; untuk jari, update jika sedang menyentuh
  if (e.pointerType === "mouse" || pointers.has(e.pointerId)) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }
});

function removePointer(e) {
  pointers.delete(e.pointerId);
}

window.addEventListener("pointerup", removePointer);
window.addEventListener("pointercancel", removePointer);
// Hapus posisi mouse jika kursor keluar dari layar browser
window.addEventListener("pointerout", (e) => {
  if (e.pointerType === "mouse") pointers.delete(e.pointerId);
});

window.addEventListener("resize", function (e) {
  canvas.width = window.innerWidth - 5;
  canvas.height = window.innerHeight - 5;
  canvas.border = 0;
  init();
});

const colors = [
  // Baris 1
  "#55EFC4", // Light Greenish Blue
  "#81ECEC", // Faded Poster
  "#74B9FF", // Green Darner Tail
  "#A29BFE", // Shy Moment
  "#DFE6E9", // City Lights

  // Baris 2
  "#00B894", // Mint Leaf
  "#00CEC9", // Robin's Egg Blue
  "#0984E3", // Electron Blue
  "#6C5CE7", // Exodus Fruit
  "#B2BEC3", // Soothing Breeze

  // Baris 3
  "#FFEAA7", // Sour Lemon
  "#FAB1A0", // First Date
  "#FF7675", // Pink Glamour
  "#FD79A8", // Pico-8 Pink
  "#636E72", // American River

  // Baris 4
  "#FDCB6E", // Bright Yarrow
  "#E17055", // Orangeville
  "#D63031", // Chi-Gong
  "#E84393", // Prunus Avium
  "#2D3436", // Dracula Orchid
];

function Circle(x, y, stepX = 2, stepY = 2, radius = radius) {
  this.x = x;
  this.y = y;
  this.stepX = stepX;
  this.stepY = stepY;
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.radius = radius;
  this.minRadius = radius;

  this.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  };

  this.update = function () {
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.stepX = -this.stepX;
    } else if (
      this.y + this.radius >= innerHeight ||
      this.y - this.radius <= 0
    ) {
      this.stepY = -this.stepY;
    }

    this.x += this.stepX;
    this.y += this.stepY;

    // interactivity
    let isNear = false;

    for (const pos of pointers.values()) {
      if (
        pos.x - this.x < 50 &&
        pos.x - this.x > -50 &&
        pos.y - this.y < 50 &&
        pos.y - this.y > -50
      ) {
        isNear = true;
        break;
      }
    }

    if (isNear && this.radius < maxRadius) {
      if (
        this.x + maxRadius < innerWidth &&
        this.x + maxRadius > 0 &&
        this.y + maxRadius < innerHeight &&
        this.y + maxRadius > 0
      ) {
        this.radius += 1;
      }
    } else if (!isNear && this.radius > this.minRadius) {
      this.radius -= 1;
    }

    this.draw();
  };
}

let circleArray = [];

function init() {
  circleArray = [];

  for (let i = 0; i < 900; i++) {
    let radius = Math.random() * 4 + 1;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let stepX = (Math.random() - 0.5) * [-1, 1][Math.floor(Math.random() * 2)];
    let stepY = (Math.random() - 0.5) * [-1, 1][Math.floor(Math.random() * 2)];

    circleArray.push(new Circle(x, y, stepX, stepY, radius));
  }
}

function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }

  requestAnimationFrame(animate);
}

animate();
init();
