// === Feature: Smooth Scroll Animations ===

// Add a temporary flag to hide “reveal” elements before the observer runs
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('reveal-init');

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.body.classList.remove('reveal-init');
    return; // No animations, nothing else to do
  }

  // Pick which existing elements should animate in (no HTML changes required)
  const SELECTORS = [
    '.section-head',           // section titles
    '#services .card',         // service cards
    '#our-story .tl-card',     // timeline cards
    '#testimonials .t',        // testimonial cards
    '.svc-frame',              // services side visual
    '.story-banner'            // story banner image
  ];

  // Collect targets and add the .reveal class
  const targets = SELECTORS.flatMap(sel => Array.from(document.querySelectorAll(sel)));
  if (!targets.length) {
    document.body.classList.remove('reveal-init');
    return;
  }

  // Stagger within each <section> for a nicer rhythm (max ~240ms)
  const groupCount = new Map();
  targets.forEach(el => {
    el.classList.add('reveal');
    const group = el.closest('section') || document.body;
    const i = groupCount.get(group) || 0;
    el.style.transitionDelay = `${Math.min(i, 4) * 60}ms`;
    groupCount.set(group, i + 1);
  });

  // Observe and reveal once
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => io.observe(el));

  // Make sure above-the-fold content isn’t stuck hidden
  window.addEventListener('load', () => {
    // small timeout avoids flash if fonts/videos finish 1 frame later
    setTimeout(() => document.body.classList.remove('reveal-init'), 60);
  });
});
