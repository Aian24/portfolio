// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
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

// Smooth scroll offset for sticky header
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

// Active navigation highlighting
function updateActiveNav() {
  const sections = ['about', 'experience', 'projects', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      const offset = 150; // Offset for better detection
      
      if (rect.top <= offset && rect.bottom >= offset) {
        currentSection = sectionId;
      }
    }
  });
  
  // Update nav links
  navLinks.forEach(link => {
    const section = link.getAttribute('data-section');
    if (section === currentSection) {
      link.classList.add('text-white', 'font-semibold');
      link.classList.remove('text-slate-400');
    } else {
      link.classList.remove('text-white', 'font-semibold');
      link.classList.add('text-slate-400');
    }
  });
}

// Update on scroll
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
});

// Update on page load
updateActiveNav();

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe sections and cards
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section > div');
  const cards = document.querySelectorAll('#projects > div > div > div, #experience > div > div > div');
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
  });
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
  });
});
