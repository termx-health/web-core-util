export class HumanNames {
  [key: string]: HumanName
}

export class HumanName {
  text?: string;
  given?: string;
  family?: string;
}
