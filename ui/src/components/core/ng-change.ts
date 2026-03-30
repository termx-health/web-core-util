type MarkFunctionProperties<C> = {
  [Key in keyof C]: C[Key] extends Function ? never : Key;
};

type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];
type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;

export type NgChanges<C, Props = ExcludeFunctions<C>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  }
};
