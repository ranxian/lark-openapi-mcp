import { initMcpServer, McpServerOptions } from './shared';
import express, { Request, Response } from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

export function initSSEServer(options: McpServerOptions) {
  const { mcpServer } = initMcpServer(options);
  const app = express();
  const transports: { [sessionId: string]: SSEServerTransport } = {};

  app.get('/sse', async (_: Request, res: Response) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
    res.on('close', () => {
      delete transports[transport.sessionId];
    });
    await mcpServer.connect(transport);
  });

  app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (!transport) {
      res.status(400).send('No transport found for sessionId');
      return;
    }
    await transport.handlePostMessage(req, res);
  });

  app.listen(options.port, options.host, (error) => {
    if (error) {
      console.error('Server error:', error);
      process.exit(1);
    }
    console.log(`Server is running on port ${options.port}`);
    console.log(`SSE endpoint: http://${options.host}:${options.port}/sse`);
  });
}
