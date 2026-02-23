/* UTIL */
const rand = (min, max) => Math.random() * (max - min) + min;

const rain = document.getElementById("rainConfetti");
const balloonHub = document.getElementById("balloonHub");
const confettiHub = document.getElementById("confettiHub");
const candlesEl = document.getElementById("candles");
const cake = document.getElementById("cake");
const song = document.getElementById("birthdaySong");

/* ::::::::::::: BUILD CANDLES ::::::::::::: */
function buildCandles(count = 5){
  candlesEl.innerHTML = "";
  for(let i=0;i<count;i++){
    const c = document.createElement("div");
    c.className = "candle";

    const flame = document.createElement("div");
    flame.className = "flame";

    c.appendChild(flame);
    candlesEl.appendChild(c);
  }
}

/* ::::::::::::: CONFETI RAIN ::::::::::::: */
function generateRainConfetti() {
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.className = "rain-piece";

    // TÜM EKRAN GENİŞLİĞİNDEN gelmesi için:
    const screenWidth = window.innerWidth;

    piece.style.left = rand(0, screenWidth) + "px";
    piece.style.top = "-20px";

    piece.style.width = rand(6, 12) + "px";
    piece.style.height = rand(8, 16) + "px";
    piece.style.background = `hsl(${rand(0,360)}, 90%, 60%)`;
    piece.style.animationDuration = rand(3, 6) + "s";
    piece.style.animationDelay = rand(0, 2) + "s";

    document.getElementById("rainConfetti").appendChild(piece);
  }
}


/* ::::::::::::: BALLOONS ::::::::::::: */
/* ::::::::::::: BETTER BALLOON SPAWNING ::::::::::::: */
function spawnBalloons() {
  const colors = [
    "#ff8fa3", "#ffd166", "#7dd3fc",
    "#b4a7ff", "#ffb3e6", "#8ef0c0"
  ];

  for (let i = 0; i < 8; i++) {
    const b = document.createElement("div");
    b.className = "balloon";

    // BALON RENGİ
    b.style.background = `
      radial-gradient(circle at 30% 25%, rgba(255,255,255,0.8), rgba(255,255,255,0.15) 40%),
      ${colors[i % colors.length]}
    `;

    // GERÇEK TAM EKRAN SPAWN
    b.style.left = rand(0, window.innerWidth - 80) + "px";
    b.style.bottom = rand(-250, -100) + "px";

    balloonHub.appendChild(b);

    // Animasyon
    const duration = rand(15000, 26000);
    const drift = rand(20, 40);

    const start = performance.now();
    const initialBottom = parseFloat(b.style.bottom);

    function floatAnim(now) {
      const p = Math.min(1, (now - start) / duration);

      b.style.bottom = (initialBottom + p * (window.innerHeight + 300)) + "px";
      b.style.transform = `
        translateX(${Math.sin(p * 5 + i) * drift}px)
      `;

      if (p < 1) {
        requestAnimationFrame(floatAnim);
      } else {
        b.remove();
      }
    }

    requestAnimationFrame(floatAnim);
  }
}

/* ::::::::::::: CLICK CONFETTI BURST ::::::::::::: */
function burst(x, y){
  for(let i=0;i<50;i++){
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = x + "px";
    c.style.top = y + "px";
    c.style.width = rand(6,12) + "px";
    c.style.height = rand(6,12) + "px";
    c.style.background = `hsl(${rand(0,360)},90%,60%)`;

    confettiHub.appendChild(c);

    const dx = rand(-300,300);
    const dy = rand(-300,300);
    const rot = rand(-720,720);
    const duration = rand(700,1400);

    const start = performance.now();
    function anim(t){
      const p = Math.min(1, (t-start)/duration);
      const ease = 1 - Math.pow(1-p,3);

      c.style.transform = `translate(${dx*ease}px, ${dy*ease}px) rotate(${rot*ease}deg)`;
      c.style.opacity = (1-ease);

      if(p<1) requestAnimationFrame(anim);
      else c.remove();
    }
    requestAnimationFrame(anim);
  }
}

/* ::::::::::::: EVENTS ::::::::::::: */
cake.addEventListener("click", () => {

  const rect = cake.getBoundingClientRect();

  // 🎂 Pasta köşeleri
  const leftBottomX = rect.left + 30;
  const leftBottomY = rect.bottom - 30;

  const rightTopX = rect.right - 30;
  const rightTopY = rect.top + 30;

  // 🌍 Sayfa köşeleri
  const pageLeftTopX = 50;
  const pageLeftTopY = 50;

  const pageRightBottomX = window.innerWidth - 50;
  const pageRightBottomY = window.innerHeight - 50;

  const burstCount = Math.floor(Math.random() * 2) + 3; // 3–4 patlama

  for(let i = 0; i < burstCount; i++){

    // Pasta sol alt
    burst(leftBottomX + rand(-20,20), leftBottomY + rand(-20,20));

    // Pasta sağ üst
    burst(rightTopX + rand(-20,20), rightTopY + rand(-20,20));

    // Sayfa sol üst
    burst(pageLeftTopX + rand(-20,20), pageLeftTopY + rand(-20,20));

    // Sayfa sağ alt
    burst(pageRightBottomX + rand(-20,20), pageRightBottomY + rand(-20,20));
  }

  song.currentTime = 0;
  song.volume = 0.5;
  song.play();
});

/* ::::::::::::: INIT ::::::::::::: */
buildCandles();
generateRainConfetti();
spawnBalloons();

setInterval(spawnBalloons, 6000);
