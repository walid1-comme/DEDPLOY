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
  let GTD = [];
let FCFS = [];

async function fetchList(csvUrl) {
  const res = await fetch(csvUrl);
  const txt = await res.text();
  return txt
    .split('\n')
    .map(line => line.trim().toLowerCase())
    .filter(line => line);
}

async function loadLists() {
  GTD = await fetchList('https://docs.google.com/spreadsheets/d/1QZ_Uw5npIAnFm5nMdtevvmcrrXUj8e9D0RJtD8NbS7M/export?format=csv');
  FCFS = await fetchList('https://docs.google.com/spreadsheets/d/1IeTuABc_tKagmvYilg7ctZoSYL1wXg2Fx24XiEyU6U0/export?format=csv');
}

function checkWallet() {
  const input = document.getElementById('walletInput').value.trim().toLowerCase();
  const result = document.getElementById('walletResult');

  if (!input) {
    result.textContent = '❗ Please enter a wallet address.';
    return;
  }

  if (GTD.includes(input)) {
    result.textContent = '✅ Wallet is in GTD list.';
  } else if (FCFS.includes(input)) {
    result.textContent = '✅ Wallet is in FCFS list.';
  } else {
    result.textContent = '❌ Wallet not found.';
  }
}

window.onload = loadLists;

}
loop();
