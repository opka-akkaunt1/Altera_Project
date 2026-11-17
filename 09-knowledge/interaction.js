(function initializeKnowledge() {
  const { find, statusMessage, showResult, escapeHtml, buttonMarkup } = window.PortfolioDemo;
  const question = find('#question');
  const docs = [
    { id: 'leave-policy', terms: /^(отпуск|отгул)/ },
    { id: 'remote-policy', terms: /^(удален|дома$|дому$|гибрид)/ },
    { id: 'expense-policy', terms: /^(расход|чек(?:а|и|ов|ом)?$|командиров)/ },
  ];

  find('#examples').addEventListener('click', (event) => {
    const example = event.target.closest('button');
    if (example) {
      question.value = example.textContent;
      question.focus();
    }
  });

  find('#question-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const words = question.value.toLowerCase().replaceAll('ё', 'е').match(/[а-я]+/g) || [];
    const matches = docs.filter(({ terms }) => words.some((word) => terms.test(word)));
    if (!matches.length) {
      showResult(
        statusMessage(
          'Подходящий документ не найден',
          'Уточните тему вопроса. В учебной базе есть регламент отпусков, правила удалённой работы и памятка по расходам.',
        ) + buttonMarkup('try-example', 'Попробовать вопрос об отпуске', 'secondary'),
        true,
      );
      find('#try-example').addEventListener('click', () => find('#example').click());
      return;
    }

    const quotes = matches.map(({ id }) => {
      const source = document.getElementById(id);
      const text = escapeHtml(source.querySelector('p').textContent);
      const name = escapeHtml(source.querySelector('h3').textContent);
      const section = escapeHtml(source.querySelector('small').textContent);
      return `<div class="source-quote"><blockquote>${text}</blockquote><a href="#${id}">${name} · ${section} ↗</a></div>`;
    });

    showResult(`<details open><summary>Ответ по базе знаний</summary>${quotes.join('')}</details>`);
  });
})();
