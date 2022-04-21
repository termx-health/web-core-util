import {coerceBooleanProperty} from '@angular/cdk/coercion';

export function toBoolean(value: boolean | string): boolean {
  return coerceBooleanProperty(value);
}

function propDecoratorFactory<T, D>(fn: (v: T) => D): (target: any, propName: string) => void {
  function propDecorator(target: any, propName: string, originalDescriptor?: TypedPropertyDescriptor<any>): any {
    const privatePropName = `$$__kuPropDecorator__${propName}`;
    Object.defineProperty(target, privatePropName, {configurable: true, writable: true});

    return {
      get(): string {
        return originalDescriptor?.get ? originalDescriptor.get.bind(this)() : this[privatePropName];
      },
      set(value: T): void {
        if (originalDescriptor?.set) {
          originalDescriptor.set.bind(this)(fn(value));
        }
        this[privatePropName] = fn(value);
      }
    };
  }

  return propDecorator;
}

export function BooleanInput(): any {
  return propDecoratorFactory(toBoolean);
}
