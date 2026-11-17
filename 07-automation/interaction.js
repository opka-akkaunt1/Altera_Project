(function initializeAutomation() {
  const { find, onClick, escapeHtml, statusMessage, showResult, tableMarkup } =
    window.PortfolioDemo;
  const owners = {
    website: 'Анна Соколова',
    integration: 'Илья Морозов',
    assistant: 'Мария Ким',
  };
  const records = new Map();
  const steps = document.querySelectorAll('.step-state');
  const labels = { done: 'Готово', error: 'Ошибка', duplicate: 'Дубль', skipped: 'Пропущено' };
  const retry = find('#retry');
  let interrupted = null;

  function markSteps(...states) {
    steps.forEach((step, index) => {
      step.dataset.state = states[index];
      step.textContent = labels[states[index]];
    });
  }

  function notify(record, resumed) {
    record.notified = true;
    interrupted = null;
    retry.hidden = true;
    markSteps('done', 'done', 'done', 'done');
    showResult(
      statusMessage(
        'Маршрут выполнен',
        `Заявка №${record.id} · ${escapeHtml(record.company)} · ${escapeHtml(record.email)}` +
          (resumed ? '<br>Продолжено с шага 04. Запись CRM сохранена.' : ''),
      ) +
        tableMarkup(
          ['Действие', 'Результат'],
          [
            ['Проверка', 'Поля заполнены, дублей нет'],
            ['Запись CRM', `№${record.id} · ${escapeHtml(record.service)}`],
            ['Ответственный', record.owner],
            ['Уведомление', 'Подготовлено в демо'],
          ],
        ),
    );
  }

  onClick('retry', () => {
    if (interrupted) notify(interrupted, true);
  });

  find('#route-form').addEventListener('submit', (event) => {
    event.preventDefault();
    retry.hidden = true;
    interrupted = null;
    const company = find('#company').value.trim();
    const emailInput = find('#email');
    const email = emailInput.value.trim();
    const service = find('#service');
    if (!company || !emailInput.validity.valid) {
      markSteps('done', 'error', 'skipped', 'skipped');
      showResult(statusMessage('Заявка остановлена на проверке', 'Укажите компанию и корректную электронную почту.'), true);
      return;
    }

    const key = `${email.toLowerCase()}/${service.value}`;
    const existing = records.get(key);
    if (existing) {
      markSteps('done', 'duplicate', 'skipped', 'skipped');
      showResult(statusMessage('Дубликат заявки', `Заявка №${existing.id} уже есть. Ответственный — ${existing.owner}.`));
      if (!existing.notified) {
        interrupted = existing;
        retry.hidden = false;
      }
      return;
    }

    const record = {
      id: `FD-${108 + records.size}`,
      company,
      email,
      service: service.selectedOptions[0].textContent,
      owner: owners[service.value],
      notified: false,
    };
    records.set(key, record);
    if (find('#simulate-failure').checked) {
      interrupted = record;
      retry.hidden = false;
      markSteps('done', 'done', 'done', 'error');
      showResult(
        statusMessage('Сбой уведомления', `Заявка №${record.id} записана в CRM. Ответственный — ${record.owner}. Повторите шаг 04.`),
        true,
      );
      return;
    }

    notify(record, false);
  });
})();
