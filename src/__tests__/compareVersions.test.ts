import { compareVersions } from '../utilities/compareVersions';

const scenarios: [string, string, number][] = [
  ['1.2.3', '1.2.3', 0],
  ['1.2.3-tag', '1.2.3', 1],
  ['1.2.3', '1.2.3-tag', -1],
  ['1.2.3-tag', '1.2.3-tag', 0],
  ['1.2.0', '1.2', 0],
  ['1.2', '1.2.0', 0],
  ['1.2.3', '1.2.4', -1],
  ['1.2.4', '1.2.3', 1],
  ['1.3.3', '1.4.3', -1],
  ['1.4.3', '1.3.3', 1],
  ['1.2.3', '2.2.3', -1],
  ['2.2.3', '1.2.3', 1],
  ['', '0', 0],
  ['0', '', 0],
];

describe('compare versions', () => {
  scenarios.forEach(([a, b, expected]) => {
    test(`a=${a}, b=${b}, expected=${expected}`, () => {
      expect(compareVersions(a, b)).toBe(expected);
    });
  });
});
