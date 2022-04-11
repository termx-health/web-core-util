import {LocalizedName} from '../localized-name';

export interface CodeNameable {
  id?: number;
  code?: string;
  names?: LocalizedName;
}
