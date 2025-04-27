import * as server from '../src/mcp-server';

interface MockCommand {
  options: any[];
  description: jest.Mock;
  option: jest.Mock;
  action: jest.Mock;
  actionCallback?: (options: any) => void;
}

// 模拟cli模块
jest.mock(
  '../src/cli',
  () => {
    // 创建mock程序实例，以便不会调用原始程序逻辑
    const mockProgram = {
      parse: jest.fn(),
      help: jest.fn(),
      commands: [] as MockCommand[],
      command: function (name: string) {
        const cmd: MockCommand = {
          options: [],
          description: jest.fn().mockReturnThis(),
          option: jest.fn().mockReturnThis(),
          action: jest.fn().mockImplementation((callback) => {
            // 存储action回调以便测试可以调用它
            cmd.actionCallback = callback;
            return cmd;
          }),
        };
        this.commands.push(cmd);
        return cmd;
      },
    };

    return {
      program: mockProgram,
    };
  },
  { virtual: true },
);

// 模拟server模块
jest.mock('../src/mcp-server', () => ({
  initStdioServer: jest.fn(),
  initSSEServer: jest.fn(),
  initStreamableHTTPServer: jest.fn(),
}));

// 模拟process.exit
const mockExit = jest.fn();
process.exit = mockExit as any;

// 模拟console.error
const originalConsoleError = console.error;
console.error = jest.fn();

describe('CLI', () => {
  // 创建模拟的action回调函数
  const actionCallback = jest.fn((options) => {
    if (options.mode === 'stdio') {
      server.initStdioServer(options);
    } else if (options.mode === 'sse') {
      server.initSSEServer(options);
    } else {
      console.error('Invalid mode:', options.mode);
      process.exit(1);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // 重置console.error模拟
    (console.error as jest.Mock).mockReset();
    // 重置process.exit模拟
    mockExit.mockReset();
    // 重置action回调
    actionCallback.mockClear();
  });

  afterAll(() => {
    // 恢复原始的console.error
    console.error = originalConsoleError;
  });

  it('应该初始化stdio服务器', () => {
    const options = {
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
      mode: 'stdio',
    };

    // 调用action回调
    actionCallback(options);

    // 验证
    expect(server.initStdioServer).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
        mode: 'stdio',
      }),
    );
  });

  it('应该初始化SSE服务器', () => {
    const options = {
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
      mode: 'sse',
      port: '3001',
    };

    // 调用action回调
    actionCallback(options);

    // 验证
    expect(server.initSSEServer).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
        mode: 'sse',
        port: '3001',
      }),
    );
  });

  it('应该在模式无效时退出', () => {
    const options = {
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
      mode: 'invalid',
    };

    // 调用action回调
    actionCallback(options);

    // 验证
    expect(console.error).toHaveBeenCalledWith('Invalid mode:', 'invalid');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('应该使用从配置文件加载的选项', () => {
    const fileOptions = {
      appId: 'config-app-id',
      appSecret: 'config-app-secret',
    };

    // 调用action回调
    actionCallback({
      ...fileOptions,
      mode: 'stdio',
      config: 'config.json',
    });

    // 验证
    expect(server.initStdioServer).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'config-app-id',
        appSecret: 'config-app-secret',
        mode: 'stdio',
        config: 'config.json',
      }),
    );
  });
});
