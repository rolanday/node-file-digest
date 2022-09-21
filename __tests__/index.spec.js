"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const index_1 = require("./index");
const assets = [
    'test/assets/digest/ded8cc7756b957c498e9a91c6e4e9dc3.png',
];
describe('digest', () => {
    test('sync', () => {
        const path = assets[0];
        const md5 = index_1.Digest.hashFileSync(path, index_1.DigestAlgo.MD5).value;
        expect(md5).toStrictEqual((0, path_1.parse)(path).name);
    });
});
//# sourceMappingURL=index.spec.js.map