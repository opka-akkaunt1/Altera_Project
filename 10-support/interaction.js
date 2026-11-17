(function initializeSupport() {
  const { find, onClick, escapeHtml, statusMessage, showResult } = window.PortfolioDemo;
  const request = find('#request-body');
  const draft = find('#draft');
  const draftText = find('#draft-text');
  const handoff = find('#handoff');
  const examples = {
    'delivery-example': 'Заказ ещё не приехал, хотя доставка была назначена на вчера. Когда его привезут?',
    'refund-example': 'Хочу вернуть заказ. Как оформить заявку на возврат?',
    'payment-example': 'Заказ оплачен дважды. Срочно верните деньги!',
  };
  const categories = [
    {
      topic: 'Оплата',
      terms: /оплат|оплач|списан|дважды|платеж/,
      reply: 'Здравствуйте. Уточните, пожалуйста, номер заказа и дату оплаты. Проверим операции и сообщим, как решить вопрос.',
    },
    {
      topic: 'Возврат',
      terms: /возврат|верну|верни|верните/,
      reply: 'Здравствуйте. Подскажите номер заказа и причину возврата. Мы проверим детали и пришлём инструкцию.',
    },
    {
      topic: 'Доставка',
      terms: /достав|привез|приех|курьер|посылк/,
      reply: 'Здравствуйте. Подскажите, пожалуйста, номер заказа. Проверим статус и уточним время доставки.',
    },
  ];
  const other = {
    topic: 'Другое',
    reply: 'Здравствуйте. Расскажите, пожалуйста, подробнее, что произошло. Передадим обращение оператору.',
  };
  const tickets = [];
  let classification;

  function resetDraft() {
    classification = undefined;
    draft.hidden = true;
    find('#draft-hint').hidden = false;
    find('#result').hidden = true;
  }

  Object.entries(examples).forEach(([id, message]) => {
    onClick(id, () => {
      request.value = message;
      resetDraft();
      request.focus();
    });
  });
  request.addEventListener('input', resetDraft);

  find('#support-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = request.value.trim();
    if (!message) {
      showResult(statusMessage('Введите обращение', 'Добавьте текст, тему и срочность которого нужно определить.'), true);
      return;
    }
    const normalized = message.toLowerCase().replaceAll('ё', 'е');
    const { topic, reply } = categories.find(({ terms }) => terms.test(normalized)) || other;
    const urgent = /срочн|немедлен|критич|дважды|двойное списан|взлом/.test(normalized);
    classification = { message, topic, urgent, urgency: urgent ? 'Высокая' : 'Обычная' };
    find('#topic').textContent = topic;
    find('#urgency').textContent = classification.urgency;
    draftText.value = reply;
    draft.hidden = false;
    handoff.disabled = false;
    find('#draft-hint').hidden = true;
    find('#result').hidden = true;
  });

  onClick('handoff', () => {
    if (!classification) return;
    const reply = draftText.value.trim();
    if (!reply) {
      showResult(statusMessage('Заполните черновик', 'Добавьте текст ответа перед передачей.'), true);
      return;
    }
    const id = String(421 + tickets.length).padStart(4, '0');
    const { message, topic, urgency, urgent } = classification;
    const ticket = document.createElement('li');
    ticket.innerHTML = `<details>
      <summary>#${id} · ${topic} · ${urgency}</summary>
      <p><strong>Обращение</strong> · ${escapeHtml(message)}</p>
      <p><strong>Черновик</strong> · ${escapeHtml(reply)}</p>
    </details>`;
    const queue = find('#queue');
    const firstRegular = urgent ? tickets.find((entry) => !entry.urgent) : undefined;
    queue.insertBefore(ticket, firstRegular?.element || null);
    tickets.push({ element: ticket, urgent });
    queue.hidden = false;
    find('#queue-hint').hidden = true;
    showResult(statusMessage('Передано оператору', `Обращение #${id} добавлено в локальную очередь вместе с черновиком.`));
    handoff.disabled = true;
  });
})();
