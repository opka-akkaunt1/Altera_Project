(function initializeBitrix() {
  const { find, escapeHtml, statusMessage, showResult } = window.PortfolioDemo;
  const cases = new Map();
  function payload() {
    return {
      entityTypeId: 2,
      fields: {
        title: find('#deal-title').value.trim(),
        sourceId: 'WEB',
        comments: find('#deal-comment').value.trim(),
      },
    };
  }
  function drawPayload() {
    find('#payload').textContent = JSON.stringify(payload(), null, 2);
  }
  find('#bitrix-form').addEventListener('input', drawPayload);
  find('#bitrix-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const { fields } = payload();
    if (!fields.title) {
      showResult(statusMessage('Укажите тему', 'Она станет названием сделки.'), true);
      return;
    }
    const key = JSON.stringify(fields);
    if (cases.has(key)) {
      showResult(
        statusMessage(
          'Повторный запрос',
          `Тестовая сделка #${cases.get(key)} уже есть. Дубликат не создан.`,
        ),
      );
      return;
    }
    const id = 2407 + cases.size;
    cases.set(key, id);
    showResult(
      statusMessage(
        'Тестовая сделка создана',
        `#${id} · ${escapeHtml(fields.title)} · источник «Веб-сайт»`,
      ),
    );
  });
  drawPayload();
})();
