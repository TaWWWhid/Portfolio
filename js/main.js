// ----- Typewriter (glitch-free, single async loop) -----
document.addEventListener("DOMContentLoaded", () => {
  // prevent double start (e.g., multiple script tags or hot reload)
  if (window.__typewriterRunning) return;
  window.__typewriterRunning = true;

  const roles = ["SQA Enthusiast", "Frontend Developer", "Data Analyst", "Python Developer"];
  const el = document.getElementById("typed-text");
  const cursor = document.querySelector(".cursor");

  const TYPE = 90;        // per char type speed (ms)
  const ERASE = 45;       // per char erase speed (ms)
  const HOLD = 1400;      // pause after a word is fully typed (ms)
  const GAP  = 250;       // short pause after erase (ms)

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function typeText(text) {
    for (const ch of text) {
      el.textContent += ch;
      await sleep(TYPE);
    }
  }

  async function eraseText() {
    while (el.textContent.length) {
      el.textContent = el.textContent.slice(0, -1);
      await sleep(ERASE);
    }
  }

  async function run() {
    while (true) {
      for (const role of roles) {
        await typeText(role);
        await sleep(HOLD);
        await eraseText();
        await sleep(GAP);
      }
    }
  }

  // set cursor height after font loads so it aligns nicely
  if (cursor) {
    const setH = () => (cursor.style.height = getComputedStyle(el).lineHeight || "1.2em");
    setH();
    window.addEventListener("resize", setH);
  }

  // clear any initial text
  el.textContent = "";
  run();
});
// ----- Nav scroll-spy -----
const links = Array.from(document.querySelectorAll('.nav__links a'));

// 1) Remove any hardcoded "active" (e.g., on Home)
links.forEach(a => a.classList.remove('active'));

// 2) Map section IDs to links
const byId = {};
links.forEach(a => {
  const id = (a.getAttribute('href') || '').replace('#','');
  if (id) byId[id] = a;
});

// 3) Observe sections
const sections = Array.from(document.querySelectorAll('section[id]'));
const setActive = (id) => {
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
};

let current = null;
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      current = entry.target.id;
      setActive(current);
    }
  });
}, { root: null, threshold: 0.55 });   // ~55% in-view to count

sections.forEach(s => io.observe(s));

// 4) Immediate feedback on click (before the observer fires)
links.forEach(a => {
  a.addEventListener('click', () => {
    const id = a.getAttribute('href').replace('#','');
    if (id) setActive(id);
  });
});
