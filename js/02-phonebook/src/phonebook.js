'use strict';

/**
 * Если вы решили сделать дополнительное задание и реализовали функцию importFromDsv,
 * то выставьте значение переменной isExtraTaskSolved в true.
 */

const isExtraTaskSolved = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

const checkStringNonEmpty = str => typeof str === 'string' && str !== '';

const checkContact = ({ name, phone, email }) =>
  checkStringNonEmpty(phone) &&
  /^\d{10}$/.test(phone) &&
  checkStringNonEmpty(name) &&
  (typeof email === 'string' || typeof email === 'undefined');

const checkEmailPatter = (email, pattern) => email && email.includes(pattern);

const checkEntity = ({ name, phone, email }, pattern) =>
  name.includes(pattern) || checkEmailPatter(email, pattern) || phone.includes(pattern);

const appendEmail = email => (email ? ', ' + email : '');

const entityToString = ({ name, phone, email }) =>
  `${name}, ${phoneToString(phone)}${appendEmail(email)}`;

/**
 * Добавление записи в телефонную книгу
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function add(phone, name, email) {
  if (!checkContact({ phone, name, email })) {
    return false;
  }

  if (phone in phoneBook) {
    return false;
  }

  phoneBook[phone] = { name, email, phone };

  return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function update(phone, name, email) {
  if (!checkContact({ phone, name, email })) {
    return false;
  }

  if (!(phone in phoneBook)) {
    return false;
  }

  phoneBook[phone] = { name, email, phone };

  return true;
}

function findContacts(query) {
  if (query === '') {
    return [];
  }

  const res = [];

  const entities = Object.values(phoneBook);
  const isAllContacts = query === '*';

  if (isAllContacts) {
    res.push(...entities);
  } else {
    for (const entity of entities) {
      if (checkEntity(entity, query)) {
        res.push(entity);
      }
    }
  }

  return res.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * @return {string}
 */
function phoneToString(phone) {
  const parenthesisDigits = phone.slice(0, 3);
  const firstDigits = phone.slice(3, 6);
  const secondDigits = phone.slice(6, 8);
  const lastDigits = phone.slice(8, 10);
  const digitsArray = [firstDigits, secondDigits, lastDigits];

  return '+7 (' + parenthesisDigits + ') ' + digitsArray.join('-');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {string} query
 * @returns {string[]}
 */
function find(query) {
  if (typeof query !== 'string') {
    throw new TypeError('query should be string');
  }

  return findContacts(query).map(entityToString);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {string} query
 * @returns {number}
 */
function findAndRemove(query) {
  if (typeof query !== 'string') {
    throw new TypeError('query should be string');
  }
  const res = findContacts(query);
  for (const entity of res) {
    delete phoneBook[entity.phone];
  }

  return res.length;
}

/**
 * Импорт записей из dsv-формата
 * @param {string} dsv
 * @returns {number} Количество добавленных и обновленных записей
 */
function importFromDsv(dsv) {
  if (typeof dsv !== 'string') {
    throw new TypeError('dsv should be string');
  }
  let res = 0;
  for (const line of dsv.split('\n')) {
    const [name, phone, email] = line.split(';');
    if (add(phone, name, email) || update(phone, name, email)) {
      res++;
    }
  }

  return res;
}

module.exports = {
  add,
  update,
  find,
  findAndRemove,
  importFromDsv,

  isExtraTaskSolved
};
