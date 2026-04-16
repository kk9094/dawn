/**
 * VOXEL FORGE MOTION OBSERVER
 * Handles strict 600ms bezier transitions based on view visibility.
 */
document.addEventListener('DOMContentLoaded', () => {
  const options = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.01 // Trigger nearly the moment it enters
  };

  const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Enforce the zero-bounce mechanical fade
        requestAnimationFrame(() => {
          entry.target.classList.add('is-visible');
        });
        
        // Disconnect from the node once revealed to maintain state
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  // Attach strictly to custom vf-reveal blocks
  const targetElements = document.querySelectorAll('.vf-reveal');
  targetElements.forEach(el => observer.observe(el));
});
