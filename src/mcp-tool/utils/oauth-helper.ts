/**
 * Helper function to generate OAuth authorization URL
 */
export function generateOAuthUrl(config: any, defaultRedirectUri?: string): string {
  const app_id = config?.appId;
  const domain = config?.domain || 'https://open.feishu.cn';
  
  if (!app_id) {
    throw new Error('App ID not found in client configuration');
  }

  // Use default redirect URI if not provided
  const redirect_uri = defaultRedirectUri || 'http://localhost:3000/oauth/callback';
  const scope = 'im:message contact:user.id';

  const authUrl = new URL('/open-apis/authen/v1/authorize', domain);
  authUrl.searchParams.set('app_id', app_id);
  authUrl.searchParams.set('redirect_uri', redirect_uri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('response_type', 'code');

  return authUrl.toString();
}

/**
 * Check if error indicates invalid or expired user access token
 */
export function isTokenError(error: any): boolean {
  const errorData = error?.response?.data;
  const errorCode = errorData?.code;
  const errorMsg = errorData?.msg || error?.message || '';

  // Common Feishu error codes for invalid/expired tokens
  const tokenErrorCodes = [
    99991663, // invalid user access token
    99991664, // user access token expired
    99991665, // invalid token
    99991671, // token expired
  ];

  // Check error code
  if (tokenErrorCodes.includes(errorCode)) {
    return true;
  }

  // Check error message patterns
  const tokenErrorPatterns = [
    'invalid.*token',
    'token.*expired',
    'token.*invalid',
    'unauthorized',
    'authentication.*failed',
  ];

  return tokenErrorPatterns.some(pattern => 
    new RegExp(pattern, 'i').test(errorMsg)
  );
}

/**
 * Format OAuth error response with callback URL
 */
export function formatOAuthErrorResponse(config: any, originalError: any, defaultRedirectUri?: string) {
  try {
    const oauthUrl = generateOAuthUrl(config, defaultRedirectUri);
    
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: `Authentication required: User access token is invalid or expired.\n\nPlease visit this URL to authorize the application:\n${oauthUrl}\n\nAfter authorization, you will be redirected to: ${defaultRedirectUri || 'http://localhost:3000/oauth/callback'}\nUse the authorization code to obtain a new access token.\n\nOriginal error: ${JSON.stringify(originalError?.response?.data || originalError?.message || originalError)}`,
        },
      ],
    };
  } catch (oauthError) {
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: `Authentication error and failed to generate OAuth URL: ${JSON.stringify(originalError?.response?.data || originalError?.message || originalError)}`,
        },
      ],
    };
  }
}