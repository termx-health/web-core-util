import {LocalizedName} from '../model';
import {CodeName} from '../model';

export function toCodeName(model: any, lang: string): CodeName {
  if (!model) {
    return undefined;
  }
  return Object.assign(new CodeName(), {
    id: model.id,
    code: model.code,
    name: model.names ? model.names[lang] : undefined,
    names: model.names
  });
}

export function toSimpleCodeName(code: string, lang?: string, name?: string): CodeName {
  const result: CodeName = {code: code};
  if (!!name) {
    result.names = new LocalizedName();
    result.names[lang] = name;
  }
  return result;
}
