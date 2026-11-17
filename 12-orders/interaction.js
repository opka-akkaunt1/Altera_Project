(function initializeOrders() {
  const { find, onClick, formatPrice, statusMessage, showResult, buttonMarkup, tableMarkup } =
    window.PortfolioDemo;
  const orders = [
    { id: '1048', name: 'Анна Соколова', sum: 12990, status: 'Новый', log: ['Заказ создан'] },
    { id: '1047', name: 'Игорь Нестеров', sum: 5890, status: 'Готов', log: ['Готов к выдаче'] },
    { id: '1046', name: 'Лев Котов', sum: 9450, status: 'В работе', log: ['Принят в работу'] },
    { id: '1045', name: 'Мария Ким', sum: 8190, status: 'Новый', log: ['Заказ создан'] },
  ];
  let current = null;
  const status = (s) =>
    `<span class="status" data-kind="${s === 'Готов' ? 'done' : s === 'В работе' ? 'active' : 'new'}">${s}</span>`;
  function list() {
    const query = find('#order-search').value.toLowerCase().trim();
    const matches = orders.filter((o) => (o.id + ' ' + o.name).toLowerCase().includes(query));
    find('#order-list').innerHTML = matches.length
      ? tableMarkup(
          ['№ заказа', 'Клиент', 'Сумма', 'Статус'],
          matches.map((o) => [
            `<button type="button" ${o.id === '1048' ? 'id="action"' : ''} class="quiet order-link" data-order="${o.id}">#${o.id}</button>`,
            o.name,
            formatPrice(o.sum),
            status(o.status),
          ]),
        )
      : '<p>Заказы не найдены.</p>';
  }
  function open() {
    find('#order-card').innerHTML =
      `<div class="keyvalues"><span>Номер</span><b>#${current.id}</b><span>Клиент</span><b>${current.name}</b><span>Сумма</span><b>${formatPrice(current.sum)}</b></div><label>Статус<select id="order-status">${['Новый', 'В работе', 'Готов'].map((s) => `<option ${s === current.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label>${buttonMarkup('save-order', 'Сохранить статус')}<h3>История</h3><ul>${current.log.map((l) => `<li>${l}</li>`).join('')}</ul>`;
    onClick('save-order', () => {
      const selected = find('#order-status').value;
      if (selected === current.status) {
        showResult(statusMessage('Статус уже выбран', `Заказ #${current.id} · ${current.status}`));
        return;
      }
      current.log.unshift(`Статус изменён: ${current.status} → ${selected}`);
      current.status = selected;
      list();
      open();
      showResult(statusMessage(`Заказ #${current.id} обновлён`, selected));
    });
  }
  find('#order-search').addEventListener('input', list);
  find('#order-list').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-order]');
    if (!btn) return;
    current = orders.find((o) => o.id === btn.dataset.order);
    find('#result').hidden = true;
    open();
  });
  list();
})();
