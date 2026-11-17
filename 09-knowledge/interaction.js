(function initializeKnowledge() {
  const { find, onClick, statusMessage, showResult } = window.PortfolioDemo;
  const docs = [
    {
      label: 'Регламент отпусков',
      terms: /отпуск|отгул/i,
      text: 'Подайте заявку руководителю за 14 дней до начала отпуска. После согласования передайте её в отдел кадров.',
      section: 'Раздел 2. Порядок согласования',
    },
    {
      label: 'Правила удалённой работы',
      terms: /удал[её]н|дом[ау]/i,
      text: 'Согласуйте удалённый день с руководителем и отметьте его в общем календаре команды.',
      section: 'Раздел 3. График',
    },
    {
      label: 'Памятка по расходам',
      terms: /расход|чек|командиров/i,
      text: 'В течение пяти рабочих дней прикрепите чек и краткое описание расхода к заявке.',
      section: 'Раздел 1. Подтверждение расходов',
    },
  ];
  onClick('example', () => {
    find('#question').value = 'Как согласовать отпуск?';
  });
  onClick('remote', () => {
    find('#question').value = 'Как работать удалённо?';
  });
  find('#question-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const doc = docs.find((x) => x.terms.test(find('#question').value));
    if (!doc) {
      showResult(
        statusMessage(
          'Подходящий документ не найден',
          'Попробуйте спросить про отпуск, удалённую работу или расходы.',
        ),
        true,
      );
      return;
    }
    showResult(
      statusMessage('Ответ по базе знаний', doc.text) +
        `<details><summary>${doc.label} ↗</summary><p>${doc.section}. ${doc.text}</p></details>`,
    );
  });
})();
