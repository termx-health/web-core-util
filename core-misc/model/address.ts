export class Address {
  public identifiers?: AddressIdentifier[];
  public text: string;
  public country?: string;
  public county?: string;
  public city?: string;
  public district?: string;
  public street?: string;
  public houseNumber?: string;
  public apartmentNumber?: string;
  public line?: string;
  public postalCode?: string;
}

export class AddressIdentifier {
  public system: string;
  public value: string;
}

export enum AddressIdentifierSystem {
  EHAK = 'urn:ehak',
  ADS = 'urn:ads'
}

export enum AddressCountry {
  EST = 'EST'
}
