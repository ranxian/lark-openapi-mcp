import { getShouldUseUAT } from '../../../src/mcp-tool/utils/get-should-use-uat';
import { TokenMode } from '../../../src/mcp-tool/types';

describe('getShouldUseUAT', () => {
  describe('USER_ACCESS_TOKEN 模式', () => {
    it('当有 userAccessToken 时应返回 true', () => {
      expect(getShouldUseUAT(TokenMode.USER_ACCESS_TOKEN, 'token', false)).toBe(true);
      expect(getShouldUseUAT(TokenMode.USER_ACCESS_TOKEN, 'token', true)).toBe(true);
    });

    it('当没有 userAccessToken 时仍应返回 true', () => {
      expect(getShouldUseUAT(TokenMode.USER_ACCESS_TOKEN, undefined, false)).toBe(true);
      expect(getShouldUseUAT(TokenMode.USER_ACCESS_TOKEN, undefined, true)).toBe(true);
    });
  });

  describe('TENANT_ACCESS_TOKEN 模式', () => {
    it('无论参数如何都应返回 false', () => {
      expect(getShouldUseUAT(TokenMode.TENANT_ACCESS_TOKEN, undefined, false)).toBe(false);
      expect(getShouldUseUAT(TokenMode.TENANT_ACCESS_TOKEN, undefined, true)).toBe(false);
      expect(getShouldUseUAT(TokenMode.TENANT_ACCESS_TOKEN, 'token', false)).toBe(false);
      expect(getShouldUseUAT(TokenMode.TENANT_ACCESS_TOKEN, 'token', true)).toBe(false);
    });
  });

  describe('AUTO 模式', () => {
    it('当有 userAccessToken 且 useUAT 为 true 时应返回 true', () => {
      expect(getShouldUseUAT(TokenMode.AUTO, 'token', true)).toBe(true);
    });

    it('在其他情况下应返回 false', () => {
      expect(getShouldUseUAT(TokenMode.AUTO, undefined, true)).toBe(false);
      expect(getShouldUseUAT(TokenMode.AUTO, undefined, false)).toBe(false);
      expect(getShouldUseUAT(TokenMode.AUTO, 'token', false)).toBe(false);
    });
  });
});
