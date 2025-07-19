// Particle animation
const canvas = document.getElementById('beerCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 280;

// Resize canvas to full window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Initialize particles
function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 300;
    this.speed = 1 + Math.random();
    this.radius = Math.random() * 3;
    this.opacity = (Math.random() * 100) / 1000;
  }
}

// Wallet eligibility lists
let GTD = [];
let FCFS = [];

// Fetch CSV data from Google Sheets
async function fetchList(csvUrl) {
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error('Failed to fetch list');
    const txt = await res.text();
    return txt
      .split('\n')
      .map(line => line.trim().toLowerCase())
      .filter(line => line);
  } catch (error) {
    console.error('Error fetching list:', error);
    return [];
  }
}

// Load both eligibility lists
async function loadLists() {
  try {
    [GTD, FCFS] = await Promise.all([
      fetchList('https://docs.google.com/spreadsheets/d/1QZ_Uw5npIAnFm5nMdtevvmcrrXUj8e9D0RJtD8NbS7M/export?format=csv'),
      fetchList('https://docs.google.com/spreadsheets/d/1IeTuABc_tKagmvYilg7ctZoSYL1wXg2Fx24XiEyU6U0/export?format=csv')
    ]);
    console.log('Lists loaded successfully');
  } catch (error) {
    console.error('Error loading lists:', error);
  }
}

// Check wallet eligibility
function checkWallet() {
  const input = document.getElementById('walletInput').value.trim().toLowerCase();
  const result = document.getElementById('walletResult');

  if (!input) {
    result.textContent = '❗ Please enter a wallet address';
    return;
  }

  result.textContent = 'Checking...';

  // Small delay to allow UI to update before heavy computation
  setTimeout(() => {
    if (GTD.includes(input)) {
      result.textContent = '✅ GTD Eligible';
    } else if (FCFS.includes(input)) {
      result.textContent = '✅ FCFS Eligible';
    } else {
      result.textContent = '❌ Not eligible';
    }
  }, 100);
}

// Animation loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
    ctx.fill();
    p.y -= p.speed;
    if (p.y <= -10) particles[i] = new Particle();
  }
}

// Main animation loop
function loop() {
  draw();
  requestAnimationFrame(loop);
}

// Initialize everything
function init() {
  resizeCanvas();
  initParticles();
  loadLists();
  
  // Reinitialize on resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
  
  // Start animation
  loop();
}

// Start when page loads
window.addEventListener('load', init);
