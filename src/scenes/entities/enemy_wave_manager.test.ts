import { generateWave } from './enemy_wave_manager';

test('generate first enemy wave -  difficulty 10', () => {
  const wave = generateWave(10)
  console.log(wave)
  expect(wave).toStrictEqual([]);
});