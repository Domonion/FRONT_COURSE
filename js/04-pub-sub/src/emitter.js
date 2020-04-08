'use strict';

/**
 * Сделано дополнительное задание: реализованы методы several и through.
 */
const isExtraTaskSolved = true;

/**
 * Получение нового Emitter'а
 * @returns {Object}
 */
function getEmitter() {
  const mainNamespace = [];

  const createActionsFromName = actionName => {
    let action = mainNamespace.find(({ name }) => name === actionName);

    if (action) {
      return action;
    }

    action = { name: actionName, actions: [] };
    mainNamespace.push(action);

    return action;
  };

  const setFunction = (namespace, context, handler) => {
    const funcObject = { context, handler };

    createActionsFromName(namespace).actions.push(funcObject);
  };

  return {
    /**
     * Подписка на событие
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     */
    on: function(event, context, handler) {
      setFunction(event, context, handler);

      return this;
    },

    /**
     * Отписка от события
     * @param {string} event
     * @param {Object} context
     */
    off: function(event, context) {
      for (const emit of mainNamespace.filter(
        curObject => curObject.name.startsWith(event + '.') || curObject.name === event
      )) {
        emit.actions = emit.actions.filter(action => action.context !== context);
      }

      return this;
    },

    /**
     * Уведомление о событии
     * @param {string} event
     */
    emit: function(event) {
      const nameParts = event.split('.');

      nameParts
        .reduce((acc, val, ind) => {
          const curName = nameParts.slice(0, ind + 1).join('.');
          acc.push(createActionsFromName(curName));

          return acc;
        }, [])
        .sort((first, second) => second.name.length - first.name.length)
        .reduce((acc, val) => acc.concat(val.actions), [])
        .forEach(func => func.handler.call(func.context));

      return this;
    },

    /**
     * Подписка на событие с ограничением по количеству отправляемых уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} times Сколько раз отправить уведомление
     */
    several: function(event, context, handler, times) {
      let count = 0;
      const handlerWrapper =
        times > 0
          ? () => {
              if (count < times) {
                handler.call(context);
              }
              count++;
            }
          : handler;
      this.on(event, context, handlerWrapper);

      return this;
    },

    /**
     * Подписка на событие с ограничением по частоте отправки уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} frequency Как часто уведомлять
     */
    through: function(event, context, handler, frequency) {
      let count = 0;
      const handlerWrapper =
        frequency > 0
          ? () => {
              if (count === 0) {
                handler.call(context);
              }
              count = (count + 1) % frequency;
            }
          : handler;
      this.on(event, context, handlerWrapper);

      return this;
    }
  };
}

module.exports = {
  getEmitter,

  isExtraTaskSolved
};
