import { docxBuiltinToolName, docxBuiltinTools } from './docx/builtin';
import { imBuiltinToolName, imBuiltinTools } from './im/buildin';
import { authBuiltinToolName, authBuiltinTools } from './auth/builtin';

export const BuiltinTools = [...docxBuiltinTools, ...imBuiltinTools, ...authBuiltinTools];

export type BuiltinToolName = docxBuiltinToolName | imBuiltinToolName | authBuiltinToolName;
