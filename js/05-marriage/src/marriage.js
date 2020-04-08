'use strict';

/**
 * @typedef {Object} Friend
 * @property {string} name Имя
 * @property {'male' | 'female'} gender Пол
 * @property {boolean} best Лучший ли друг?
 * @property {string[]} friends Список имён друзей
 */

const getSorted = arr => [...arr].sort();

function getNotUsed(items, used) {
  return items.filter(item => !used.has(item));
}

function getUnique(items) {
  return items.filter((item, index) => items.indexOf(item) === index);
}

function getNextWave(friendsObject, wave, used) {
  const newWave = [];
  for (const name of wave) {
    newWave.push(...getNotUsed(friendsObject[name].friends, used));
  }

  return getSorted(getUnique(newWave));
}

function getBestFriendNames(friends) {
  return friends.filter(friend => friend.best).map(friend => friend.name);
}

function convertToFriendsObject(friends) {
  const friendsObject = {};
  for (const friend of friends) {
    friendsObject[friend.name] = friend;
  }

  return friendsObject;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 */
function Iterator(friends, filter) {
  if (!(filter instanceof Filter)) {
    throw new TypeError('filter is not instance of Filter');
  }
  this.wave = [];
  this.firstWave = getSorted(getBestFriendNames(friends));
  this.friendsObject = convertToFriendsObject(friends);
  this.used = new Set();
  this.index = 0;
  this.finished = false;
  this.maxLevel = Infinity;
  this.level = 0;
  this.filter = filter;
}

Iterator.prototype = {
  constructor: {
    value: Iterator
  },

  updateWaveIfNecessary: function() {
    if (this.wave.length === this.index) {
      this.level++;
      if (this.level > this.maxLevel) {
        return;
      }
      if (this.firstWave !== null) {
        this.wave = this.firstWave;
        this.firstWave = null;
      } else {
        this.wave = getNextWave(this.friendsObject, this.wave, this.used);
        this.index = 0;
      }
    }
  },

  isAtEnd: function() {
    return this.wave.length === this.index;
  },

  getCurrent: function() {
    return this.friendsObject[this.wave[this.index]];
  },

  moveToNext: function() {
    this.used.add(this.getCurrent().name);
    this.index++;
  },

  skipToNextValid: function() {
    this.updateWaveIfNecessary();
    while (!this.isAtEnd() && !this.filter.isValid(this.getCurrent())) {
      this.moveToNext();
      this.updateWaveIfNecessary();
    }
  },

  next: function() {
    if (this.finished) {
      return null;
    }
    this.skipToNextValid();
    const nextFriend = this.isAtEnd() ? null : this.getCurrent();
    if (!this.isAtEnd()) {
      this.moveToNext();
    }

    return nextFriend;
  },

  done: function() {
    const isDone = this.next() === null;
    if (isDone) {
      this.finished = true;
    } else {
      this.index--;
    }

    return isDone;
  }
};

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 * @param {Number} maxLevel Максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  Iterator.call(this, friends, filter);
  this.maxLevel = maxLevel;
}

LimitedIterator.prototype = Object.create(Iterator.prototype, {
  constructor: {
    value: LimitedIterator
  }
});

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  this.isValid = () => true;
}

Filter.prototype = {
  constructor: {
    value: Filter
  }
};

function filterGender(gender) {
  return friend => friend.gender === gender;
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  this.isValid = filterGender('male');
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  this.isValid = filterGender('female');
}

for (const genderFilter of [MaleFilter, FemaleFilter]) {
  genderFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
      value: genderFilter
    }
  });
}

module.exports = {
  Iterator,
  LimitedIterator,
  Filter,
  MaleFilter,
  FemaleFilter
};
