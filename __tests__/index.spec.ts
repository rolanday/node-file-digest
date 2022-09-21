import { BinaryToTextEncoding } from 'crypto';
import { join } from 'path';
import {
  DigestAlgorithm,
  hashFile,
  hashFileSync,
  hashStringSync,
  IDigestOptions,
} from '../src/';
const getFqp = function (fileName: string) {
  return join(__dirname, 'assets', fileName);
};
describe('binary digest', () => {
  let actual: string;
  test('binary-1', async () => {
    const test = fileTests['1'];
    actual = await hashFile(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-2', async () => {
    const test = fileTests['2'];
    actual = await hashFile(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-3', async () => {
    const test = fileTests['3'];
    actual = await hashFile(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-4', async () => {
    const test = fileTests['4'];
    actual = await hashFile(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-5', async () => {
    const test = fileTests['5'];
    actual = await hashFile(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
});
describe('binary-sync digest', () => {
  let actual: string;
  test('binary-1', () => {
    const test = fileTests['1'];
    actual = hashFileSync(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-2', () => {
    const test = fileTests['2'];
    actual = hashFileSync(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-3', () => {
    const test = fileTests['3'];
    actual = hashFileSync(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-4', () => {
    const test = fileTests['4'];
    actual = hashFileSync(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
  test('binary-5', () => {
    const test = fileTests['5'];
    actual = hashFileSync(getFqp(test.path), test.algo, test.options);
    expect(actual).toStrictEqual(test.expected);
  });
});
describe('string digest', () => {
  let actual: string;
  test('string-1', () => {
    const test = stringTests['1'];
    actual = hashStringSync(test.text, test.algo, { encoding: test.encoding });
    expect(actual).toStrictEqual(test.expected);
  });
  test('string-2', () => {
    const test = stringTests['2'];
    actual = hashStringSync(test.text, test.algo, { encoding: test.encoding });
    expect(actual).toStrictEqual(test.expected);
  });
  test('string-3', () => {
    const test = stringTests['3'];
    actual = hashStringSync(test.text, test.algo, { encoding: test.encoding });
    expect(actual).toStrictEqual(test.expected);
  });
  test('string-4', () => {
    const test = stringTests['4'];
    actual = hashStringSync(test.text, test.algo, { encoding: test.encoding });
    expect(actual).toStrictEqual(test.expected);
  });  
  test('string-5', () => {
    const test = stringTests['5'];
    actual = hashStringSync(test.text, test.algo, { encoding: test.encoding });
    expect(actual).toStrictEqual(test.expected);
  });  
});
interface IFileTest {
  /**
   *  File path
   */
  path: string;
  /**
   * algo
   */
  algo: DigestAlgorithm;
  /**
   * Expected output
   */
  expected: string;
  /**
   * Option
   */
  options?: IDigestOptions;
}

const fileTests: { [key: string]: IFileTest } = {
  '1': {
    path: 'small-img.png',
    expected: 'ded8cc7756b957c498e9a91c6e4e9dc3',
    algo: 'md5',
  },
  '2': {
    path: 'large-img.png',
    expected: '33a23242279d39f5b1fb043b23e51534',
    algo: 'md5',
  },
  '3': {
    path: 'large-img.png',
    expected: '33a23242279d39f5b1fb043b23e51534',
    algo: 'md5',
    options: {
      partial: true,
      // 0 multiplier should produce same result as non partial
      partialMultipler: 0,
    }
  },
  '4': {
    path: 'large-img.png',
    expected: '62f39b40fbb50657eec2600a2860e95e64b217c7',
    algo: 'sha1',
  },
  '5': {
    path: 'large-img.png',
    expected: '77c505453595433d533af8e2e37b18689362b9d77375606301eb6ea87033820b',
    algo: 'sha256',
  },
  '6': {
    path: 'large-img.png',
    expected: '296e55dce5eddb43b0471c9676344a8e6511a3d4a3f58b21bc6a196ce262447eb801fcf795cecba4148afc7a399b280e74ee862811724ed08fe4c72aae1ca7e8',
    algo: 'sha512',
  },
};

interface IStringTest {
  /**
   * The string to hash
   */
  text: string;
  /**
   * Digest algo
   */
  algo: DigestAlgorithm;
  /**
   * Digest encoding
   */
  encoding: BinaryToTextEncoding;
  /**
   * Expected output
   */
  expected: string;
}

const TEST_STRING_VAL = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt';
const stringTests: { [key: string]: IStringTest } = {
  1: {
    text: TEST_STRING_VAL,
    algo: 'md5',
    encoding: 'hex',
    expected: 'd0b795915de6ec4630bf2a0d0bd8ecd1',
  },
  2: {
    text: TEST_STRING_VAL,
    algo: 'sha1',
    encoding: 'hex',
    expected: 'c387f597da3cce8492676e72ab488595871b7e58',
  },
  3: {
    text: TEST_STRING_VAL,
    algo: 'sha256',
    encoding: 'hex',
    expected: '1a7b9019e4af3bb3dbd038efdd1a22b5cf20623b99bb2f8cac563f67f508d303',
  },
  4: {
    text: TEST_STRING_VAL,
    algo: 'sha512',
    encoding: 'hex',
    expected: '0193863115a0954f775e339d9dc6cd4264f1e44febcde2f4e171bbcf34c10561db9e1d3c2fa56132ef0c5691129c7daba28184c8016bf12d84ab0e277b9e6c47',
  },
  5: {
    text: TEST_STRING_VAL,
    algo: 'md5',
    encoding: 'base64',
    expected: '0LeVkV3m7EYwvyoNC9js0Q==',
  },
};
