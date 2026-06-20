/* ═══════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════ */
(function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem('ya-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = saved === 'dark' ? '🌙' : '☀️';
})();

document.getElementById('themeBtn')?.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('themeIcon').textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('ya-theme', next);
});

/* ═══════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════ */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.transform = `translate(${curX - 16}px, ${curY - 16}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .bento-card, .other-proj-card, .proj-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorDot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorDot.style.opacity = '1';
});

/* ═══════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ═══════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards in the same parent
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')]
        : [];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.max(0, idx * 100));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   BENTO CARD TILT
═══════════════════════════════════════════════ */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `scale(1.02) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════════════
   HERO NAME GLITCH on hover
═══════════════════════════════════════════════ */
const nameLast = document.querySelector('.name-last');
if (nameLast) {
  nameLast.addEventListener('mouseenter', () => {
    nameLast.style.color = 'var(--accent)';
    nameLast.style.webkitTextStroke = '0';
    nameLast.style.transition = 'all 0.2s';
  });
  nameLast.addEventListener('mouseleave', () => {
    nameLast.style.color = 'transparent';
    nameLast.style.webkitTextStroke = '2px var(--heading)';
  });
}

/* ═══════════════════════════════════════════════
   TYPING EFFECT on eyebrow
═══════════════════════════════════════════════ */
const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  const texts = [
    'Étudiant · Développeur · Créateur',
    'Full Stack · Python · PHP · Java',
    'Université Marie & Louis Pasteur · I2A',
  ];
  let ti = 0, ci = 0, isDeleting = false;
  const originalText = eyebrow.innerHTML;

  // Only run typing if we can safely target the text content
  const dotSpan = eyebrow.querySelector('.eyebrow-dot');

  function type() {
    const current = texts[ti];
    if (!isDeleting) {
      ci++;
      if (dotSpan) {
        dotSpan.nextSibling
          ? (dotSpan.nextSibling.textContent = ' ' + current.slice(0, ci))
          : eyebrow.appendChild(document.createTextNode(' ' + current.slice(0, ci)));
      }
      if (ci === current.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      ci--;
      if (dotSpan && dotSpan.nextSibling) {
        dotSpan.nextSibling.textContent = ' ' + current.slice(0, ci);
      }
      if (ci === 0) {
        isDeleting = false;
        ti = (ti + 1) % texts.length;
      }
    }
    setTimeout(type, isDeleting ? 40 : 75);
  }

  // Set up text node
  if (dotSpan) {
    // Clear existing text nodes after dot
    [...eyebrow.childNodes].forEach(node => {
      if (node !== dotSpan) node.remove();
    });
    eyebrow.appendChild(document.createTextNode(''));
    setTimeout(type, 800);
  }
}

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL for nav links
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
