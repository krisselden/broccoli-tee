'use strict';
import TreeSync = require('tree-sync');
import { IBroccoliNode } from './interface';

class Tee {
  private treeSyncs: TreeSync[];
  private targetPaths: string[];
  private lastOutput: string | undefined;
  private build: () => PromiseLike<void>;

  constructor(private input: IBroccoliNode) {
    this.treeSyncs = [];
    this.targetPaths = [];
    this.lastOutput = undefined;

    this.build = input.build.bind(input);
    this.tee = this.tee.bind(this);
    input.build = this.wrap.bind(this);
  }

  public addTarget(targetPath: string) {
    this.targetPaths.push(targetPath);
  }

  private wrap() {
    return Promise.resolve().then(this.build).then(this.tee);
  }

  private tee() {
    const lastOutput = this.lastOutput;
    const treeSyncs = this.treeSyncs;
    const targetPaths = this.targetPaths;
    const outputPath = this.input.outputPath;

    // should be used with stable output plugins
    if (outputPath !== this.lastOutput) {
      this.lastOutput = outputPath;
      treeSyncs.length = 0;
    }

    let i = 0;
    for (; i < treeSyncs.length; i++) {
      treeSyncs[i].sync();
    }

    for (; i < targetPaths.length; i++) {
      const treeSync = new TreeSync(outputPath, targetPaths[i]);
      treeSyncs.push(treeSync);
      treeSync.sync();
    }
  }
}

const contextMap = new WeakMap<IBroccoliNode, Tee>();

function tee(input: IBroccoliNode, targetPath: string) {
  let ctx = contextMap.get(input);
  if (ctx === undefined) {
    ctx = new Tee(input);
    contextMap.set(input, ctx);
  }
  ctx.addTarget(targetPath);
  return input;
}

export = tee;
