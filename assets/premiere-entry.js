(() => {
  const loader = document.querySelector('.loader[data-premiere="v1"]');
  if (!loader || document.documentElement.dataset.premiereRuntime === 'v1') return;

  document.documentElement.dataset.premiereRuntime = 'v1';
  const body = document.body;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'yn.premiere.seen.v1';

  let seen = false;
  try { seen = sessionStorage.getItem(key) === '1'; } catch {}

  const fullDuration = reducedMotion.matches ? 420 : 1500;
  const repeatDuration = reducedMotion.matches ? 220 : 620;
  const duration = seen ? repeatDuration : fullDuration;

  body.classList.add('premiere-running');
  body.dataset.premiere = seen ? 'recall' : 'opening';

  const finish = () => {
    if (body.classList.contains('premiere-reveal')) return;
    body.classList.add('premiere-reveal');
    body.classList.remove('premiere-running');
    loader.setAttribute('aria-hidden', 'true');

    try { sessionStorage.setItem(key, '1'); } catch {}

    body.dispatchEvent(new CustomEvent('yn:premierecomplete', {
      detail: { mode: seen ? 'recall' : 'opening', duration }
    }));

    window.setTimeout(() => {
      loader.classList.add('hide');
      body.dataset.premiere = 'complete';
    }, reducedMotion.matches ? 40 : 540);
  };

  window.setTimeout(finish, duration);

  // Never trap the visitor behind presentation chrome if the tab resumes late.
  window.setTimeout(finish, Math.max(duration + 1200, 2600));
})();
