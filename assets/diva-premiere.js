(() => {
  if (document.documentElement.dataset.divaPremiere === 'v1') return;
  document.documentElement.dataset.divaPremiere = 'v1';

  const premiere = document.querySelector('.diva-premiere') || document.querySelector('.loader');
  if (!premiere) return;

  if (premiere.classList.contains('loader')) {
    premiere.className = 'diva-premiere';
    premiere.setAttribute('aria-hidden', 'true');
    premiere.innerHTML = `
      <div class="premiere-core">
        <div class="premiere-halo"></div>
        <img class="premiere-logo" src="/assets/yass-noir-logo.svg?v=3" alt="" width="350" height="230">
        <div class="premiere-line"></div>
        <div class="premiere-credit">A private identity · VibraAlto</div>
      </div>`;
  }

  const body = document.body;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sessionKey = 'yn.premiere.seen.v1';
  let seen = false;

  try {
    seen = sessionStorage.getItem(sessionKey) === '1';
    sessionStorage.setItem(sessionKey, '1');
  } catch {
    seen = false;
  }

  const anchorEntry = Boolean(location.hash && location.hash !== '#');
  const encore = seen || anchorEntry;
  const duration = reducedMotion.matches ? 160 : encore ? 420 : 1550;

  if (encore) premiere.classList.add('is-encore');
  premiere.dataset.mode = encore ? 'encore' : 'premiere';
  premiere.dataset.duration = String(duration);

  body.classList.add('premiere-lock', 'premiere-running');
  body.classList.remove('premiere-done');

  performance.mark?.('yn-premiere-start');

  let finished = false;
  let arrivalTimer = 0;

  const finish = source => {
    if (finished) return;
    finished = true;

    body.classList.remove('premiere-lock', 'premiere-running');
    body.classList.add('premiere-done', 'premiere-arrival');
    premiere.dataset.state = 'complete';

    clearTimeout(arrivalTimer);
    arrivalTimer = window.setTimeout(() => body.classList.remove('premiere-arrival'), 960);

    performance.mark?.('yn-premiere-end');
    try {
      performance.measure?.('yn-premiere', 'yn-premiere-start', 'yn-premiere-end');
    } catch {}

    body.dispatchEvent(new CustomEvent('yn:premiereend', {
      detail: {
        mode: encore ? 'encore' : 'premiere',
        duration,
        source
      }
    }));

    window.setTimeout(() => premiere.remove(), 80);
  };

  const onAnimationEnd = event => {
    if (event.target !== premiere || event.animationName !== 'premiereExit') return;
    finish('animationend');
  };

  premiere.addEventListener('animationend', onAnimationEnd, { once: true });

  requestAnimationFrame(() => {
    premiere.dataset.state = 'playing';
    premiere.classList.add('is-playing');
  });

  window.setTimeout(() => finish('fallback'), duration + 180);
})();
