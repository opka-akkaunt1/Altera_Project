(function initializeLanding() {
  const {
    find,
    onClick,
    formatPrice,
    statusMessage,
    showResult,
    handleLeadForm,
  } = window.PortfolioDemo;
  const form = find("#lead-form");
  const review = find("#review");
  const areaFormat = new Intl.NumberFormat("ru-RU");

  handleLeadForm(() => {
    const property = find("#property-type");
    find("#review-type").textContent = property.selectedOptions[0].textContent;
    find("#review-area").textContent =
      areaFormat.format(find("#property-area").valueAsNumber) + " м²";
    find("#review-budget").textContent = formatPrice(
      find("#property-budget").valueAsNumber,
    );
    find("#review-name").textContent = find("#lead-name").value.trim();
    find("#review-phone").textContent = find("#lead-phone").value.trim();
    find("#result").hidden = true;
    form.hidden = true;
    review.hidden = false;
    find("#review-title").focus();
  });

  onClick("edit-lead", () => {
    review.hidden = true;
    form.hidden = false;
    find("#property-type").focus();
  });

  onClick("submit-lead", () => {
    review.hidden = true;
    showResult(
      statusMessage(
        "Заявка принята · №F-014",
        "Тестовая заявка заполнена и подтверждена.",
      ),
    );
  });
})();
