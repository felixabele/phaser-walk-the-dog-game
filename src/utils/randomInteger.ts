export function randomInteger(min: number, max: number): number {
  const randDec = Math.random() * (max - min) + min;
  return Math.round(randDec);
};