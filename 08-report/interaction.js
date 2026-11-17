(function initializeReport() {
  const { find, onClick, formatPrice, statusMessage, showResult, tableMarkup } = window.PortfolioDemo;
  const day = 24 * 60 * 60 * 1000;
  const sales = [
    17, 26, 21, 32, 20, 38, 24,
    18, 29, 23, 30, 22, 39, 27,
    19, 31, 24, 33, 21, 42, 28,
    22, 35, 28, 41, 25, 49, 37,
  ];
  const orders = [
    3, 5, 4, 6, 4, 7, 5,
    3, 5, 4, 6, 4, 8, 5,
    3, 5, 4, 7, 4, 8, 6,
    4, 6, 5, 8, 5, 10, 7,
  ];
  const firstDate = Date.UTC(2026, 9, 19);
  const lastDate = Date.UTC(2026, 10, 15);
  const weekStart = lastDate - 6 * day;
  const fromInput = find('#from-date');
  const toInput = find('#to-date');
  const download = find('#download');
  const hint = find('#report-hint');
  const result = find('#result');
  const dateText = new Intl.DateTimeFormat('ru-RU', { timeZone: 'UTC' });
  let downloadUrl;

  const isoDate = (timestamp) => new Date(timestamp).toISOString().slice(0, 10);
  const periodText = (from, to) => from === to ? dateText.format(from) : `${dateText.format(from)}–${dateText.format(to)}`;

  function rowsFor(from, to) {
    const rows = [];
    for (let date = from; date <= to; date += day) {
      const index = (date - firstDate) / day;
      rows.push({ date, revenue: sales[index] * 1000, count: orders[index] });
    }
    return rows;
  }

  function totals(rows) {
    const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
    const count = rows.reduce((sum, row) => sum + row.count, 0);
    return [revenue, count, Math.round(revenue / count)];
  }

  function clearPreview() {
    const from = fromInput.valueAsNumber;
    const to = toInput.valueAsNumber;
    find('#period-day').setAttribute('aria-pressed', String(from === lastDate && to === lastDate));
    find('#period-week').setAttribute('aria-pressed', String(from === weekStart && to === lastDate));
    result.hidden = true;
    hint.hidden = false;
    download.hidden = true;
    download.removeAttribute('href');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = undefined;
    }
  }

  function preset(from) {
    fromInput.value = isoDate(from);
    toInput.value = isoDate(lastDate);
    clearPreview();
  }

  function drawChart(rows, from, to) {
    find('#chart-range').textContent = periodText(from, to);
    const chart = find('#daily-chart');
    chart.toggleAttribute('data-dense', rows.length > 7);
    chart.innerHTML = rows.map(({ date, revenue }) => `
      <div class="bar-col">
        <strong>${revenue / 1000} тыс.</strong>
        <div class="bar" style="--bar: ${Math.round(revenue / 400)}px"></div>
        <span>${dateText.format(date).slice(0, 5)}</span>
      </div>`).join('');
  }

  function drawComparison(current, previous, previousPeriod) {
    const section = find('#comparison');
    const title = '<h3>Сравнение с предыдущим периодом</h3>';
    const previousNumbers = totals(previous);
    const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, signDisplay: 'exceptZero' });
    const rows = ['Выручка', 'Заказы', 'Средний чек'].map((label, index) => {
      const before = previousNumbers[index];
      const change = (current[index] - before) / before * 100;
      return [label, index === 1 ? before : formatPrice(before), `${number.format(change)}%`];
    });
    section.innerHTML = title + `<p>${previousPeriod}</p>` + tableMarkup(['Показатель', 'Было', 'Изменение'], rows);
  }

  function enableDownload(current, previous, from, to) {
    const lines = ['Период;Дата;Выручка, ₽;Заказы'];
    for (const [label, rows] of [['Текущий', current], ['Предыдущий', previous]]) {
      for (const { date, revenue, count } of rows) {
        lines.push(`${label};${isoDate(date)};${revenue};${count}`);
      }
    }
    downloadUrl = URL.createObjectURL(new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    download.href = downloadUrl;
    download.download = `sales-${isoDate(from)}_${isoDate(to)}.csv`;
    download.hidden = false;
  }

  onClick('period-day', () => preset(lastDate));
  onClick('period-week', () => preset(weekStart));
  fromInput.addEventListener('input', clearPreview);
  toInput.addEventListener('input', clearPreview);
  find('#report-form').addEventListener('submit', (event) => {
    event.preventDefault();
    clearPreview();
    const from = fromInput.valueAsNumber;
    const to = toInput.valueAsNumber;
    hint.hidden = true;
    if (from > to) {
      showResult(statusMessage('Проверьте даты', 'Дата начала должна быть раньше даты окончания или совпадать с ней.'), true);
      return;
    }

    const previousEnd = from - day;
    const previousStart = previousEnd - (to - from);
    const current = rowsFor(from, to);
    const previous = rowsFor(previousStart, previousEnd);
    const currentNumbers = totals(current);
    const labels = ['Выручка', 'Заказы', 'Средний чек'];
    const values = [formatPrice(currentNumbers[0]), currentNumbers[1], formatPrice(currentNumbers[2])];
    find('#metrics').querySelectorAll('b').forEach((value, index) => { value.textContent = values[index]; });
    drawChart(current, from, to);
    drawComparison(currentNumbers, previous, periodText(previousStart, previousEnd));

    const periodName = from === to ? 'за день' : to - from === 6 * day ? 'за неделю' : 'за период';
    showResult(statusMessage(
      `Сводка ${periodName} сформирована`,
      [`Пульс · Продажи · ${periodText(from, to)}`, ...labels.map((label, index) => `${label} · ${values[index]}`)].join('<br>'),
    ));
    enableDownload(current, previous, from, to);
  });
})();
