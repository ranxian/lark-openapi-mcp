import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function initStdioServer(server: McpServer) {
  const transport = new StdioServerTransport();
  server.connect(transport).catch((error) => {
    console.error('MCP Connect Error:', error);
    process.exit(1);
  });
}
