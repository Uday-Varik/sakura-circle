/* =============================================
   SAKURA CIRCLE — Script
   ============================================= */

// ---- STAR CANVAS ----
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STAR_COUNT = 140;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.4 + 0.25,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.8 + 0.3,
  hue: Math.random() > 0.7 ? 300 : 270,
}));

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() / 1000;
  stars.forEach(s => {
    const alpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${s.hue}, 90%, 80%, ${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// ---- CUSTOM CURSOR ----
const cursorDot = document.getElementById('cursor-dot');
let lastTrail = 0;

document.addEventListener('mousemove', e => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';

  const now = Date.now();
  if (now - lastTrail > 75) {
    lastTrail = now;
    spawnTrail(e.clientX, e.clientY);
  }
});

const TRAIL_CHARS = ['✦', '✧', '★', '✸', '✹'];
const TRAIL_COLORS = ['#e879f9', '#ffd700', '#c084fc', '#f472b6', '#a78bfa'];

function spawnTrail(x, y) {
  const el = document.createElement('div');
  el.className = 'cursor-trail';
  const size = Math.random() * 10 + 7;
  const ox = (Math.random() - 0.5) * 22;
  const oy = (Math.random() - 0.5) * 22;
  el.style.cssText = [
    `left: ${x + ox}px`,
    `top: ${y + oy}px`,
    `font-size: ${size}px`,
    `color: ${TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)]}`,
    'opacity: 1',
    'transform: translate(-50%,-50%)',
  ].join(';');
  el.textContent = TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)];
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = '0';
    const dy = 28 + Math.random() * 28;
    const rot = (Math.random() - 0.5) * 70;
    el.style.transform = `translate(-50%, calc(-50% - ${dy}px)) rotate(${rot}deg)`;
  });

  setTimeout(() => el.remove(), 700);
}

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- BILLING TOGGLE ----
const billingToggle = document.getElementById('billing-toggle');
const foundingPrice = document.getElementById('founding-price');
const foundingAnnual = document.getElementById('founding-annual');
const memberPrice = document.getElementById('member-price');
const memberAnnual = document.getElementById('member-annual');

billingToggle.addEventListener('change', () => {
  const annual = billingToggle.checked;

  if (foundingPrice) {
    animatePrice(foundingPrice, annual ? '5.75' : '6.99');
  }
  if (memberPrice) {
    animatePrice(memberPrice, annual ? '7.42' : '9.99');
  }
  if (foundingAnnual) foundingAnnual.style.display = annual ? 'block' : 'none';
  if (memberAnnual)   memberAnnual.style.display   = annual ? 'block' : 'none';
});

function animatePrice(el, target) {
  el.style.transform = 'scale(0.85)';
  el.style.opacity = '0';
  el.style.transition = 'transform 0.18s, opacity 0.18s';
  setTimeout(() => {
    el.textContent = '$' + target;
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
  }, 180);
}

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- MOBILE NAV ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

// ---- CTA SPARKLE BURST (on btn click) ----
document.querySelectorAll('.btn-primary, .btn-card-primary').forEach(btn => {
  btn.addEventListener('click', e => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => burstSparkle(e.clientX, e.clientY), i * 40);
    }
  });
});

function burstSparkle(x, y) {
  const el = document.createElement('div');
  el.className = 'cursor-trail';
  const angle = Math.random() * Math.PI * 2;
  const dist = 30 + Math.random() * 60;
  el.style.cssText = [
    `left: ${x}px`,
    `top: ${y}px`,
    `font-size: ${10 + Math.random() * 12}px`,
    `color: ${TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)]}`,
    'opacity: 1',
    'transform: translate(-50%,-50%)',
    'transition: opacity 0.7s, transform 0.7s',
  ].join(';');
  el.textContent = TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)];
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    el.style.opacity = '0';
    el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 360}deg)`;
  });

  setTimeout(() => el.remove(), 800);
}
