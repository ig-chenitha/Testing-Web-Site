const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = (index % 4) * 75 + 'ms';
  observer.observe(element);
});

// 3D liquid-inspired FlexCarousel — vanilla JavaScript, no React or build tools.
const flexCards = Array.from(document.querySelectorAll('.flex-card'));
const flexCarousel = document.querySelector('.flex-carousel');
if (flexCards.length && flexCarousel) {
  let activeIndex = Math.max(0, flexCards.findIndex(card => card.classList.contains('is-active')));
  let autoRotate = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let pointerDown = false;
  let dragged = false;
  let suppressClick = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setActiveCard = (index) => {
    activeIndex = (index + flexCards.length) % flexCards.length;
    flexCards.forEach((card, cardIndex) => {
      const active = cardIndex === activeIndex;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
    });
  };
  const stopAutoRotate = () => {
    if (autoRotate) window.clearInterval(autoRotate);
    autoRotate = null;
  };
  const startAutoRotate = () => {
    stopAutoRotate();
    if (!reducedMotion && !document.hidden) {
      autoRotate = window.setInterval(() => setActiveCard(activeIndex + 1), 3600);
    }
  };
  const resetTilt = (card) => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--shine-x', '50%');
    card.style.setProperty('--shine-y', '50%');
  };

  flexCards.forEach((card, index) => {
    card.setAttribute('aria-pressed', String(index === activeIndex));
    card.addEventListener('click', () => {
      if (suppressClick) { suppressClick = false; return; }
      setActiveCard(index);
      startAutoRotate();
    });
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || reducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--tilt-x', ((x - .5) * 5).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', ((.5 - y) * 4).toFixed(2) + 'deg');
      card.style.setProperty('--shine-x', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--shine-y', (y * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => resetTilt(card));
    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerDown = true;
      dragged = false;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      stopAutoRotate();
      card.classList.add('is-dragging');
      card.setPointerCapture?.(event.pointerId);
    });
    card.addEventListener('pointerup', (event) => {
      if (!pointerDown) return;
      pointerDown = false;
      card.classList.remove('is-dragging');
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.15) {
        dragged = true;
        suppressClick = true;
        setActiveCard(activeIndex + (dx < 0 ? 1 : -1));
        window.setTimeout(() => { suppressClick = false; }, 80);
      } else if (!dragged) {
        setActiveCard(index);
      }
      startAutoRotate();
    });
    card.addEventListener('pointercancel', () => {
      pointerDown = false;
      card.classList.remove('is-dragging');
      startAutoRotate();
    });
    card.addEventListener('mouseenter', stopAutoRotate);
    card.addEventListener('mouseleave', startAutoRotate);
    card.addEventListener('focus', stopAutoRotate);
    card.addEventListener('blur', startAutoRotate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); setActiveCard(activeIndex + 1); startAutoRotate(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setActiveCard(activeIndex - 1); startAutoRotate(); }
    });
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoRotate() : startAutoRotate());
  if (!reducedMotion) startAutoRotate();
}
