declare interface AnyObject {
  [propName: string]: any;
}

declare interface Dictionary<T> {
  [index: string]: T;
}
declare interface NumericDictionary<T> {
  [index: number]: T;
}

declare type TimeoutHandle = ReturnType<typeof setTimeout>;

declare type IntervalHandle = ReturnType<typeof setInterval>;

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare type Nullable<T> = T | null;

declare type TargetContext = "_self" | "_blank";
