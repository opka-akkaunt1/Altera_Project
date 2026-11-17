(function initializeGithub() {
  const { find, onClick, escapeHtml, statusMessage, showResult, tableMarkup } =
    window.PortfolioDemo;
  const date = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  });
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC',
  });
  const count = new Intl.NumberFormat('ru-RU');
  const demo = [
    {
      full_name: 'acme/demo-store', default_branch: 'main', stargazers_count: 128,
      open_issues_count: 14, forks_count: 23, updated_at: '2026-10-30T10:22:00Z',
      release: { tag_name: 'v1.8.0', published_at: '2026-10-29T10:00:00Z' },
    },
    {
      full_name: 'acme/demo-catalog', default_branch: 'main', stargazers_count: 91,
      open_issues_count: 7, forks_count: 16, updated_at: '2026-10-31T16:10:00Z',
      release: null,
    },
  ];
  const hint = find('#repo-hint');
  const action = find('#action');
  const example = find('#example');

  function dateMarkup(value, detailed = false) {
    const timestamp = new Date(value ?? NaN);
    if (Number.isNaN(timestamp.getTime())) return 'Нет данных';
    const label = date.format(timestamp) + (detailed ? ' · ' + time.format(timestamp) + ' UTC' : '');
    return `<time datetime="${timestamp.toISOString()}">${label}</time>`;
  }

  function releaseMarkup(repository) {
    if (repository.releaseError) return escapeHtml(repository.releaseError);
    if (!repository.release) return 'Релиз не опубликован';
    return dateMarkup(repository.release.published_at) + ' · ' + escapeHtml(repository.release.tag_name);
  }

  function render(repositories, live, updated) {
    hint.hidden = true;
    const successful = repositories.filter((repository) => !repository.error);
    const heading = !live ? 'Тестовый ответ API'
      : successful.length === repositories.length ? 'Получено из GitHub API'
      : successful.length ? 'Часть данных получена из GitHub API' : 'Не удалось получить данные';
    const description = successful.length
      ? `Данные обновлены ${dateMarkup(updated, true)}`
      : 'Проверьте имена или повторите запрос позже.';
    const metrics = [
      ['Ветка', (repo) => escapeHtml(repo.default_branch)],
      ['Звёзды', (repo) => count.format(repo.stargazers_count)],
      ['Открытые задачи и PR', (repo) => count.format(repo.open_issues_count)],
      ['Форки', (repo) => count.format(repo.forks_count)],
      ['Дата релиза', releaseMarkup],
      ['Обновление репозитория', (repo) => dateMarkup(repo.updated_at, true)],
    ];
    const errors = repositories.filter((repository) => repository.error)
      .map((repository) => `<p>${escapeHtml(repository.full_name)} · ${escapeHtml(repository.error)}</p>`).join('');
    showResult(
      statusMessage(heading, description) + errors + tableMarkup(
        ['Показатель', ...repositories.map((repo) => escapeHtml(repo.full_name))],
        metrics.map(([label, display]) => [
          label, ...repositories.map((repo) => repo.error ? '—' : display(repo)),
        ]),
      ),
      !successful.length,
    );
  }

  function errorMessage(status) {
    if (status === 404) return 'Репозиторий не найден или закрыт.';
    if (status === 403 || status === 429) return 'GitHub ограничил запросы. Повторите позже.';
    return 'GitHub вернул код ' + status + '.';
  }

  async function request(url) {
    return fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(7500),
    });
  }

  async function latestRelease(destination) {
    try {
      const response = await request(destination + '/releases/latest');
      if (response.ok) return { release: await response.json() };
      if (response.status === 404) return { release: null };
      return { releaseError: 'Дата недоступна · HTTP ' + response.status };
    } catch {
      return { releaseError: 'Дата недоступна · ошибка соединения' };
    }
  }

  async function loadRepository(repo) {
    const destination =
      'https://api.github.com/repos/' + repo.split('/').map(encodeURIComponent).join('/');
    try {
      const response = await request(destination);
      if (!response.ok) return { full_name: repo, error: errorMessage(response.status) };
      const data = await response.json();
      return { ...data, ...await latestRelease(destination) };
    } catch {
      return { full_name: repo, error: 'Не удалось подключиться к GitHub.' };
    }
  }

  onClick('example', () => render(demo, false, '2026-11-01T12:00:00Z'));
  find('#repo-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (action.disabled) return;
    const repositories = [find('#repo-name').value.trim(), find('#repo-compare').value.trim()];
    const slugPattern = /^[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/;
    if (repositories.some((repo) => !slugPattern.test(repo) || repo.endsWith('/.') || repo.endsWith('/..'))) {
      showResult(statusMessage('Проверьте имена', 'Укажите оба репозитория в формате владелец/репозиторий.'), true);
      return;
    }
    if (repositories[0].toLowerCase() === repositories[1].toLowerCase()) {
      showResult(statusMessage('Укажите разные репозитории', 'Сейчас в обоих полях один и тот же репозиторий.'), true);
      return;
    }

    hint.hidden = true;
    action.disabled = example.disabled = true;
    showResult(statusMessage('Запрашиваем данные', 'Подключение к GitHub API…'));
    try {
      const data = await Promise.all(repositories.map(loadRepository));
      render(data, true, new Date());
    } finally {
      action.disabled = example.disabled = false;
    }
  });
})();
