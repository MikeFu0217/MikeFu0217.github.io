(() => {
  const STORAGE_KEY = 'blog-left-aside-open';

  function readState() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'true') return true;
      if (v === 'false') return false;
    } catch (e) {}
    return true;
  }

  function writeState(open) {
    try {
      localStorage.setItem(STORAGE_KEY, open ? 'true' : 'false');
    } catch (e) {}
  }

  function applyState(container, icon, open) {
    if (!container) return;
    container.classList.toggle('left-sidebar-hidden', !open);
    if (icon) {
      icon.classList.toggle('fa-indent', open);
      icon.classList.toggle('fa-outdent', !open);
    }
  }

  function init() {
    const btn = document.querySelector('.page-left-aside-toggle');
    const container = document.querySelector('.post-page-container.show-left-sidebar');
    if (!btn || !container) return;
    const icon = btn.querySelector('i');

    btn.style.display = 'flex';

    let open = readState();
    applyState(container, icon, open);

    btn.addEventListener('click', () => {
      open = !open;
      writeState(open);
      applyState(container, icon, open);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  try {
    swup.hooks.on('page:view', init);
  } catch (e) {}
})();
