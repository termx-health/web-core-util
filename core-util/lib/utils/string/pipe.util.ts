import {Identifier} from '../../models';
import {isNil} from '../object/object.util';

export function asPipe(identifier: Identifier): string | undefined {
  if (isNil(identifier)) {
    return undefined;
  }
  return `${identifier.system}|${identifier.value}`;
}

export function fromPipe(pipeString: string): Identifier | undefined {
  if (isNil(pipeString)) {
    return undefined;
  }
  if (pipeString.indexOf('|') === -1) {
    return {value: pipeString};
  }
  const [system, value] = pipeString.split('|');
  return {system, value};
}




