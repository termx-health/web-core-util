import {LocalizedName} from '../localized-name';
import {CodeNameable} from './code-nameable';

export class CodeName implements CodeNameable {
  public id?: number;
  public code?: string;
  public names?: LocalizedName;
}
