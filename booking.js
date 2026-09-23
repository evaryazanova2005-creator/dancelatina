(() => {
  const form = document.getElementById('bookingForm');
  const name = document.getElementById('bookingName');
  const format = document.getElementById('bookingFormat');
  const comment = document.getElementById('bookingComment');
  const preview = document.getElementById('bookingPreview');
  function message() {
    return `Привет, Ева! Меня зовут ${name.value.trim() || '[твоё имя]'}.\nХочу записаться на занятия.\nФормат: ${format.value}.${comment.value.trim() ? `\nПожелания: ${comment.value.trim()}` : ''}\nПодскажи, пожалуйста, как записаться?`;
  }
  const status = document.getElementById('bookingStatus');
  const telegramStep = document.getElementById('telegramStep');
  const copyButton = document.getElementById('copyBooking');
  function updatePreview() {
    preview.value = message();
    telegramStep.hidden = true;
    status.textContent = '';
  }
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  name.addEventListener('input', () => name.setCustomValidity(''));
  const dialog = document.getElementById('booking');
  let opener = null;
  document.querySelectorAll('a[href="#booking"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      if (link.dataset.format) format.value = link.dataset.format;
      updatePreview();
      dialog.showModal();
    });
  });
  dialog.querySelector('.booking-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (opener) opener.focus({ preventScroll: true });
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    name.setCustomValidity(name.value.trim() ? '' : 'Пожалуйста, укажи своё имя.');
    if (!form.reportValidity()) return;
    const draft = message();
    preview.value = draft;
    copyButton.disabled = true;
    try {
      await navigator.clipboard.writeText(draft);
      if (message() !== draft) {
        status.textContent = 'Данные изменились — скопируй сообщение ещё раз.';
        return;
      }
      status.textContent = 'Сообщение скопировано. Открой Telegram и вставь его в чат.';
    } catch {
      preview.closest('details').open = true;
      preview.focus();
      preview.select();
      status.textContent = 'Не удалось скопировать автоматически. Скопируй выделенный текст вручную, затем открой Telegram.';
    } finally {
      copyButton.disabled = false;
    }
    telegramStep.hidden = false;
  });
  updatePreview();
})();
