(() => {
  const STORAGE_KEY = 'blog-recent-viewed';
  const MAX_STORED = 20;

  const readHistory = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const writeHistory = (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* quota exceeded or disabled — silently drop */
    }
  };

  const recordVisit = (path, title) => {
    if (!path || !title) return;
    const history = readHistory().filter((entry) => entry.path !== path);
    history.unshift({ path, title, ts: Date.now() });
    writeHistory(history.slice(0, MAX_STORED));
  };

  const render = (card) => {
    const list = card.querySelector('.recent-viewed-list');
    const empty = card.querySelector('.recent-viewed-empty');
    if (!list) return;

    const limit = Number(card.dataset.limit) || 3;
    const currentPath = card.dataset.currentPath || '';
    const entries = readHistory()
      .filter((entry) => entry.path !== currentPath)
      .slice(0, limit);

    list.innerHTML = '';
    entries.forEach((entry) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = entry.path;
      a.textContent = entry.title;
      a.className = 'recent-viewed-link';
      li.appendChild(a);
      list.appendChild(li);
    });

    if (empty) empty.style.display = entries.length === 0 ? 'block' : 'none';
  };

  const initAll = () => {
    document.querySelectorAll('.post-recent-viewed').forEach((card) => {
      recordVisit(card.dataset.currentPath, card.dataset.currentTitle);
      render(card);
    });
  };

  initAll();
})();
