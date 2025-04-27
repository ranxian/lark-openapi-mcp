/**
 * Commonly used tools in MCP
 */

import { ToolName } from './tools';

export enum PresetName {
  /**
   * Default preset including IM, Bitable, Doc and Contact tools
   */
  DEFAULT = 'preset.default',
  /**
   * IM related tools for chat and message operations
   */
  IM_DEFAULT = 'preset.im.default',
  /**
   * Bitable standard tools for table operations
   */
  BITABLE_DEFAULT = 'preset.bitable.default',
  /**
   * Bitable tools with batch record operations
   */
  BITABLE_BATCH = 'preset.bitable.batch',
  /**
   * Document related tools for content and permission operations
   */
  DOC_DEFAULT = 'preset.doc.default',
  /**
   * Task management related tools
   */
  TASK_DEFAULT = 'preset.task.default',
  /**
   * Calendar event management tools
   */
  CALENDAR_DEFAULT = 'preset.calendar.default',
}

export const presetContactToolNames: ToolName[] = ['contact.v3.user.batchGetId'];

export const presetImToolNames: ToolName[] = [
  'im.v1.chat.create',
  'im.v1.chat.list',
  'im.v1.chatMembers.get',
  'im.v1.message.create',
  'im.v1.message.list',
];

export const presetBitableCommonToolNames: ToolName[] = [
  'bitable.v1.app.create',
  'bitable.v1.appTable.create',
  'bitable.v1.appTable.list',
  'bitable.v1.appTableField.list',
  'bitable.v1.appTableRecord.search',
];

export const presetBitableToolNames: ToolName[] = [
  ...presetBitableCommonToolNames,
  'bitable.v1.appTableRecord.create',
  'bitable.v1.appTableRecord.update',
];

export const presetBitableRecordBatchToolNames: ToolName[] = [
  ...presetBitableCommonToolNames,
  'bitable.v1.appTableRecord.batchCreate',
  'bitable.v1.appTableRecord.batchUpdate',
];

export const presetDocToolNames: ToolName[] = [
  'docx.v1.document.rawContent',
  'docx.builtin.import',
  'docx.builtin.search',
  'drive.v1.permissionMember.create',
  'wiki.v2.space.getNode',
  'wiki.v1.node.search',
];

export const presetTaskToolNames: ToolName[] = [
  'task.v2.task.create',
  'task.v2.task.patch',
  'task.v2.task.addMembers',
  'task.v2.task.addReminders',
];

export const presetCalendarToolNames: ToolName[] = [
  'calendar.v4.calendarEvent.create',
  'calendar.v4.calendarEvent.patch',
  'calendar.v4.calendarEvent.get',
  'calendar.v4.freebusy.list',
  'calendar.v4.calendar.primary',
];

export const defaultToolNames: ToolName[] = [
  ...presetImToolNames,
  ...presetBitableToolNames,
  ...presetDocToolNames,
  ...presetContactToolNames,
];

export const presetTools: Record<PresetName, ToolName[]> = {
  [PresetName.DEFAULT]: defaultToolNames,
  [PresetName.IM_DEFAULT]: presetImToolNames,
  [PresetName.BITABLE_DEFAULT]: presetBitableToolNames,
  [PresetName.BITABLE_BATCH]: presetBitableRecordBatchToolNames,
  [PresetName.DOC_DEFAULT]: presetDocToolNames,
  [PresetName.TASK_DEFAULT]: presetTaskToolNames,
  [PresetName.CALENDAR_DEFAULT]: presetCalendarToolNames,
};
