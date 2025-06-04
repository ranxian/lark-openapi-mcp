import crypto from 'crypto';
import { URLSearchParams } from 'url';

// Interfaces
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  domain?: string;
}

export interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expires_at_ms: number;
  token_type: string;
  refresh_token_expires_at_ms: number;
  scope: string;
}

export interface AuthorizeOptions {
  scope?: string;
  state?: string;
}

export class FeishuOAuth {
  private readonly config: OAuthConfig;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(options: AuthorizeOptions = {}): string {
    const state = options.state || crypto.randomBytes(16).toString('hex');

    const URL = "https://accounts.feishu.cn/open-apis/authen/v1/authorize";

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state: state,
      scope: 'offline_access drive:drive.search:readonly bitable:app:readonly docx:document:readonly'
    });

    return `${URL}?${params.toString()}`;
  }

  private async requestToken(params: {
    grant_type: 'authorization_code' | 'refresh_token';
    [key: string]: string;
  }): Promise<TokenInfo> {
    const URL = "https://open.feishu.cn/open-apis/authen/v2/oauth/token";

    const requestBody = {
      ...params,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    };

    console.log('Request body:', requestBody);

    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at_ms: Date.now() + data.expires_in * 1000,
      token_type: data.token_type || 'Bearer',
      refresh_token_expires_at_ms: Date.now() + data.refresh_token_expires_in * 1000,  
      scope: data.scope,
    } as TokenInfo;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<TokenInfo> {
    return this.requestToken({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
    });
  }

  /**
   * Refresh access token using refresh token
   * Implementation based on https://open.feishu.cn/document/authentication-management/access-token/refresh-user-access-token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenInfo> {
    console.log('Try to refresh access token')
    return this.requestToken({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
  }

}