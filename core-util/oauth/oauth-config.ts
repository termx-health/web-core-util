export class OauthConfig {
  issuer: string;
  client: string;
  redirectUri?: string;
  responseType?: string;
  scope: string;
  silentRefresh?: number;
  loginHint?: string;
}
