var canvas = document.getElementById('beerCanvas');
var ctx = canvas.getContext('2d');
var particles = [];
var particleCount = 280;

for (var i = 0; i < particleCount; i++) {
  particles.push(new particle());
}

function particle() {
  this.x = Math.random() * canvas.width;
  this.y = canvas.height + Math.random() * 300;
  this.speed = 1 + Math.random();
  this.radius = Math.random() * 3;
  this.opacity = (Math.random() * 100) / 1000;
}

function loop() {
  requestAnimationFrame(loop);
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
    ctx.fill();
    p.y -= p.speed;
    if (p.y <= -10)
      particles[i] = new particle();
  }
  // Your existing particle code remains exactly the same
var canvas = document.getElementById('beerCanvas');
var ctx = canvas.getContext('2d');
var particles = [];
var particleCount = 280;

for (var i = 0; i < particleCount; i++) {
  particles.push(new particle());
}

function particle() {
  this.x = Math.random() * canvas.width;
  this.y = canvas.height + Math.random() * 300;
  this.speed = 1 + Math.random();
  this.radius = Math.random() * 3;
  this.opacity = (Math.random() * 100) / 1000;
}

function loop() {
  requestAnimationFrame(loop);
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
    ctx.fill();
    p.y -= p.speed;
    if (p.y <= -10)
      particles[i] = new particle();
  }
}
loop();

// NEW Wallet Check Functions (added at the bottom)
function toggleWalletCheck() {
  const container = document.getElementById('walletCheckContainer');
  container.style.display = container.style.display === 'block' ? 'none' : 'block';
}

function checkWallet() {
  const wallet = document.getElementById('walletInput').value.trim().toLowerCase();
  const result = document.getElementById('walletResult');
  
  if (!wallet) {
    result.textContent = "Please enter a wallet";
    return;
  }
  
  result.textContent = "Checking...";
  
  // Replace this with your actual check:
  setTimeout(() => {
    if (Math.random() > 0.5) {
      result.textContent = "GTD Eligible";
    } else {
      result.textContent = "Not eligible";
    }
  }, 800);
}
}
/* Bubble Canvas Styles */
#bubbleCanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Keeps bubbles behind your content */
  pointer-events: none; /* Allows clicks to pass through */
}
// Bubble Animation (Add this at the end of script.js)
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('bubbleCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Bubble settings
  const bubbles = [];
  const bubbleCount = 150; // Adjust number of bubbles
  
  // Create bubbles
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      radius: Math.random() * 3 + 1, // Size range (1px to 4px)
      speed: 0.5 + Math.random() * 1.5, // Speed range (0.5 to 2)
      opacity: 0.1 + Math.random() * 0.4 // Transparency (0.1 to 0.5)
    });
  }
  
  // Animation loop
  function animateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bubbles.forEach(bubble => {
      // Move bubble upward
      bubble.y -= bubble.speed;
      
      // Reset bubble to bottom if it goes off screen
      if (bubble.y < -10) {
        bubble.y = canvas.height + 10;
        bubble.x = Math.random() * canvas.width;
      }
      
      // Draw bubble
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
      ctx.fill();
    });
    
    requestAnimationFrame(animateBubbles);
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  // Start animation
  animateBubbles();
});
loop();
