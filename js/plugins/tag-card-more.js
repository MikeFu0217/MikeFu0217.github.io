document.addEventListener('click', (e) => {
  const btn = e.target.closest('.tag-card-more');
  if (!btn) return;
  const card = btn.closest('.sidebar-tag-card');
  if (!card) return;
  const hidden = card.querySelector('.tag-card-hidden');
  if (!hidden) return;
  const isHidden = hidden.hasAttribute('hidden');
  if (isHidden) {
    hidden.removeAttribute('hidden');
    btn.textContent = btn.dataset.lessLabel;
  } else {
    hidden.setAttribute('hidden', '');
    btn.textContent = btn.dataset.moreLabel;
  }
});
