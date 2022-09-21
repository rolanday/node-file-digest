# node-file-digest

This NodeJS module provides synchronous and asynchronous functions for generating MD5, SHA1, SHA256, and SHA512 file digests.

## Quickstart

To generate a file hash...

**1. Install**

```shell
npm install node-file-digest
```
**2. Create an MD5 file digest**
```
import { hashFile, hashFileSync } from 'node-file-digest';
// const hashFile = require('node-file-digest').hashFile; // alt usage if not importing

// Async usage
hashFile('image.dng', 'md5') // hex encoding by default
  .then((digest) => {
    console.log(`digest: ${digest}`);
  })
  .catch((e) => {
    console.error(e);
  });

// Synchronous usage
console.log(`digest: ${hashFileSync('image.dng', 'md5')}`);

// Outputs:
// digest: a3a66e185c3ccbd8d2f658200354e10d
// digest: a3a66e185c3ccbd8d2f658200354e10d
```
**2. Create a SHA256 file digest encoded as base64 **

```
import { hashFile, hashFileSync } from 'node-file-digest';

// Async call
hashFile('image.dng', 'sha256', { encoding: 'base64'})
  .then((digest) => {
    console.log(`digest: ${digest}`);
  })
  .catch((e) => {
    console.error(e);
  });

// Outputs:
// digest: YANU/RXHl0w7d6pdNorh6JVOGxFtS8kg3W0DrKENphg=
```
## Usage
Module exports the following functions, all having same call pattern:
# **Functions**
* **hashFile**(filePath, algorithm, options)
* **hashFileSync**(filePath, algorithm, options)
* **hashString**(strVal, algorithm, options)
### Parameters
* **filePath**: Path to file to calculate digest
* **algorithm**: 'md5' | 'sha1' | 'sha256' | 'sha512'
* **options**: {}

### Options
* **encoding**: 'base64' | 'base64url' | 'hex'
* **textMode**: Read text file line-by-line, feeding each line to hash generator. This option is useful for comparing text files that differ only in linefeed endings (e.g., dos/windows vs unix/macos).
