#!/usr/bin/env node

import fs from 'fs';
import dotenv from 'dotenv';
import { Command } from 'commander';
import express, { Request, Response } from 'express';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { currentVersion } from './utils/version';
import { initMcpServer } from './mcp-server/shared';

dotenv.config();

const program = new Command();

program.name('lark-mcp').description('Feishu/Lark MCP Tool').version(currentVersion);

program
  .command('mcp')
  .description('Start Feishu/Lark MCP Service')
  .option('-a, --app-id <appId>', 'Feishu/Lark App ID')
  .option('-s, --app-secret <appSecret>', 'Feishu/Lark App Secret')
  .option('-d, --domain <domain>', 'Feishu/Lark Domain', 'https://open.feishu.cn')
  .option('-t, --tools <tools>', 'Allowed Tools List, separated by commas')
  .option('-c, --tool-name-case <toolNameCase>', 'Tool Name Case, snake or camel or kebab or dot', 'snake')
  .option('-l, --language <language>', 'Tools Language, zh or en', 'en')
  .option('-u, --user-access-token <userAccessToken>', 'User Access Token (beta)')
  .option('-m, --mode <mode>', 'Transport Mode, stdio or sse', 'stdio')
  .option('--host <host>', 'Host to listen', 'localhost')
  .option('-p, --port <port>', 'Port to listen in sse mode', '3000')
  .option('--config <configPath>', 'Config file path (JSON)')
  .action(async (options) => {
    let fileOptions = {};
    if (options.config) {
      try {
        const configContent = fs.readFileSync(options.config, 'utf-8');
        fileOptions = JSON.parse(configContent);
      } catch (err) {
        console.error('Failed to read config file:', err);
        process.exit(1);
      }
    }
    // 合并配置，命令行参数优先
    const mergedOptions = { ...fileOptions, ...options };
    const { mcpServer } = initMcpServer(mergedOptions);

    if (options.mode === 'stdio') {
      const transport = new StdioServerTransport();
      mcpServer.connect(transport).catch((error) => {
        console.error('MCP Connect Error:', error);
        process.exit(1);
      });
    } else if (options.mode === 'sse') {
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
    } else {
      console.error('Invalid mode:', options.mode);
      process.exit(1);
    }
  });

if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);

export { program };
