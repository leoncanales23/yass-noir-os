(() => {
  const carousel = document.querySelector('.archive-carousel');
  if (!carousel || carousel.dataset.runtime === 'v2') return;

  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const viewport = carousel.querySelector('.carousel-viewport');
  if (!track || !viewport || !slides.length) return;

  carousel.dataset.runtime = 'v2';
  carousel.dataset.controller = 'cinematic-carousel';

  if (!document.querySelector('link[data-yn="cinematic-breathing"]')) {
    const breathingStyles = document.createElement('link');
    breathingStyles.rel = 'stylesheet';
    breathingStyles.href = '/assets/cinematic-breathing.css?v=2';
    breathingStyles.dataset.yn = 'cinematic-breathing';
    document.head.appendChild(breathingStyles);
  }

  if (!document.querySelector('style[data-yn="cinematic-runtime-v2"]')) {
    const style = document.createElement('style');
    style.dataset.yn = 'cinematic-runtime-v2';
    style.textContent = `
      .archive{position:relative;background:radial-gradient(circle at 50% 38%,rgba(179,72,208,.07),transparent 34%),linear-gradient(180deg,#0c0a0b,#070607 82%)}
      .archive-carousel{--film-progress:0;max-width:min(1240px,94vw);outline:none;touch-action:pan-y}
      .archive-carousel:focus-visible{outline:1px solid rgba(199,163,106,.42);outline-offset:8px}
      .carousel-viewport{position:relative;isolation:isolate;border-color:rgba(199,163,106,.24);background:#030303;box-shadow:0 38px 130px rgba(0,0,0,.62),0 0 55px rgba(179,72,208,.08)}
      .carousel-viewport:before,.carousel-viewport:after{content:'';position:absolute;z-index:6;left:0;right:0;height:8%;pointer-events:none}
      .carousel-viewport:before{top:0;background:linear-gradient(180deg,rgba(0,0,0,.48),transparent)}
      .carousel-viewport:after{bottom:0;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent)}
      .carousel-slide{isolation:isolate;transition:background .7s ease}
      .carousel-slide:before{content:'';position:absolute;z-index:-2;inset:-9%;background-image:var(--film-bg);background-size:cover;background-position:center;filter:blur(34px) saturate(.58) brightness(.28);transform:scale(1.12);opacity:.72;transition:opacity .9s ease,filter .9s ease}
      .carousel-slide:after{z-index:-1;background:radial-gradient(circle at 50% 44%,rgba(179,72,208,.08),transparent 40%),linear-gradient(90deg,rgba(3,3,3,.72),rgba(3,3,3,.14) 25%,rgba(3,3,3,.14) 75%,rgba(3,3,3,.72))}
      .carousel-slide img{position:relative;z-index:2;width:auto;height:auto;max-width:94%;max-height:92%;filter:saturate(.88) contrast(1.035) brightness(.94);box-shadow:0 28px 90px rgba(0,0,0,.55);transition:transform 1.2s cubic-bezier(.2,.7,.2,1),filter .8s ease,opacity .65s ease;will-change:transform}
      .carousel-slide.is-portrait img{max-width:min(68%,620px);max-height:94%}
      .carousel-slide.is-landscape img{max-width:96%;max-height:90%}
      .carousel-slide:not(.is-active) img{opacity:.72;transform:scale(.975)}
      .carousel-slide.is-active img{opacity:1;transform:scale(1)}
      .carousel-slide.is-active:before{opacity:.88;filter:blur(36px) saturate(.66) brightness(.31)}
      .carousel-count{font-size:8px;letter-spacing:.32em;padding:9px 12px;border:1px solid rgba(199,163,106,.2);background:rgba(5,5,5,.5);backdrop-filter:blur(9px);color:#d4b87e;transition:border-color .45s ease,background .45s ease}
      .carousel-slide.is-active .carousel-count{border-color:rgba(199,163,106,.36);background:rgba(5,5,5,.62)}
      .carousel-button{border-color:rgba(199,163,106,.36);background:rgba(5,5,5,.48);box-shadow:0 10px 34px rgba(0,0,0,.28)}
      .carousel-button:hover{box-shadow:0 0 30px rgba(179,72,208,.18)}
      .cinematic-progress{position:absolute;z-index:8;left:50%;bottom:0;width:min(420px,42vw);height:1px;transform:translateX(-50%);background:rgba(255,255,255,.09);overflow:hidden;pointer-events:none}
      .cinematic-progress span{display:block;width:100%;height:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,var(--gold),var(--violet));box-shadow:0 0 12px rgba(179,72,208,.4)}
      .cinematic-progress.running span{animation:ynFilmProgress 5.2s linear forwards}
      .archive-carousel.is-paused .cinematic-progress.running span{animation-play-state:paused}
      .cinematic-announcer{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
      .archive-carousel.is-sleeping .carousel-track{will-change:auto}
      .archive-carousel.is-sleeping .carousel-slide img{will-change:auto}
      .archive-carousel.is-sleeping .carousel-slide:before{opacity:0;filter:none}
      .archive-carousel.is-sleeping .carousel-viewport{box-shadow:none}
      .archive-carousel.is-sleeping .cinematic-progress{opacity:0}
      @keyframes ynFilmProgress{to{transform:scaleX(1)}}
      .carousel-dots{margin-top:26px}
      .carousel-dot{height:1px;background:rgba(255,255,255,.16)}
      .carousel-dot.active{box-shadow:0 0 13px rgba(199,163,106,.28)}
      @media(min-width:901px){.archive-head{margin-bottom:64px}.carousel-slide{height:min(82svh,900px)}}
      @media(max-width:900px){.archive-carousel{max-width:100%}.carousel-slide{height:min(76svh,760px);min-height:520px;padding:8px}.carousel-slide.is-portrait img{max-width:94%;max-height:94%}.carousel-slide.is-landscape img{max-width:98%;max-height:88%}.carousel-slide:before{inset:-14%;filter:blur(26px) saturate(.55) brightness(.26)}.cinematic-progress{width:44vw}.carousel-count{font-size:7px;padding:7px 9px}}
      @media(prefers-reduced-motion:reduce){.cinematic-progress{display:none}.carousel-slide img{transition:none!important;transform:none!important}}
    `;
    document.head.appendChild(style);
  }

  const AUTOPLAY_MS = 5200;
  const MEMORY_KEY = 'yn.carousel.memory.v1';
  const prefetched = new Set();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');

  let current = 0;
  let autoplayTimer = 0;
  let pointerPaused = false;
  let focusPaused = false;
  let nearViewport = true;
  let dragStartX = null;
  let parallaxFrame = 0;
  let parallaxX = 0;
  let parallaxY = 0;
  let lastPersistedIndex = -1;
  let memoryReady = false;
  let hasAnnounced = false;

  const progress = document.createElement('div');
  progress.className = 'cinematic-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  viewport.appendChild(progress);

  const announcer = document.createElement('div');
  announcer.className = 'cinematic-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  carousel.appendChild(announcer);

  carousel.tabIndex = 0;
  carousel.setAttribute('role', 'region');

  const normalize = index => (index + slides.length) % slides.length;

  const readMemory = () => {
    try {
      const raw = localStorage.getItem(MEMORY_KEY);
      if (!raw) return null;
      const memory = JSON.parse(raw);
      const index = Number(memory?.index);
      if (!Number.isInteger(index) || index < 0) return null;
      return Math.min(index, slides.length - 1);
    } catch {
      return null;
    }
  };

  const persistMemory = (index, force = false) => {
    if (!memoryReady || index < 0 || index >= slides.length) return;
    if (!force && index === lastPersistedIndex) return;
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify({
        version: 2,
        index,
        slides: slides.length,
        seenAt: Date.now()
      }));
      lastPersistedIndex = index;
      carousel.dataset.memoryIndex = String(index);
    } catch {
      carousel.dataset.memory = 'unavailable';
    }
  };

  const classify = (slide, img) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const portrait = img.naturalHeight > img.naturalWidth * 1.08;
    const landscape = img.naturalWidth >= img.naturalHeight * 1.08;
    slide.classList.toggle('is-portrait', portrait);
    slide.classList.toggle('is-landscape', landscape);
    slide.classList.toggle('is-square', !portrait && !landscape);
    slide.dataset.orientation = portrait ? 'portrait' : landscape ? 'landscape' : 'square';
    slide.style.setProperty('--film-bg', `url("${img.currentSrc || img.src}")`);
  };

  slides.forEach((slide, index) => {
    slide.id ||= `yn-carousel-slide-${index + 1}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositiva');
    slide.setAttribute('aria-label', `${index + 1} de ${slides.length}`);
    const img = slide.querySelector('img');
    if (!img) return;
    if (img.complete) classify(slide, img);
    else img.addEventListener('load', () => classify(slide, img), { once: true });
  });

  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-controls', slides[index]?.id || '');
    dot.setAttribute('aria-label', `Foto ${index + 1} de ${slides.length}`);
  });

  const prefetchImage = index => {
    if (!nearViewport || document.hidden) return;
    const slide = slides[normalize(index)];
    const img = slide?.querySelector('img');
    const src = img?.currentSrc || img?.src;
    if (!src || prefetched.has(src)) return;
    prefetched.add(src);
    const probe = new Image();
    probe.decoding = 'async';
    probe.src = src;
  };

  const prefetchNeighbors = index => {
    if (!nearViewport || document.hidden) return;
    const task = () => {
      if (!nearViewport || document.hidden) return;
      prefetchImage(index + 1);
      prefetchImage(index - 1);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(task, { timeout: 800 });
    else setTimeout(task, 80);
  };

  const clearParallax = () => {
    if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
    parallaxFrame = 0;
    parallaxX = 0;
    parallaxY = 0;
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img) img.style.transform = '';
    });
  };

  const shouldPause = () => !nearViewport || pointerPaused || focusPaused || document.hidden;
  const canParallax = () => finePointer.matches && nearViewport && !document.hidden && !focusPaused && !reducedMotion.matches;

  const stopAutoplay = () => {
    if (autoplayTimer) clearTimeout(autoplayTimer);
    autoplayTimer = 0;
  };

  const stopProgress = () => progress.classList.remove('running');

  const resetProgress = () => {
    if (reducedMotion.matches || shouldPause()) {
      stopProgress();
      return;
    }
    progress.classList.remove('running');
    void progress.offsetWidth;
    progress.classList.add('running');
  };

  const scheduleAutoplay = () => {
    stopAutoplay();
    if (shouldPause()) {
      stopProgress();
      return;
    }
    resetProgress();
    autoplayTimer = setTimeout(() => go(current + 1, { announce: false, source: 'autoplay' }), AUTOPLAY_MS);
  };

  const render = ({ announce = true, source = 'programmatic' } = {}) => {
    current = normalize(current);
    track.style.transform = `translate3d(-${current * 100}%,0,0)`;
    carousel.dataset.index = String(current);

    slides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) slide.setAttribute('aria-current', 'true');
      else slide.removeAttribute('aria-current');
    });

    dots.forEach((dot, index) => {
      const active = index === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
      dot.tabIndex = active ? 0 : -1;
    });

    persistMemory(current);
    prefetchNeighbors(current);

    if (announce && hasAnnounced) {
      const activeImg = slides[current]?.querySelector('img');
      announcer.textContent = `Foto ${current + 1} de ${slides.length}. ${activeImg?.alt || 'Editorial Yass Noir'}`;
    }
    hasAnnounced = true;

    carousel.dispatchEvent(new CustomEvent('yn:carouselchange', {
      detail: { index: current, total: slides.length, source }
    }));
  };

  function go(index, { announce = true, source = 'manual' } = {}) {
    current = normalize(index);
    clearParallax();
    render({ announce, source });
    scheduleAutoplay();
  }

  const syncLifecycle = () => {
    const paused = shouldPause();
    carousel.classList.toggle('is-paused', paused);
    carousel.classList.toggle('is-sleeping', !nearViewport);
    carousel.dataset.lifecycle = nearViewport ? 'awake' : 'sleeping';
    carousel.dataset.paused = String(paused);

    if (paused) {
      stopAutoplay();
      stopProgress();
      if (!nearViewport) clearParallax();
    } else {
      scheduleAutoplay();
    }
  };

  const rememberedIndex = readMemory();
  if (rememberedIndex !== null) {
    current = rememberedIndex;
    lastPersistedIndex = rememberedIndex;
    carousel.dataset.memory = 'restored';
    carousel.dataset.memoryIndex = String(rememberedIndex);
  } else {
    carousel.dataset.memory = 'new';
  }
  memoryReady = true;
  render({ announce: false, source: 'restore' });

  prev?.addEventListener('click', () => go(current - 1, { source: 'previous' }));
  next?.addEventListener('click', () => go(current + 1, { source: 'next' }));
  dots.forEach((dot, index) => dot.addEventListener('click', () => go(index, { source: 'dot' })));

  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(current - 1, { source: 'keyboard' });
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(current + 1, { source: 'keyboard' });
    } else if (event.key === 'Home') {
      event.preventDefault();
      go(0, { source: 'keyboard' });
    } else if (event.key === 'End') {
      event.preventDefault();
      go(slides.length - 1, { source: 'keyboard' });
    }
  });

  carousel.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    dragStartX = event.clientX;
  });

  carousel.addEventListener('pointerup', event => {
    if (dragStartX === null) return;
    const delta = event.clientX - dragStartX;
    dragStartX = null;
    if (Math.abs(delta) > 45) go(current + (delta < 0 ? 1 : -1), { source: 'swipe' });
  });

  carousel.addEventListener('pointercancel', () => {
    dragStartX = null;
  });

  carousel.addEventListener('mouseenter', () => {
    pointerPaused = true;
    syncLifecycle();
  });

  carousel.addEventListener('mouseleave', () => {
    pointerPaused = false;
    dragStartX = null;
    clearParallax();
    syncLifecycle();
  });

  carousel.addEventListener('focusin', () => {
    focusPaused = true;
    syncLifecycle();
  });

  carousel.addEventListener('focusout', event => {
    if (carousel.contains(event.relatedTarget)) return;
    focusPaused = false;
    syncLifecycle();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) persistMemory(current, true);
    syncLifecycle();
  });

  addEventListener('pagehide', () => {
    persistMemory(current, true);
    stopAutoplay();
  });

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const visible = entry.isIntersecting;
      if (visible === nearViewport) return;
      nearViewport = visible;
      syncLifecycle();
    }, { root: null, rootMargin: '280px 0px 280px 0px', threshold: 0 });
    visibilityObserver.observe(carousel);
  }

  if (finePointer.matches) {
    const paintParallax = () => {
      parallaxFrame = 0;
      if (!canParallax()) return;
      const active = slides[current]?.querySelector('img');
      if (!active) return;
      active.style.transform = `translate3d(${parallaxX}px,${parallaxY}px,0) scale(1.008)`;
    };

    carousel.addEventListener('pointermove', event => {
      if (!canParallax()) return;
      const rect = carousel.getBoundingClientRect();
      parallaxX = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      parallaxY = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(paintParallax);
    });
  }

  reducedMotion.addEventListener?.('change', () => {
    clearParallax();
    syncLifecycle();
  });

  carousel.dataset.ready = 'true';
  syncLifecycle();
})();
