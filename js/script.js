// Background animation
var canvas = document.getElementById('beerCanvas');
var ctx = canvas.getContext('2d');
var particles = [];
var particleCount = 280;

function particle() {
  this.x = Math.random() * canvas.width;
  this.y = canvas.height + Math.random() * 300;
  this.speed = 1 + Math.random();
  this.radius = Math.random() * 3;
  this.opacity = (Math.random() * 100) / 1000;
}

for (var i = 0; i < particleCount; i++) {
  particles.push(new particle());
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
    if (p.y <= -10) particles[i] = new particle();
  }
}

function loop() {
  requestAnimationFrame(loop);
  draw();
}

loop();

// Wallet Check Logic
let gtdWallets = [];
let fcfsWallets = [];

async function loadWalletLists() {
  try {
    const gtdRes = await fetch('https://docs.google.com/spreadsheets/d/1QZ_Uw5npIAnFm5nMdtevvmcrrXUj8e9D0RJtD8NbS7M/export?format=csv');
    const gtdData = await gtdRes.text();
    gtdWallets = gtdData
      .split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(w => w && !w.includes("wallet"));

    const fcfsRes = await fetch('https://docs.google.com/spreadsheets/d/1IeTuABc_tKagmvYilg7ctZoSYL1wXg2Fx24XiEyU6U0/export?format=csv');
    const fcfsData = await fcfsRes.text();
    fcfsWallets = fcfsData
      .split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(w => w && !w.includes("wallet"));

    console.log("Wallet lists loaded.");
  } catch (err) {
    console.error("Error loading wallets:", err);
  }
}

async function checkWallet() {
  const wallet = document.getElementById('walletInput').value.trim().toLowerCase();
  const result = document.getElementById('walletResult');

  if (!wallet) {
    result.textContent = "⚠️ Please enter a wallet address.";
    result.style.color = "red";
    return;
  }

  if (gtdWallets.length === 0 || fcfsWallets.length === 0) {
    result.textContent = "Loading wallet lists...";
    result.style.color = "orange";
    await loadWalletLists();
  }

  result.textContent = "Checking...";
  result.style.color = "orange";

  if (gtdWallets.includes(wallet)) {
    result.textContent = "✅ Guaranteed Phase (GTD) — You're eligible!";
    result.style.color = "green";
  } else if (fcfsWallets.includes(wallet)) {
    result.textContent = "✅ First Come First Serve (FCFS) — You're eligible!";
    result.style.color = "green";
  } else {
    result.textContent = "❌ Not eligible";
    result.style.color = "red";
  }
}

function toggleWalletCheck() {
  const container = document.getElementById('walletCheckContainer');
  container.style.display = container.style.display === 'block' ? 'none' : 'block';
}

// Preload the wallet lists
loadWalletLists();
