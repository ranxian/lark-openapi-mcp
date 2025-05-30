import { Client } from '@larksuiteoapi/node-sdk';

/**
 * Token information with expiration tracking
 */
export interface UserTokenInfo {
  access_token: string;
  refresh_token: string;
  expires_in: number; // Expiration time in seconds
  token_type: string;
  scope: string;
  created_at: number; // Timestamp when token was created/refreshed
}

/**
 * Token refresh callback function type
 */
export type TokenRefreshCallback = (newTokenInfo: UserTokenInfo) => void;

/**
 * Auto-refreshing token manager for Feishu user access tokens
 */
export class UserTokenManager {
  private tokenInfo: UserTokenInfo | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private client: Client;
  private refreshCallback?: TokenRefreshCallback;
  private isRefreshing = false;

  constructor(client: Client, refreshCallback?: TokenRefreshCallback) {
    this.client = client;
    this.refreshCallback = refreshCallback;
  }

  /**
   * Set token information and start auto-refresh
   */
  setTokenInfo(tokenInfo: Omit<UserTokenInfo, 'created_at'>): void {
    this.tokenInfo = {
      ...tokenInfo,
      created_at: Date.now(),
    };
    
    this.scheduleRefresh();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.tokenInfo?.access_token || null;
  }

  /**
   * Get current token info
   */
  getTokenInfo(): UserTokenInfo | null {
    return this.tokenInfo;
  }

  /**
   * Check if token is expired or will expire soon (within 5 minutes)
   */
  isTokenExpired(): boolean {
    if (!this.tokenInfo) return true;
    
    const now = Date.now();
    const expiresAt = this.tokenInfo.created_at + (this.tokenInfo.expires_in * 1000);
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    
    return now >= (expiresAt - bufferTime);
  }

  /**
   * Manual token refresh
   */
  async refreshToken(): Promise<UserTokenInfo | null> {
    if (!this.tokenInfo?.refresh_token) {
      throw new Error('No refresh token available');
    }

    if (this.isRefreshing) {
      // Return current token if already refreshing
      return this.tokenInfo;
    }

    try {
      this.isRefreshing = true;
      
      const config = (this.client as any).config;
      const app_id = config?.appId;
      const app_secret = config?.appSecret;
      
      if (!app_id || !app_secret) {
        throw new Error('App ID or App Secret not found in client configuration');
      }

      // Use the official Feishu refresh token endpoint
      const response = await this.client.request({
        method: 'POST',
        url: '/open-apis/authen/v1/oidc/refresh_access_token',
        data: {
          grant_type: 'refresh_token',
          client_id: app_id,
          client_secret: app_secret,
          refresh_token: this.tokenInfo.refresh_token,
        },
      });

      const responseData = response.data;
      
      if (responseData.code === 0) {
        const newTokenInfo: UserTokenInfo = {
          access_token: responseData.data.access_token,
          refresh_token: responseData.data.refresh_token,
          expires_in: responseData.data.expires_in,
          token_type: responseData.data.token_type,
          scope: responseData.data.scope,
          created_at: Date.now(),
        };

        this.tokenInfo = newTokenInfo;
        this.scheduleRefresh();
        
        // Notify callback about new token
        if (this.refreshCallback) {
          this.refreshCallback(newTokenInfo);
        }

        return newTokenInfo;
      } else {
        throw new Error(`Token refresh failed: ${responseData.msg} (code: ${responseData.code})`);
      }
    } catch (error) {
      console.error('Failed to refresh user access token:', error);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.tokenInfo) return;

    // Schedule refresh 5 minutes before expiration
    const bufferTime = 5 * 60 * 1000; // 5 minutes
    const refreshTime = (this.tokenInfo.expires_in * 1000) - bufferTime;
    
    // Ensure minimum refresh time of 1 minute
    const minRefreshTime = 60 * 1000; // 1 minute
    const actualRefreshTime = Math.max(refreshTime, minRefreshTime);

    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshToken();
        console.log('User access token refreshed automatically');
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
        // Clear token info on refresh failure
        this.tokenInfo = null;
      }
    }, actualRefreshTime);
  }

  /**
   * Stop auto-refresh and clear timers
   */
  stop(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.isRefreshing = false;
  }

  /**
   * Clear all token information
   */
  clear(): void {
    this.stop();
    this.tokenInfo = null;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCode(code: string, redirect_uri: string): Promise<UserTokenInfo> {
    const config = (this.client as any).config;
    const app_id = config?.appId;
    const app_secret = config?.appSecret;
    
    if (!app_id || !app_secret) {
      throw new Error('App ID or App Secret not found in client configuration');
    }

    // Exchange code for tokens using the official endpoint
    const response = await this.client.request({
      method: 'POST',
      url: '/open-apis/authen/v1/oidc/access_token',
      data: {
        grant_type: 'authorization_code',
        client_id: app_id,
        client_secret: app_secret,
        code,
        redirect_uri,
      },
    });

    const responseData = response.data;
    
    if (responseData.code === 0) {
      const tokenInfo: UserTokenInfo = {
        access_token: responseData.data.access_token,
        refresh_token: responseData.data.refresh_token,
        expires_in: responseData.data.expires_in,
        token_type: responseData.data.token_type,
        scope: responseData.data.scope,
        created_at: Date.now(),
      };

      this.setTokenInfo(tokenInfo);
      
      // Notify callback about new token
      if (this.refreshCallback) {
        this.refreshCallback(tokenInfo);
      }

      return tokenInfo;
    } else {
      throw new Error(`Token exchange failed: ${responseData.msg} (code: ${responseData.code})`);
    }
  }
}