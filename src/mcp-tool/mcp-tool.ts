import { Client } from '@larksuiteoapi/node-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { LarkMcpToolOptions, McpTool, ToolNameCase, TokenMode } from './types';
import { AllTools, AllToolsZh } from './tools';
import { filterTools } from './utils/filter-tools';
import { defaultToolNames } from './constants';
import { larkOapiHandler } from './utils/handler';
import { caseTransf } from './utils/case-transf';
import { getShouldUseUAT } from './utils/get-should-use-uat';
import { formatOAuthErrorResponse } from './utils/oauth-helper';
import { UserTokenManager, UserTokenInfo } from './utils/token-manager';

/**
 * Feishu/Lark MCP
 */
export class LarkMcpTool {
  // Lark Client
  private client: Client | null = null;

  // User Access Token
  private userAccessToken: string | undefined;

  // Token Manager for auto-refresh
  private tokenManager: UserTokenManager | null = null;

  // Token Mode
  private tokenMode: TokenMode = TokenMode.AUTO;

  // All Tools
  private allTools: McpTool[] = [];

  /**
   * Feishu/Lark MCP
   * @param options Feishu/Lark Client Options
   */
  constructor(options: LarkMcpToolOptions) {
    if (options.client) {
      this.client = options.client;
    } else if (options.appId && options.appSecret) {
      this.client = new Client({
        appId: options.appId,
        appSecret: options.appSecret,
        ...options,
      });
    }
    this.tokenMode = options.tokenMode || TokenMode.AUTO;
    
    // Initialize token manager if client is available
    if (this.client) {
      this.tokenManager = new UserTokenManager(this.client, (newTokenInfo) => {
        // Update internal token when auto-refreshed
        this.userAccessToken = newTokenInfo.access_token;
      });
    }
    
    const isZH = options.toolsOptions?.language === 'zh';

    const filterOptions = {
      allowTools: defaultToolNames,
      tokenMode: this.tokenMode,
      ...options.toolsOptions,
    };
    this.allTools = filterTools(isZH ? AllToolsZh : AllTools, filterOptions);
  }

  /**
   * Update User Access Token
   * @param userAccessToken User Access Token
   */
  updateUserAccessToken(userAccessToken: string) {
    this.userAccessToken = userAccessToken;
  }

  /**
   * Set user token info with auto-refresh capability
   * @param tokenInfo Complete token information including refresh token
   */
  setUserTokenInfo(tokenInfo: Omit<UserTokenInfo, 'created_at'>) {
    if (this.tokenManager) {
      this.tokenManager.setTokenInfo(tokenInfo);
      this.userAccessToken = tokenInfo.access_token;
    } else {
      // Fallback for when tokenManager is not available
      this.userAccessToken = tokenInfo.access_token;
    }
  }

  /**
   * Exchange OAuth code for access token with auto-refresh
   * @param code Authorization code from OAuth callback
   * @param redirect_uri Redirect URI used in OAuth flow
   */
  async exchangeOAuthCode(code: string, redirect_uri: string): Promise<UserTokenInfo> {
    if (!this.tokenManager) {
      throw new Error('Token manager not initialized. Client is required for OAuth operations.');
    }
    
    const tokenInfo = await this.tokenManager.exchangeCode(code, redirect_uri);
    this.userAccessToken = tokenInfo.access_token;
    return tokenInfo;
  }

  /**
   * Get current token information
   */
  getTokenInfo(): UserTokenInfo | null {
    return this.tokenManager?.getTokenInfo() || null;
  }

  /**
   * Check if current token is expired or will expire soon
   */
  isTokenExpired(): boolean {
    return this.tokenManager?.isTokenExpired() ?? true;
  }

  /**
   * Manually refresh the user access token
   */
  async refreshUserToken(): Promise<UserTokenInfo | null> {
    if (!this.tokenManager) {
      throw new Error('Token manager not initialized. Client is required for token refresh.');
    }
    
    const tokenInfo = await this.tokenManager.refreshToken();
    if (tokenInfo) {
      this.userAccessToken = tokenInfo.access_token;
    }
    return tokenInfo;
  }

  /**
   * Get MCP Tools
   * @returns MCP Tool Definition Array
   */
  getTools(): McpTool[] {
    return this.allTools;
  }

  /**
   * Register Tools to MCP Server
   * @param server MCP Server Instance
   */
  registerMcpServer(server: McpServer, options?: { toolNameCase?: ToolNameCase }): void {
    for (const tool of this.allTools) {
      server.tool(caseTransf(tool.name, options?.toolNameCase), tool.description, tool.schema, (params: any) => {
        try {
          if (!this.client) {
            return {
              isError: true,
              content: [{ type: 'text' as const, text: 'Client not initialized' }],
            };
          }
          const handler = tool.customHandler || larkOapiHandler;
          const shouldUseUAT = getShouldUseUAT(this.tokenMode, this.userAccessToken, params?.useUAT);
          
          // Check if user access token is required but missing
          if (shouldUseUAT && !this.userAccessToken) {
            const config = (this.client as any).config;
            return formatOAuthErrorResponse(config, new Error('User access token required but not provided'));
          }
          return handler(
            this.client,
            { ...params, useUAT: shouldUseUAT },
            { userAccessToken: this.userAccessToken, tool, larkMcpTool: this },
          );
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text' as const, text: `Error: ${JSON.stringify((error as Error)?.message)}` }],
          };
        }
      });
    }
  }

  /**
   * Stop auto-refresh and cleanup resources
   */
  stop(): void {
    if (this.tokenManager) {
      this.tokenManager.stop();
    }
  }

  /**
   * Clear all token information and stop auto-refresh
   */
  clearTokens(): void {
    if (this.tokenManager) {
      this.tokenManager.clear();
    }
    this.userAccessToken = undefined;
  }
}
