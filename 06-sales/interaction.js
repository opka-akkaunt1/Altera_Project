(function initializeSales() {
  const { find, onClick, formatPrice, statusMessage, showResult, appendMessage } =
    window.PortfolioDemo;
  const receipt = find('#sales-items');
  const checkout = find('#action');
  const paymentControls = find('#payment-controls');
  const pay = find('#pay');
  const decline = find('#decline-payment');
  const offers = [...document.querySelectorAll('[data-sku]')];
  const items = offers.map((offer) => ({
    sku: offer.dataset.sku,
    price: Number(offer.dataset.price),
    name: offer.querySelector('strong').textContent,
    button: offer.querySelector('button'),
    quantity: offer.dataset.sku === 'brazil' ? 1 : 0,
  }));
  const invoiceNumber = 'ZR-031';
  const maxQuantity = 99;
  let invoiceTotal = null;

  function cartLines() {
    return items.filter((item) => item.quantity > 0);
  }

  function cartTotal() {
    return cartLines().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function drawCart() {
    const lines = cartLines();
    receipt.innerHTML = lines.length
      ? lines.map(({ sku, name, price, quantity }) => `
        <div class="cart-line">
          <span>${name} × ${quantity}</span>
          <strong>${formatPrice(price * quantity)}</strong>
          <button type="button" class="quiet" aria-label="Уменьшить количество ${name}" data-remove="${sku}">−</button>
        </div>`).join('')
      : '<p>Корзина пуста.</p>';
    find('#sales-total').textContent = `К оплате ${formatPrice(cartTotal())}`;
    checkout.disabled = lines.length === 0;
    items.forEach((item) => { item.button.disabled = item.quantity === maxQuantity; });
  }

  for (const item of items) {
    item.button.addEventListener('click', () => {
      item.quantity += 1;
      drawCart();
    });
  }

  receipt.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    const item = items.find(({ sku }) => sku === button.dataset.remove);
    item.quantity -= 1;
    drawCart();
    const next = receipt.querySelector(`[data-remove="${item.sku}"]`) || item.button;
    next.focus();
  });

  onClick('action', () => {
    const lines = cartLines();
    if (lines.length === 0 || invoiceTotal !== null) return;
    invoiceTotal = cartTotal();
    const breakdown = lines
      .map(({ name, quantity, price }) => `${name} × ${quantity} · ${formatPrice(price * quantity)}`)
      .join('<br>');
    appendMessage('Оформить заказ', true);
    appendMessage(`<b>Счёт №${invoiceNumber}</b><br>${breakdown}<br><b>К оплате ${formatPrice(invoiceTotal)}</b>`);
    find('#controls').hidden = true;
    paymentControls.hidden = false;
    pay.focus();
  });

  onClick('decline-payment', () => {
    if (paymentControls.hidden || decline.disabled) return;
    showResult(
      statusMessage('Тестовый платёж отклонён', `Счёт №${invoiceNumber} на ${formatPrice(invoiceTotal)} ожидает оплаты.`),
      true,
    );
    decline.disabled = true;
    pay.textContent = 'Повторить тестовый платёж';
    pay.focus();
  });

  onClick('pay', () => {
    if (paymentControls.hidden) return;
    paymentControls.hidden = true;
    showResult(
      statusMessage('Тестовая оплата прошла', `Заказ №${invoiceNumber} · ${formatPrice(invoiceTotal)} · статус «Оплачен».`),
    );
  });

  drawCart();
})();
