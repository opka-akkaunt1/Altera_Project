(function initializeBooking() {
  const { find, onClick, statusMessage, showResult, buttonMarkup, appendMessage } =
    window.PortfolioDemo;
  const service = find('#booking-service');
  const day = find('#booking-day');
  const slots = find('#slot-group');
  const controls = find('#controls');
  const confirm = find('#action');
  const workingHours = [11 * 60, 18 * 60];
  const step = 30;
  const occupied = {
    'day-one': [[12 * 60, 14 * 60 + 30], [15 * 60 + 30, 17 * 60]],
    'day-two': [[11 * 60, 12 * 60], [13 * 60 + 30, 16 * 60]],
  };
  let selectedStart = null;
  let booking = null;

  function formatTime(minutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const remainder = String(minutes % 60).padStart(2, '0');
    return hours + ':' + remainder;
  }

  function duration() {
    return Number(service.selectedOptions[0].dataset.duration);
  }

  function renderSlots() {
    const intervals = [...occupied[day.value]];
    if (booking?.day === day.value) intervals.push([booking.start, booking.end]);
    const [opens, closes] = workingHours;
    const available = [];
    const minutes = duration();
    for (let start = opens; start + minutes <= closes; start += step) {
      const end = start + minutes;
      const overlaps = intervals.some(([busyStart, busyEnd]) => start < busyEnd && busyStart < end);
      if (!overlaps) available.push(start);
    }

    selectedStart = null;
    confirm.disabled = true;
    slots.innerHTML = available.length
      ? available.map((start, index) => `
          <button type="button" id="slot-${index + 1}" class="chip"
            aria-pressed="false" data-start="${start}">${formatTime(start)}</button>`).join('')
      : '<p>На этот день нет свободных окон для выбранной услуги.</p>';
  }

  function showBooking(heading) {
    const { dayLabel, serviceLabel, start, end } = booking;
    showResult(
      statusMessage(heading, `${dayLabel}, ${formatTime(start)}–${formatTime(end)} · ${serviceLabel} · №M-042`) +
        '<div class="toolbar">' + buttonMarkup('reschedule', 'Перенести запись', 'secondary') +
          buttonMarkup('cancel', 'Отменить запись', 'secondary') + '</div>',
    );
  }

  service.addEventListener('change', renderSlots);
  day.addEventListener('change', renderSlots);
  slots.addEventListener('click', (event) => {
    const chosen = event.target.closest('[data-start]');
    if (!chosen) return;
    selectedStart = Number(chosen.dataset.start);
    slots.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === chosen));
    });
    confirm.disabled = false;
  });

  onClick('action', () => {
    if (selectedStart === null) return;
    const rescheduled = Boolean(booking);
    const dayLabel = day.selectedOptions[0].textContent;
    appendMessage(`${rescheduled ? 'Перенесите запись' : 'Запишите меня'} · ${dayLabel}, ${formatTime(selectedStart)}`, true);
    booking = {
      day: day.value,
      service: service.value,
      dayLabel,
      serviceLabel: service.selectedOptions[0].textContent,
      start: selectedStart,
      end: selectedStart + duration(),
    };
    controls.hidden = true;
    showBooking(rescheduled ? 'Запись перенесена' : 'Запись подтверждена');
    find('#reschedule').focus();
  });

  find('#result').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !booking) return;
    if (button.id === 'reschedule') {
      confirm.textContent = 'Подтвердить перенос';
      controls.hidden = false;
      renderSlots();
      showResult(
        statusMessage('Выберите новое время', `Текущая запись №M-042 · ${booking.dayLabel}, ${formatTime(booking.start)}`) +
          buttonMarkup('keep', 'Оставить текущую запись', 'secondary'),
      );
      day.focus();
    } else if (button.id === 'keep') {
      day.value = booking.day;
      service.value = booking.service;
      controls.hidden = true;
      showBooking('Запись подтверждена');
      find('#reschedule').focus();
    } else if (button.id === 'cancel') {
      const oldTime = formatTime(booking.start);
      const oldDay = booking.dayLabel;
      booking = null;
      controls.hidden = false;
      confirm.textContent = 'Подтвердить запись';
      renderSlots();
      showResult(statusMessage('Запись отменена', `${oldDay}, ${oldTime} снова доступно для записи.`));
      day.focus();
    }
  });

  renderSlots();
})();
