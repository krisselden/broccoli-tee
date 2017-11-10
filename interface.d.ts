export interface IBroccoliNode {
  outputPath: string;
  build(): PromiseLike<void>;
}
