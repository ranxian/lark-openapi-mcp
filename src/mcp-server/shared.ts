import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { currentVersion } from '../utils/version';
import { noop } from '../utils/noop';

import * as larkmcp from '../mcp-tool';

export interface McpServerOptions {
  appId?: string;
  appSecret?: string;
  domain?: string;
  tools?: string | string[];
  userAccessToken?: string;
  language?: 'zh' | 'en';
  toolNameCase?: larkmcp.ToolNameCase;
}
export function initMcpServer(options: McpServerOptions) {
  const appId = options.appId || process.env.APP_ID;
  const appSecret = options.appSecret || process.env.APP_SECRET;
  const userAccessToken = options.userAccessToken || process.env.USER_ACCESS_TOKEN;
  const allowTools = Array.isArray(options.tools)
    ? (options.tools as larkmcp.ToolName[])
    : ((options.tools?.split(',') || []) as larkmcp.ToolName[]);

  if (!appId || !appSecret) {
    console.error(
      'Error: Missing App Credentials, please provide APP_ID and APP_SECRET or specify them via command line arguments',
    );
    process.exit(1);
  }

  const mcpServer = new McpServer({ id: 'lark-mcp-server', name: 'Feishu/Lark MCP Server', version: currentVersion });

  const larkClient = new larkmcp.LarkMcpTool({
    appId,
    appSecret,
    logger: { warn: noop, error: noop, debug: noop, info: noop, trace: noop },
    domain: options.domain,
    toolsOptions: allowTools.length ? { allowTools, language: options.language } : { language: options.language },
  });

  if (userAccessToken) {
    larkClient.updateUserAccessToken(userAccessToken);
  }

  larkClient.registerMcpServer(mcpServer, { toolNameCase: options.toolNameCase });

  return { mcpServer, larkClient };
}
