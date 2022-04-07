export enum IssueSeverity {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARNING = 'WARNING'
}

export interface Issue {
  severity: IssueSeverity;
  code: string;
  message: string;
  params: { [name: string]: any };
}
