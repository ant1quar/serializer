import { sum } from '../src/index';

test('sum adds numbers', () => {
  expect(sum(1, 2)).toBe(3);
});
