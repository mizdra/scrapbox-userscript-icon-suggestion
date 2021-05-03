/* eslint-env node */

require('@testing-library/jest-dom');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const faker = require('faker');
faker.locale = 'ja';
const seed = process.env.FAKER_SEED ?? getRandomInt(0, 0xffffff);
faker.seed(seed);
console.log(`faker's seed is \`${seed}\``);
