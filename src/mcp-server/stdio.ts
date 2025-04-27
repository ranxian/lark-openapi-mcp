import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServerOptions, initMcpServer } from './shared';

export function initStdioServer(options: McpServerOptions) {
  const { mcpServer } = initMcpServer(options);
  const transport = new StdioServerTransport();
  mcpServer.connect(transport).catch((error) => {
    console.error('MCP Connect Error:', error);
    process.exit(1);
  });
}
