(() => {
  const form = document.getElementById('scheduleForm');
  if (!form) return;
  const name = form.elements.namedItem('name');
  const time = form.elements.namedItem('time');
  const level = form.elements.namedItem('level');
  const days = [...form.querySelectorAll('input[name="days"]')];
  const result = document.getElementById('scheduleResult');
  const preview = document.getElementById('schedulePreview');
  const link = document.getElementById('scheduleTelegram');
  const status = document.getElementById('scheduleStatus');
  function validate() {
    name.setCustomValidity(name.value.trim() ? '' : 'Пожалуйста, укажи своё имя.');
    time.setCustomValidity(time.value.trim() ? '' : 'Укажи удобное время.');
    days[0].setCustomValidity(days.some(day => day.checked) ? '' : 'Выбери хотя бы один удобный день.');
  }
  form.addEventListener('input', () => {
    validate();
    result.hidden = true;
    status.textContent = '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    validate();
    if (!form.reportValidity()) return;
    const selectedDays = days.filter(day => day.checked).map(day => day.value).join(', ');
    const message = `Ева, привет! Мне интересна мини-группа. Мне было бы удобно заниматься: ${selectedDays}, ${time.value.trim()}.\nМеня зовут ${name.value.trim()}.\nУровень подготовки: ${level.value}.`;
    const url = `https://t.me/evavasilyyevna?text=${encodeURIComponent(message)}`;
    preview.value = message;
    link.href = url;
    result.hidden = false;
    status.textContent = 'Если Telegram не открылся, воспользуйся ссылкой ниже. Отправка сообщения — в Telegram.';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  validate();
})();

// Animate only on entry; content remains visible without JavaScript or motion.
(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.format-card, .base-stories article').forEach(element => observer.observe(element));
})();

(() => {
  const dialog = document.getElementById('base-details');
  const opener = document.getElementById('openBaseDetails');
  if (!dialog || !opener) return;
  let position = 0;
  opener.addEventListener('click', () => {
    if (dialog.open) return;
    position = window.scrollY;
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector('.base-close').focus({ preventScroll: true });
  });
  dialog.querySelector('.base-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    opener.focus({ preventScroll: true });
    window.scrollTo({ top: position, behavior: 'instant' });
  });
})();
