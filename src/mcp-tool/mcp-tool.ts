import { Client } from '@larksuiteoapi/node-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { FeishuOAuth } from '../utils/oauth';
import { TokenStorage } from '../utils/token-storage';
import { defaultToolNames } from './constants';
import { AllTools, AllToolsZh } from './tools';
import { LarkMcpToolOptions, McpTool, TokenMode, ToolNameCase } from './types';
import { caseTransf } from './utils/case-transf';
import { filterTools } from './utils/filter-tools';
import { larkOapiHandler } from './utils/handler';

/**
 * Feishu/Lark MCP
 */
export class LarkMcpTool {
  // Lark Client
  private client: Client | null = null;

  // User Access Token
  private userAccessToken: string | undefined;

  // Token Mode
  private tokenMode: TokenMode = TokenMode.AUTO;

  // All Tools
  private allTools: McpTool[] = [];

  // OAuth Client
  private oauthClient: FeishuOAuth | null = null;

  // App credentials for OAuth
  private appId: string | undefined;
  private appSecret: string | undefined;
  private domain: string;

  // Token storage
  private tokenStorage: TokenStorage | null = null;

  /**
   * Feishu/Lark MCP
   * @param options Feishu/Lark Client Options
   */
  constructor(options: LarkMcpToolOptions) {
    // Store credentials for OAuth
    this.appId = options.appId;
    this.appSecret = options.appSecret;
    this.domain = typeof options.domain === 'string' ? options.domain : options.domain?.toString() || 'https://passport.feishu.cn';

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
    const isZH = options.toolsOptions?.language === 'zh';

    const filterOptions = {
      allowTools: defaultToolNames,
      tokenMode: this.tokenMode,
      ...options.toolsOptions,
    };
    this.allTools = filterTools(isZH ? AllToolsZh : AllTools, filterOptions);

    // Initialize OAuth client if credentials are available
    if (this.appId && this.appSecret) {
      this.oauthClient = new FeishuOAuth({
        clientId: this.appId,
        clientSecret: this.appSecret,
        redirectUri: options.callbackUrl || (() => { throw new Error('callbackUrl is required for OAuth initialization') })(),
        domain: this.domain
      });
    }
      
    // Initialize token storage only if OAuth client is available
    if (this.oauthClient) {
      this.tokenStorage = new TokenStorage({ 
        oauthClient: this.oauthClient
      });
    }
  }

  async getUserAccessToken(): Promise<string | null> {
    if (!this.tokenStorage) {
      return null;
    }
    
    return this.tokenStorage.getValidAccessToken();
  }

  /**
   * Get MCP Tools
   * @returns MCP Tool Definition Array
   */
  getTools(): McpTool[] {
    return this.allTools;
  }

  /**
   * Generate OAuth URL for authorization
   * @param state State parameter for OAuth flow
   * @returns OAuth authorization URL
   */
  public generateOAuthUrl(state: string): string {
    if (!this.oauthClient) {
      throw new Error('OAuth client not initialized');
    }
    return this.oauthClient.generateAuthUrl({ state });
  }

  /**
   * Generate OAuth authorization response
   */
  private generateOAuthResponse(toolName: string) {
    if (this.oauthClient) {
      const authUrl = this.generateOAuthUrl(`tool_${toolName}_${Date.now()}`);
      return {
        isError: false,
        content: [{
          type: 'text' as const,
          text: `User access token is required for this operation. Please authorize by clicking this URL:\n\n${authUrl}\n\nAfter authorization, your token will be automatically saved and you can retry this operation.`
        }],
      };
    } else {
      return {
        isError: true,
        content: [{ type: 'text' as const, text: 'Invalid UserAccessToken - OAuth not configured' }],
      };
    }
  }

  /**
   * Register Tools to MCP Server
   * @param server MCP Server Instance
   */
  registerMcpServer(server: McpServer, options?: { toolNameCase?: ToolNameCase }): void {
    for (const tool of this.allTools) {
      server.tool(caseTransf(tool.name, options?.toolNameCase), tool.description, tool.schema, async (params: any) => {
        try {
          if (!this.client) {
            return {
              isError: true,
              content: [{ type: 'text' as const, text: 'Client not initialized' }],
            };
          }
          const handler = tool.customHandler || larkOapiHandler;
          const uat = this.tokenStorage ? await this.tokenStorage.getValidAccessToken() : undefined;
          const token = uat === null ? undefined : uat;


          if (!token && params?.useUAT) {
            return this.generateOAuthResponse(tool.name);
          }

          return handler(
            this.client,
            { ...params, useUAT: params?.useUAT },
            {
              userAccessToken: token,
              tool,
              appId: this.appId,
              appSecret: this.appSecret
            },
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
}
