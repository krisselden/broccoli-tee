# broccoli-tee

[![Build Status](https://travis-ci.org/krisselden/broccoli-tee.svg?branch=master)](https://travis-ci.org/krisselden/broccoli-tee)

Tees the outputPath of a Broccoli node to a targetPath.

## Usage

```js
const tee = require('broccoli-tee');

const dist = mergeTrees([
  tee(buildPackage('a'), 'packages/a/dist'),
  tee(buildPackage('b'), 'packages/b/dist'),
]);

const builder = new Builder(dist);
```
