import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => '{"version":"1.0.0"}'),
}));

jest.mock('path', () => ({
  join: jest.fn(() => '/mock/path/package.json'),
}));

describe('version', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该从package.json读取当前版本', () => {
    // 加载模块
    const { currentVersion } = require('../../src/utils/version');

    // 验证结果
    expect(currentVersion).toBe('1.0.0');
    expect(path.join).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalledWith('/mock/path/package.json', 'utf8');
  });
});
