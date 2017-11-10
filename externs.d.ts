// tslint:disable:max-classes-per-file
declare module 'tree-sync' {
  class TreeSync {
    constructor(input: string, output: string);
    public sync(): void;
  }
  export = TreeSync;
}

declare module 'broccoli-funnel' {
  class Funnel {
    public outputPath: string;
    constructor(inputNode: any, options: any);
    public build(): PromiseLike<void>;
  }
  export = Funnel;
}
