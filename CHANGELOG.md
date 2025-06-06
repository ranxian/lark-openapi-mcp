# 0.3.1
Fix: 修复使用 configFile 配置 mode 参数不生效的问题
Fix: 修复由于使用了z.record(z.any())类型的字段导致直接传给豆包模型无法使用的问题
Feat: 新增 preset.light 预设

Fix: Fix the problem that the mode parameter configured by configFile does not take effect
Fix: Fix the problem that the z.record(z.any()) type field is passed directly to the doubao model and cannot be used
Feat: Add preset.light preset

# 0.3.0

New: 开放平台开发文档检索 MCP，旨在帮助用户输入自身诉求后迅速检索到自己需要的开发文档，帮助开发者在AI IDE中编写与飞书集成的代码
New: 新增--token-mode，现在可以在启动的时候指定调用API的token类型，支持auto/tenant_access_token/user_access_token
New: -t 支持配置 preset.default preset.im.default preset.bitable.default preset.doc.default 等默认预设
Bump： 升级 @modelcontextprotocol/sdk 到 1.11.0

New：Retrieval of Open Platform Development Documents in MCP aims to enable users to quickly find the development documents they need after inputting their own requirements, and assist developers in writing code integrated with Feishu in the AI IDE.
New: Added --token-mode, now you can specify the API token type when starting, supporting auto/tenant_access_token/user_access_token
New: -t supports configuring preset.default preset.im.default preset.bitable.default preset.doc.default etc.
Bump: Upgraded @modelcontextprotocol/sdk to 1.11.0

# 0.2.0

飞书/Lark OpenAPI MCP 工具，可以帮助你快速开始使用MCP协议连接飞书/Lark，实现 Agent 与飞书/Lark平台的高效协作

Feishu/Lark OpenAPI MCP tool helps you quickly start using the MCP protocol to connect with Feishu/Lark, enabling efficient collaboration between Agent and the Feishu/Lark platform