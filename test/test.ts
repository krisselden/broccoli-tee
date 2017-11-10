'use strict';
import Funnel = require('broccoli-funnel');
import { createBuilder, createTempDir, Output, TempDir } from 'broccoli-test-helper';
import tee = require('../index');

QUnit.module('BroccoliDebug', (hooks) => {
  let input: TempDir;
  let target: TempDir;
  let output: Output;

  hooks.beforeEach(async () => {
    input = await createTempDir();
    target = await createTempDir();
  });

  hooks.afterEach(async () => {
    await input.dispose();
    await target.dispose();
    await output.dispose();
  });

  QUnit.test('it tees output', async (assert) => {
    const node = new Funnel(input.path(), {});
    output = createBuilder(node);

    tee(node, target.path('foo'));

    const expected = {
      herp: {
        'derp.txt': 'hello',
      },
    };

    input.write(expected);

    await output.build();

    assert.deepEqual(expected, output.read());
    assert.deepEqual(expected, target.read('foo'));
  });
});
