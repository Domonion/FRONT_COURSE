'use strict';

global.fetch = require('node-fetch');

/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

class TripBuilder {
  constructor(geoids) {
    this.maxDays = Infinity;
    this.weather = [];
    this.geoids = geoids;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    for (let i = 0; i < daysCount; i++) {
      this.weather.push(['clear', 'partly-cloudy']);
    }

    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    for (let i = 0; i < daysCount; i++) {
      this.weather.push(['cloudy', 'overcast']);
    }

    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.maxDays = daysCount;

    return this;
  }

  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  build() {
    const getWeatherUrl = id => {
      return `https://api.weather.yandex.ru/v1/forecast?hours=false&geoid=${id}&limit=7`;
    };

    return new Promise((resolve, reject) => {
      Promise.all(
        this.geoids.map(geoid => {
          return global.fetch(getWeatherUrl(geoid));
        })
      )
        .then(responses => Promise.all(responses.map(entry => entry.json())))
        .then(jsons => {
          const forecast = jsons.map(json => ({
            id: json['info']['geoid'],
            conditions: json['forecasts'].map(day => day['parts']['day_short']['condition'])
          }));

          const findPath = order => {
            if (order.length === this.weather.length) {
              return { ok: true, order: order };
            }

            const tryAdd = id => {
              const alreadyDays = order.filter(town => town.geoid === id).length;
              const isLastOk =
                order.length === 0 ||
                (order[order.length - 1] === id ? alreadyDays < this.maxDays : true);
              const currentForecast = forecast.find(town => town.id === id).conditions[
                order.length
              ];
              if (isLastOk && this.weather[order.length].includes(currentForecast)) {
                return findPath(order.concat([{ geoid: id, day: order.length + 1 }]));
              }

              return { ok: false };
            };

            /*
             .filter(id => {
              return (
                order.every(town => town.geoid !== id) ||
                (order.length > 0 && order[order.length - 1].geoid === id)
              );
            }*/
            for (const anotherId of this.geoids) {
              if (order.length > 0 && order[order.length - 1] === anotherId) {
                const newOrder = tryAdd(anotherId);
                if (newOrder.ok) {
                  return newOrder;
                }
              }
              if (!order.some(town => town.geoid === anotherId)) {
                const newOrder = tryAdd(anotherId);
                if (newOrder.ok) {
                  return newOrder;
                }
              }
            }

            return { ok: false };
          };

          const answer = findPath([]);
          if (answer.ok) {
            resolve(answer.order);
          } else {
            throw new Error('Не могу построить маршрут!');
          }
        })
        .catch(err => reject(err));
    });
  }
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
