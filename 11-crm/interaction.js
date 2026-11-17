(function initializeCrm() {
  const { find, escapeHtml, statusMessage, showResult } = window.PortfolioDemo;
  const contacts = new Map([['demo@example.com', { id: 201, name: 'Алексей Орлов' }]]);
  const deals = new Map();
  const log = find('#sync-log');

  function logSync(email, outcome) {
    const entry = document.createElement('li');
    entry.textContent = `${email} · ${outcome}`;
    log.prepend(entry);
    log.hidden = false;
    find('#sync-empty').hidden = true;
  }

  find('#crm-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = find('#lead-name').value.trim();
    const email = find('#lead-email').value.trim().toLowerCase();
    const company = find('#lead-company').value.trim();
    const topic = find('#lead-topic').value.trim();
    if (!name || !company || !topic) {
      showResult(statusMessage('Заполните данные заявки', 'Укажите имя, компанию и тему.'), true);
      return;
    }

    const key = JSON.stringify([email, company.toLowerCase(), topic.toLowerCase()]);
    if (deals.has(key)) {
      const id = deals.get(key);
      logSync(email, `Повтор заявки · ${id}`);
      showResult(statusMessage(`Сделка уже существует · ${id}`, 'Дубликат не создан.'));
      return;
    }

    let contact = contacts.get(email);
    const found = Boolean(contact);
    if (!contact) {
      contact = { id: 201 + contacts.size, name };
      contacts.set(email, contact);
    }
    const id = '#CR-' + (104 + deals.size);
    deals.set(key, id);
    const contactStatus = found ? 'Существующий контакт' : 'Контакт создан';
    logSync(email, `${contactStatus} · сделка ${id}`);
    showResult(
      statusMessage(
        `Сделка создана · ${id}`,
        `${escapeHtml(topic)} · ${escapeHtml(company)} · этап «Новая»`,
      ) + `<p>${contactStatus} · #${contact.id} · ${escapeHtml(contact.name)}</p>`,
    );
  });
})();
