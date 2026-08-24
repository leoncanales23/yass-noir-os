(() => {
  const carousel = document.querySelector('.archive-carousel');
  if (!carousel) return;

  const style = document.createElement('style');
  style.textContent = `
    .archive{position:relative;background:radial-gradient(circle at 50% 38%,rgba(179,72,208,.07),transparent 34%),linear-gradient(180deg,#0c0a0b,#070607 82%)}
    .archive-carousel{--film-progress:0;max-width:min(1240px,94vw);outline:none}
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
    @keyframes ynFilmProgress{to{transform:scaleX(1)}}
    .carousel-dots{margin-top:26px}
    .carousel-dot{height:1px;background:rgba(255,255,255,.16)}
    .carousel-dot.active{box-shadow:0 0 13px rgba(199,163,106,.28)}
    @media(min-width:901px){.archive-head{margin-bottom:64px}.carousel-slide{height:min(82svh,900px)}}
    @media(max-width:900px){.archive-carousel{max-width:100%}.carousel-slide{height:min(76svh,760px);min-height:520px;padding:8px}.carousel-slide.is-portrait img{max-width:94%;max-height:94%}.carousel-slide.is-landscape img{max-width:98%;max-height:88%}.carousel-slide:before{inset:-14%;filter:blur(26px) saturate(.55) brightness(.26)}.cinematic-progress{width:44vw}.carousel-count{font-size:7px;padding:7px 9px}}
    @media(prefers-reduced-motion:reduce){.cinematic-progress{display:none}.carousel-slide img{transition:none!important;transform:none!important}}
  `;
  document.head.appendChild(style);

  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const viewport = carousel.querySelector('.carousel-viewport');
  const prefetched = new Set();

  const progress = document.createElement('div');
  progress.className = 'cinematic-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  viewport?.appendChild(progress);

  const announcer = document.createElement('div');
  announcer.className = 'cinematic-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  carousel.appendChild(announcer);

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

  const prefetchImage = index => {
    const slide = slides[(index + slides.length) % slides.length];
    const img = slide?.querySelector('img');
    const src = img?.currentSrc || img?.src;
    if (!src || prefetched.has(src)) return;
    prefetched.add(src);
    const probe = new Image();
    probe.decoding = 'async';
    probe.src = src;
  };

  const prefetchNeighbors = index => {
    const task = () => {
      prefetchImage(index + 1);
      prefetchImage(index - 1);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(task, { timeout: 800 });
    else setTimeout(task, 80);
  };

  slides.forEach((slide, i) => {
    const img = slide.querySelector('img');
    if (!img) return;
    if (img.complete) classify(slide, img);
    else img.addEventListener('load', () => classify(slide, img), { once:true });
    slide.classList.toggle('is-active', i === 0);
    slide.setAttribute('aria-hidden', String(i !== 0));
  });

  const resetProgress = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    progress.classList.remove('running');
    void progress.offsetWidth;
    progress.classList.add('running');
  };

  let hasAnnounced = false;
  let syncQueued = false;
  const syncActive = () => {
    syncQueued = false;
    let active = dots.findIndex(d => d.classList.contains('active'));
    if (active < 0) active = 0;

    slides.forEach((slide, i) => {
      const isActive = i === active;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      if (isActive) slide.setAttribute('aria-current', 'true');
      else slide.removeAttribute('aria-current');
      const img = slide.querySelector('img');
      if (img) img.style.transform = '';
    });

    dots.forEach((dot, i) => {
      dot.tabIndex = i === active ? 0 : -1;
      dot.setAttribute('aria-label', `Foto ${i + 1} de ${slides.length}`);
    });

    if (hasAnnounced) {
      const activeImg = slides[active]?.querySelector('img');
      announcer.textContent = `Foto ${active + 1} de ${slides.length}. ${activeImg?.alt || 'Editorial Yass Noir'}`;
    }
    hasAnnounced = true;

    prefetchNeighbors(active);
    resetProgress();
  };

  const queueSync = () => {
    if (syncQueued) return;
    syncQueued = true;
    requestAnimationFrame(syncActive);
  };

  const observer = new MutationObserver(queueSync);
  dots.forEach(dot => observer.observe(dot, { attributes:true, attributeFilter:['class','aria-selected'] }));
  syncActive();

  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev?.click(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next?.click(); }
    if (e.key === 'Home') { e.preventDefault(); dots[0]?.click(); }
    if (e.key === 'End') { e.preventDefault(); dots[dots.length - 1]?.click(); }
  });
  carousel.tabIndex = 0;

  carousel.addEventListener('mouseenter', () => carousel.classList.add('is-paused'));
  carousel.addEventListener('mouseleave', () => carousel.classList.remove('is-paused'));
  carousel.addEventListener('focusin', () => {
    carousel.classList.add('is-paused');
    carousel.dispatchEvent(new Event('mouseenter'));
  });
  carousel.addEventListener('focusout', e => {
    if (carousel.contains(e.relatedTarget)) return;
    carousel.classList.remove('is-paused');
    carousel.dispatchEvent(new Event('mouseleave'));
  });
  document.addEventListener('visibilitychange', () => carousel.classList.toggle('is-paused', document.hidden));

  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let parallaxFrame = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    const paintParallax = () => {
      parallaxFrame = 0;
      const active = carousel.querySelector('.carousel-slide.is-active img');
      if (!active) return;
      active.style.transform = `translate3d(${parallaxX}px,${parallaxY}px,0) scale(1.008)`;
    };

    carousel.addEventListener('pointermove', e => {
      const r = carousel.getBoundingClientRect();
      parallaxX = ((e.clientX - r.left) / r.width - .5) * 8;
      parallaxY = ((e.clientY - r.top) / r.height - .5) * 5;
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(paintParallax);
    });

    carousel.addEventListener('pointerleave', () => {
      if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
      parallaxFrame = 0;
      slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) img.style.transform = '';
      });
    });
  }
})();
