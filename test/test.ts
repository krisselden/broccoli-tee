'use strict';
import Funnel = require('broccoli-funnel');
import { createBuilder, createTempDir, Output, TempDir, wrapBuilder } from 'broccoli-test-helper';
import tee = require('../index');

// create a noop builder to track changes
// TODO extract change tracking from Output
class TrackedTempDir {
  public outputPath: string;

  constructor(public targetDir: TempDir) {
    this.outputPath = targetDir.path();
  }

  public build() {
    // NOOP just used for change tracking
    // TODO extract change tracking from Output
    return Promise.resolve();
  }

  public cleanup() {
    return this.targetDir.dispose();
  }
}

QUnit.module('BroccoliDebug', (hooks) => {
  let input: TempDir;
  let target: Output;
  let output: Output;

  hooks.beforeEach(async () => {
    input = await createTempDir();
    target = wrapBuilder(new TrackedTempDir(await createTempDir()));
  });

  hooks.afterEach(async () => {
    await input.dispose();
    await target.dispose();
    if (output) {
      await output.dispose();
    }
  });

  QUnit.test('it tees output', async (assert) => {
    const node = new Funnel(input.path(), {});
    output = createBuilder(node);

    tee(node, target.path('foo'));

    const expected: any = {
      herp: {
        'derp.txt': 'hello',
      },
    };

    input.write(expected);

    await output.build();
    await target.build();

    assert.deepEqual(output.changes(), {
      'herp/': 'mkdir',
      'herp/derp.txt': 'create',
    });

    assert.deepEqual(target.changes(), {
      'foo/': 'mkdir',
      'foo/herp/': 'mkdir',
      'foo/herp/derp.txt': 'create',
    });

    assert.deepEqual(expected, output.read());
    assert.deepEqual(expected, target.read('foo'));

    const update = {
      foo: 'bar',
      herp: {
        'derp.txt': 'bye',
      },
    };

    input.write(update);

    Object.assign(expected, update);

    // UPDATE
    await output.build();
    await target.build();

    assert.deepEqual(output.changes(), {
      'foo': 'create',
      'herp/derp.txt': 'change',
    });

    assert.deepEqual(target.changes(), {
      'foo/foo': 'create',
      'foo/herp/derp.txt': 'change',
    });

    assert.deepEqual(expected, output.read());
    assert.deepEqual(expected, target.read('foo'));

    // NOOP
    await output.build();
    await target.build();

    assert.deepEqual(output.changes(), {});
    assert.deepEqual(target.changes(), {});

    assert.deepEqual(expected, output.read());
    assert.deepEqual(expected, target.read('foo'));

    // DELETE
    input.write({
      foo: null,
    });
    delete expected.foo;

    await output.build();
    await target.build();

    assert.deepEqual(output.changes(), {
      foo: 'unlink',
    });
    assert.deepEqual(target.changes(), {
      'foo/foo': 'unlink',
    });

    assert.deepEqual(expected, output.read());
    assert.deepEqual(expected, target.read('foo'));
  });
});
