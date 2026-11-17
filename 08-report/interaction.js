(function initializeReport() {
  const { find, onClick, formatPrice, statusMessage, showResult } = window.PortfolioDemo;
  const sales = [22, 35, 28, 41, 25, 49, 37],
    orders = [4, 6, 5, 8, 5, 10, 7];
  let weekly = false;
  const names = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  function numbers() {
    const total = (weekly ? sales.reduce((a, b) => a + b, 0) : sales.at(-1)) * 1000;
    const count = weekly ? orders.reduce((a, b) => a + b, 0) : orders.at(-1);
    return [formatPrice(total), count, formatPrice(Math.round(total / count))];
  }
  const draw = () => {
    find('#metrics').innerHTML = ['Выручка', 'Заказы', 'Средний чек']
      .map((label, i) => `<div class="metric"><span>${label}</span><b>${numbers()[i]}</b></div>`)
      .join('');
  };
  find('#period').addEventListener('click', (event) => {
    if (!['period-day', 'period-week'].includes(event.target.id)) return;
    weekly = event.target.id === 'period-week';
    find('#period-day').setAttribute('aria-pressed', String(!weekly));
    find('#period-week').setAttribute('aria-pressed', String(weekly));
    find('#result').hidden = true;
    find('#report-hint').hidden = false;
    draw();
  });
  onClick('action', () => {
    const [total, count, average] = numbers();
    find('#report-hint').hidden = true;
    showResult(
      statusMessage(
        `Сводка за ${weekly ? 'неделю' : 'день'} сформирована`,
        `Выручка ${total}<br>Заказов ${count}<br>Средний чек ${average}`,
      ),
    );
  });
  draw();
})();
