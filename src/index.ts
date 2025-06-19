export function serialize(numbers: number[]): string {
  if (numbers.length === 0) return '';

  numbers = [...numbers].sort((a, b) => a - b);

  const deltas: number[] = [numbers[0]];
  for (let i = 1; i < numbers.length; i++) {
    deltas.push(numbers[i] - numbers[i - 1]);
  }

  return deltas.reduce((str, delta) => str + encodeDelta(delta), '');
}

export function deserialize(serialized: string): number[] {
  if (serialized === '') return [];

  const deltas = decodeDeltas(serialized);

  const numbers: number[] = [deltas[0]];
  for (let i = 1; i < deltas.length; i++) {
    numbers.push(numbers[i - 1] + deltas[i]);
  }

  return numbers;
}

const BASE = 128;
const DELTA_MAX = 127; 

function encodeDelta(delta: number): string {
  if (delta <= DELTA_MAX) {
    return String.fromCharCode(delta);
  } else {
    let result = '';
    while (delta > 0) {
      const chunk = delta % BASE;
      result = String.fromCharCode(chunk) + result;
      delta = Math.floor(delta / BASE);
    }
    return result;
  }
}

function decodeDeltas(serialized: string): number[] {
  const deltas: number[] = [];
  let i = 0;

  while (i < serialized.length) {
    let delta = 0;
    let charCode = serialized.charCodeAt(i);

    if (charCode <= DELTA_MAX) {
      delta = charCode;
      i++;
    } else {
      while (i < serialized.length) {
        charCode = serialized.charCodeAt(i);
        delta = delta * BASE + charCode;
        i++;
        if (charCode <= DELTA_MAX) break;
      }
    }

    deltas.push(delta);
  }

  return deltas;
}
