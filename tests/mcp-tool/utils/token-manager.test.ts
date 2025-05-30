import { Client } from '@larksuiteoapi/node-sdk';
import { UserTokenManager, UserTokenInfo } from '../../../src/mcp-tool/utils/token-manager';

// Mock the Client
jest.mock('@larksuiteoapi/node-sdk');

describe('UserTokenManager', () => {
  let mockClient: jest.Mocked<Client>;
  let tokenManager: UserTokenManager;
  let mockCallback: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = new Client({ appId: 'test-app-id', appSecret: 'test-app-secret' }) as jest.Mocked<Client>;
    (mockClient as any).config = { appId: 'test-app-id', appSecret: 'test-app-secret' };
    mockCallback = jest.fn();
    tokenManager = new UserTokenManager(mockClient, mockCallback);
  });

  afterEach(() => {
    tokenManager.stop(); // Clean up timers
  });

  describe('setTokenInfo', () => {
    it('should set token info and schedule refresh', () => {
      const tokenInfo: Omit<UserTokenInfo, 'created_at'> = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'test-scope',
      };

      tokenManager.setTokenInfo(tokenInfo);

      expect(tokenManager.getAccessToken()).toBe('test-access-token');
      expect(tokenManager.getTokenInfo()).toMatchObject(tokenInfo);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true when no token is set', () => {
      expect(tokenManager.isTokenExpired()).toBe(true);
    });

    it('should return false for fresh token', () => {
      const tokenInfo: Omit<UserTokenInfo, 'created_at'> = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600, // 1 hour
        token_type: 'Bearer',
        scope: 'test-scope',
      };

      tokenManager.setTokenInfo(tokenInfo);
      expect(tokenManager.isTokenExpired()).toBe(false);
    });

    it('should return true for expired token', () => {
      const tokenInfo: Omit<UserTokenInfo, 'created_at'> = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 60, // 1 minute
        token_type: 'Bearer',
        scope: 'test-scope',
      };

      // Manually set an old created_at time
      tokenManager.setTokenInfo(tokenInfo);
      const fullTokenInfo = tokenManager.getTokenInfo()!;
      (fullTokenInfo as any).created_at = Date.now() - 3600000; // 1 hour ago

      expect(tokenManager.isTokenExpired()).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should stop timers when stop() is called', () => {
      const tokenInfo: Omit<UserTokenInfo, 'created_at'> = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'test-scope',
      };

      tokenManager.setTokenInfo(tokenInfo);
      tokenManager.stop();

      // No way to directly test timer cleanup, but this should not throw
      expect(tokenManager.getTokenInfo()).toMatchObject(tokenInfo);
    });

    it('should clear token info when clear() is called', () => {
      const tokenInfo: Omit<UserTokenInfo, 'created_at'> = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'test-scope',
      };

      tokenManager.setTokenInfo(tokenInfo);
      tokenManager.clear();

      expect(tokenManager.getTokenInfo()).toBe(null);
      expect(tokenManager.getAccessToken()).toBe(null);
    });
  });
});