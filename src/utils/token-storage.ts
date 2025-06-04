import fs from 'fs';
import os from 'os';
import path from 'path';
import { FeishuOAuth, TokenInfo } from './oauth';


export class TokenStorage {
  private configDir: string;
  private tokenFilePath: string;
  private oauthClient: FeishuOAuth;

  constructor(options: { configDir?: string; oauthClient: FeishuOAuth }) {
    this.configDir = options.configDir || path.join(os.homedir(), '.lark-mcp');
    this.tokenFilePath = path.join(this.configDir, 'tokens.json');
    this.oauthClient = options.oauthClient;
    this.ensureConfigDir();
  }

  private ensureConfigDir(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  /**
   * Store tokens to file
   */
  async storeTokens(tokens: TokenInfo): Promise<void> {
    await fs.promises.writeFile(
      this.tokenFilePath,
      JSON.stringify(tokens, null, 2),
      'utf-8'
    );
  }

  /**
   * Load tokens from file
   */
  async loadTokens(): Promise<TokenInfo | null> {
    try {
      if (!fs.existsSync(this.tokenFilePath)) {
        return null;
      }

      const content = await fs.promises.readFile(this.tokenFilePath, 'utf-8');
      return JSON.parse(content) as TokenInfo;
    } catch (error) {
      console.warn('Failed to load tokens:', error);
      return null;
    }
  }

  /**
   * Check if access token is expired
   */
  isAccessTokenExpired(tokens: TokenInfo): boolean {
    return Date.now() >= tokens.expires_at_ms - 30000; // 30 seconds buffer
  }

  isRefreshTokenExpired(tokens: TokenInfo): boolean {
    return Date.now() >= tokens.refresh_token_expires_at_ms - 30000; // 30 seconds buffer
  }

  /**
   * Clear stored tokens
   */
  async clearTokens(): Promise<void> {
    if (fs.existsSync(this.tokenFilePath)) {
      await fs.promises.unlink(this.tokenFilePath);
    }
  }

  /**
   * Get valid access token (refresh if needed)
   * @param refreshTokenFn Optional function to refresh token if not using built-in OAuth client
   */
  async getValidAccessToken(): Promise<string | null> {
    const tokens = await this.loadTokens();

    if (!tokens) {
      return null;
    }

    if (!this.isAccessTokenExpired(tokens)) {
      return tokens.access_token;
    }

    if (this.isRefreshTokenExpired(tokens)) {
      await this.clearTokens();
      return null;
    }

    const newTokens = await this.oauthClient.refreshAccessToken(tokens.refresh_token);
    await this.storeTokens(newTokens);
    return newTokens.access_token;
  }
}