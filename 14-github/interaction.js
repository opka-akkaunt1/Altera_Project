(function initializeGithub() {
  const { find, onClick, escapeHtml, statusMessage, showResult, tableMarkup } =
    window.PortfolioDemo;
  function render(data, live) {
    find('#repo-hint').hidden = true;
    showResult(
      statusMessage(
        live ? 'Получено из GitHub API' : 'Тестовый ответ API',
        `${escapeHtml(data.full_name)} · Ветка ${escapeHtml(data.default_branch)}`,
      ) +
        tableMarkup(
          ['Показатель', 'Значение'],
          [
            ['Звёзды', escapeHtml(data.stargazers_count)],
            ['Открытые задачи и PR', escapeHtml(data.open_issues_count)],
            ['Форки', escapeHtml(data.forks_count)],
          ],
        ),
    );
  }
  onClick('example', () =>
    render(
      {
        full_name: 'acme/demo-store',
        default_branch: 'main',
        stargazers_count: 128,
        open_issues_count: 14,
        forks_count: 23,
      },
      false,
    ),
  );
  find('#repo-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const repo = find('#repo-name').value.trim();
    if (!/^[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
      showResult(
        statusMessage('Проверьте адрес', 'Введите имя в формате владелец/репозиторий.'),
        true,
      );
      return;
    }
    find('#repo-hint').hidden = true;
    find('#action').disabled = find('#example').disabled = true;
    showResult(statusMessage('Запрашиваем данные', 'Подключение к GitHub API…'));
    try {
      const destination =
        'https://api.github.com/repos/' + repo.split('/').map(encodeURIComponent).join('/');
      const response = await fetch(destination, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: AbortSignal.timeout(8500),
      });
      if (!response.ok) {
        const message =
          response.status === 404
            ? 'Проверьте имя и публичный доступ к репозиторию.'
            : response.status === 403 || response.status === 429
              ? 'GitHub временно ограничил запросы. Попробуйте позднее.'
              : 'Попробуйте повторить запрос.';
        showResult(statusMessage('GitHub вернул код ' + response.status, message), true);
        return;
      }
      const data = await response.json();
      render(data, true);
    } catch {
      showResult(
        statusMessage(
          'Не удалось подключиться к GitHub',
          'Проверьте соединение или откройте тестовый ответ.',
        ),
        true,
      );
    } finally {
      find('#action').disabled = find('#example').disabled = false;
    }
  });
})();
