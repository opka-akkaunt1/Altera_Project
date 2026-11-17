(function initializeLanding() {
  const { statusMessage, showResult, handleLeadForm } = window.PortfolioDemo;
  handleLeadForm((name, phone) =>
    showResult(
      statusMessage(
        'Заявка принята · №F-014',
        `${name}, мы свяжемся с вами по номеру ${phone}. Это тестовая заявка.`,
      ),
    ),
  );
})();
