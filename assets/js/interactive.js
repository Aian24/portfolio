/**
 * Interactive Effects System
 * Typing animation, scroll progress, cursor glow, counters, 
 * section reveals, tilt cards, button ripples
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Typing Animation ─────────────────────────────────────────────
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'web applications',
      'responsive dashboards',
      'business tools',
      'e-commerce systems',
      'POS integrations',
      'clean interfaces'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before next word
      }

      setTimeout(type, typeSpeed);
    }

    // Start typing after a brief delay
    setTimeout(type, 800);
  }

  // ─── Scroll Progress Bar ───────────────────────────────────────────
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }, { passive: true });
  }

  // ─── Cursor Glow ──────────────────────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(min-width: 768px)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateGlow() {
      // Smooth follow with lerp
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ─── Animated Counters ────────────────────────────────────────────
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ─── Section Reveal on Scroll ─────────────────────────────────────
  const revealSections = document.querySelectorAll('.reveal-section');
  const staggerContainers = document.querySelectorAll('.stagger-children');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealSections.forEach(section => revealObserver.observe(section));
  staggerContainers.forEach(container => revealObserver.observe(container));

  // Trigger counter animation when hero stats come into view
  const heroStats = document.getElementById('heroStats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(heroStats);
  }

  // ─── Tilt Card Effect ─────────────────────────────────────────────
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // ─── Button Ripple Effect ─────────────────────────────────────────
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ─── Enhanced Nav Active State ────────────────────────────────────
  function updateNavUnderlines() {
    const sections = ['about', 'experience', 'projects', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link-enhanced');

    let currentSection = '';
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = sectionId;
        }
      }
    });

    navLinks.forEach(link => {
      const section = link.getAttribute('data-section');
      if (section === currentSection) {
        link.classList.add('active-nav');
      } else {
        link.classList.remove('active-nav');
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateNavUnderlines);
  }, { passive: true });

  updateNavUnderlines();

});
