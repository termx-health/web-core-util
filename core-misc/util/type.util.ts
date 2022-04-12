import 'reflect-metadata';
import {Type} from '@angular/core';

export function Typed(target: any, key: string, baseDescriptor?: PropertyDescriptor) {
  // do nothing, required to trigger 'reflect-metadata' compile time pre-processor
}

export function getDeclaredTypeName<T>(type: Type<T>, property: string): string {
  const metadata = Reflect.getMetadata('design:type', type.prototype, property);
  return metadata ? metadata.name : null;
}
