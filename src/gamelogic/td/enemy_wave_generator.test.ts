import { generateWave } from './enemy_wave_generator';

describe('waves', () => {
  test('generate first enemy wave - difficulty 10', () => {
    const wave = generateWave(10)
    expect(wave?.enemy_type).toEqual('green_knight');
    expect(wave?.wave_difficulty).toBeLessThanOrEqual(10);
    expect(wave?.wave_type).toEqual('normal')
  });
  
  test('generate first enemy wave - difficulty 20', () => {
    const wave = generateWave(20)
    // expect(wave?.enemy_type).toEqual('green_knight');
    expect(wave?.wave_difficulty).toBeGreaterThan(10);
    expect(wave?.wave_difficulty).toBeLessThanOrEqual(20);
    expect(wave?.wave_type).toEqual('normal')
  });
  
  test('generate first enemy wave - difficulty 30', () => {
    const wave = generateWave(30)
    // expect(wave?.enemy_type).toEqual('green_knight');
    expect(wave?.wave_difficulty).toBeGreaterThan(20);
    expect(wave?.wave_difficulty).toBeLessThanOrEqual(30);
    expect(wave?.wave_type).toEqual('normal')
  });
  
  test('generate first enemy wave - difficulty 40', () => {
    const wave = generateWave(40)
    // expect(wave?.enemy_type).toEqual('green_knight');
    expect(wave?.wave_difficulty).toBeGreaterThan(30);
    expect(wave?.wave_difficulty).toBeLessThanOrEqual(40);
    expect(['normal', 'magic']).toContain(wave?.wave_type)
  });
  
  test('generate first enemy wave - difficulty 50', () => {
    const wave = generateWave(50)
    // expect(wave?.enemy_type).toEqual('green_knight');
    expect(wave?.wave_difficulty).toBeGreaterThan(40);
    expect(wave?.wave_difficulty).toBeLessThanOrEqual(50);
    expect(['normal', 'magic']).toContain(wave?.wave_type)
  });
  
  test('generate first enemy wave - difficulty 60', () => {
    const wave = generateWave(60)
    // expect(wave?.enemy_type).toEqual('green_knight');
    expect(wave?.wave_difficulty).toBeGreaterThan(50);
    expect(wave?.wave_difficulty).toBeLessThanOrEqual(60);
    expect(['normal', 'magic']).toContain(wave?.wave_type)
  });

  test('generate first enemy wave - difficulty 70', () => {
    const wave = generateWave(70)
    // expect(wave?.enemy_type).toEqual('green_knight');
    expect(wave?.wave_difficulty).toBeGreaterThan(60);
    expect(wave?.wave_difficulty).toBeLessThanOrEqual(70);
    expect(['normal', 'magic', 'rare']).toContain(wave?.wave_type)
  });
})