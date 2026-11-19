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

// Interactive liquid-style FlexCarousel
const flexCards = Array.from(document.querySelectorAll('.flex-card'));
if (flexCards.length) {
  let activeIndex = Math.max(0, flexCards.findIndex(card => card.classList.contains('is-active')));
  let autoRotate;
  const setActiveCard = (index) => {
    activeIndex = (index + flexCards.length) % flexCards.length;
    flexCards.forEach((card, cardIndex) => {
      const active = cardIndex === activeIndex;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
    });
  };
  const stopAutoRotate = () => window.clearInterval(autoRotate);
  const startAutoRotate = () => {
    stopAutoRotate();
    autoRotate = window.setInterval(() => setActiveCard(activeIndex + 1), 3200);
  };
  flexCards.forEach((card, index) => {
    card.addEventListener('click', () => { setActiveCard(index); startAutoRotate(); });
    card.addEventListener('mouseenter', stopAutoRotate);
    card.addEventListener('mouseleave', startAutoRotate);
    card.addEventListener('focus', stopAutoRotate);
    card.addEventListener('blur', startAutoRotate);
  });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startAutoRotate();
}
