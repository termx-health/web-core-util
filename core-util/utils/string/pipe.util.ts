import {Identifier} from '../../models';
import {isNil} from '../object/object.util';

export function asPipe(identifier: Identifier): string {
  if (isNil(identifier)) {
    return null;
  }
  return `${identifier.system}|${identifier.value}`;
}

export function fromPipe(pipeString: string): Identifier {
  if (isNil(pipeString)) {
    return null;
  }
  if (pipeString.indexOf('|') === -1) {
    return {value: pipeString};
  }
  const [system, value] = pipeString.split('|');
  return {system, value};
}




