import { hash } from './hash.js';

test('hash', () => {
  expect(hash('') >>> 0).toBe(5381);
  expect(hash('🦄🌈') >>> 0).toBe(1_484_783_307);
  expect(hash('h') >>> 0).toBe(177_613);
  expect(hash('he') >>> 0).toBe(5_861_128);
  expect(hash('hel') >>> 0).toBe(193_417_316);
  expect(hash('hell') >>> 0).toBe(2_087_804_040);
  expect(hash('hello') >>> 0).toBe(178_056_679);
  expect(hash('hello ') >>> 0).toBe(1_580_903_143);
  expect(hash('hello w') >>> 0).toBe(630_196_144);
  expect(hash('hello wo') >>> 0).toBe(3_616_603_615);
  expect(hash('hello wor') >>> 0).toBe(3_383_802_317);
  expect(hash('hello worl') >>> 0).toBe(4_291_293_953);
  expect(hash('hello world') >>> 0).toBe(4_173_747_013);
  expect(
    hash(
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.',
    ) >>> 0,
  ).toBe(1_122_617_945);
});
