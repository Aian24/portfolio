/* Year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile menu toggle */
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close when clicking a link
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

/* Reveal on scroll (Tailwind classes only) */
const revealElements = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('opacity-0', 'translate-y-3');
      entry.target.classList.add('animate-fadeUp');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => io.observe(el));

/* Smooth scroll offset for sticky header */
const header = document.querySelector('header');
const headerHeight = header ? header.offsetHeight : 0;

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').substring(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* Spotlight effect on hero image */
document.querySelectorAll('.spotlight').forEach(container => {
  const overlay = container.querySelector('.spotlight-overlay');
  if (!overlay) return;

  const updateSpotlight = (x, y) => {
    overlay.style.background = `
      radial-gradient(200px circle at ${x}px ${y}px, rgba(255,255,255,0.18), rgba(255,255,255,0.0) 60%),
      radial-gradient(700px circle at 10% 10%, rgba(59,181,255,0.10), transparent 45%),
      radial-gradient(700px circle at 90% 20%, rgba(240,171,252,0.12), transparent 45%)
    `;
  };

  // Initial center
  const rect = container.getBoundingClientRect();
  updateSpotlight(rect.width / 2, rect.height / 2);

  container.addEventListener('mousemove', (e) => {
    const bounds = container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    updateSpotlight(x, y);
  });

  container.addEventListener('mouseleave', () => {
    const r = container.getBoundingClientRect();
    updateSpotlight(r.width / 2, r.height / 2);
  });
});

/* Email confirmation modal */
const emailModal = document.getElementById('emailModal');
const openEmailModalBtn = document.getElementById('openEmailModal');
const cancelEmailModalBtn = document.getElementById('cancelEmailModal');
const emailBackdrop = document.getElementById('emailModalBackdrop');

const closeEmailModal = () => {
  if (!emailModal) return;
  emailModal.classList.add('hidden');
};
const openEmailModal = () => {
  if (!emailModal) return;
  emailModal.classList.remove('hidden');
};

if (openEmailModalBtn) {
  openEmailModalBtn.addEventListener('click', openEmailModal);
}
if (cancelEmailModalBtn) {
  cancelEmailModalBtn.addEventListener('click', closeEmailModal);
}
if (emailBackdrop) {
  emailBackdrop.addEventListener('click', closeEmailModal);
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeEmailModal();
});