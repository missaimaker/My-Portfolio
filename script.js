/* ---------------------------
   NAVBAR & MENU TOGGLE
---------------------------- */
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');
const currentYear = document.getElementById('current-year');

const toggleMenu = () => {
  const isOpen = navbar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.classList.toggle('is-active', isOpen);
  menuToggle.innerHTML = isOpen
    ? '<i class="bx bx-x" aria-hidden="true"></i><span class="sr-only">Close navigation</span>'
    : '<i class="bx bx-menu" aria-hidden="true"></i><span class="sr-only">Toggle navigation</span>';
};

menuToggle?.addEventListener('click', toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navbar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-active');
    menuToggle.innerHTML =
      '<i class="bx bx-menu" aria-hidden="true"></i><span class="sr-only">Toggle navigation</span>';
  });
});

const setActiveNavLink = () => {
  const offset = 120;
  const fromTop = window.scrollY + offset;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;

    if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('load', setActiveNavLink);

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* INFINITE AUTO-SCROLL CAROUSEL WITH BUTTON CONTROLS */
function makeInfiniteCarousel(containerSelector, speed = 1) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  container.classList.add('infinite-scroll');

  // Duplicate cards for infinite effect
  const items = [...container.children];
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    container.appendChild(clone);
  });

  let scrollAmount = 0;
  let animationFrame = null;

  const autoScroll = () => {
    const halfWidth = container.scrollWidth / 2;
    scrollAmount = container.scrollLeft + speed;

    if (scrollAmount >= halfWidth) {
      scrollAmount -= halfWidth;
    }

    container.scrollLeft = scrollAmount;
    animationFrame = requestAnimationFrame(autoScroll);
  };

  const start = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(autoScroll);
  };

  const stop = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };

  container.addEventListener('mouseenter', stop);
  container.addEventListener('mouseleave', start);
  container.addEventListener('focusin', stop);
  container.addEventListener('focusout', start);

  start();

  return { start, stop, container };
}

function setupCarouselControls(containerSelector, leftBtnId, rightBtnId, step = 320, speed = 1) {
  const controls = makeInfiniteCarousel(containerSelector, speed);
  if (!controls) return;

  const { container, start, stop } = controls;
  const leftBtn = document.getElementById(leftBtnId);
  const rightBtn = document.getElementById(rightBtnId);

  const scrollByAmount = (delta) => {
    stop();
    container.scrollBy({ left: delta, behavior: 'smooth' });
    // Restart auto-scroll after the smooth scroll finishes
    setTimeout(start, 600);
  };

  leftBtn?.addEventListener('click', () => scrollByAmount(-step));
  rightBtn?.addEventListener('click', () => scrollByAmount(step));
}

// Apply infinite scroll and wire up arrow controls
setupCarouselControls('.services-container', 'services-left', 'services-right', 340, 0.6);
setupCarouselControls('.projects-grid', 'projects-left', 'projects-right', 360, 0.7);