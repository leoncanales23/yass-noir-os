(() => {
  const loader = document.querySelector('.loader');
  const memoryLine = document.querySelector('.memoryline');
  const progressBar = document.querySelector('.progress');
  const stage = document.querySelector('.tattoo-stage');
  const note = document.querySelector('.tattoo-note');
  const hotspots = [...document.querySelectorAll('.hotspot')];
  const film = document.querySelector('#noir-film');

  window.setTimeout(() => loader?.classList.add('hide'), 220);

  if (memoryLine) {
    const messages = [
      'Primer contacto. Nada aquí está puesto por accidente.',
      'Volviste. Algunas puertas recuerdan quién las abrió.',
      'Sabía que volverías.'
    ];

    let visits = 0;
    try {
      visits = Number(localStorage.getItem('yn.visits') || 0);
      localStorage.setItem('yn.visits', String(visits + 1));
    } catch {
      visits = 0;
    }

    memoryLine.textContent = messages[Math.min(Math.max(visits, 0), messages.length - 1)];
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('in'));
  }

  if (progressBar) {
    let scrollFrame = 0;
    const paintProgress = () => {
      scrollFrame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      progressBar.style.width = `${ratio * 100}%`;
    };

    const queueProgress = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(paintProgress);
    };

    addEventListener('scroll', queueProgress, { passive: true });
    addEventListener('resize', queueProgress, { passive: true });
    queueProgress();
  }

  if (stage && note && hotspots.length) {
    const activateHotspot = hotspot => {
      hotspots.forEach(item => item.classList.toggle('active', item === hotspot));

      const title = note.querySelector('b');
      const copy = note.querySelector('span');
      if (title) title.textContent = hotspot.dataset.title || '';
      if (copy) copy.textContent = hotspot.dataset.text || '';

      const level = Math.min(4, Math.max(1, Number(hotspot.dataset.level || 1)));
      stage.style.setProperty('--zoom', (1.004 + level * 0.014).toFixed(3));
      stage.style.setProperty('--light', (0.56 + level * 0.055).toFixed(2));
      stage.style.setProperty('--glow', (0.08 + level * 0.055).toFixed(2));
      note.style.backdropFilter = `blur(${Math.max(5, 13 - level * 1.7)}px)`;
      note.style.borderColor = `rgba(199,163,106,${0.16 + level * 0.05})`;
    };

    hotspots.forEach(hotspot => hotspot.addEventListener('click', () => activateHotspot(hotspot)));
  }

  film?.addEventListener('error', event => {
    event.currentTarget.style.display = 'none';
  });

  document.documentElement.dataset.landingRuntime = 'v1';
})();
