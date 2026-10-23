(() => {
  const GESTURE_END_MS = 300;
  const MIN_WHEEL_DELTA = 8;
  const FADE_MS = 200;

  const state = new WeakMap();

  const parsePhotos = (card) => {
    try {
      const arr = JSON.parse(card.dataset.photos || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const pickRandomIndex = (length, exclude) => {
    if (length <= 1) return 0;
    let next;
    do {
      next = Math.floor(Math.random() * length);
    } while (next === exclude);
    return next;
  };

  const setPhoto = (card, nextIndex) => {
    const s = state.get(card);
    if (!s) return;
    const n = s.photos.length;
    if (n === 0) return;
    const normalized = ((nextIndex % n) + n) % n;
    if (normalized === s.index) {
      scheduleAuto(card);
      return;
    }
    s.index = normalized;
    s.img.classList.add('photo-card-fading');
    clearTimeout(s.fadeTimer);
    s.fadeTimer = setTimeout(() => {
      s.img.src = s.photos[s.index];
      s.img.classList.remove('photo-card-fading');
    }, FADE_MS);
    scheduleAuto(card);
  };

  const scheduleAuto = (card) => {
    const s = state.get(card);
    if (!s) return;
    clearTimeout(s.autoTimer);
    if (s.intervalMs <= 0 || s.photos.length <= 1) return;
    s.autoTimer = setTimeout(() => {
      if (document.hidden) return;
      setPhoto(card, pickRandomIndex(s.photos.length, s.index));
    }, s.intervalMs);
  };

  const openLightbox = (src) => {
    if (!src) return;
    const overlay = document.createElement('div');
    overlay.className = 'photo-card-lightbox';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    overlay.appendChild(img);
    const close = () => overlay.remove();
    overlay.addEventListener('click', close);
    document.addEventListener(
      'keydown',
      function onKey(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', onKey);
        }
      },
      { once: false }
    );
    document.body.appendChild(overlay);
  };

  const initCard = (card) => {
    if (state.has(card)) return;
    const img = card.querySelector('.photo-card-image');
    if (!img) return;
    const photos = parsePhotos(card);
    if (photos.length === 0) return;
    const intervalMs = Number(card.dataset.autoSwitchMs) || 0;
    const currentSrc = img.getAttribute('src');
    const startIndex = Math.max(0, photos.indexOf(currentSrc));

    const s = {
      img,
      photos,
      intervalMs,
      index: startIndex,
      autoTimer: null,
      fadeTimer: null,
      gestureLock: false,
      unlockTimer: null,
    };
    state.set(card, s);

    card.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        if (Math.abs(e.deltaY) < MIN_WHEEL_DELTA) return;

        clearTimeout(s.unlockTimer);
        s.unlockTimer = setTimeout(() => {
          s.gestureLock = false;
        }, GESTURE_END_MS);

        if (s.gestureLock) return;
        s.gestureLock = true;

        const dir = e.deltaY > 0 ? 1 : -1;
        setPhoto(card, s.index + dir);
      },
      { passive: false }
    );

    img.addEventListener('click', () => openLightbox(s.photos[s.index]));

    scheduleAuto(card);
  };

  const initAll = () => {
    document.querySelectorAll('.sidebar-photo-card').forEach(initCard);
  };

  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('.sidebar-photo-card').forEach((card) => {
      const s = state.get(card);
      if (!s) return;
      if (document.hidden) {
        clearTimeout(s.autoTimer);
      } else {
        scheduleAuto(card);
      }
    });
  });

  initAll();
})();
