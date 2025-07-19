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

// Wallet Check Functions
function toggleWalletCheck() {
  const container = document.getElementById('walletCheckContainer');
  container.style.display = container.style.display === 'block' ? 'none' : 'block';
}

// Cache for wallet lists
let gtdWallets = [];
let fcfsWallets = [];

// Load wallet lists from Google Sheets
async function loadWalletLists() {
  try {
    // GTD Sheet
    const gtdResponse = await fetch('https://docs.google.com/spreadsheets/d/1QZ_Uw5npIAnFm5nMdtevvmcrrXUj8e9D0RJtD8NbS7M/gviz/tq?tqx=out:csv');
    const gtdData = await gtdResponse.text();
    gtdWallets = gtdData.split('\n').map(wallet => wallet.trim().toLowerCase());
    
    // FCFS Sheet
    const fcfsResponse = await fetch('https://docs.google.com/spreadsheets/d/1IeTuABc_tKagmvYilg7ctZoSYL1wXg2Fx24XiEyU6U0/gviz/tq?tqx=out:csv');
    const fcfsData = await fcfsResponse.text();
    fcfsWallets = fcfsData.split('\n').map(wallet => wallet.trim().toLowerCase());
    
    console.log('Wallet lists loaded successfully');
  } catch (error) {
    console.error('Error loading wallet lists:', error);
  }
}

// Check wallet against the lists
async function checkWallet() {
  const wallet = document.getElementById('walletInput').value.trim().toLowerCase();
  const result = document.getElementById('walletResult');
  
  if (!wallet) {
    result.textContent = "Please enter a wallet address";
    result.style.color = "red";
    return;
  }
  
  // If lists haven't been loaded yet, load them
  if (gtdWallets.length === 0 || fcfsWallets.length === 0) {
    result.textContent = "Loading wallet lists...";
    result.style.color = "orange";
    await loadWalletLists();
  }
  
  result.textContent = "Checking...";
  result.style.color = "orange";
  
  // Check against the lists
  if (gtdWallets.includes(wallet)) {
    result.textContent = "✅ GTD Eligible";
    result.style.color = "green";
  } else if (fcfsWallets.includes(wallet)) {
    result.textContent = "✅ FCFS Eligible";
    result.style.color = "green";
  } else {
    result.textContent = "❌ Not eligible";
    result.style.color = "red";
  }
}

// Load wallet lists when the page loads
loadWalletLists();
