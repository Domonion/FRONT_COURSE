'use strict';

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;
const timeRE = new RegExp('^(.{2})\\s(\\d{2}):(\\d{2})\\+(\\d)$');
const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const minutesInDay = 1440;
const minutesInHour = 60;
const open = 0;
const close = 1;

let timeBeforeStart;
let timeAfterEnd;

function getMinutesFromWeekStart(timeString) {
  const [, dayString, hourString, minuteString, timeZone] = timeRE.exec(timeString);
  const days = dayNames.indexOf(dayString);
  const hours = parseInt(hourString) - parseInt(timeZone);
  const minutes = parseInt(minuteString);

  return days * minutesInDay + hours * minutesInHour + minutes;
}

function getPopulatedEvents(schedule, events, reverse = false) {
  events = events.slice();

  for (const { from, to } of schedule) {
    events.push({ time: getMinutesFromWeekStart(from), type: reverse ? close : open });
    events.push({ time: getMinutesFromWeekStart(to), type: reverse ? open : close });
  }

  return events;
}

function getEvents(schedule) {
  return getPopulatedEvents(schedule, []);
}

function getEventsFromRobberSchedule(robberSchedule) {
  const events = getPopulatedEvents(robberSchedule, [{ time: timeBeforeStart, type: open }], true);
  events.push({ time: timeAfterEnd, type: close });

  return events;
}

function getEventsFromBankWorkingHours({ from, to }) {
  const bankWorkingHoursByDays = dayNames.slice(0, 3).map(day => ({
    from: `${day} ${from}`,
    to: `${day} ${to}`
  }));

  return getEvents(bankWorkingHoursByDays);
}

function getSortedEvents(events) {
  events = events.slice();

  events.sort((first, second) => {
    const result = first.time - second.time;
    if (result !== 0) {
      return result;
    }

    return first.type - second.type;
  });

  return events;
}

function getCommonMomentRanges(events, enoughOpenedForRobbery) {
  events = getSortedEvents(events);
  let openedCount = 0;
  const notStarted = timeBeforeStart - 1;
  let rangeStarted = notStarted;
  const ranges = [];

  for (const event of events) {
    openedCount += event.type === open ? 1 : -1;

    if (openedCount >= enoughOpenedForRobbery && rangeStarted === notStarted) {
      rangeStarted = event.time;
    }

    if (openedCount < enoughOpenedForRobbery && rangeStarted !== notStarted) {
      ranges.push({ from: rangeStarted, to: event.time });
      rangeStarted = notStarted;
    }
  }

  return ranges;
}

function getDay(timeInMinutes) {
  const dayNumber = Math.floor(timeInMinutes / minutesInDay);

  return dayNames[dayNumber];
}

function formatNumber(number) {
  return number < 10 ? '0' + number : number;
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  const bankTimeZone = parseInt(workingHours.from[workingHours.from.length - 1]);
  timeBeforeStart = getMinutesFromWeekStart('ПН 00:00+' + bankTimeZone);
  timeAfterEnd = getMinutesFromWeekStart('ВС 23:59+' + bankTimeZone);
  let bankEvents = getEventsFromBankWorkingHours(workingHours);

  for (const key of Object.keys(schedule)) {
    bankEvents = bankEvents.concat(getEventsFromRobberSchedule(schedule[key]));
  }

  const commonMomentRanges = getCommonMomentRanges(bankEvents, Object.keys(schedule).length + 1);
  let robberyRanges = [];

  for (const range of commonMomentRanges) {
    if (range.to - range.from >= duration) {
      robberyRanges.push({ from: range.from, to: range.to - duration });
    }
  }

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists: function() {
      return robberyRanges.length > 0;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format: function(template) {
      if (robberyRanges.length === 0) {
        return '';
      }

      const timeInBankTimezone = robberyRanges[0].from + bankTimeZone * minutesInHour;
      const day = getDay(timeInBankTimezone);
      const hour = formatNumber(Math.floor(timeInBankTimezone / 60) % 24);
      const minute = formatNumber(timeInBankTimezone % 60);
      template = template.replace('%DD', day);
      template = template.replace('%HH', hour);
      template = template.replace('%MM', minute);

      return template;
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater: function() {
      if (robberyRanges.length === 0) {
        return false;
      }

      const minimalTime = robberyRanges[0].from + 30;

      for (let i = 0; i < robberyRanges.length; ++i) {
        if (robberyRanges[i].to >= minimalTime) {
          robberyRanges = robberyRanges.slice(i);
          robberyRanges[0].from = Math.max(robberyRanges[0].from, minimalTime);

          return true;
        }
      }

      return false;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
