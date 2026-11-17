(function initializeConsult() {
  const { find, onClick, escapeHtml, statusMessage, showResult, appendMessage, handleLeadForm } =
    window.PortfolioDemo;
  const service = find('#consult-service');
  const faq = find('#faq');
  const followUp = find('#follow-up');
  const branches = {
    design: {
      faq: 'Что входит в проект?',
      description: 'В дизайн-проект входят планировка, визуализации, рабочие чертежи и список материалов.',
      questions: [
        ['Какой у вас объект?', ['Квартира', 'Дом']],
        ['Когда хотите начать проект?', ['В этом месяце', 'Позже']],
      ],
    },
    review: {
      faq: 'Как проходит разбор?',
      description: 'Разберём планировку на онлайн-встрече и предложим варианты расстановки мебели.',
      questions: [
        ['Какое пространство нужно разобрать?', ['Одна комната', 'Вся квартира']],
        ['Когда нужен разбор?', ['В этом месяце', 'Позже']],
      ],
    },
  };
  const transcript = [{ text: find('#greeting').textContent.trim(), fromCustomer: false }];
  let answers = [];
  let started = false;

  function message(text, fromCustomer = false) {
    transcript.push({ text, fromCustomer });
    appendMessage(escapeHtml(text), fromCustomer);
  }

  function askQuestion() {
    const question = branches[service.value].questions[answers.length];
    followUp.hidden = !question;
    if (!question) {
      message('Оставьте контакты, чтобы дизайнер мог с вами связаться.');
      find('#lead-name').focus();
      return;
    }
    const [prompt, options] = question;
    message(prompt);
    followUp.replaceChildren();
    for (const choice of options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = choice;
      button.addEventListener('click', () => {
        answers.push(choice);
        message(choice, true);
        askQuestion();
      });
      followUp.append(button);
    }
  }

  function startBranch(fromFaq = false) {
    const branch = branches[service.value];
    faq.textContent = branch.faq;
    faq.disabled = true;
    started = true;
    answers = [];
    message(fromFaq ? branch.faq : service.selectedOptions[0].textContent, true);
    message(branch.description);
    askQuestion();
  }

  service.addEventListener('change', () => startBranch());
  onClick('faq', () => startBranch(true));

  handleLeadForm((name, phone) => {
    const serviceName = service.selectedOptions[0].textContent;
    if (!started) message(serviceName, true);
    message('Хочу оставить запрос на консультацию.', true);
    const log = transcript
      .map(({ text, fromCustomer }) => `<li><b>${fromCustomer ? 'Клиент' : 'Бот'}</b> · ${escapeHtml(text)}</li>`)
      .join('');
    const details = [serviceName, ...answers].map(escapeHtml).join(' · ');
    showResult(
      statusMessage('Запрос передан менеджеру', `Тестовая карточка №TG-028 · ${name} · ${phone}`) +
        `<p>${details}</p><details><summary>Переписка</summary><ol>${log}</ol></details>`,
    );
    find('#controls').hidden = true;
  });
})();
