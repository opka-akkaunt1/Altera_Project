(function initializeSupport() {
  const { find, onClick, escapeHtml, statusMessage, showResult, buttonMarkup } =
    window.PortfolioDemo;
  find('#topic').addEventListener('change', () => {
    find('#request-body').textContent =
      find('#topic').value === 'Доставка'
        ? 'Заказ ещё не приехал, хотя доставка была назначена на вчера. Когда его привезут?'
        : 'Хочу вернуть заказ. Как оформить заявку на возврат?';
    find('#draft').hidden = true;
    find('#draft-hint').hidden = false;
    find('#result').hidden = true;
  });
  onClick('action', () => {
    const delivery = find('#topic').value === 'Доставка';
    find('#draft-hint').hidden = true;
    find('#result').hidden = true;
    const draft = find('#draft');
    draft.hidden = false;
    draft.innerHTML = `<label>Черновик ответа<textarea id="draft-text" rows="5">${delivery ? 'Мария, здравствуйте. Проверим статус заказа и уточним время доставки. Подскажите номер заказа, пожалуйста.' : 'Мария, здравствуйте. Подскажите номер заказа и причину возврата. Мы проверим детали и пришлём инструкцию.'}</textarea></label>${buttonMarkup('handoff', 'Передать оператору', 'secondary')}`;
    onClick('handoff', () => {
      if (!find('#draft-text').value.trim()) {
        showResult(
          statusMessage('Заполните черновик', 'Добавьте текст ответа перед передачей.'),
          true,
        );
        return;
      }
      showResult(
        statusMessage(
          'Передано оператору',
          `Тикет #0421 · ${escapeHtml(find('#topic').value)} · история и черновик приложены.`,
        ),
      );
      find('#handoff').disabled = true;
    });
  });
})();
