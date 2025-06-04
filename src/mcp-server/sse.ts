import { initMcpServer, McpServerOptions } from './shared';
import express, { Request, Response } from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { FeishuOAuth } from '../utils/oauth';
import { TokenStorage } from '../utils/token-storage';

export function initSSEServer(server: McpServer, options: McpServerOptions) {
  const app = express();
  const transports: { [sessionId: string]: SSEServerTransport } = {};
  // Initialize token storage (will only be fully initialized when oauthClient is available)
  let tokenStorage: TokenStorage | null = null;
  
  // Initialize OAuth client if credentials are available
  let oauthClient: FeishuOAuth | null = null;
  if (options.appId && options.appSecret) {
    oauthClient = new FeishuOAuth({
      clientId: options.appId,
      clientSecret: options.appSecret,
      redirectUri: `http://${options.host}:${options.port}/oauth/callback`,
      domain: options.domain
    });

    tokenStorage = new TokenStorage({ oauthClient });
  }

  app.get('/sse', async (_: Request, res: Response) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
    res.on('close', () => {
      delete transports[transport.sessionId];
    });
    await server.connect(transport);
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

  // OAuth callback endpoint
  app.get('/oauth/callback', async (req: Request, res: Response) => {
    if (!oauthClient) {
      res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #e74c3c;">❌ OAuth Not Configured</h1>
            <p>OAuth client is not properly configured. Please check your environment variables.</p>
            <p>You can close this window.</p>
          </body>
        </html>
      `);
      return;
    }

    // Handle case when req.query might be undefined or missing properties (especially in tests)
    const code = req.query?.code as string || '';
    const error = req.query?.error as string || '';
    const errorDescription = req.query?.error_description as string || '';

    if (error) {
      res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #e74c3c;">❌ Authorization Failed</h1>
            <p><strong>Error:</strong> ${error}</p>
            ${errorDescription ? `<p><strong>Description:</strong> ${errorDescription}</p>` : ''}
            <p>You can close this window and try again.</p>
          </body>
        </html>
      `);
      return;
    }

    if (!code) {
      res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #e74c3c;">❌ Missing Authorization Code</h1>
            <p>No authorization code received from the OAuth provider.</p>
            <p>You can close this window and try again.</p>
          </body>
        </html>
      `);
      return;
    }

    try {
      // Exchange code for tokens
      const tokens = await oauthClient.exchangeCodeForTokens(code);
      
      // Store tokens
      if (tokenStorage) {
        await tokenStorage.storeTokens(tokens);
      }

      res.status(200).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #27ae60;">✅ Authorization Successful</h1>
            <p>Your access token has been saved successfully!</p>
            <p>You can close this window and continue using the MCP server.</p>
            <script>
              setTimeout(() => window.close(), 3000);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Token exchange failed:', error);
      res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #e74c3c;">❌ Token Exchange Failed</h1>
            <p>Failed to exchange authorization code for access token.</p>
            <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p>You can close this window and try again.</p>
          </body>
        </html>
      `);
    }
  });

  app.listen(options.port, options.host, (error) => {
    if (error) {
      console.error('Server error:', error);
      process.exit(1);
    }
    console.log(`Server is running on port ${options.port}`);
    console.log(`SSE endpoint: http://${options.host}:${options.port}/sse`);
    if (oauthClient) {
      console.log('Authorization URL: ', oauthClient.generateAuthUrl({ state: 'test' }));
      console.log(`OAuth callback: http://${options.host}:${options.port}/oauth/callback`);
    }
  });
}
