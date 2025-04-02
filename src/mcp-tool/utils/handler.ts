import * as lark from '@larksuiteoapi/node-sdk';
import { McpHandler } from '../types';

const sdkFuncCall: McpHandler = async (client, params, options) => {
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

  let response: any = {};
  if (userAccessToken && params?.useUAT) {
    response = await func(params, lark.withUserAccessToken(userAccessToken));
  } else {
    response = await func(params);
  }
  return response;
};

export const larkOapiHandler: McpHandler = async (client, params, options) => {
  try {
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
