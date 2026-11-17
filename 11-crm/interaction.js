(function initializeCrm() {
  const { onClick, statusMessage, showResult } = window.PortfolioDemo;
  let created = false;
  onClick('action', () => {
    if (created) {
      showResult(
        statusMessage(
          'Сделка уже существует · #CR-104',
          'Повторная отправка связана с той же записью. Дубликат не создан.',
        ),
      );
      return;
    }
    created = true;
    showResult(
      statusMessage('Сделка создана · #CR-104', 'Запуск сайта · Меридиан · этап «Новая»') +
        '<p>Связанный контакт: Алексей Орлов.</p>',
    );
  });
})();
