(function initializeSales() {
  const { find, onClick, statusMessage, showResult, buttonMarkup, appendMessage } =
    window.PortfolioDemo;
  onClick('action', () => {
    appendMessage('Оформить заказ', true);
    appendMessage('<b>Счёт №ZR-031</b><br>Бразилия Серрадо × 1<br>К оплате 1 190 ₽');
    find('#controls').innerHTML = buttonMarkup('pay', 'Провести тестовый платёж');
    onClick('pay', () => {
      find('#controls').hidden = true;
      showResult(
        statusMessage('Тестовая оплата прошла', 'Заказ №ZR-031 · 1 190 ₽ · статус «Оплачен».'),
      );
    });
  });
})();
