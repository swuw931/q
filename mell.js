// mell.js — финальный слот с плавной анимацией и правильной логикой

document.addEventListener('DOMContentLoaded', () => {
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  document.querySelectorAll('a.nav-link[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

// 🔹 Плавное появление всех секций по ID
// 🔹 Плавное появление всех основных блоков (section, footer, main элементы и т.д.)
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Добавляем reveal ко всем элементам, у которых есть id
// + ко всем крупным контейнерам в main
document.querySelectorAll('section[id], footer, main > div, main > section, .slot-wrapper, .video-block')
  .forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  const logoBtn = document.getElementById('logoButton');
  if (logoBtn) logoBtn.addEventListener('click', () => window.open('https://mellstroy.game', '_blank'));

  // -------------------- СЛОТ --------------------
  const spinButton = document.getElementById('spinButton');
  const reels = [ 'reel1', 'reel2', 'reel3' ].map(id => document.getElementById(id));
  const slotMsg = document.getElementById('slotMessage');

  const WIN_IMG = 'img/img11.png';
  const LOSE_IMG = 'img/img12.png';
  const SYMBOLS = [WIN_IMG, LOSE_IMG];
  let failStreak = 0;

  reels.forEach(reel => {
    if (!reel.querySelector('img')) {
      const img = document.createElement('img');
      img.src = LOSE_IMG;
      img.alt = 'slot';
      reel.appendChild(img);
    }
  });

  function getWinChance() {
    const base = 0.08;
    const extra = Math.min(failStreak * 0.1, 0.5);
    return base + extra;
  }

  async function animateReel(reel, finalSrc) {
    const oldImg = reel.querySelector('img');
    const newImg = document.createElement('img');
    newImg.src = finalSrc;
    newImg.alt = 'slot';
    newImg.classList.add('new');

    if (oldImg) oldImg.classList.add('old');
    reel.appendChild(newImg);

    await sleep(600);
    if (oldImg) oldImg.remove();
    newImg.classList.remove('new');
  }

  spinButton.addEventListener('click', async () => {
    spinButton.disabled = true;
    slotMsg.textContent = 'Крутим... 🎰';

    const winChance = getWinChance();
    const willWin = Math.random() < winChance;

    const results = willWin
      ? [WIN_IMG, WIN_IMG, WIN_IMG]
      : reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

    const promises = reels.map((reel, i) =>
      sleep(i * 250).then(() => animateReel(reel, results[i]))
    );

    await Promise.all(promises);

    const allWin = results.every(src => src === WIN_IMG);
    if (allWin) {
      slotMsg.textContent = '🎉 АМ АМ, 3 логотипа mellstroy.game = победа 🎰';
      failStreak = 0;
      createConfetti();
    } else {
      slotMsg.textContent = 'Не повезло 😏 Попробуй ещё раз!';
      failStreak++;
    }

    spinButton.disabled = false;
  });

  function createConfetti() {
    const colors = ['#8e44ad','#9b59b6','#ffffff','#bfc6cc'];
    for (let i = 0; i < 25; i++) {
      const c = document.createElement('div');
      c.style.position = 'fixed';
      c.style.top = '-10px';
      c.style.left = Math.random() * 100 + '%';
      c.style.width = '8px';
      c.style.height = '8px';
      c.style.borderRadius = '50%';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.zIndex = 9999;
      document.body.appendChild(c);
      const dur = 2000 + Math.random() * 1000;
      const x = (Math.random() - 0.5) * 300;
      c.animate([
        { transform: 'translate(0,0)', opacity: 1 },
        { transform: `translate(${x}px,100vh)`, opacity: 0.5 }
      ], { duration: dur, easing: 'ease-in' });
      setTimeout(() => c.remove(), dur);
    }
  }
});


// --- Соцсети переходы ---
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const link = btn.dataset.link;
    if (link) window.open(link, '_blank');
  });
});