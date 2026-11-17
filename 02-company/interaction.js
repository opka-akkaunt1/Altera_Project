(function initializeCompany() {
  const { find, onClick } = window.PortfolioDemo;
  onClick('action', () => find('#project-detail').showModal());
  onClick('close-dialog', () => find('#project-detail').close());
})();
