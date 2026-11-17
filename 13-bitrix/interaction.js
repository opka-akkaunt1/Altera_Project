(function initializeBitrix() {
  const { find, escapeHtml, statusMessage, showResult } = window.PortfolioDemo;
  const cases = new Map();
  const stages = [
    { id: 'NEW', title: 'Новая' },
    { id: 'PREPARATION', title: 'Подготовка' },
  ];
  const simulatedErrors = new Map([
    ['denied', {
      code: '400 · ACCESS_DENIED',
      description: 'Проверьте права на создание сделок в выбранной воронке.',
    }],
    ['limited', {
      code: '503 · QUERY_LIMIT_EXCEEDED',
      description: 'Уменьшите частоту запросов и повторите отправку после паузы.',
    }],
  ]);
  const category = find('#deal-category');
  const stage = find('#deal-stage');

  function updateStages() {
    const prefix = category.value === '0' ? '' : `C${category.value}:`;
    stage.replaceChildren(...stages.map(({ id, title }) => new Option(title, prefix + id)));
    drawPayload();
  }

  function payload() {
    return {
      entityTypeId: 2,
      fields: {
        title: find('#deal-title').value.trim(),
        categoryId: Number(category.value),
        stageId: stage.value,
        sourceId: 'WEB',
        comments: find('#deal-comment').value.trim(),
      },
    };
  }
  function drawPayload() {
    find('#payload').textContent = JSON.stringify(payload(), null, 2);
  }
  category.addEventListener('change', updateStages);
  find('#bitrix-form').addEventListener('input', (event) => {
    if (event.target !== category) drawPayload();
  });
  find('#bitrix-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const { fields } = payload();
    if (!fields.title) {
      showResult(statusMessage('Укажите тему', 'Она станет названием сделки.'), true);
      return;
    }
    const error = simulatedErrors.get(find('#response-mode').value);
    if (error) {
      showResult(statusMessage(error.code, error.description), true);
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
        `#${id} · ${escapeHtml(fields.title)} · ${category.selectedOptions[0].text} / ${stage.selectedOptions[0].text}`,
      ),
    );
  });
  updateStages();
})();
