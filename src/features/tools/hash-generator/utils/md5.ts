// RFC 1321 MD5 Implementation
export function md5Hash(text: string): string {
  const md5Cycle = (x: number, k: number, s: number, i: number): number => {
    return (x + k + i) << s | (x + k + i) >>> (32 - s);
  };

  const md5F = (x: number, y: number, z: number): number => {
    return x & y | ~x & z;
  };

  const md5G = (x: number, y: number, z: number): number => {
    return x & z | y & ~z;
  };

  const md5H = (x: number, y: number, z: number): number => {
    return x ^ y ^ z;
  };

  const md5I = (x: number, y: number, z: number): number => {
    return y ^ (x | ~z);
  };

  const md5RotateLeft = (lValue: number, iShiftBits: number): number => {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  const md5AddUnsigned = (lX: number, lY: number): number => {
    const lX4 = (lX & 0x40000000);
    const lY4 = (lY & 0x40000000);
    const lX8 = (lX & 0x80000000);
    const lY8 = (lY & 0x80000000);
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);

    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }

    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xc0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  const md5FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5F(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
  };

  const md5GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5G(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
  };

  const md5HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5H(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
  };

  const md5II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5I(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
  };

  let wordArray: number[] = [];
  let nBytes: number = 0;

  for (let n = 0; n < text.length; n++) {
    wordArray[nBytes >> 2] |= text.charCodeAt(n) << ((nBytes % 4) * 8);
    nBytes++;
  }

  wordArray[nBytes >> 2] |= 0x80 << ((nBytes % 4) * 8);

  const lWordCount = Math.ceil((nBytes + 8) / 64);
  const lMessageLength = (lWordCount << 4) - 1;

  for (let i = 0; i < lMessageLength; i++) {
    wordArray.push(0);
  }

  wordArray[lMessageLength] = nBytes << 3;

  let AA: number = 0x67452301;
  let BB: number = 0xefcdab89;
  let CC: number = 0x98badcfe;
  let DD: number = 0x10325476;

  let S11: number = 7;
  let S12: number = 12;
  let S13: number = 17;
  let S14: number = 22;
  let S21: number = 5;
  let S22: number = 9;
  let S23: number = 14;
  let S24: number = 20;
  let S31: number = 4;
  let S32: number = 11;
  let S33: number = 16;
  let S34: number = 23;
  let S41: number = 6;
  let S42: number = 10;
  let S43: number = 15;
  let S44: number = 21;

  for (let k = 0; k < wordArray.length; k += 16) {
    let a = AA;
    let b = BB;
    let c = CC;
    let d = DD;

    a = md5FF(a, b, c, d, wordArray[k], S11, 0xd76aa478);
    d = md5FF(d, a, b, c, wordArray[k + 1], S12, 0xe8c7b756);
    c = md5FF(c, d, a, b, wordArray[k + 2], S13, 0x242070db);
    b = md5FF(b, c, d, a, wordArray[k + 3], S14, 0xc1bdceee);
    a = md5FF(a, b, c, d, wordArray[k + 4], S11, 0xf57c0faf);
    d = md5FF(d, a, b, c, wordArray[k + 5], S12, 0x4787c62a);
    c = md5FF(c, d, a, b, wordArray[k + 6], S13, 0xa8304613);
    b = md5FF(b, c, d, a, wordArray[k + 7], S14, 0xfd469501);
    a = md5FF(a, b, c, d, wordArray[k + 8], S11, 0x698098d8);
    d = md5FF(d, a, b, c, wordArray[k + 9], S12, 0x8b44f7af);
    c = md5FF(c, d, a, b, wordArray[k + 10], S13, 0xffff5bb1);
    b = md5FF(b, c, d, a, wordArray[k + 11], S14, 0x895cd7be);
    a = md5FF(a, b, c, d, wordArray[k + 12], S11, 0x6b901122);
    d = md5FF(d, a, b, c, wordArray[k + 13], S12, 0xfd987193);
    c = md5FF(c, d, a, b, wordArray[k + 14], S13, 0xa679438e);
    b = md5FF(b, c, d, a, wordArray[k + 15], S14, 0x49b40821);
    a = md5GG(a, b, c, d, wordArray[k + 1], S21, 0xf61e2562);
    d = md5GG(d, a, b, c, wordArray[k + 6], S22, 0xc040b340);
    c = md5GG(c, d, a, b, wordArray[k + 11], S23, 0x265e5a51);
    b = md5GG(b, c, d, a, wordArray[k], S24, 0xe9b6c7aa);
    a = md5GG(a, b, c, d, wordArray[k + 5], S21, 0xd62f105d);
    d = md5GG(d, a, b, c, wordArray[k + 10], S22, 0x02441453);
    c = md5GG(c, d, a, b, wordArray[k + 15], S23, 0xd8a1e681);
    b = md5GG(b, c, d, a, wordArray[k + 4], S24, 0xe7d3fbc8);
    a = md5GG(a, b, c, d, wordArray[k + 9], S21, 0x21e1cde6);
    d = md5GG(d, a, b, c, wordArray[k + 14], S22, 0xc33707d6);
    c = md5GG(c, d, a, b, wordArray[k + 3], S23, 0xf4d50d87);
    b = md5GG(b, c, d, a, wordArray[k + 8], S24, 0x455a14ed);
    a = md5GG(a, b, c, d, wordArray[k + 13], S21, 0xa9e3e905);
    d = md5GG(d, a, b, c, wordArray[k + 2], S22, 0xfcefa3f8);
    c = md5GG(c, d, a, b, wordArray[k + 7], S23, 0x676f02d9);
    b = md5GG(b, c, d, a, wordArray[k + 12], S24, 0x8d2a4c8a);
    a = md5HH(a, b, c, d, wordArray[k + 5], S31, 0xfffa3942);
    d = md5HH(d, a, b, c, wordArray[k + 8], S32, 0x8771f681);
    c = md5HH(c, d, a, b, wordArray[k + 11], S33, 0x6d9d6122);
    b = md5HH(b, c, d, a, wordArray[k + 14], S34, 0xfde5380c);
    a = md5HH(a, b, c, d, wordArray[k + 1], S31, 0xa4beea44);
    d = md5HH(d, a, b, c, wordArray[k + 4], S32, 0x4bdecfa9);
    c = md5HH(c, d, a, b, wordArray[k + 7], S33, 0xf6bb4b60);
    b = md5HH(b, c, d, a, wordArray[k + 10], S34, 0xbebfbc70);
    a = md5HH(a, b, c, d, wordArray[k + 13], S31, 0x289b7ec6);
    d = md5HH(d, a, b, c, wordArray[k], S32, 0xeaa127fa);
    c = md5HH(c, d, a, b, wordArray[k + 3], S33, 0xd4ef3085);
    b = md5HH(b, c, d, a, wordArray[k + 6], S34, 0x04881d05);
    a = md5HH(a, b, c, d, wordArray[k + 9], S31, 0xd9d4d039);
    d = md5HH(d, a, b, c, wordArray[k + 12], S32, 0xe6db99e5);
    c = md5HH(c, d, a, b, wordArray[k + 15], S33, 0x1fa27cf8);
    b = md5HH(b, c, d, a, wordArray[k + 2], S34, 0xc4ac5665);
    a = md5II(a, b, c, d, wordArray[k], S41, 0xf4292244);
    d = md5II(d, a, b, c, wordArray[k + 7], S42, 0x432aff97);
    c = md5II(c, d, a, b, wordArray[k + 14], S43, 0xab9423a7);
    b = md5II(b, c, d, a, wordArray[k + 5], S44, 0xfc93a039);
    a = md5II(a, b, c, d, wordArray[k + 12], S41, 0x655b59c3);
    d = md5II(d, a, b, c, wordArray[k + 3], S42, 0x8f0ccc92);
    c = md5II(c, d, a, b, wordArray[k + 10], S43, 0xffeff47d);
    b = md5II(b, c, d, a, wordArray[k + 1], S44, 0x85845dd1);
    a = md5II(a, b, c, d, wordArray[k + 8], S41, 0x6fa87e4f);
    d = md5II(d, a, b, c, wordArray[k + 15], S42, 0xfe2ce6e0);
    c = md5II(c, d, a, b, wordArray[k + 6], S43, 0xa3014314);
    b = md5II(b, c, d, a, wordArray[k + 13], S44, 0x4e0811a1);
    a = md5II(a, b, c, d, wordArray[k + 4], S41, 0xf7537e82);
    d = md5II(d, a, b, c, wordArray[k + 11], S42, 0xbd3af235);
    c = md5II(c, d, a, b, wordArray[k + 2], S43, 0x2ad7d2bb);
    b = md5II(b, c, d, a, wordArray[k + 9], S44, 0xeb86d391);

    AA = md5AddUnsigned(a, AA);
    BB = md5AddUnsigned(b, BB);
    CC = md5AddUnsigned(c, CC);
    DD = md5AddUnsigned(d, DD);
  }

  const convertToWordArray = (bytes: number): number[] => {
    const word = [];
    for (let i = 0; i < 8; i++) {
      word[i] = (bytes >>> (i * 8)) & 0xff;
    }
    return word;
  };

  const AAByte = convertToWordArray(AA);
  const BBByte = convertToWordArray(BB);
  const CCByte = convertToWordArray(CC);
  const DDByte = convertToWordArray(DD);

  const wordToHex = (value: number): string => {
    const hex = [];
    for (let i = 0; i < 4; i++) {
      const byte = (value >>> (8 * i)) & 0xff;
      hex.push(byte.toString(16).padStart(2, '0'));
    }
    return hex.join('');
  };

  return wordToHex(AA) + wordToHex(BB) + wordToHex(CC) + wordToHex(DD);
}