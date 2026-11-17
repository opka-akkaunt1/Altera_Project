(function registerDemoHelpers() {
  function find(selector) {
    return document.querySelector(selector);
  }

  function onClick(id, handleClick) {
    document.getElementById(id).addEventListener('click', handleClick);
  }

  function formatPrice(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
  }

  function escapeHtml(value) {
    const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, (character) => replacements[character]);
  }

  function statusMessage(heading, description) {
    return `<strong>${heading}</strong><p>${description}</p>`;
  }

  function showResult(content, error = false) {
    const result = find('#result');
    result.hidden = false;
    result.classList.toggle('error', error);
    result.innerHTML = content;
  }

  function buttonMarkup(id, caption, appearance = 'primary') {
    return `<button type="button" class="${appearance}" id="${id}">${caption}</button>`;
  }

  function appendMessage(content, fromCustomer = false) {
    const message = document.createElement('div');
    message.className = fromCustomer ? 'bubble mine' : 'bubble';
    message.innerHTML = content;
    find('#messages').append(message);
  }

  function tableMarkup(headings, rows) {
    const header = headings.map((heading) => `<th scope="col">${heading}</th>`).join('');
    const body = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
      .join('');
    return `<div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function handleLeadForm(acceptLead) {
    find('#lead-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = find('#lead-name').value.trim();
      const phone = find('#lead-phone').value.trim();
      if (!name || phone.replace(/\D/g, '').length < 10) {
        showResult(
          statusMessage('Проверьте контакты', 'Укажите имя и телефон с кодом города или страны.'),
          true,
        );
        return;
      }
      acceptLead(escapeHtml(name), escapeHtml(phone));
    });
  }

  window.PortfolioDemo = {
    find,
    onClick,
    formatPrice,
    escapeHtml,
    statusMessage,
    showResult,
    buttonMarkup,
    appendMessage,
    tableMarkup,
    handleLeadForm,
  };
})();
