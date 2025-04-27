import { Client } from '@larksuiteoapi/node-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { LarkMcpToolOptions, McpTool, ToolNameCase, TokenMode } from './types';
import { AllTools, AllToolsZh } from './tools';
import { filterTools } from './utils/filter-tools';
import { defaultToolNames } from './constants';
import { larkOapiHandler } from './utils/handler';
import { caseTransf } from './utils/case-transf';

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
        if (!this.client) {
          throw new Error('Client not initialized');
        }
        const handler = tool.customHandler || larkOapiHandler;
        return handler(this.client, params, { tokenMode: this.tokenMode, userAccessToken: this.userAccessToken, tool });
      });
    }
  }
}
