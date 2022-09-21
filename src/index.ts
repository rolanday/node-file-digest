/**
 * read-file <https://github.com/rolanday/node-file-digest#readme>
 * Copyright (c) 2022, Roland Ayala.
 * Licensed under the MIT license.
 */

import crypto, { BinaryToTextEncoding, createHash } from 'crypto';
import readline from 'readline';
import * as fs from 'fs';

export type DigestAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';
const DEFAULT_ENCODING: BinaryToTextEncoding = 'hex';
const BUFFER_SIZE = 8192;
export interface IDigestOptions {
  /**
   * Digest format: hex (default), base64, base64url
   */
  encoding?: BinaryToTextEncoding;
  /**
   * Read text file line-by-line, feeding each line to hash generator. This
   * function is useful for comparing text files that differ only in linefeed
   * endings (e.g., dos/windows vs unix/macos).
   */
  textMode?: boolean;
  /**
   * Generate hash output based partial file read. The option applies only to
   * binary file mode (i.e., textMode is false or not set), and is not
   * cryptographically useful.
   */
  partial?: boolean;
  /**
   * Partial reads hash the first block (n-bytes) of data starting at head of
   * file, and then skips (1 x i) blocks for each read iteration (i).
   * Default = 1, setting to 0 results in full read, producing same result
   * as if non-partial read. If set, should be integer val >= 0.
   */
  partialMultipler?: number;
}

const getEncoding = (options?: IDigestOptions) => {
  return options?.encoding ? options.encoding : DEFAULT_ENCODING;
};

/**
 * Async call
 * @param filePath
 * @param algorithm
 * @param options
 * @returns
 */
export async function hashFile(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): Promise<string> {
  let digest: string;
  if (options?.textMode) {
    digest = await hashTextFile(filePath, algorithm, options);
  } else {
    digest = options?.partial
      ? await hashBinaryFilePartial(filePath, algorithm, options)
      : await hashBinaryFile(filePath, algorithm, options);
  }
  return digest;
}

/**
 * Sync call
 * @param filePath
 * @param algorithm
 * @param options
 * @returns
 */
export function hashFileSync(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): string {
  let digest: string;
  if (options?.textMode) {
    digest = hashTextFileSync(filePath, algorithm, options);
  } else {
    digest = options?.partial
      ? hashBinaryFilePartialSync(filePath, algorithm, options)
      : hashBinaryFileSync(filePath, algorithm, options);
  }
  return digest;
}

export function hashStringSync(
  text: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): string {
  const hasher = crypto.createHash(algorithm);
  return hasher
    .update(Buffer.from(text, 'utf8'))
    .digest()
    .toString(getEncoding(options));
}

function hashTextFileSync(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): string {
  const hasher = crypto.createHash(algorithm);
  readLinesSync(filePath, (line: string) => {
    hasher.update(`${line}\n`);
  });
  return hasher.digest(getEncoding(options));
}

async function hashTextFile(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): Promise<string> {
  const stream = fs.createReadStream(filePath);
  const reader = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  // For text files, fast algorithm uses MD5
  const hasher = crypto.createHash(algorithm);
  for await (const line of reader) {
    if (line) {
      hasher.update(`${line}\n`);
    }
  }
  return hasher.digest(getEncoding(options));
}

async function hashBinaryFile(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const hasher = createHash(algorithm);
    stream
      .on('readable', () => {
        const data = stream.read();
        if (data) {
          hasher.update(data);
        } else {
          resolve(hasher.digest(getEncoding(options)));
        }
      })
      .on('error', (e) => {
        reject(e);
      });
  });
}

function hashBinaryFileSync(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): string {
  const fd = fs.openSync(filePath, 'r');
  const hasher = crypto.createHash(algorithm);
  const buffer = Buffer.alloc(BUFFER_SIZE);
  try {
    let bytesRead: number;
    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null);
      hasher.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
  } finally {
    fs.closeSync(fd);
  }
  return hasher.digest(getEncoding(options));
}

