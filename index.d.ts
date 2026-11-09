declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '.txt.d.ts;' {
  const content: string;
  export default content;
}
declare module '!!raw-loader!*' {
  const contents: string;
  export = contents;
}

declare type PromiseReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : never;
