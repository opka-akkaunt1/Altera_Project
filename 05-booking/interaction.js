(function initializeBooking() {
  const { find, onClick, statusMessage, showResult, buttonMarkup, appendMessage } =
    window.PortfolioDemo;
  const slots = ['11:00', '14:30', '17:00'];
  let current = '';
  find('#action').disabled = true;
  find('#slot-group').addEventListener('click', (event) => {
    const chosen = event.target.closest('button');
    if (!chosen) return;
    current = chosen.textContent;
    find('#slot-group')
      .querySelectorAll('button')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === chosen)));
    find('#action').disabled = false;
  });
  onClick('action', () => {
    appendMessage(`Запишите меня на ${current}`, true);
    find('#controls').hidden = true;
    showResult(
      statusMessage('Запись подтверждена', `Завтра, ${current} · Стрижка и укладка · №M-042`) +
        buttonMarkup('cancel', 'Отменить запись', 'secondary'),
    );
    onClick('cancel', () => {
      find('#controls').hidden = false;
      showResult(statusMessage('Запись отменена', `Время ${current} снова доступно для записи.`));
    });
  });
})();