function readLinesSync(
  filePath: string,
  callback: (line: string) => void,
): void {
  this.checkAccessSync(filePath);
  let fstat: fs.Stats;
  const chunkSize = 64 * 1024; // 64KB
  let bufferSize = chunkSize;

  const bufferAlloc = function (size: number) {
    return Buffer.alloc(size);
  };

  let curBuffer = bufferAlloc(0);
  let readBuffer: any;
  const fileSize = fs.statSync(filePath).size;
  if (fileSize < chunkSize) {
    bufferSize = fileSize;
  }

  const numOfLoops = Math.floor(fileSize / bufferSize);
  const remainder = fileSize % bufferSize;

  const fd = fs.openSync(filePath, 'r');
  let i: number;
  for (i = 0; i < numOfLoops; i = i + 1) {
    readBuffer = bufferAlloc(bufferSize);

    fs.readSync(fd, readBuffer, 0, bufferSize, bufferSize * i);

    curBuffer = Buffer.concat(
      [curBuffer, readBuffer],
      curBuffer.length + readBuffer.length,
    );
    let lineObj;
    while ((lineObj = getLine(curBuffer))) {
      curBuffer = lineObj.newBuffer;
      callback(lineObj.line);
    }
  }

  if (remainder > 0) {
    readBuffer = bufferAlloc(remainder);

    fs.readSync(fd, readBuffer, 0, remainder, bufferSize * i);

    curBuffer = Buffer.concat(
      [curBuffer, readBuffer],
      curBuffer.length + readBuffer.length,
    );
    let lineObj: any;
    while ((lineObj = getLine(curBuffer))) {
      curBuffer = lineObj.newBuffer;
      callback(lineObj.line);
    }
  }
  // Return last remaining lines in the buffer in case it didn't have any
  // more lines.
  if (curBuffer.length) {
    callback(curBuffer.toString());
  }
  fs.closeSync(fd);
}

function getLine(buffer: Buffer) {
  let end: number;
  for (let i = 0; i < buffer.length; i = i + 1) {
    if (buffer[i] === 0x0a) {
      end = i;
      if (i > 0 && buffer[i - 1] === 0x0d) {
        end = i - 1;
      }
      return {
        line: buffer.slice(0, end).toString(),
        newBuffer: buffer.slice(i + 1),
      };
    }
  }
  return null;
}

async function hashBinaryFilePartial(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
): Promise<string> {
  const fd = await fs.promises.open(filePath, 'r');
  const hasher = crypto.createHash(algorithm);
  const buffer = Buffer.alloc(BUFFER_SIZE);
  let pos = 0;
  let n = 0;
  try {
    let bytesRead: number;
    // partialMultipler default is 1 of not set, else val which can be 0 or higher.
    let factor =
      options?.partialMultipler == undefined ? 1 : options.partialMultipler;
    do {
      n += 1;
      const result = await fd.read(buffer, 0, BUFFER_SIZE, pos);
      bytesRead = result.bytesRead;
      pos = pos + bytesRead + Math.floor(Math.abs(BUFFER_SIZE * n * factor));
      hasher.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
  } finally {
    await fd.close();
  }
  return hasher.digest(getEncoding(options));
}

function hashBinaryFilePartialSync(
  filePath: string,
  algorithm: DigestAlgorithm,
  options?: IDigestOptions,
) {
  const fd = fs.openSync(filePath, 'r');
  const hasher = crypto.createHash(algorithm);
  const buffer = Buffer.alloc(BUFFER_SIZE);
  let pos = 0;
  let n = 0;
  try {
    let bytesRead;
    let factor =
      options?.partialMultipler == undefined ? 1 : options.partialMultipler;
    do {
      n += 1;
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, pos);
      pos = pos + bytesRead + Math.floor(Math.abs(BUFFER_SIZE * n * factor));
      hasher.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
  } finally {
    fs.closeSync(fd);
  }
  return hasher.digest(getEncoding(options));
}
