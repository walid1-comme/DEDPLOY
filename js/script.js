// ===== CANVAS INITIALIZATION =====
const canvas = document.getElementById('beerCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
initCanvas();

// ===== BUBBLE ANIMATION =====
const particles = [];
const particleCount = 280;

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 300;
    this.speed = 1 + Math.random();
    this.radius = Math.random() * 3;
    this.opacity = (Math.random() * 100) / 1000;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= -10) {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

// Initialize bubbles
function initBubbles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Bubble());
  }
}
initBubbles();

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  particles.forEach(bubble => {
    bubble.update();
    bubble.draw();
  });

  requestAnimationFrame(animate);
}
animate();

// ===== WALLET CHECKER =====
let GTD = [];
let FCFS = [];

// Toggle wallet check visibility
function toggleWalletCheck() {
  const container = document.getElementById('walletCheckContainer');
  container.style.display = container.style.display === 'block' ? 'none' : 'block';
  if (container.style.display === 'block') {
    document.getElementById('walletInput').focus();
  }
}

// Fetch data from Google Sheets
async function fetchSheetData(sheetID) {
  try {
    // Use the published CSV export URL
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`
    );
    const text = await response.text();
    return text.split('\n')
      .map(line => line.trim().toLowerCase())
      .filter(line => line.startsWith('0x') && line.length === 42); // Basic ETH address validation
  } catch (error) {
    console.error('Error fetching sheet:', error);
    return [];
  }
}

// Load eligibility lists
async function loadEligibilityLists() {
  try {
    [GTD, FCFS] = await Promise.all([
      fetchSheetData('1QZ_Uw5npIAnFm5nMdtevvmcrrXUj8e9D0RJtD8NbS7M'), // GTD Sheet
      fetchSheetData('1IeTuABc_tKagmvYilg7ctZoSYL1wXg2Fx24XiEyU6U0')  // FCFS Sheet
    ]);
    console.log(`Loaded ${GTD.length} GTD and ${FCFS.length} FCFS wallets`);
  } catch (error) {
    console.error('Error loading lists:', error);
  }
}

// Check wallet eligibility
async function checkWallet() {
  const wallet = document.getElementById('walletInput').value.trim().toLowerCase();
  const result = document.getElementById('walletResult');
  
  if (!wallet) {
    showResult('Please enter a wallet address', 'error');
    return;
  }

  // Basic ETH address validation
  if (!wallet.startsWith('0x') || wallet.length !== 42) {
    showResult('Invalid wallet format', 'error');
    return;
  }

  showResult('Checking...', 'checking');

  try {
    // First check GTD list
    if (GTD.includes(wallet)) {
      showResult('✅ GTD Eligible - Guaranteed Spot!', 'gtd-eligible');
    } 
    // Then check FCFS list
    else if (FCFS.includes(wallet)) {
      showResult('🟡 FCFS Eligible - First Come First Serve', 'fcfs-eligible');
    } 
    // Not found in either list
    else {
      showResult('❌ Not eligible - Wallet not found', 'not-eligible');
    }
  } catch (error) {
    showResult('⚠️ System error - please try again', 'error');
    console.error('Wallet check error:', error);
  }
}

// Display result with styling
function showResult(message, className) {
  const result = document.getElementById('walletResult');
  result.innerHTML = message;
  result.className = className;
}

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', () => {
  initCanvas();
});

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
  // Start loading lists immediately
  loadEligibilityLists();
  
  // Set up wallet check button
  document.querySelector('.wallet-check-button')?.addEventListener('click', toggleWalletCheck);
  
  // Set up verify button
  document.querySelector('.verify-button')?.addEventListener('click', checkWallet);
  
  // Handle Enter key in wallet input
  document.getElementById('walletInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWallet();
  });
});
