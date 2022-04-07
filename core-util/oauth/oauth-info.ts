import {UserInfo} from '../auth/user-info';

export class OAuthInfo {
  accessToken: string;
  exp: number;
  userInfo?: UserInfo;
}
