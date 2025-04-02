import { Client } from '@larksuiteoapi/node-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { LarkMcpToolOptions, McpTool, ToolNameCase } from './types';
import { AllTools, AllToolsZh } from './tools';
import { filterTools } from './utils/filter-tools';
import { defaultToolNames } from './constants';
import { larkOapiHandler } from './utils/handler';
import { caseTransf } from './utils/case-transf';

/**
 * 飞书/Lark MCP SDK
 */
export class LarkMcpTool {
  // 飞书API客户端
  private client: Client | null = null;
  // 用户访问令牌
  private userAccessToken: string | undefined;
  // 所有工具
  private allTools: McpTool[] = [];

  /**
   * 飞书/Lark MCP SDK
   * @param options 飞书API配置选项
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
    if (options.toolsOptions?.language === 'zh') {
      this.allTools = filterTools(AllToolsZh, { allowTools: defaultToolNames, ...options.toolsOptions });
    } else {
      this.allTools = filterTools(AllTools, { allowTools: defaultToolNames, ...options.toolsOptions });
    }
  }

  /**
   * 更新用户访问令牌
   * @param userAccessToken 用户访问令牌
   */
  updateUserAccessToken(userAccessToken: string) {
    this.userAccessToken = userAccessToken;
  }

  /**
   * 获取MCP工具列表
   * @returns MCP工具定义数组
   */
  getTools(): McpTool[] {
    return this.allTools;
  }

  /**
   * 注册工具到MCP服务器
   * @param server MCP服务器实例
   */
  registerMcpServer(server: McpServer, options?: { toolNameCase?: ToolNameCase }): void {
    for (const tool of this.allTools) {
      server.tool(caseTransf(tool.name, options?.toolNameCase), tool.description, tool.schema, (params: any) => {
        if (!this.client) {
          throw new Error('Client not initialized');
        }
        const handler = tool.customHandler || larkOapiHandler;
        return handler(this.client, params, {
          userAccessToken: this.userAccessToken,
          tool,
        });
      });
    }
  }
}
