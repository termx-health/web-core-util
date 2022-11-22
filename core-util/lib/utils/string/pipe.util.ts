import {Identifier} from '../../models';
import {isDefined, isNil} from '../object/object.util';

export function asPipe(identifier: Identifier): string | undefined {
  if (isDefined(identifier)) {
    return `${identifier.system}|${identifier.value}`;
  }
}

export function fromPipe(pipeString: string): Identifier | undefined {
  if (isNil(pipeString)) {
    return;
  }
  if (pipeString.indexOf('|') === -1) {
    return {value: pipeString};
  }

  const [system, value] = pipeString.split('|');
  return {
    system,
    value
  };
}




