(function initializeCatalog() {
  const { find, formatPrice, statusMessage, showResult } = window.PortfolioDemo;
  const products = find('#products');
  const basket = find('#basket-items');
  const review = find('#review-order');
  const search = find('#catalog-search');
  const sort = find('#catalog-sort');
  const filters = find('#filters');
  const items = [...products.querySelectorAll('article')].map((card) => ({
    card,
    id: card.querySelector('button').id.slice(4),
    name: card.querySelector('h2').textContent,
    category: card.querySelector('small').textContent,
    price: Number(card.dataset.price),
  }));
  const cart = new Map();
  const maxQuantity = 99;

  function cartLines() {
    return items
      .filter(({ id }) => cart.has(id))
      .map((item) => ({ ...item, quantity: cart.get(item.id) }));
  }

  function updateTotals() {
    const lines = cartLines();
    const quantity = lines.reduce((sum, item) => sum + item.quantity, 0);
    const amount = lines.reduce((sum, item) => sum + item.quantity * item.price, 0);
    find('#cart-link').textContent = 'Корзина · ' + quantity;
    review.hidden = lines.length === 0;
    if (lines.length) find('#basket-total').textContent = formatPrice(amount);
  }

  function drawCart() {
    const lines = cartLines();
    basket.innerHTML = lines.length
      ? lines.map(({ id, name, price, quantity }) => `
        <div class="cart-line">
          <label for="quantity-${id}">${name}</label>
          <input id="quantity-${id}" data-quantity="${id}" aria-label="Количество ${name}"
            type="number" min="1" max="${maxQuantity}" step="1" value="${quantity}" required>
          <strong id="subtotal-${id}">${formatPrice(price * quantity)}</strong>
          <button type="button" class="quiet" data-remove="${id}" aria-label="Уменьшить количество ${name}">−</button>
        </div>`).join('') +
        '<div class="total"><span>Итого</span><strong id="basket-total"></strong></div>'
      : '<p>Выберите товар из каталога.</p>';
    updateTotals();
  }

  function updateProducts() {
    const category = filters.querySelector('[aria-pressed="true"]').dataset.category;
    const query = search.value.trim().toLocaleLowerCase('ru');
    const ordered = [...items];
    if (sort.value !== 'default') {
      const direction = sort.value === 'asc' ? 1 : -1;
      ordered.sort((first, second) => direction * (first.price - second.price));
    }
    ordered.forEach(({ card, name, category: itemCategory }) => {
      const matchesCategory = category === 'Все товары' || category === itemCategory;
      const matchesSearch = (name + ' ' + itemCategory).toLocaleLowerCase('ru').includes(query);
      card.hidden = !matchesCategory || !matchesSearch;
      products.append(card);
    });
    find('#catalog-empty').hidden = ordered.some(({ card }) => !card.hidden);
  }

  filters.addEventListener('click', (event) => {
    const target = event.target.closest('[data-category]');
    if (!target) return;
    filters.querySelectorAll('[data-category]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === target));
    });
    updateProducts();
  });
  search.addEventListener('input', updateProducts);
  sort.addEventListener('change', updateProducts);

  products.addEventListener('click', (event) => {
    const target = event.target.closest('[id^="buy-"]');
    if (!target) return;
    const item = items.find(({ id }) => target.id === 'buy-' + id);
    const previous = cart.get(item.id) || 0;
    if (previous === maxQuantity) {
      showResult(statusMessage('Достигнут лимит', 'В корзине может быть до 99 штук каждого товара.'), true);
      return;
    }
    cart.set(item.id, previous + 1);
    drawCart();
    showResult(statusMessage(`${item.name} добавлены`, 'Количество и сумма обновлены.'));
  });

  basket.addEventListener('change', (event) => {
    const field = event.target.closest('[data-quantity]');
    if (!field) return;
    const id = field.dataset.quantity;
    if (!field.validity.valid) {
      field.value = cart.get(id);
      return;
    }
    cart.set(id, field.valueAsNumber);
    const item = items.find((product) => product.id === id);
    find('#subtotal-' + id).textContent = formatPrice(item.price * field.valueAsNumber);
    updateTotals();
    find('#result').hidden = true;
  });

  basket.addEventListener('click', (event) => {
    const target = event.target.closest('[data-remove]');
    if (!target) return;
    const id = target.dataset.remove;
    const count = cart.get(id);
    if (count === 1) cart.delete(id);
    else cart.set(id, count - 1);
    drawCart();
    find('#result').hidden = true;
    const next = find(`[data-remove="${id}"]`) || basket.querySelector('[data-remove]') || find('#cart-link');
    next.focus();
  });

  review.addEventListener('click', () => {
    const lines = cartLines()
      .map(({ name, quantity, price }) => `<li>${name} × ${quantity} · ${formatPrice(price * quantity)}</li>`)
      .join('');
    const total = find('#basket-total').textContent;
    showResult(`<strong>Сводка заказа</strong><ul>${lines}</ul><p>Итого ${total}</p>`);
  });
})();
