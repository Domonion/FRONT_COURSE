'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('types of variables a and b should be number');
  }

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError('types of variables a and b should be number');
  }

  return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
  if (typeof year !== 'number') {
    throw new TypeError('year should be number');
  }

  if (!Number.isInteger(year)) {
    throw new TypeError('year should be integer');
  }

  if (year <= 0) {
    throw new RangeError('year should be positive');
  }

  return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
  if (typeof hexColor !== 'string') {
    throw new TypeError('hexColor should be string');
  }

  const upperString = hexColor.toUpperCase();

  if (upperString.length !== 7) {
    throw new RangeError('hexColor should 7 symbols long');
  }

  if (upperString[0] !== '#') {
    throw new RangeError('hexColor should start from #');
  }

  if (!/^#(\d|[A-F]){6}$/i.test(upperString)) {
    throw new RangeError('hexColor should be in hex');
  }

  const numberFromFirstTwo = parseInt(upperString.substr(1, 2), 16);
  const numberFromSecondTwo = parseInt(upperString.substr(3, 2), 16);
  const numberFromThirdTwo = parseInt(upperString.substr(5, 2), 16);

  return `(${numberFromFirstTwo}, ${numberFromSecondTwo}, ${numberFromThirdTwo})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
  if (typeof n !== 'number') {
    throw new TypeError('n should be number');
  }

  if (!Number.isInteger(n)) {
    throw new RangeError('n should be integer');
  }

  if (n <= 0) {
    throw new RangeError('n should be positive');
  }

  const fibonacci = [0, 1];

  for (let pos = 2; pos <= n; pos++) {
    fibonacci.push(fibonacci[pos - 1] + fibonacci[pos - 2]);
  }

  return fibonacci[n];
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
  if (!Array.isArray(matrix)) {
    throw new TypeError('matrix should be array');
  }

  const columnsLength = matrix.length;

  if (columnsLength === 0 || !matrix.every(Array.isArray)) {
    throw new TypeError('matrix lines should be arrays');
  }

  let rawsLength = 0;

  if (columnsLength > 0) {
    rawsLength = matrix[0].length;
  }

  if (!matrix.every(line => line.length === rawsLength)) {
    throw new TypeError('every matrix line should has same length');
  }

  const res = new Array(rawsLength);

  for (let i = 0; i < rawsLength; i++) {
    res[i] = new Array(columnsLength);

    for (let j = 0; j < columnsLength; j++) {
      res[i][j] = matrix[j][i];
    }
  }

  return res;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
  if (typeof n !== 'number') {
    throw new TypeError('n should be number');
  }

  if (typeof targetNs !== 'number') {
    throw new TypeError('targetNs should be number');
  }

  if (!Number.isInteger(targetNs)) {
    throw new TypeError('targetNs should be integer');
  }

  if (targetNs < 2 || targetNs > 36) {
    throw new RangeError('targetNs should be between 2 and 36');
  }

  return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    throw new TypeError('phoneNumber should be string');
  }

  return /^8-800-\d{3}-\d{2}-\d{2}$/.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
  if (typeof text !== 'string') {
    throw new TypeError('text should be string');
  }

  return (text.match(/\(-:|:-\)/g) || []).length;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
  for (let i = 0; i < 3; i++) {
    if (field[i][0] === field[i][1] && field[i][1] === field[i][2]) {
      return field[i][0];
    }

    if (field[0][i] === field[1][i] && field[1][i] === field[2][i]) {
      return field[0][i];
    }
  }

  if (field[2][2] === field[1][1] && field[0][0] === field[1][1]) {
    return field[2][2];
  }

  if (field[0][2] === field[1][1] && field[2][0] === field[1][1]) {
    return field[0][2];
  }

  return 'draw';
}

module.exports = {
  abProblem,
  centuryByYearProblem,
  colorsProblem,
  fibonacciProblem,
  matrixProblem,
  numberSystemProblem,
  phoneProblem,
  smilesProblem,
  ticTacToeProblem
};
