import { ToolName } from './tools';

/**
 * 精选工具，MCP常用工具
 */
export const defaultToolNames: ToolName[] = [
  'im.v1.chat.create', // 创建群
  'im.v1.chat.list', // 获取群列表
  'im.v1.chatMembers.get', // 获取群成员

  'im.v1.message.create', // 发送消息
  'im.v1.message.list', // 获取消息列表

  'wiki.v2.space.getNode', // 获取知识库节点
  'wiki.v1.node.search', // 搜索知识库节点

  'docx.v1.document.rawContent', // 获取文档内容
  'drive.v1.permissionMember.create', // 添加协作者权限
  'docx.builtin.import', // 导入文档
  'docx.builtin.search', // 搜索文档

  // 多维表格

  'bitable.v1.app.create', // 创建多维表格
  'bitable.v1.appTable.create', // 创建多维表格数据表
  'bitable.v1.appTable.list', // 获取多维表格数据表列表
  'bitable.v1.appTableField.list', // 获取多维表格数据表字段列表
  'bitable.v1.appTableRecord.search', // 搜索多维表格数据表记录
  'bitable.v1.appTableRecord.create', // 创建多维表格数据表记录
  'bitable.v1.appTableRecord.update', // 更新多维表格数据表记录

  // 通讯录
  'contact.v3.user.batchGetId', // 批量获取用户ID
];
