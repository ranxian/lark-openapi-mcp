# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lark OpenAPI MCP is a tool designed to integrate Feishu/Lark platform APIs with AI assistants through the Model Context Protocol (MCP). It allows AI models to interact directly with Feishu/Lark services like documents, messaging, calendars, and more.

The tool provides MCP-compatible interfaces for almost all Feishu/Lark APIs, enabling AI assistants to perform various automation tasks within the Feishu/Lark ecosystem.

## Development Commands

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Format code with prettier
npm run format

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

The project is organized into several key directories:

- `/src`
  - `/mcp-server` - Server implementation for MCP protocol
    - `/shared` - Shared server utilities and types
    - `stdio.ts` - Standard I/O mode implementation
    - `sse.ts` - Server-Sent Events mode implementation
  - `/mcp-tool` - Core tool implementation
    - `/tools` - API tool definitions 
      - `/en` - English tool definitions
      - `/zh` - Chinese tool definitions
    - `/utils` - Utility functions for tools 
  - `/utils` - General utilities
    - `oauth.ts` - OAuth implementation
    - `token-storage.ts` - Token storage and management
    - `http-instance.ts` - HTTP client configuration

## Architecture

The project implements a Model Context Protocol (MCP) server that exposes Feishu/Lark APIs as tools for AI models. The architecture consists of:

1. **MCP Server** - Handles communication between AI models and Feishu/Lark APIs. Supports two transport modes:
   - Standard I/O (stdio) mode for direct integration with AI tools
   - Server-Sent Events (SSE) mode for HTTP-based communication

2. **Tool Registry** - Defines and registers API tools with the MCP server, converting Feishu/Lark APIs into MCP-compatible tools.

3. **Authentication** - Supports both application-level and user-level authentication:
   - App Access Token authentication using App ID and Secret
   - User Access Token authentication via OAuth 2.0
   - Token refresh and storage

4. **Tool Configuration** - Enables customization of API tool sets through presets and individual tool selection.

## Key Files

- `src/cli.ts` - Command-line interface for the tool
- `src/index.ts` - Main entry point for the module
- `src/mcp-server/shared/init.ts` - MCP server initialization logic
- `src/mcp-tool/mcp-tool.ts` - Core tool implementation
- `src/utils/oauth.ts` - OAuth implementation for user authentication
- `src/utils/token-storage.ts` - Token storage and refresh management

## Authentication Flow

The project supports two authentication methods:

1. **App-Level Auth** - Uses App ID and App Secret to generate tenant_access_token
2. **User-Level Auth** - Uses OAuth 2.0 to obtain and manage user_access_token

The OAuth implementation provides:
- Authorization URL generation
- Code exchange for tokens
- Token refresh handling
- Secure local token storage

## Core Components

### LarkMcpTool

The `LarkMcpTool` class is the central component that:
1. Initializes the Lark client
2. Filters and configures available tools
3. Handles token management and OAuth
4. Registers tools with the MCP server

### McpServer Initialization

The `initMcpServer` function:
1. Creates an MCP server instance
2. Initializes the LarkMcpTool with proper configuration
3. Sets up OAuth callback if needed
4. Registers all tools with the server

### Token Storage and Management

The `TokenStorage` class:
1. Securely stores OAuth tokens locally
2. Handles token expiration and refresh
3. Provides access to valid tokens when needed

## Working with the Codebase

When working with this codebase, keep in mind:

1. Tools are defined as MCP-compatible interfaces that wrap Feishu/Lark APIs
2. Most tools use the standard handler (`larkOapiHandler`), but some have custom implementations
3. OAuth implementation includes token refresh and secure storage
4. The project supports both CLI usage and programmatic usage
5. Testing follows Jest conventions with separate test files for each module

- This project is built by `yarn build`