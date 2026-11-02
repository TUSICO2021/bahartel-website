// Compact byte-mode QR encoder for a short, fixed website URL (Version 2-L).
const multiply = (x, y) => {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ (((z >>> 7) & 1) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
};

function errorCorrection(data, degree) {
  const divisor = new Uint8Array(degree);
  divisor[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      divisor[j] = multiply(divisor[j], root);
      if (j + 1 < degree) divisor[j] ^= divisor[j + 1];
    }
    root = multiply(root, 2);
  }
  const remainder = new Uint8Array(degree);
  for (const byte of data) {
    const factor = byte ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[degree - 1] = 0;
    for (let i = 0; i < degree; i++) remainder[i] ^= multiply(divisor[i], factor);
  }
  return remainder;
}

export function makeWebsiteQr(text) {
  const bytes = new TextEncoder().encode(text);
  if (bytes.length > 32) throw new Error('Website QR encoder supports URLs up to 32 bytes.');

  const bits = [];
  const appendBits = (value, length) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  appendBits(0b0100, 4);
  appendBits(bytes.length, 8);
  for (const byte of bytes) appendBits(byte, 8);
  for (let i = 0, count = Math.min(4, 272 - bits.length); i < count; i++) bits.push(0);
  while (bits.length % 8) bits.push(0);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((value, bit) => (value << 1) | bit, 0));
  }
  for (let pad = 0; data.length < 34; pad++) data.push(pad % 2 === 0 ? 0xec : 0x11);
  const codewords = [...data, ...errorCorrection(data, 10)];
  const stream = codewords.flatMap((byte) => Array.from({ length: 8 }, (_, i) => (byte >>> (7 - i)) & 1));

  const size = 25;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const setFunction = (x, y, dark) => {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      matrix[y][x] = dark;
      reserved[y][x] = true;
    }
  };

  const finder = (cx, cy) => {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const distance = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
        setFunction(cx + dx, cy + dy, distance !== 2 && distance <= 3);
      }
    }
  };
  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);

  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      setFunction(18 + dx, 18 + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
  for (let i = 8; i < size - 8; i++) {
    setFunction(i, 6, i % 2 === 0);
    setFunction(6, i, i % 2 === 0);
  }

  const formatBits = (mask) => {
    const dataBits = (0b01 << 3) | mask;
    let remainder = dataBits << 10;
    for (let i = 14; i >= 10; i--) {
      if ((remainder >>> i) & 1) remainder ^= 0x537 << (i - 10);
    }
    const bits15 = ((dataBits << 10) | remainder) ^ 0x5412;
    const getBit = (i) => ((bits15 >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) setFunction(8, i, getBit(i));
    setFunction(8, 7, getBit(6));
    setFunction(8, 8, getBit(7));
    setFunction(7, 8, getBit(8));
    for (let i = 9; i < 15; i++) setFunction(14 - i, 8, getBit(i));
    for (let i = 0; i < 8; i++) setFunction(size - 1 - i, 8, getBit(i));
    for (let i = 8; i < 15; i++) setFunction(8, size - 15 + i, getBit(i));
    setFunction(8, size - 8, true);
  };
  formatBits(0);

  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right--;
    for (let vert = 0; vert < size; vert++) {
      const upward = ((right + 1) & 2) === 0;
      const y = upward ? size - 1 - vert : vert;
      for (let offset = 0; offset < 2; offset++) {
        const x = right - offset;
        if (!reserved[y][x]) {
          const bit = bitIndex < stream.length ? stream[bitIndex++] : 0;
          matrix[y][x] = Boolean(bit ^ ((x + y) % 2 === 0 ? 1 : 0));
        }
      }
    }
  }
  formatBits(0);
  return matrix;
}
