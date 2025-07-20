// Promo Carousel JS - adapted from librarycall.com/spanish

document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.promo-slider');
  if (!slider) return;

  // Wrap slides in a track
  let slides = Array.from(slider.querySelectorAll('.feature-box'));
  if (!slides.length) return;

  // Create track container
  let track = document.createElement('div');
  track.className = 'promo-carousel-track';

  // Move slides into track
  slides.forEach(slide => {
    let wrapper = document.createElement('div');
    wrapper.className = 'promo-carousel-slide';
    wrapper.appendChild(slide);
    track.appendChild(wrapper);
  });

  // Remove any existing slides from slider and add track
  slides.forEach(slide => slider.removeChild(slide));
  slider.insertBefore(track, slider.querySelector('.right-arrow-icon'));

  // Set up arrows
  const leftArrow = slider.querySelector('.left-arrow-icon');
  const rightArrow = slider.querySelector('.right-arrow-icon');
  leftArrow.classList.add('promo-carousel-arrow');
  rightArrow.classList.add('promo-carousel-arrow');

  let current = 1; // Center slide index

  function updateSlides() {
    let slideEls = Array.from(track.children);
    slideEls.forEach((el, idx) => {
      el.classList.toggle('active', idx === current);
    });
    // Move track
    let slideWidth = slideEls[0].offsetWidth + 40; // 40px margin
    let offset = (current * slideWidth) - (slider.offsetWidth / 2) + (slideWidth / 2);
    track.style.transform = `translateX(${-offset}px)`;
    // Disable arrows at ends
    leftArrow.disabled = current === 0;
    rightArrow.disabled = current === slideEls.length - 1;
  }

  leftArrow.addEventListener('click', function () {
    if (current > 0) {
      current--;
      updateSlides();
    }
  });

  rightArrow.addEventListener('click', function () {
    if (current < track.children.length - 1) {
      current++;
      updateSlides();
    }
  });

  // Initialize
  updateSlides();
  window.addEventListener('resize', updateSlides);
});