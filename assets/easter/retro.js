// Konami-style "Retro Mode" toggler for DryChess
// Place at: assets/easter/konami.js
(function () {
  const sequence = ['b','a'];
  let pos = 0;

  function showBanner(text) {
    const existing = document.querySelector('.egg-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.className = 'egg-banner';
    banner.textContent = text;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 20);
    setTimeout(() => banner.classList.remove('visible'), 2800);
    setTimeout(() => banner.remove(), 3200);
  }

  function setRetro(on) {
    if (on) {
      document.body.classList.add('retro');
      try { localStorage.setItem('drychess_retro', '1'); } catch (e) {}
      showBanner('RETRO MODE ACTIVATED');
    } else {
      document.body.classList.remove('retro');
      try { localStorage.removeItem('drychess_retro'); } catch (e) {}
      showBanner('RETRO MODE DEACTIVATED');
    }
  }

  function toggleRetro() {
    const isOn = document.body.classList.contains('retro');
    setRetro(!isOn);
  }

  window.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === sequence[pos]) {
      pos++;
      if (pos === sequence.length) {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
          showBanner('RETRO MODE available — enable in Settings (reduced motion)');
        } else {
          toggleRetro();
        }
        pos = 0;
      }
    } else {
      pos = 0;
    }
  });

  // click-logo trigger (7 quick clicks)
  (function () {
    const logo = document.querySelector('img[alt*="Dry"]') || document.querySelector('img[alt*="DryBlob"]') || document.querySelector('img');
    if (!logo) return;
    let clicks = 0, last = 0;
    logo.addEventListener('click', () => {
      const now = Date.now();
      if (now - last < 1000) {
        clicks++;
      } else {
        clicks = 1;
      }
      last = now;
      if (clicks >= 7) {
        toggleRetro();
        clicks = 0;
      }
    });
  })();

  // Reapply saved setting on load
  document.addEventListener('DOMContentLoaded', () => {
    try {
      if (localStorage.getItem('drychess_retro') === '1') {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) document.body.classList.add('retro');
      }
    } catch (e) {}
  });
})();
