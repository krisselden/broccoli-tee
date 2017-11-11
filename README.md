# broccoli-tee
[![Build Status](https://travis-ci.org/krisselden/broccoli-tee.svg?branch=master)](https://travis-ci.org/krisselden/broccoli-tee) [![Build Status](https://ci.appveyor.com/api/projects/status/32r7s2skrgm9ubva?svg=true)](https://ci.appveyor.com/api/projects/status/32r7s2skrgm9ubva?svg=true)

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
