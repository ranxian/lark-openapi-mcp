import * as lark from '@larksuiteoapi/node-sdk';
import { McpHandler, McpHandlerOptions } from '../types';
import { isTokenError, formatOAuthErrorResponse } from './oauth-helper';

const sdkFuncCall = async (client: lark.Client, params: any, options: McpHandlerOptions) => {
  const { tool, userAccessToken } = options || {};
  const { sdkName, path, httpMethod } = tool || {};

  if (!sdkName) {
    throw new Error('Invalid sdkName');
  }

  const chain = sdkName.split('.');
  let func: any = client;
  for (const element of chain) {
    func = func[element as keyof typeof func];
    if (!func) {
      func = async (params: any, ...args: any) =>
        await client.request({ method: httpMethod, url: path, ...params }, ...args);
      break;
    }
  }
  if (!(func instanceof Function)) {
    func = async (params: any, ...args: any) =>
      await client.request({ method: httpMethod, url: path, ...params }, ...args);
  }

  if (params?.useUAT) {
    if (!userAccessToken) {
      throw new Error('Invalid UserAccessToken');
    }
    return await func(params, lark.withUserAccessToken(userAccessToken));
  }
  return await func(params);
};

export const larkOapiHandler: McpHandler = async (client, params, options) => {
  try {
    // Check token expiration before making the request
    if (params?.useUAT && options?.larkMcpTool) {
      const larkMcpTool = options.larkMcpTool;
      if (typeof larkMcpTool.isTokenExpired === 'function' && larkMcpTool.isTokenExpired()) {
        // Try to refresh token automatically
        if (typeof larkMcpTool.refreshUserToken === 'function') {
          try {
            await larkMcpTool.refreshUserToken();
            // Update the userAccessToken in options after refresh
            options.userAccessToken = larkMcpTool.getTokenInfo()?.access_token;
          } catch (refreshError) {
            // If refresh fails, return OAuth URL
            const config = (client as any).config;
            return formatOAuthErrorResponse(config, refreshError);
          }
        }
      }
    }
    
    const response = await sdkFuncCall(client, params, options);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Success: ${JSON.stringify(response?.data ?? response)}`,
        },
      ],
    };
  } catch (error) {
    // Check if this is a token-related error for user access token operations
    if (params?.useUAT && isTokenError(error)) {
      // Try to refresh token if we have the token manager
      if (options?.larkMcpTool && typeof options.larkMcpTool.refreshUserToken === 'function') {
        try {
          await options.larkMcpTool.refreshUserToken();
          // Retry the request with the new token
          const newOptions = {
            ...options,
            userAccessToken: options.larkMcpTool.getTokenInfo()?.access_token,
          };
          const retryResponse = await sdkFuncCall(client, params, newOptions);
          return {
            content: [
              {
                type: 'text' as const,
                text: `Success (after token refresh): ${JSON.stringify(retryResponse?.data ?? retryResponse)}`,
              },
            ],
          };
        } catch (refreshError) {
          // If refresh fails, fall through to OAuth URL generation
        }
      }
      
      // Get client config for OAuth URL generation
      const config = (client as any).config;
      return formatOAuthErrorResponse(config, error);
    }
    
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: `Error: ${JSON.stringify((error as any)?.response?.data || (error as any)?.message || error)}`,
        },
      ],
    };
  }
};
