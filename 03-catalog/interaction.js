(function initializeCatalog() {
  const { find, formatPrice, statusMessage, showResult, buttonMarkup } = window.PortfolioDemo;
  const items = [
    ['nova', 'Nova H1', 'Наушники', 8990, 'headphones'],
    ['pulse', 'Pulse Mini', 'Акустика', 5490, 'speaker'],
    ['type', 'Type 67', 'Аксессуары', 7590, 'keyboard'],
    ['beam', 'Beam Desk', 'Аксессуары', 4190, 'lamp'],
  ];
  let filter = 'Все товары';
  const cart = new Map();
  const drawCart = () => {
    find('#cart-link').textContent = 'Корзина · ' + [...cart.values()].reduce((a, b) => a + b, 0);
    find('#basket-items').innerHTML = cart.size
      ? `${[...cart]
          .map(([id, count]) => {
            const item = items.find((x) => x[0] === id);
            return `<div class="cart-line"><span>${item[1]} × ${count}</span><strong>${formatPrice(item[3] * count)}</strong><button type="button" class="quiet" data-remove="${id}" aria-label="Убрать ${item[1]}">−</button></div>`;
          })
          .join(
            '',
          )}<div class="total"><span>Итого</span><strong>${formatPrice([...cart].reduce((sum, [id, count]) => sum + items.find((x) => x[0] === id)[3] * count, 0))}</strong></div>`
      : '<p>Выберите товар из каталога.</p>';
  };
  const list = () => {
    find('#products').innerHTML = items
      .filter((x) => filter === 'Все товары' || x[2] === filter)
      .map(
        ([id, name, category, price, photo]) =>
          `<article class="product"><div class="product-photo ${photo}" role="img" aria-label="${name}"></div><div class="product-copy"><small>${category}</small><h2>${name}</h2><div class="product-action"><strong>${formatPrice(price)}</strong>${buttonMarkup('buy-' + id, 'В корзину', 'secondary')}</div></div></article>`,
      )
      .join('');
  };
  find('#filters').addEventListener('click', (event) => {
    const target = event.target.closest('[data-category]');
    if (!target) return;
    filter = target.dataset.category;
    find('#filters')
      .querySelectorAll('button')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === target)));
    list();
  });
  find('#products').addEventListener('click', (event) => {
    const target = event.target.closest('[id^="buy-"]');
    if (!target) return;
    const id = target.id.slice(4);
    const item = items.find((x) => x[0] === id);
    cart.set(id, (cart.get(id) || 0) + 1);
    drawCart();
    showResult(statusMessage(`${item[1]} добавлены`, 'Количество и сумма обновлены.'));
  });
  find('#basket-items').addEventListener('click', (event) => {
    const target = event.target.closest('[data-remove]');
    if (!target) return;
    const id = target.dataset.remove;
    const count = cart.get(id);
    if (count === 1) cart.delete(id);
    else cart.set(id, count - 1);
    drawCart();
    find('#result').hidden = true;
  });
  list();
  drawCart();
})();
