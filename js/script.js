// Bubble Animation
const canvas = document.getElementById('beerCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 150;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create particles
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 4 + 1;
    this.speed = 0.5 + Math.random() * 2;
    this.opacity = Math.random() * 0.5;
  }
  
  update() {
    this.y -= this.speed;
    if (this.y < -10) {
      this.y = canvas.height + 10;
      this.x = Math.random() * canvas.width;
    }
  }
  
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  requestAnimationFrame(animate);
}

// Wallet Checker
let GTD = [];
let FCFS = [];

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  animate();
  loadLists();
  
  // Wallet Check Elements
  const checkBtn = document.getElementById('checkWalletBtn');
  const verifyBtn = document.getElementById('verifyWalletBtn');
  const walletInput = document.getElementById('walletInput');
  const resultText = document.getElementById('walletResult');
  const walletChecker = document.getElementById('walletChecker');
  
  // Toggle wallet checker
  checkBtn.addEventListener('click', () => {
    walletChecker.style.display = walletChecker.style.display === 'none' ? 'block' : 'none';
    if (walletChecker.style.display === 'block') {
      walletInput.focus();
    }
  });
  
  // Verify wallet
  verifyBtn.addEventListener('click', checkWallet);
  walletInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWallet();
  });
  
  function checkWallet() {
    const wallet = walletInput.value.trim().toLowerCase();
    
    if (!wallet.startsWith('0x') || wallet.length !== 42) {
      showResult("⚠️ Invalid wallet address", "not-eligible");
      return;
    }
    
    showResult("Checking...", "");
    
    if (GTD.includes(wallet)) {
      showResult("✅ GTD Eligible!", "gtd-eligible");
    } else if (FCFS.includes(wallet)) {
      showResult("🟡 FCFS Eligible", "fcfs-eligible");
    } else {
      showResult("❌ Not eligible", "not-eligible");
    }
  }
  
  function showResult(message, className) {
    resultText.textContent = message;
    resultText.className = className;
  }
});

// Load Google Sheets data
async function loadLists() {
  try {
    const [gtdRes, fcfsRes] = await Promise.all([
      fetch('https://docs.google.com/spreadsheets/d/1QZ_Uw5npIAnFm5nMdtevvmcrrXUj8e9D0RJtD8NbS7M/export?format=csv'),
      fetch('https://docs.google.com/spreadsheets/d/1IeTuABc_tKagmvYilg7ctZoSYL1wXg2Fx24XiEyU6U0/export?format=csv')
    ]);
    
    GTD = (await gtdRes.text()).split('\n').map(w => w.trim().toLowerCase());
    FCFS = (await fcfsRes.text()).split('\n').map(w => w.trim().toLowerCase());
    
    console.log(`Loaded ${GTD.length} GTD and ${FCFS.length} FCFS wallets`);
  } catch (error) {
    console.error("Error loading lists:", error);
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
