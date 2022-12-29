export function randomDecimal (min: number, max: number): number {
  const randDec = Math.random() * (max - min) + min;
  return Math.round((randDec * 10)) / 10;
};