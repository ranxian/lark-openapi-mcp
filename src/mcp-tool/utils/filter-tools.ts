import { ToolName, ProjectName } from '../tools';
import { McpTool, ToolsFilterOptions } from '../types';

export function filterTools(tools: McpTool[], options: ToolsFilterOptions) {
  return tools.filter(
    (tool) =>
      options.allowTools?.includes(tool.name as ToolName) ||
      options.allowProjects?.includes(tool.project as ProjectName),
  );
}
