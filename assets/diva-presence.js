(() => {
  if (document.documentElement.dataset.divaPresence === 'v1') return;
  document.documentElement.dataset.divaPresence = 'v1';

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');

  const aura = document.createElement('div');
  aura.className = 'diva-aura';
  aura.setAttribute('aria-hidden', 'true');
  body.appendChild(aura);

  const stageLabel = document.createElement('div');
  stageLabel.className = 'diva-stage-label';
  stageLabel.setAttribute('aria-hidden', 'true');
  stageLabel.innerHTML = '<strong>YASS NOIR</strong><span>OPENING</span>';
  body.appendChild(stageLabel);

  let cursor = null;
  if (finePointer.matches && !reducedMotion.matches) {
    cursor = document.createElement('div');
    cursor.className = 'diva-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    body.appendChild(cursor);
  }

  const scenes = [
    { selector: '.hero', key: 'hero', label: 'OPENING' },
    { selector: '#historia', key: 'presence', label: 'PRESENCE' },
    { selector: '#tatuajes', key: 'gaze', label: 'THE GAZE' },
    { selector: '.motion', key: 'motion', label: 'MOTION' },
    { selector: '#archivo', key: 'archive', label: 'PRIVATE ARCHIVE' },
    { selector: '#experiencia', key: 'private', label: 'PRIVATE SIDE' },
    { selector: '.threshold', key: 'threshold', label: 'THRESHOLD' },
    { selector: '.cta', key: 'access', label: 'ACCESS' }
  ].map((scene, index) => ({ ...scene, index, node: document.querySelector(scene.selector) }))
    .filter(scene => scene.node);

  const sceneRatios = new Map();
  let currentScene = '';
  let sceneTimer = 0;

  const setScene = scene => {
    if (!scene || scene.key === currentScene) return;
    currentScene = scene.key;
    body.dataset.divaScene = scene.key;
    scenes.forEach(item => item.node?.setAttribute('data-diva-active', String(item === scene)));

    stageLabel.classList.add('is-changing');
    clearTimeout(sceneTimer);
    sceneTimer = setTimeout(() => {
      const count = String(scene.index + 1).padStart(2, '0');
      stageLabel.innerHTML = `<strong>YASS NOIR</strong><span>${count} · ${scene.label}</span>`;
      stageLabel.classList.remove('is-changing');
    }, reducedMotion.matches ? 0 : 150);

    body.dispatchEvent(new CustomEvent('yn:presencechange', {
      detail: { scene: scene.key, index: scene.index, label: scene.label }
    }));
  };

  if ('IntersectionObserver' in window && scenes.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => sceneRatios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
      const best = scenes
        .map(scene => ({ scene, ratio: sceneRatios.get(scene.node) || 0 }))
        .sort((a, b) => b.ratio - a.ratio)[0];
      if (best?.ratio > 0) setScene(best.scene);
    }, { threshold: [0, .12, .28, .45, .62], rootMargin: '-8% 0px -12% 0px' });

    scenes.forEach(scene => observer.observe(scene.node));
  } else if (scenes[0]) {
    setScene(scenes[0]);
  }

  let pointerFrame = 0;
  let pointerX = innerWidth * .72;
  let pointerY = innerHeight * .34;

  const paintPointer = () => {
    pointerFrame = 0;
    const xPercent = Math.max(0, Math.min(100, pointerX / Math.max(1, innerWidth) * 100));
    const yPercent = Math.max(0, Math.min(100, pointerY / Math.max(1, innerHeight) * 100));
    root.style.setProperty('--diva-x', `${xPercent.toFixed(2)}%`);
    root.style.setProperty('--diva-y', `${yPercent.toFixed(2)}%`);
    root.style.setProperty('--cursor-x', `${pointerX.toFixed(1)}px`);
    root.style.setProperty('--cursor-y', `${pointerY.toFixed(1)}px`);
  };

  if (finePointer.matches && !reducedMotion.matches) {
    addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      body.classList.add('diva-pointer-active');
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    }, { passive: true });

    document.addEventListener('pointerover', event => {
      body.classList.toggle('diva-pointer-action', Boolean(event.target.closest('a,button,[role="button"]')));
    }, { passive: true });

    addEventListener('pointerleave', () => body.classList.remove('diva-pointer-active'));
  }

  let lastY = scrollY;
  let lastTime = performance.now();
  let velocityFrame = 0;
  let energy = .42;

  const paintVelocity = () => {
    velocityFrame = 0;
    const now = performance.now();
    const dt = Math.max(16, now - lastTime);
    const dy = Math.abs(scrollY - lastY);
    const normalized = Math.min(1, (dy / dt) * .85);
    energy += ((.40 + normalized * .38) - energy) * .28;
    root.style.setProperty('--diva-energy', energy.toFixed(3));
    root.style.setProperty('--diva-velocity', normalized.toFixed(3));
    lastY = scrollY;
    lastTime = now;
  };

  addEventListener('scroll', () => {
    if (!velocityFrame) velocityFrame = requestAnimationFrame(paintVelocity);
  }, { passive: true });

  if (finePointer.matches && !reducedMotion.matches) {
    document.querySelectorAll('.button').forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const ny = ((event.clientY - rect.top) / rect.height - .5) * 2;
        button.style.setProperty('--mag-x', `${(nx * 5).toFixed(2)}px`);
        button.style.setProperty('--mag-y', `${(ny * 3).toFixed(2)}px`);
      }, { passive: true });
      button.addEventListener('pointerleave', () => {
        button.style.setProperty('--mag-x', '0px');
        button.style.setProperty('--mag-y', '0px');
      });
    });
  }

  let framePulseTimer = 0;
  body.addEventListener('yn:carouselchange', event => {
    const carousel = document.querySelector('.archive-carousel');
    if (!carousel) return;
    const detail = event.detail || {};
    const index = Number(detail.index || 0);
    const total = Math.max(1, Number(detail.total || 1));
    const frameEnergy = .44 + ((index + 1) / total) * .18;
    root.style.setProperty('--diva-energy', frameEnergy.toFixed(3));

    if (!reducedMotion.matches) {
      carousel.classList.remove('diva-frame-pulse');
      void carousel.offsetWidth;
      carousel.classList.add('diva-frame-pulse');
      clearTimeout(framePulseTimer);
      framePulseTimer = setTimeout(() => carousel.classList.remove('diva-frame-pulse'), 680);
    }

    if (body.dataset.divaScene === 'archive') {
      const frame = String(index + 1).padStart(2, '0');
      stageLabel.innerHTML = `<strong>YASS NOIR</strong><span>ARCHIVE · FRAME ${frame}</span>`;
    }
  });

  const syncVisibility = () => body.classList.toggle('diva-sleep', document.hidden);
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  paintPointer();
})();
