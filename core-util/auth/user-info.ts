import {CodeName} from '../model';
import {LocalizedName} from '../model';
import {Identifier} from '../model/identifier';

export class UserInfo  {
  public tenant?: string;
  public user?: User;
  public account?: Account;
  public reference?: UserReference;
  public accounts?: CodeName[];
  public iesterUrl?: string;
  public sub?: string;
  public sid?: string;
  public issuer?: string;

  public getUserIdentifier(system: string): string {
    if (!this.user || !this.user.identifiers) {
      return null;
    }
    const identifier = this.user.identifiers.filter(i => i.system === system)[0];
    if (identifier && identifier.value.trim() !== '') {
      return identifier.value;
    }
    return null;
  }
}

export class User {
  public id: string;
  public sub: string;
  public name: string;
  public identifiers: Identifier[];
}

export class UserReference {
  public id?: string;
  public type?: string;

  public practitioner?: {
    id: string;
    identifiers: Identifier[];
    specialities: string[];
    name: {
      given: string;
      family: string;
      text: string;
    }
  };
}

export class Account {
  public id?: number;
  public names?: LocalizedName;
  public workplaces?: CodeName[];
  public organization?: {
    id: string;
    code: string;
    name: string;
    institutionId: string;
  };
  public privileges?: {[privilegeName: string]: string[]};
  public specifier?: Identifier[];
}
