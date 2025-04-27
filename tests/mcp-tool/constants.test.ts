import { defaultToolNames } from '../../src/mcp-tool/constants';

describe('constants', () => {
  describe('defaultToolNames', () => {
    it('should be an array', () => {
      expect(Array.isArray(defaultToolNames)).toBe(true);
    });

    it('should contain expected tool names', () => {
      // 检查是否包含一些核心工具
      expect(defaultToolNames).toContain('im.v1.message.create');
      expect(defaultToolNames).toContain('im.v1.chat.create');
      expect(defaultToolNames).toContain('bitable.v1.app.create');
      expect(defaultToolNames).toContain('wiki.v1.node.search');
    });

    it('should have more than 5 tools', () => {
      expect(defaultToolNames.length).toBeGreaterThan(5);
    });
  });
});
