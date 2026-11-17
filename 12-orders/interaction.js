(function initializeOrders() {
  const { find, onClick, escapeHtml, formatPrice, statusMessage, showResult, tableMarkup } =
    window.PortfolioDemo;
  const unassigned = 'Не назначен';
  const assignees = [unassigned, 'Ирина Волкова', 'Олег Смирнов', 'Наталья Белова'];
  const statusKinds = new Map([['Новый', 'new'], ['В работе', 'active'], ['Готов', 'done']]);
  const orders = [
    { id: '1048', name: 'Анна Соколова', sum: 12990, status: 'Новый', assignee: unassigned, log: ['Заказ создан'] },
    { id: '1047', name: 'Игорь Нестеров', sum: 5890, status: 'Готов', assignee: assignees[1], log: ['Готов к выдаче'] },
    { id: '1046', name: 'Лев Котов', sum: 9450, status: 'В работе', assignee: assignees[2], log: ['Принят в работу'] },
    { id: '1045', name: 'Мария Ким', sum: 8190, status: 'Новый', assignee: unassigned, log: ['Заказ создан'] },
  ];
  let current = null;
  let nextId = 1049;

  function list() {
    const query = find('#order-search').value.toLowerCase().trim().replace(/^#/, '');
    const filter = find('#order-filter').value;
    const matches = orders.filter((order) =>
      (!filter || order.status === filter) &&
      (order.id + ' ' + order.name).toLowerCase().includes(query)
    );
    find('#order-list').innerHTML = matches.length
      ? tableMarkup(
          ['№ заказа', 'Клиент', 'Сумма', 'Статус'],
          matches.map((order) => [
            `<button type="button" ${order.id === '1048' ? 'id="action"' : ''} class="quiet order-link" data-order="${order.id}">#${order.id}</button>`,
            escapeHtml(order.name),
            formatPrice(order.sum),
            `<span class="status" data-kind="${statusKinds.get(order.status)}">${order.status}</span>`,
          ]),
        )
      : '<p>Заказы не найдены.</p>';
  }

  function options(values, selected) {
    return Array.from(values, (value) =>
      `<option ${value === selected ? 'selected' : ''}>${escapeHtml(value)}</option>`
    ).join('');
  }

  function historyMarkup(order) {
    return order.log.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('');
  }

  function openCard() {
    find('#order-card').innerHTML = `
      <div class="keyvalues">
        <span>Номер</span><b>#${current.id}</b>
        <span>Клиент</span><b>${escapeHtml(current.name)}</b>
        <span>Сумма</span><b>${formatPrice(current.sum)}</b>
      </div>
      <form id="edit-order">
        <label>Статус<select id="order-status">${options(statusKinds.keys(), current.status)}</select></label>
        <label>Ответственный<select id="order-assignee">${options(assignees, current.assignee)}</select></label>
        <button type="submit" class="primary" id="save-order">Сохранить изменения</button>
      </form>
      <h3>История</h3>
      <ul id="order-history">${historyMarkup(current)}</ul>`;

    find('#edit-order').addEventListener('submit', (event) => {
      event.preventDefault();
      const status = find('#order-status').value;
      const assignee = find('#order-assignee').value;
      const changes = [];
      if (status !== current.status) {
        changes.push(`Статус изменён: ${current.status} → ${status}`);
      }
      if (assignee !== current.assignee) {
        changes.push(`Ответственный изменён: ${current.assignee} → ${assignee}`);
      }
      if (!changes.length) {
        showResult(statusMessage('Изменений нет', `Заказ #${current.id} · ${status}`));
        return;
      }
      current.status = status;
      current.assignee = assignee;
      current.log.unshift(...changes);
      find('#order-history').innerHTML = historyMarkup(current);
      list();
      showResult(statusMessage(`Заказ #${current.id} обновлён`, `${status} · ${assignee}`));
    });
  }

  const createForm = find('#order-form');
  function toggleCreation(creating) {
    createForm.hidden = !creating;
    find('#order-card').hidden = creating;
    find('#new-order').setAttribute('aria-expanded', String(creating));
    find('#card-title').textContent = creating ? 'Новый заказ' : 'Карточка заказа';
    find('#result').hidden = true;
  }

  onClick('new-order', () => {
    const creating = createForm.hidden;
    toggleCreation(creating);
    if (creating) find('#order-customer').focus();
  });
  onClick('cancel-order', () => {
    createForm.reset();
    toggleCreation(false);
    find('#new-order').focus();
  });
  createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = find('#order-customer').value.trim();
    if (!name) {
      showResult(statusMessage('Укажите имя клиента', 'Оно появится в списке заказов.'), true);
      return;
    }
    current = {
      id: String(nextId++), name, sum: find('#order-total').valueAsNumber,
      status: 'Новый', assignee: unassigned, log: ['Заказ создан'],
    };
    orders.unshift(current);
    createForm.reset();
    toggleCreation(false);
    find('#order-search').value = '';
    find('#order-filter').value = '';
    list();
    openCard();
    find('#order-status').focus();
    showResult(statusMessage(`Заказ #${current.id} создан`, escapeHtml(current.name)));
  });

  find('#order-search').addEventListener('input', list);
  find('#order-filter').addEventListener('change', list);
  find('#order-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-order]');
    if (!button) return;
    current = orders.find((order) => order.id === button.dataset.order);
    toggleCreation(false);
    openCard();
  });
  list();
})();
