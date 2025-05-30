import { McpTool } from '../../../../types';
import { z } from 'zod';

export type authBuiltinToolName = 'auth.builtin.getOAuthUrl' | 'auth.builtin.exchangeCode';

export const larkAuthBuiltinGetOAuthUrlTool: McpTool = {
  project: 'auth',
  name: 'auth.builtin.getOAuthUrl',
  accessTokens: [],
  description:
    '[Feishu/Lark] - Generate OAuth URL - Generate OAuth authorization URL for user authentication when token is expired or missing',
  schema: {
    data: z.object({
      redirect_uri: z.string().describe('OAuth redirect URI where the authorization code will be sent'),
      scope: z
        .string()
        .describe('OAuth scopes separated by spaces (e.g., "im:message contact:user.id")')
        .optional()
        .default('im:message contact:user.id'),
      state: z.string().describe('State parameter for security (optional)').optional(),
    }),
  },
  customHandler: async (client, params): Promise<any> => {
    try {
      const { data } = params;
      const { redirect_uri, scope = 'im:message contact:user.id', state } = data;
      
      // Get app_id from client configuration
      const config = (client as any).config;
      const app_id = config?.appId;
      
      if (!app_id) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: 'Error: App ID not found in client configuration',
            },
          ],
        };
      }

      // Get domain from client configuration or use default
      const domain = config?.domain || 'https://open.feishu.cn';
      
      // Build OAuth URL
      const authUrl = new URL('/open-apis/authen/v1/authorize', domain);
      authUrl.searchParams.set('app_id', app_id);
      authUrl.searchParams.set('redirect_uri', redirect_uri);
      authUrl.searchParams.set('scope', scope);
      authUrl.searchParams.set('response_type', 'code');
      
      if (state) {
        authUrl.searchParams.set('state', state);
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `OAuth authorization URL generated successfully. Please visit this URL to authorize the application:\n\n${authUrl.toString()}\n\nAfter authorization, you will be redirected to: ${redirect_uri}\nThe authorization code can be exchanged for an access token using the Feishu OAuth API.`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text' as const,
            text: `Failed to generate OAuth URL: ${JSON.stringify((error as any)?.response?.data || error)}`,
          },
        ],
      };
    }
  },
};

export const larkAuthBuiltinExchangeCodeTool: McpTool = {
  project: 'auth',
  name: 'auth.builtin.exchangeCode',
  accessTokens: [],
  description:
    '[Feishu/Lark] - Exchange OAuth Code - Exchange authorization code for user access token with auto-refresh capability',
  schema: {
    data: z.object({
      code: z.string().describe('Authorization code received from OAuth callback'),
      redirect_uri: z.string().describe('OAuth redirect URI (must match the one used in authorization request)'),
    }),
  },
  customHandler: async (client, params, options): Promise<any> => {
    try {
      const { data } = params;
      const { code, redirect_uri } = data;
      
      // Get the LarkMcpTool instance from the context if available
      // This is a workaround to access the token manager
      const larkMcpTool = (options as any)?.larkMcpTool;
      
      if (larkMcpTool && typeof larkMcpTool.exchangeOAuthCode === 'function') {
        // Use the token manager for auto-refresh capability
        const tokenInfo = await larkMcpTool.exchangeOAuthCode(code, redirect_uri);
        
        return {
          content: [
            {
              type: 'text' as const,
              text: `OAuth token exchange successful with auto-refresh enabled!\n\nAccess Token: ${tokenInfo.access_token}\nExpires In: ${tokenInfo.expires_in} seconds\nToken Type: ${tokenInfo.token_type}\nScope: ${tokenInfo.scope}\n\nThe token will be automatically refreshed before expiration.`,
            },
          ],
        };
      } else {
        // Fallback to direct API call without auto-refresh
        const config = (client as any).config;
        const app_id = config?.appId;
        const app_secret = config?.appSecret;
        
        if (!app_id || !app_secret) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: 'Error: App ID or App Secret not found in client configuration',
              },
            ],
          };
        }

        const response = await client.request({
          method: 'POST',
          url: '/open-apis/authen/v1/oidc/access_token',
          data: {
            grant_type: 'authorization_code',
            client_id: app_id,
            client_secret: app_secret,
            code,
            redirect_uri,
          },
        });

        const tokenData = response.data;
        
        if (tokenData.code === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `OAuth token exchange successful!\n\nAccess Token: ${tokenData.data.access_token}\nRefresh Token: ${tokenData.data.refresh_token}\nExpires In: ${tokenData.data.expires_in} seconds\nToken Type: ${tokenData.data.token_type}\nScope: ${tokenData.data.scope}\n\nNote: Auto-refresh is not enabled. Use setUserTokenInfo() method for auto-refresh capability.`,
              },
            ],
          };
        } else {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `OAuth token exchange failed: ${tokenData.msg} (code: ${tokenData.code})`,
              },
            ],
          };
        }
      }
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text' as const,
            text: `Failed to exchange OAuth code: ${JSON.stringify((error as any)?.response?.data || error)}`,
          },
        ],
      };
    }
  },
};

export const authBuiltinTools = [larkAuthBuiltinGetOAuthUrlTool, larkAuthBuiltinExchangeCodeTool];