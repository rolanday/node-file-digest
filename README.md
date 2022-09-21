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
import { hashFile } from 'node-file-hash';

...

const digest = await hashFile('somefile.ext', 'md5');

```
