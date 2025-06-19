import { serialize, deserialize } from '../src/index';


function testSerialization(original: number[]) {
  const serialized = serialize(original);
  return {
    serialized,
    deserialized: deserialize(serialized),
    compressionRatio: (JSON.stringify(original).length / serialized.length).toFixed(2)
  };
}

function isEqualArrays(array1: number[], array2: number[]) {
  return JSON.stringify(array1.sort((a, b) => a - b)) === JSON.stringify(array2.sort((a, b) => a - b));
}

const tests = {
  'empty': [],
  'single number': [42],
  'simple short': [1, 2, 3, 4, 5],
  'repeated numbers': [10, 10, 10, 20, 20, 30],
  'all 1-digit': Array(100).fill(0).map(() => Math.floor(Math.random() * 9) + 1),
  'all 2-digit': Array(100).fill(0).map(() => Math.floor(Math.random() * 90) + 10),
  'all 3-digit': Array(10).fill(0).map(() => Math.floor(Math.random() * 200) + 100),
  'mixed sizes': Array(100).fill(0).map(() => Math.floor(Math.random() * 299) + 1),
  'large set 500': Array(500).fill(0).map(() => Math.floor(Math.random() * 299) + 1),
  'large set 1000': Array(1000).fill(0).map(() => Math.floor(Math.random() * 299) + 1),
  'each number 3 times': Array.from({ length: 100 }, (_, i) => [i + 1, i + 1, i + 1]).flat(),
};

for (const [name, data] of Object.entries(tests)) {
  const { deserialized, compressionRatio, serialized } = testSerialization(data);
  test(`${name} (Compression Ratio: ${compressionRatio}), ${serialized}`, () => {
    expect(isEqualArrays(data, deserialized)).toBe(true);
  });
}
