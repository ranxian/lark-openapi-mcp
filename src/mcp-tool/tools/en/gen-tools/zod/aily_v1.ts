import { z } from 'zod';
export type ailyV1ToolName =
  | 'aily.v1.ailySessionAilyMessage.create'
  | 'aily.v1.ailySessionAilyMessage.get'
  | 'aily.v1.ailySessionAilyMessage.list'
  | 'aily.v1.ailySession.create'
  | 'aily.v1.ailySession.delete'
  | 'aily.v1.ailySession.get'
  | 'aily.v1.ailySessionRun.cancel'
  | 'aily.v1.ailySessionRun.create'
  | 'aily.v1.ailySessionRun.get'
  | 'aily.v1.ailySessionRun.list'
  | 'aily.v1.ailySession.update'
  | 'aily.v1.appDataAssetTag.list'
  | 'aily.v1.appDataAsset.list'
  | 'aily.v1.appKnowledge.ask'
  | 'aily.v1.appSkill.get'
  | 'aily.v1.appSkill.list'
  | 'aily.v1.appSkill.start';
export const ailyV1AilySessionAilyMessageCreate = {
  project: 'aily',
  name: 'aily.v1.ailySessionAilyMessage.create',
  sdkName: 'aily.v1.ailySessionAilyMessage.create',
  path: '/open-apis/aily/v1/sessions/:aily_session_id/messages',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-aily-message-Send aily message-The API is used to send a message to a Feishu smart partner application; each message belongs to an active session',
  accessTokens: ['tenant', 'user'],
  schema: {
    data: z.object({
      idempotent_id: z
        .string()
        .describe('Idempotent id, the same idempotent id in the same session counts as a message, valid period 72h'),
      content_type: z.string().describe('Message content type'),
      content: z.string().describe('Message content'),
      file_ids: z.array(z.string()).describe('List of file IDs contained in the message').optional(),
      quote_message_id: z.string().describe('Referred message ID').optional(),
      mentions: z
        .array(
          z.object({
            entity_id: z.string().describe('Entity ID').optional(),
            identity_provider: z.string().describe('Identity provider').optional(),
            key: z.string().describe('Placeholder for @entity in message body').optional(),
            name: z.string().describe('The name of the @entity').optional(),
            aily_id: z.string().describe('ID under the Aily account system').optional(),
          }),
        )
        .describe('@entity')
        .optional(),
    }),
    path: z.object({ aily_session_id: z.string().describe('Session ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionAilyMessageGet = {
  project: 'aily',
  name: 'aily.v1.ailySessionAilyMessage.get',
  sdkName: 'aily.v1.ailySessionAilyMessage.get',
  path: '/open-apis/aily/v1/sessions/:aily_session_id/messages/:aily_message_id',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-aily-message-Get aily message-This API is used to obtain the detailed information of the message of a Feishu smart partner application; including the content of the message, the sender, and so on',
  accessTokens: ['tenant', 'user'],
  schema: {
    path: z.object({
      aily_session_id: z.string().describe('Session ID'),
      aily_message_id: z.string().describe('Message ID'),
    }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionAilyMessageList = {
  project: 'aily',
  name: 'aily.v1.ailySessionAilyMessage.list',
  sdkName: 'aily.v1.ailySessionAilyMessage.list',
  path: '/open-apis/aily/v1/sessions/:aily_session_id/messages',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-aily-message-List aily messages-This API is used to list the details of the message under a session of a Feishu smart partner application; including the content of the message, the sender, etc',
  accessTokens: ['tenant', 'user'],
  schema: {
    params: z.object({
      page_size: z.number().describe('Page size').optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
      run_id: z.string().describe('Run ID').optional(),
      with_partial_message: z.boolean().describe('Return the message being generated').optional(),
    }),
    path: z.object({ aily_session_id: z.string().describe('Session ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionCreate = {
  project: 'aily',
  name: 'aily.v1.ailySession.create',
  sdkName: 'aily.v1.ailySession.create',
  path: '/open-apis/aily/v1/sessions',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-aily-session-Create session-This API is used to create a session with a Feishu smart partner application; when the session is created successfully, you can send messages, create and run',
  accessTokens: ['tenant', 'user'],
  schema: {
    data: z.object({
      channel_context: z.string().describe('Channel context').optional(),
      metadata: z.string().describe('Other transparent information').optional(),
    }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionDelete = {
  project: 'aily',
  name: 'aily.v1.ailySession.delete',
  sdkName: 'aily.v1.ailySession.delete',
  path: '/open-apis/aily/v1/sessions/:aily_session_id',
  httpMethod: 'DELETE',
  description:
    '[Feishu/Lark]-aily-session-Delete session-This API is used to delete a session with a Feishu Smart Partner application',
  accessTokens: ['tenant', 'user'],
  schema: {
    path: z.object({ aily_session_id: z.string().describe('Session ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionGet = {
  project: 'aily',
  name: 'aily.v1.ailySession.get',
  sdkName: 'aily.v1.ailySession.get',
  path: '/open-apis/aily/v1/sessions/:aily_session_id',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-aily-session-Get session-This API is used to obtain detailed information about a session with a Feishu smart partner application, including the state of the session, channel context, creation time, and so on',
  accessTokens: ['tenant', 'user'],
  schema: {
    path: z.object({ aily_session_id: z.string().describe('Session ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionRunCancel = {
  project: 'aily',
  name: 'aily.v1.ailySessionRun.cancel',
  sdkName: 'aily.v1.ailySessionRun.cancel',
  path: '/open-apis/aily/v1/sessions/:aily_session_id/runs/:run_id/cancel',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-aily-run-Cancel run-This API is used to cancel the run of a Feishu smart partner application',
  accessTokens: ['tenant', 'user'],
  schema: {
    path: z.object({ aily_session_id: z.string().describe('Session ID'), run_id: z.string().describe('Run ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionRunCreate = {
  project: 'aily',
  name: 'aily.v1.ailySessionRun.create',
  sdkName: 'aily.v1.ailySessionRun.create',
  path: '/open-apis/aily/v1/sessions/:aily_session_id/runs',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-aily-run-Create run-This API is used to create a Run on a session of a Feishu Smart Partner application',
  accessTokens: ['tenant', 'user'],
  schema: {
    data: z.object({
      app_id: z.string().describe('App ID'),
      skill_id: z.string().describe('Skill ID').optional(),
      skill_input: z.string().describe('When specifying a skill ID, you can also specify a skill input').optional(),
      metadata: z.string().describe('Other transparent information').optional(),
    }),
    path: z.object({ aily_session_id: z.string().describe('Session ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionRunGet = {
  project: 'aily',
  name: 'aily.v1.ailySessionRun.get',
  sdkName: 'aily.v1.ailySessionRun.get',
  path: '/open-apis/aily/v1/sessions/:aily_session_id/runs/:run_id',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-aily-run-Get run-This API is used to obtain detailed information about the Run of a Feishu smart partner application, including the status of the run, the end time, and so on',
  accessTokens: ['tenant', 'user'],
  schema: {
    path: z.object({ aily_session_id: z.string().describe('Session ID'), run_id: z.string().describe('Run ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionRunList = {
  project: 'aily',
  name: 'aily.v1.ailySessionRun.list',
  sdkName: 'aily.v1.ailySessionRun.list',
  path: '/open-apis/aily/v1/sessions/:aily_session_id/runs',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-aily-run-List runs-This API is used to list the running details of a Feishu smart partner application; including status, end time, and so on',
  accessTokens: ['tenant', 'user'],
  schema: {
    params: z.object({
      page_size: z.number().describe('Page size').optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
    }),
    path: z.object({ aily_session_id: z.string().describe('Session ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AilySessionUpdate = {
  project: 'aily',
  name: 'aily.v1.ailySession.update',
  sdkName: 'aily.v1.ailySession.update',
  path: '/open-apis/aily/v1/sessions/:aily_session_id',
  httpMethod: 'PUT',
  description:
    '[Feishu/Lark]-aily-session-Update session-This API is used to update information about a session with a Feishu Smart Partner application',
  accessTokens: ['tenant', 'user'],
  schema: {
    data: z.object({
      channel_context: z.string().describe('Channel context').optional(),
      metadata: z.string().describe('Other transparent information').optional(),
    }),
    path: z.object({ aily_session_id: z.string().describe('Session ID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AppDataAssetTagList = {
  project: 'aily',
  name: 'aily.v1.appDataAssetTag.list',
  sdkName: 'aily.v1.appDataAssetTag.list',
  path: '/open-apis/aily/v1/apps/:app_id/data_asset_tags',
  httpMethod: 'GET',
  description:
    "[Feishu/Lark]-aily-Data Knowledge-Data Knowledge Management-List Data Knowledge Tag-List Aily's data knowledge tags",
  accessTokens: ['tenant', 'user'],
  schema: {
    params: z.object({
      page_size: z.number().describe('Paging parameters: paging size, default: 20, max: 100').optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
      keyword: z.string().describe('Fuzzy matching classification name').optional(),
      data_asset_tag_ids: z.array(z.string()).describe('Fuzzy matching classification name').optional(),
    }),
    path: z.object({ app_id: z.string().describe('AppID') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AppDataAssetList = {
  project: 'aily',
  name: 'aily.v1.appDataAsset.list',
  sdkName: 'aily.v1.appDataAsset.list',
  path: '/open-apis/aily/v1/apps/:app_id/data_assets',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-aily-Data Knowledge-Data Knowledge Management-List Data Knowledges-Get the data knowledge list of the Aily',
  accessTokens: ['tenant', 'user'],
  schema: {
    params: z.object({
      page_size: z.number().describe('Paging parameters: paging size, default: 20, max: 100').optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
      keyword: z.string().describe('Fuzzy matching keywords').optional(),
      data_asset_ids: z.array(z.string()).describe('Filtering by Data Knowledge ID').optional(),
      data_asset_tag_ids: z.array(z.string()).describe('Filtering by data knowledge classification ID').optional(),
      with_data_asset_item: z.boolean().describe('Does the result include data and knowledge items?').optional(),
      with_connect_status: z.boolean().describe('Does the result contain data connection status?').optional(),
    }),
    path: z.object({
      app_id: z
        .string()
        .describe(
          "The APPID of the application of the Aily can be obtained directly from the URL of the Aily's application. Get an example:/ai/{APPID}",
        ),
    }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AppKnowledgeAsk = {
  project: 'aily',
  name: 'aily.v1.appKnowledge.ask',
  sdkName: 'aily.v1.appKnowledge.ask',
  path: '/open-apis/aily/v1/apps/:app_id/knowledges/ask',
  httpMethod: 'POST',
  description: "[Feishu/Lark]-aily-Data Knowledge-Execute Data-Knowledge Q&A-Ask Aily's Data Knowledge",
  accessTokens: ['tenant', 'user'],
  schema: {
    data: z.object({
      message: z
        .object({ content: z.string().describe('message content').optional() })
        .describe('Input message (currently only supports plain text input)'),
      data_asset_ids: z
        .array(z.string())
        .describe('The scope of data knowledge on which control knowledge question answering is based')
        .optional(),
      data_asset_tag_ids: z
        .array(z.string())
        .describe('The Scope of Data Knowledge Classification Based on Control Knowledge Question Answering')
        .optional(),
    }),
    path: z.object({ app_id: z.string().describe('AppID of Feishu Smart Partner Building Platform') }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AppSkillGet = {
  project: 'aily',
  name: 'aily.v1.appSkill.get',
  sdkName: 'aily.v1.appSkill.get',
  path: '/open-apis/aily/v1/apps/:app_id/skills/:skill_id',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-aily-skill-Get Skill-This API is used to query the specific skill details of an Aily application',
  accessTokens: ['tenant', 'user'],
  schema: {
    path: z.object({
      app_id: z
        .string()
        .describe(
          'The Aily application ID (spring_xxx__c) can be obtained from the browser address of the Aily application development page',
        ),
      skill_id: z
        .string()
        .describe('Skill ID; can be obtained from the browser address bar on the Skill Edit page (skill_xxx)'),
    }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AppSkillList = {
  project: 'aily',
  name: 'aily.v1.appSkill.list',
  sdkName: 'aily.v1.appSkill.list',
  path: '/open-apis/aily/v1/apps/:app_id/skills',
  httpMethod: 'GET',
  description: '[Feishu/Lark]-aily-skill-List Skill-This API is used to query the skill list of an Aily application',
  accessTokens: ['tenant', 'user'],
  schema: {
    params: z.object({
      page_size: z
        .number()
        .describe('The number of message records obtained in this request, the default is 20')
        .optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
    }),
    path: z.object({
      app_id: z
        .string()
        .describe(
          'The Aily application ID (spring_xxx__c) can be obtained from the browser address of the Aily application development page',
        ),
    }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1AppSkillStart = {
  project: 'aily',
  name: 'aily.v1.appSkill.start',
  sdkName: 'aily.v1.appSkill.start',
  path: '/open-apis/aily/v1/apps/:app_id/skills/:skill_id/start',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-aily-skill-Start Skill-The API is used to invoke a specific skill of an Aily application, supports specifying skill imported parameters; and returns the result of skill execution synchronously',
  accessTokens: ['tenant', 'user'],
  schema: {
    data: z.object({
      global_variable: z
        .object({
          query: z
            .string()
            .describe(
              'Message text that triggers skills; that is, what the user enters in a conversation on channels such as the Feishu bot',
            )
            .optional(),
          files: z
            .array(z.string())
            .describe(
              "File information that triggers skills (such as image files that need to be consumed such as OCR nodes)> If the skill does not require a file, the'files' parameter can be passed empty",
            )
            .optional(),
          channel: z
            .object({
              variables: z
                .string()
                .describe('Custom incoming variables; can be consumed in Workflow skills global variables')
                .optional(),
            })
            .describe('Channel information')
            .optional(),
        })
        .describe('Global Variables for Skills')
        .optional(),
      input: z.string().describe('Custom variables for skills').optional(),
    }),
    path: z.object({
      app_id: z
        .string()
        .describe(
          'The Aily application ID (spring_xxx__c) can be obtained from the browser address of the Aily application development page',
        ),
      skill_id: z
        .string()
        .describe('Skill ID; can be obtained from the browser address bar on the Skill Edit page (skill_xxx)'),
    }),
    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const ailyV1Tools = [
  ailyV1AilySessionAilyMessageCreate,
  ailyV1AilySessionAilyMessageGet,
  ailyV1AilySessionAilyMessageList,
  ailyV1AilySessionCreate,
  ailyV1AilySessionDelete,
  ailyV1AilySessionGet,
  ailyV1AilySessionRunCancel,
  ailyV1AilySessionRunCreate,
  ailyV1AilySessionRunGet,
  ailyV1AilySessionRunList,
  ailyV1AilySessionUpdate,
  ailyV1AppDataAssetTagList,
  ailyV1AppDataAssetList,
  ailyV1AppKnowledgeAsk,
  ailyV1AppSkillGet,
  ailyV1AppSkillList,
  ailyV1AppSkillStart,
];
