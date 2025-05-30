import { McpTool } from '../../../../types';
import { z } from 'zod';

export type authBuiltinToolName = 'auth.builtin.getOAuthUrl' | 'auth.builtin.exchangeCode';

export const larkAuthBuiltinGetOAuthUrlTool: McpTool = {
  project: 'auth',
  name: 'auth.builtin.getOAuthUrl',
  accessTokens: [],
  description:
    '[飞书/Lark] - 生成OAuth URL - 当令牌过期或缺失时生成用户认证的OAuth授权URL',
  schema: {
    data: z.object({
      redirect_uri: z.string().describe('OAuth重定向URI，授权码将发送到此地址'),
      scope: z
        .string()
        .describe('OAuth权限范围，用空格分隔 (例如: "im:message contact:user.id")')
        .optional()
        .default('im:message contact:user.id'),
      state: z.string().describe('状态参数用于安全验证 (可选)').optional(),
    }),
  },
  customHandler: async (client, params): Promise<any> => {
    try {
      const { data } = params;
      const { redirect_uri, scope = 'im:message contact:user.id', state } = data;
      
      // 从客户端配置获取app_id
      const config = (client as any).config;
      const app_id = config?.appId;
      
      if (!app_id) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: '错误：在客户端配置中找不到App ID',
            },
          ],
        };
      }

      // 从客户端配置获取域名或使用默认值
      const domain = config?.domain || 'https://open.feishu.cn';
      
      // 构建OAuth URL
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
            text: `OAuth授权URL生成成功。请访问此URL来授权应用：\n\n${authUrl.toString()}\n\n授权后，您将被重定向到：${redirect_uri}\n授权码可以通过飞书OAuth API交换为访问令牌。`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text' as const,
            text: `生成OAuth URL失败：${JSON.stringify((error as any)?.response?.data || error)}`,
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
    '[飞书/Lark] - 交换OAuth授权码 - 使用授权码获取用户访问令牌并启用自动刷新功能',
  schema: {
    data: z.object({
      code: z.string().describe('从OAuth回调接收到的授权码'),
      redirect_uri: z.string().describe('OAuth重定向URI（必须与授权请求中使用的相同）'),
    }),
  },
  customHandler: async (client, params, options): Promise<any> => {
    try {
      const { data } = params;
      const { code, redirect_uri } = data;
      
      // 从上下文获取LarkMcpTool实例（如果可用）
      // 这是访问令牌管理器的一种解决方案
      const larkMcpTool = (options as any)?.larkMcpTool;
      
      if (larkMcpTool && typeof larkMcpTool.exchangeOAuthCode === 'function') {
        // 使用令牌管理器来获得自动刷新功能
        const tokenInfo = await larkMcpTool.exchangeOAuthCode(code, redirect_uri);
        
        return {
          content: [
            {
              type: 'text' as const,
              text: `OAuth令牌交换成功，已启用自动刷新！\n\n访问令牌：${tokenInfo.access_token}\n过期时间：${tokenInfo.expires_in} 秒\n令牌类型：${tokenInfo.token_type}\n权限范围：${tokenInfo.scope}\n\n令牌将在过期前自动刷新。`,
            },
          ],
        };
      } else {
        // 回退到直接API调用，不启用自动刷新
        const config = (client as any).config;
        const app_id = config?.appId;
        const app_secret = config?.appSecret;
        
        if (!app_id || !app_secret) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: '错误：在客户端配置中找不到App ID或App Secret',
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
                text: `OAuth令牌交换成功！\n\n访问令牌：${tokenData.data.access_token}\n刷新令牌：${tokenData.data.refresh_token}\n过期时间：${tokenData.data.expires_in} 秒\n令牌类型：${tokenData.data.token_type}\n权限范围：${tokenData.data.scope}\n\n注意：未启用自动刷新。请使用setUserTokenInfo()方法来启用自动刷新功能。`,
              },
            ],
          };
        } else {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `OAuth令牌交换失败：${tokenData.msg} (代码: ${tokenData.code})`,
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
            text: `交换OAuth授权码失败：${JSON.stringify((error as any)?.response?.data || error)}`,
          },
        ],
      };
    }
  },
};

export const authBuiltinTools = [larkAuthBuiltinGetOAuthUrlTool, larkAuthBuiltinExchangeCodeTool];