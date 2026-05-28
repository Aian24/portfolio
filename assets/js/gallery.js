/**
 * Gallery & Lightbox System
 * Handles in-card image carousels and fullscreen lightbox viewer
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── In-card Gallery Carousels ───────────────────────────────────
  const galleries = document.querySelectorAll('.project-gallery');

  galleries.forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const slides = gallery.querySelectorAll('.gallery-slide');
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    const dots = gallery.querySelectorAll('.gallery-dot');
    const counter = gallery.querySelector('.gallery-counter');
    const totalSlides = slides.length;
    let currentIndex = 0;

    if (totalSlides <= 1) {
      // Hide gallery controls for single-image projects
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      const offset = -(100 / totalSlides) * currentIndex;
      track.style.transform = `translateX(${offset}%)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Update counter
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(parseInt(dot.dataset.index));
      });
    });

    // Touch/swipe support for gallery
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });

    // Auto-advance every 5 seconds (pause on hover)
    let autoTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);

    gallery.closest('.project-card').addEventListener('mouseenter', () => {
      clearInterval(autoTimer);
    });

    gallery.closest('.project-card').addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);
    });
  });

  // ─── Fullscreen Lightbox ─────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxThumbs = document.getElementById('lightboxThumbs');

  // Collect all project images into a flat array for lightbox navigation
  let allImages = [];
  let currentLightboxIndex = 0;

  document.querySelectorAll('.gallery-slide').forEach(slide => {
    const src = slide.dataset.lightboxSrc;
    const alt = slide.querySelector('img')?.alt || '';
    if (src) {
      allImages.push({ src, alt });
    }
  });

  function openLightbox(imageSrc) {
    // Find index of clicked image
    currentLightboxIndex = allImages.findIndex(img => img.src === imageSrc);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;

    showLightboxImage(currentLightboxIndex, false);
    lightbox.classList.remove('hidden');
    lightbox.classList.add('lightbox-entering');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lightbox.classList.remove('lightbox-entering');
        lightbox.classList.add('lightbox-visible');
      });
    });

    document.body.style.overflow = 'hidden';

    // Show/hide prev/next based on count
    if (allImages.length <= 1) {
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
    } else {
      lightboxPrev.style.display = '';
      lightboxNext.style.display = '';
    }

    buildThumbnails();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox-visible');
    lightbox.classList.add('lightbox-entering');

    setTimeout(() => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('lightbox-entering');
      document.body.style.overflow = '';
    }, 300);
  }

  function showLightboxImage(index, animate = true) {
    if (index < 0) index = allImages.length - 1;
    if (index >= allImages.length) index = 0;
    currentLightboxIndex = index;

    if (animate) {
      lightboxImg.classList.add('switching');
      setTimeout(() => {
        lightboxImg.src = allImages[index].src;
        lightboxImg.alt = allImages[index].alt;
        lightboxImg.classList.remove('switching');
      }, 200);
    } else {
      lightboxImg.src = allImages[index].src;
      lightboxImg.alt = allImages[index].alt;
    }

    // Update counter
    lightboxCounter.textContent = `${index + 1} / ${allImages.length}`;

    // Update thumbnail highlights
    lightboxThumbs.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  function buildThumbnails() {
    lightboxThumbs.innerHTML = '';
    if (allImages.length <= 1) {
      lightboxThumbs.style.display = 'none';
      return;
    }
    lightboxThumbs.style.display = '';

    allImages.forEach((img, i) => {
      const thumb = document.createElement('img');
      thumb.src = img.src;
      thumb.alt = img.alt;
      thumb.className = 'lightbox-thumb' + (i === currentLightboxIndex ? ' active' : '');
      thumb.addEventListener('click', () => showLightboxImage(i));
      lightboxThumbs.appendChild(thumb);
    });
  }

  // ─── Event Listeners ─────────────────────────────────────────────

  // Click on gallery slides to open lightbox
  document.querySelectorAll('.gallery-slide').forEach(slide => {
    slide.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = slide.dataset.lightboxSrc;
      if (src) openLightbox(src);
    });
  });

  // Lightbox controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentLightboxIndex - 1);
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentLightboxIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showLightboxImage(currentLightboxIndex - 1);
        break;
      case 'ArrowRight':
        showLightboxImage(currentLightboxIndex + 1);
        break;
    }
  });

  // Touch/swipe for lightbox
  let lbTouchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = lbTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        showLightboxImage(currentLightboxIndex + 1);
      } else {
        showLightboxImage(currentLightboxIndex - 1);
      }
    }
  }, { passive: true });

  // Prevent project-ext-link clicks from bubbling to the card
  document.querySelectorAll('.project-ext-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // ─── Card Body Click → Navigate to Live Site ─────────────────────
  document.querySelectorAll('.project-card[data-link]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking gallery controls, slides, or ext links
      const clickedElement = e.target;
      const isGalleryControl = clickedElement.closest('.gallery-prev, .gallery-next, .gallery-dot, .gallery-slide, .project-ext-link');
      if (isGalleryControl) return;

      const link = card.dataset.link;
      if (link) {
        window.open(link, '_blank');
      }
    });
  });

});
