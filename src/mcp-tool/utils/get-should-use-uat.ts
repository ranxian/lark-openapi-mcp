import { TokenMode } from '../types';

export function getShouldUseUAT(tokenMode: TokenMode, userAccessToken?: string, useUAT?: boolean) {
  switch (tokenMode) {
    case TokenMode.USER_ACCESS_TOKEN: {
      return true; // Always return true for USER_ACCESS_TOKEN mode, let caller handle missing token
    }
    case TokenMode.TENANT_ACCESS_TOKEN: {
      return false;
    }
    case TokenMode.AUTO:
    default: {
      if (userAccessToken && useUAT) {
        return true;
      } else {
        return false;
      }
    }
  }
}
