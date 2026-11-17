(function initializeConsult() {
  const { find, onClick, statusMessage, showResult, appendMessage, handleLeadForm } =
    window.PortfolioDemo;
  onClick('faq', () => {
    appendMessage('Что входит в проект?', true);
    appendMessage(
      'Планировка, визуализации, рабочие чертежи и перечень материалов. Оставьте контакты, чтобы дизайнер уточнил детали.',
    );
    find('#faq').disabled = true;
  });
  handleLeadForm((name, phone) => {
    appendMessage(`Хочу консультацию · ${name}`, true);
    showResult(statusMessage('Запрос передан менеджеру', `Обращение №TG-028 · ${name} · ${phone}`));
    find('#lead-form').hidden = true;
  });
})();
