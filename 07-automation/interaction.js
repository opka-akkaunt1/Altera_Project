(function initializeAutomation() {
  const { find, onClick, escapeHtml, statusMessage, showResult, tableMarkup } =
    window.PortfolioDemo;
  const route = [
    ['01', 'Веб-форма', 'Принять заявку'],
    ['02', 'Проверка', 'Проверить поля'],
    ['03', 'CRM', 'Создать запись'],
    ['04', 'Менеджер', 'Подготовить уведомление'],
  ];
  onClick('action', () => {
    const company = find('#company').value.trim();
    const email = find('#email');
    const ok = company && email.value.trim() && email.validity.valid;
    [...document.querySelectorAll('.step-state')].forEach((s, i) => {
      s.dataset.state = ok || i === 0 ? 'done' : i === 1 ? 'error' : '';
      s.textContent = ok || i === 0 ? 'Готово' : i === 1 ? 'Ошибка' : 'Пропущено';
    });
    find('#log-hint').hidden = true;
    if (!ok) {
      showResult(
        statusMessage(
          'Заявка остановлена на проверке',
          'Укажите компанию и корректную электронную почту.',
        ),
        true,
      );
      return;
    }
    showResult(
      statusMessage(
        'Маршрут выполнен',
        `Заявка №FD-108 · ${escapeHtml(company)} · ${escapeHtml(email.value)}`,
      ) +
        tableMarkup(
          ['Действие', 'Результат'],
          [
            ['Проверка полей', 'Пройдена'],
            ['Запись CRM', 'Сохранена в демо'],
            ['Уведомление', 'Подготовлено'],
          ],
        ),
    );
  });
})();
