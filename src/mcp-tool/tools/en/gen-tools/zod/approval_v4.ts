import { z } from 'zod';
export type approvalV4ToolName =
  | 'approval.v4.approval.create'
  | 'approval.v4.approval.get'
  | 'approval.v4.approval.subscribe'
  | 'approval.v4.approval.unsubscribe'
  | 'approval.v4.externalApproval.create'
  | 'approval.v4.externalApproval.get'
  | 'approval.v4.externalInstance.check'
  | 'approval.v4.externalInstance.create'
  | 'approval.v4.externalTask.list'
  | 'approval.v4.instance.addSign'
  | 'approval.v4.instance.cancel'
  | 'approval.v4.instance.cc'
  | 'approval.v4.instanceComment.create'
  | 'approval.v4.instanceComment.delete'
  | 'approval.v4.instanceComment.list'
  | 'approval.v4.instanceComment.remove'
  | 'approval.v4.instance.create'
  | 'approval.v4.instance.get'
  | 'approval.v4.instance.list'
  | 'approval.v4.instance.preview'
  | 'approval.v4.instance.query'
  | 'approval.v4.instance.searchCc'
  | 'approval.v4.instance.specifiedRollback'
  | 'approval.v4.task.approve'
  | 'approval.v4.task.query'
  | 'approval.v4.task.reject'
  | 'approval.v4.task.resubmit'
  | 'approval.v4.task.search'
  | 'approval.v4.task.transfer';
export const approvalV4ApprovalCreate = {
  project: 'approval',
  name: 'approval.v4.approval.create',
  sdkName: 'approval.v4.approval.create',
  path: '/open-apis/approval/v4/approvals',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval definition-Create an approval definition-This API is used to create a simple approval definition, whose basic information, form and process can be specified. This API is not recommended for custom apps. Contact the administrator to create definitions in the Approval Admin if necessary',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_name: z
        .string()
        .describe(
          'Internationalized text key of the approval title. It starts with @i18n@ and has a minimum length of 9 characters',
        ),
      approval_code: z
        .string()
        .describe(
          'Approval definition Code. If this is left empty, it indicates creating a new approval. Passing a specified Code means overwriting the original definition content',
        )
        .optional(),
      description: z
        .string()
        .describe(
          'Internationalized text key of the approval description. It starts with @i18n@ and has a minimum length of 9 characters',
        )
        .optional(),
      viewers: z
        .array(
          z.object({
            viewer_type: z
              .enum(['TENANT', 'DEPARTMENT', 'USER', 'NONE'])
              .describe(
                'Viewer type Options:TENANT(Users in a tenant),DEPARTMENT(Specified departments),USER(Specified users),NONE(No one)',
              )
              .optional(),
            viewer_user_id: z
              .string()
              .describe('When viewer_type is USER, fill in the user id according to user_id_type')
              .optional(),
            viewer_department_id: z
              .string()
              .describe('When viewer_type is DEPARTMENT, fill in the department id according to department_id_type')
              .optional(),
          }),
        )
        .describe(
          'Visible scope of Approval Frontend(The maximum supported length of the list is 200). 1. When viewer_type is USER, viewer_user_id need to be filled in 2. When viewer_type is DEPARTMENT,viewer_department_id need to be filled in 3. When viewer_type is TENANT or NONE, viewer_user_id and viewer_department_id do not need to be filled in',
        ),
      form: z
        .object({
          form_content: z
            .string()
            .describe(
              'Approval definition form content, which is listed as a JSON array. See the field description below for details',
            ),
        })
        .describe('Approval definition form'),
      node_list: z
        .array(
          z.object({
            id: z
              .string()
              .describe(
                "Node ID. The start node's ID is START, and the end node's ID is END. name, node_type, and approver are not required for the start and end nodes",
              ),
            name: z
              .string()
              .describe(
                'Internationalized text key of the node name. It starts with @i18n@ and has a minimum length of 9 characters',
              )
              .optional(),
            node_type: z
              .enum(['AND', 'OR', 'SEQUENTIAL'])
              .describe(
                'Approval type enumeration. When node_type is SEQUENTIAL, the approver must be selected by the initiator. Options:AND(Everyone assigned),OR(Anyone assigned),SEQUENTIAL(Sequental Sequential)',
              )
              .optional(),
            approver: z
              .array(
                z.object({
                  type: z
                    .enum([
                      'Supervisor',
                      'SupervisorTopDown',
                      'DepartmentManager',
                      'DepartmentManagerTopDown',
                      'Personal',
                      'Free',
                    ])
                    .describe(
                      'Approver/Cc Type1. When the type is Supervisor, SupervisorTopDown, DepartmentManager , or DepartmentManagerTopDown, their level should be specified in the level. For example, for approval by third-level managers from bottom up, level is 3. 2. When the type is Personal, User id fill in according to user_id_type 3. When the type is Free (selected by the initiator), neither user_id nor level is required. 4. ccer does not support Free. Options:Supervisor(Manager (bottom up)),SupervisorTopDown(Manager (top down)),DepartmentManager(Department supervisor (bottom up)),DepartmentManagerTopDown(Department supervisor (top down)),Personal(Specified member),Free(Selected by the initiator)',
                    ),
                  user_id: z.string().describe('User id, fill in according to user_id_type').optional(),
                  level: z
                    .string()
                    .describe(
                      'Approval level, when the type is Supervisor, SupervisorTopDown, DepartmentManager, DepartmentManagerTopDown, you need to fill in the corresponding level in the level, for example: review from the bottom to the top three levels, level = 3',
                    )
                    .optional(),
                }),
              )
              .describe('List of reviewers')
              .optional(),
            ccer: z
              .array(
                z.object({
                  type: z
                    .enum([
                      'Supervisor',
                      'SupervisorTopDown',
                      'DepartmentManager',
                      'DepartmentManagerTopDown',
                      'Personal',
                      'Free',
                    ])
                    .describe(
                      'Approver/Cc Type1. When the type is Supervisor, SupervisorTopDown, DepartmentManager , or DepartmentManagerTopDown, their level should be specified in the level. For example, for approval by third-level managers from bottom up, level is 3. 2. When the type is Personal, User id fill in according to user_id_type 3. When the type is Free (selected by the initiator), neither user_id nor level is required. 4. ccer does not support Free. Options:Supervisor(Manager (bottom up)),SupervisorTopDown(Manager (top down)),DepartmentManager(Department supervisor (bottom up)),DepartmentManagerTopDown(Department supervisor (top down)),Personal(Specified member),Free(Selected by the initiator)',
                    ),
                  user_id: z.string().describe('User id, fill in according to user_id_type').optional(),
                  level: z
                    .string()
                    .describe(
                      'Approval level, when the type is Supervisor, SupervisorTopDown, DepartmentManager, DepartmentManagerTopDown, you need to fill in the corresponding level in the level, for example: review from the bottom to the top three levels, level = 3',
                    )
                    .optional(),
                }),
              )
              .describe('Copy sender list')
              .optional(),
            privilege_field: z
              .object({
                writable: z.array(z.string()).describe('The id list of form entries with writable permissions'),
                readable: z.array(z.string()).describe('The id list of table entries with readable permissions'),
              })
              .describe('Control permissions for table items')
              .optional(),
            approver_chosen_multi: z
              .boolean()
              .describe('Whether to allow multiple selection of self-selected approvers')
              .optional(),
            approver_chosen_range: z
              .array(
                z.object({
                  type: z
                    .enum(['ALL', 'PERSONAL', 'ROLE'])
                    .describe(
                      'Approver Type Options:ALL(all people),PERSONAL(Designated Approver),ROLE(Designated Roles)',
                    )
                    .optional(),
                  id_list: z.array(z.string()).describe('Approver ID').optional(),
                }),
              )
              .describe('Select range of self-selected approvers')
              .optional(),
            starter_assignee: z
              .enum(['STARTER', 'AUTO_PASS', 'SUPERVISOR', 'DEPARTMENT_MANAGER'])
              .describe(
                'Operation when the approver is the submitter Options:STARTER(Requester Approval),AUTO_PASS(Auto-approve),SUPERVISOR(Manager Approval),DEPARTMENT_MANAGER(Department supervisor Approval)',
              )
              .optional(),
          }),
        )
        .describe(
          'Approval definition nodes, which are listed as the map array. The start node should be the first element of the list and the end node should be the last element',
        ),
      settings: z
        .object({
          revert_interval: z
            .number()
            .describe(
              'The period of time (in seconds) during which an approval instance can be canceled after it is approved. It defaults to 31 days. 0 indicates not cancelable',
            )
            .optional(),
          revert_option: z
            .number()
            .describe('Whether an approval can be canceled after the first node. It defaults to 1. 0 indicates No')
            .optional(),
          reject_option: z
            .number()
            .describe(
              'Reject settings Options:0(RejectDefault Default setting, process terminated),1(RejectSubmit Return to submitter, the submitter can edit the process and resubmit)',
            )
            .optional(),
          quick_approval_option: z
            .number()
            .describe(
              'Quick approval configuration item. When it is enabled, approval can be directly approved on the card. The default value of 1 is enabled, 0 is disabled Options:0(Close disable),1(Open enable)',
            )
            .optional(),
        })
        .describe('Other settings of the approval definition')
        .optional(),
      config: z
        .object({
          can_update_viewer: z.boolean().describe('Whether the visible scope can be modified. It defaults to false'),
          can_update_form: z.boolean().describe('Whether the form content can be modified. It defaults to false'),
          can_update_process: z.boolean().describe('Whether process nodes can be modified. It defaults to false'),
          can_update_revert: z
            .boolean()
            .describe('Whether the period of time for cancellation can be modified. It defaults to false'),
          help_url: z
            .string()
            .describe(
              'Used to configure the help page link, by clicking which users can be redirected to the help page from the Approval Admin',
            )
            .optional(),
        })
        .describe(
          'Approval definition configuration items, used to configure whether an approval definition can be modified by users in the Approval Admin',
        )
        .optional(),
      icon: z
        .number()
        .describe(
          'Approval icon enumeration. It defaults to 0. For details, see ',
        )
        .optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe('Language Options:zh-CN(Zhcn Chinese),en-US(Enus English),ja-JP(Jajp Japanese)'),
            texts: z
              .array(
                z.object({ key: z.string().describe('Copywriting key'), value: z.string().describe('Copywriting') }),
              )
              .describe(
                "Key, value, and i18n key of copy starts with @i18n@.This field is mainly used for internationalized text. Word order users can pass texts in multiple languages at the same time, and the Approval Center will use the corresponding text according to the user's language environment. If the text of the user's language environment isn't passed, the text of default language will be used",
              ),
            is_default: z
              .boolean()
              .describe(
                'Whether to use the default language. If the default language is used, all keys should be contained; if a non-default language is used but its keys do not exist, the default language will be used instead',
              ),
          }),
        )
        .describe('Internationalized text'),
      process_manager_ids: z
        .array(z.string())
        .describe(
          'Process manager ids, fill in according to user_id_type(The maximum supported length of the list is 200)',
        )
        .optional(),
    }),
    params: z.object({
      department_id_type: z
        .enum(['department_id', 'open_department_id'])
        .describe(
          'The type of department ID used in this call Options:department_id(DepartmentId Identify departments with custom department_id),open_department_id(OpenDepartmentId Identify departments by open_department_id)',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
    }),
  },
};
export const approvalV4ApprovalGet = {
  project: 'approval',
  name: 'approval.v4.approval.get',
  sdkName: 'approval.v4.approval.get',
  path: '/open-apis/approval/v4/approvals/:approval_code',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-Approval-Approval definition-View approval definitions-This API is used to get the details of an approval definition based on an Approval Code and create approval instance requests',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('Language optional Options:zh-CN(Zhcn Chinese),en-US(Enus English),ja-JP(Jajp Japanese)')
        .optional(),
      with_admin_id: z
        .boolean()
        .describe('Optional Whether to return a list of admin IDs with data permissions for the approval process')
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
    }),
    path: z.object({ approval_code: z.string().describe('Approval definition code') }),
  },
};
export const approvalV4ApprovalSubscribe = {
  project: 'approval',
  name: 'approval.v4.approval.subscribe',
  sdkName: 'approval.v4.approval.subscribe',
  path: '/open-apis/approval/v4/approvals/:approval_code/subscribe',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval Events-Event interface-Subscribe to approval events-When the application , it needs to call this interface to specify the approval definition Code (approval_code) to enable the subscription. Only after enabling it will the application be able to receive the events corresponding to that approval definition',
  accessTokens: ['tenant'],
  schema: {
    path: z.object({ approval_code: z.string().describe('Review Definition Unique Identifier') }),
  },
};
export const approvalV4ApprovalUnsubscribe = {
  project: 'approval',
  name: 'approval.v4.approval.unsubscribe',
  sdkName: 'approval.v4.approval.unsubscribe',
  path: '/open-apis/approval/v4/approvals/:approval_code/unsubscribe',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval Events-Event interface-Unsubscribe from approval events-After unsubscribing approval_code, you can no longer receive event notifications for the corresponding instance of the review definition',
  accessTokens: ['tenant'],
  schema: {
    path: z.object({ approval_code: z.string().describe('Review Definition Unique Identifier').optional() }),
  },
};
export const approvalV4ExternalApprovalCreate = {
  project: 'approval',
  name: 'approval.v4.externalApproval.create',
  sdkName: 'approval.v4.externalApproval.create',
  path: '/open-apis/approval/v4/external_approvals',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Third-party approval definition-Create a third-party approval definition-Approval definition is the description of an approval, including the approval title, description, and other basic information. After an approval definition is created, users can see the approval in the initiation page of the approval app. By clicking "Initiate", a user will be redirected to the configured system address for the third-party approval initiation to initiate an approval.In addition, the approval definition also configures the callback URL for approval operations. When the approver performs [Approve] or [Reject] action in the pending approval list, the Approval Center will call the callback URL to notify the third-party system',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_name: z
        .string()
        .describe(
          'The international copy key of the approval name, starting with @i18n@, must not be less than 9 characters in length',
        ),
      approval_code: z
        .string()
        .describe(
          'This value is used to determine whether calling the current interface is to create or update an approval definition. Specific description:- If the value passed in can be matched to an existing approval definition approval_code, calling this interface will update the corresponding approval definition.- If the value passed in cannot be matched to any approval definition approval_code, a new approval definition will be created and the real approval_code of the new approval definition will be returned (not the value you passed in through this parameter)',
        ),
      group_code: z
        .string()
        .describe(
          'The approval group to which the approval definition belongs, which is user-defined.If the group_code does not exist, a new approval group will be created.If the group_code already exists, the approval group name will be updated with the group_name',
        ),
      group_name: z
        .string()
        .describe(
          'Group name. Its value is in the format of i18n key, and the text is in i18n_resource.If the group_code does not exist, the group_name is required. Otherwise, the group name will only be updated if it is entered.The group name of the approval definition in the approval initiation page is from this field',
        )
        .optional(),
      description: z
        .string()
        .describe(
          'Description. Its value is in the format of i18n key, and the text is in i18n_resource.The description of the approval definition in the approval initiation page is from this field',
        )
        .optional(),
      external: z
        .object({
          biz_name: z
            .string()
            .describe(
              'This field is used in the list to indicate where the approval comes from, whose value is in the format of i18n key. Please note that the prefix "From" is not required, since the prefix will be added by the Approval Center',
            )
            .optional(),
          biz_type: z
            .string()
            .describe(
              'This field is used to identify which business party the approval definition belongs to. It is user-defined , and the same value can be used for multiple approval definitions.The field is to attribute multiple approval definitions to the same business party. Therefore, when searching for approvals, if the business party has configured an external approval search with the same biz_type parameter, the parameters with biz_type will be filtered out from the search provided by the Approval Center, and the search will be performed from the configured URL',
            )
            .optional(),
          create_link_mobile: z
            .string()
            .describe(
              'Initiation link in the mobile app. If the link is set, the approval will be displayed in the approval initiation page on the mobile, and users will be redirected to the link to initiate an approval after clicking.If this field is left empty, the approval will not be displayed in themobile app',
            )
            .optional(),
          create_link_pc: z
            .string()
            .describe(
              'Initiation link on PC. If the link is set, the approval will be displayed in the approval initiation page on PC, and users will be redirected to the link to initiate an approval after clicking.If this field is left empty, the approval will not be displayed on PC',
            )
            .optional(),
          support_pc: z
            .boolean()
            .describe(
              'The support_pc parameter controls whether the approval definition is displayed on the PC initiation approval page. If it is set to true, it will be displayed; otherwise, it will not',
            )
            .optional(),
          support_mobile: z
            .boolean()
            .describe(
              'The support_mobile parameter controls whether the approval definition is displayed on the mobile initiation approval page. If it is set to true, it will be displayed; otherwise, it will not.Both support_pc and support_mobile parameters cannot be set to false simultaneously',
            )
            .optional(),
          support_batch_read: z.boolean().describe('Whether marking as read in batches is supported').optional(),
          enable_mark_readed: z
            .boolean()
            .describe('Whether marking as read is supported（This field is invalid）')
            .optional(),
          enable_quick_operate: z.boolean().describe('Whether quick action is supported').optional(),
          action_callback_url: z
            .string()
            .describe(
              'Third-party\'s action callback URL. This URL is called by the Approval Center to notify the third-party system when the task approver of the [Pending] list clicks "Approve" or "Reject".Refer to ',
            )
            .optional(),
          action_callback_token: z
            .string()
            .describe(
              'Callback token, used for the business system to validate whether the request comes from Approval. Refer to ',
            )
            .optional(),
          action_callback_key: z
            .string()
            .describe(
              'Request parameter encryption key. If this parameter is configured, the request parameters will be encrypted and the business party must decrypt the request. For the encryption and decryption methods, refer to ',
            )
            .optional(),
          allow_batch_operate: z.boolean().describe('Whether batch action is supported').optional(),
          exclude_efficiency_statistics: z
            .boolean()
            .describe('Whether approval process data is not included in efficiency statistics')
            .optional(),
        })
        .describe('Third-party approval related'),
      viewers: z
        .array(
          z.object({
            viewer_type: z
              .enum(['TENANT', 'DEPARTMENT', 'USER', 'NONE'])
              .describe(
                'Viewer type Options:TENANT(Users in a tenant),DEPARTMENT(Specified departments),USER(Specified users),NONE(No one)',
              )
              .optional(),
            viewer_user_id: z
              .string()
              .describe('When viewer_type is USER, fill in the user id according to user_id_type')
              .optional(),
            viewer_department_id: z
              .string()
              .describe('When viewer_type is DEPARTMENT, fill in the department id according to department_id_type')
              .optional(),
          }),
        )
        .describe(
          'List of users who can view(Maximum supported length 200). Multiple viewers can be configured at the same time, and only users within the visible scope can see the approval in the approval initiation page',
        )
        .optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe('Language Options:zh-CN(Zhcn Chinese),en-US(Enus English),ja-JP(Jajp Japanese)'),
            texts: z
              .array(
                z.object({ key: z.string().describe('Copywriting key'), value: z.string().describe('Copywriting') }),
              )
              .describe(
                "Key, value, and i18n key of copy starts with @i18n@.This field is mainly used for internationalized text. Word order users can pass texts in multiple languages at the same time, and the Approval Center will use the corresponding text according to the user's language environment. If the text of the user's language environment isn't passed, the text of default language will be used",
              ),
            is_default: z
              .boolean()
              .describe(
                'Whether to use the default language. If the default language is used, all keys should be contained; if a non-default language is used but its keys do not exist, the default language will be used instead',
              ),
          }),
        )
        .describe('Internationalized text')
        .optional(),
      managers: z
        .array(z.string())
        .describe('Fill in the process managers id according to the user_id_type(Maximum supported length 200)')
        .optional(),
    }),
    params: z.object({
      department_id_type: z
        .enum(['department_id', 'open_department_id'])
        .describe(
          'The type of department ID used in this call Options:department_id(DepartmentId Identify departments with custom department_id),open_department_id(OpenDepartmentId Identify departments by open_department_id)',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
    }),
  },
};
export const approvalV4ExternalApprovalGet = {
  project: 'approval',
  name: 'approval.v4.externalApproval.get',
  sdkName: 'approval.v4.externalApproval.get',
  path: '/open-apis/approval/v4/external_approvals/:approval_code',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-Approval-Third-party approval definition-View third-party approval definition-This API is used to get the details of a third-party approval definition based on an Approval Code',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional() }),
    path: z.object({
      approval_code: z
        .string()
        .describe(
          'Approval definition code in response body after ',
        ),
    }),
  },
};
export const approvalV4ExternalInstanceCheck = {
  project: 'approval',
  name: 'approval.v4.externalInstance.check',
  sdkName: 'approval.v4.externalInstance.check',
  path: '/open-apis/approval/v4/external_instances/check',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Third-party approval instances-Verify instances',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      instances: z
        .array(
          z.object({
            instance_id: z.string(),
            update_time: z.string(),
            tasks: z.array(z.object({ task_id: z.string(), update_time: z.string() })),
          }),
        )
        .describe('Instance information'),
    }),
  },
};
export const approvalV4ExternalInstanceCreate = {
  project: 'approval',
  name: 'approval.v4.externalInstance.create',
  sdkName: 'approval.v4.externalInstance.create',
  path: '/open-apis/approval/v4/external_instances',
  httpMethod: 'POST',
  description:
    "[Feishu/Lark]-Approval-Third-party approval instances-Sync instances-Approval transfer lies in the third-party system instead of the Approval Center. The approval instances, approval tasks, and approval CC data generated after approval transfer are synced from the third-party system to the Approval Center. Users can browse the instances, tasks, and CC information synced from the third-party system in the Approval Center, and can redirect to the third-party system for more detailed viewing and action. The instance information is in the [Initiated] list, the task information is in the [Pending] and [Approved] lists, and the CC information is in the [CC'd] list.The third-party system can also configure the callback API for approval tasks, so that the approver can directly perform the approval action in the Approval Center, and the Approval Center will call back the third-party system. After receiving the callback, the third-party system will update the task information and sync the new task information back to the Approval Center to form a closed loop",
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z
        .string()
        .describe(
          'Approval definition code, create the value returned by the approval definition, indicating which process the instance belongs to; this field will affect the title of the instance in the list, and the title is taken from the corresponding defined name field',
        ),
      status: z
        .enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'DELETED', 'HIDDEN', 'TERMINATED'])
        .describe(
          'Approval instance status Options:PENDING(Approving),APPROVED(The approval process is over and the result is consent.),REJECTED(The approval process ends with a rejection),CANCELED(Approval sponsor withdraws),DELETED(Approval deleted),HIDDEN(Status hide (do not show status)),TERMINATED(Approval terminated)',
        ),
      extra: z
        .string()
        .describe(
          'Approval instance extends JSON. The document number is achieved by passing business_key field. The following example values are not escaped, so please be aware of the escaping when using them. You can see an example after escaping in the request body example',
        )
        .optional(),
      instance_id: z
        .string()
        .describe(
          'The approval instance is uniquely identified, user-defined, and it is necessary to ensure that the certificate tenant and the application are unique',
        ),
      links: z
        .object({
          pc_link: z
            .string()
            .describe(
              'Jump link on the pc side, when the user uses the Feishu pc side, use this field to jump, and the hosted link remains unchanged',
            ),
          mobile_link: z
            .string()
            .describe(
              'Mobile end jump link, when the user uses Feishu mobile end, use this field to jump, the hosted link remains the same',
            )
            .optional(),
        })
        .describe(
          'Approval instance link collection, used for the jump of the [initiated] list, jump back to the three-party system; pc_link and mobile_link must fill in one, which end of the link is filled in, that is, it will jump to the link, not affected by the platform',
        ),
      title: z
        .string()
        .describe(
          'Approval display name, if this field is filled in, the approval title in the approval list uses this field, if this field is not filled in, the approval title uses the name of the approval definition',
        )
        .optional(),
      form: z
        .array(
          z.object({
            name: z.string().describe('Form field name').optional(),
            value: z.string().describe('form value').optional(),
          }),
        )
        .describe(
          'The form data filled in by the user when submitting for approval is used for display in all approval lists. Multiple values can be submitted, but only the first 3 will be displayed in the approval center, and the total length should not exceed 2048 characters',
        )
        .optional(),
      user_id: z
        .string()
        .describe(
          'Approval sponsor user_id, the sponsor can see all the approvals that have been initiated in the [Initiated] list; in the [Pending Approval], [Approved] [CC Me] list, this field shows who initiated the approval',
        )
        .optional(),
      user_name: z
        .string()
        .describe(
          'Approval sponsor, username, if the sponsor is not a real user (for example, a department), there is no user_id, you can use this field to pass the name',
        )
        .optional(),
      open_id: z.string().describe('Approval sponsor open id').optional(),
      department_id: z
        .string()
        .describe(
          'Promoter department, used to display the department to which the promoter belongs in the list. If it is not passed, it will not be displayed. If the user does not join any department, pass "", and pass the display tenant name department_name the display department name',
        )
        .optional(),
      department_name: z
        .string()
        .describe(
          'Approval sponsor, department, if the sponsor is not a real user (for example, a department), there is no department_id, you can use this field to pass the name',
        )
        .optional(),
      start_time: z.string().describe('Approval initiation time, Unix millisecond timestamp'),
      end_time: z
        .string()
        .describe('Approval instance end time: 0 for unfinished approvals, Unix millisecond timestamp'),
      update_time: z
        .string()
        .describe(
          'The most recent update time of the approval instance; used to push data version control If the update_mode value is UPDATE, the approval instance information in the approval center will only be updated when the passed update_time changes (becomes larger). This field is mainly used to avoid concurrency when old data is updated with new data',
        ),
      display_method: z
        .enum(['BROWSER', 'SIDEBAR', 'NORMAL', 'TRUSTEESHIP'])
        .describe(
          'How to open an approval instance on the list page Options:BROWSER(Jump to the default browser of the system to open),SIDEBAR(Feishu middle side drawer open),NORMAL(Feishu inline page opens),TRUSTEESHIP(Open with hosting)',
        )
        .optional(),
      update_mode: z
        .enum(['REPLACE', 'UPDATE'])
        .describe(
          'Update mode, when update_mode = REPLACE, the current push data is used as the final data every time, and redundant tasks and cc data in the approval center will be deleted (not in the data pushed this time); when update_mode = UPDATE, The data of the approval center will not be deleted, but only the instance and task data will be added and updated Options:REPLACE(Full replacement, default),UPDATE(incremental update)',
        )
        .optional(),
      task_list: z
        .array(
          z.object({
            task_id: z
              .string()
              .describe(
                'Unique identifier within the approval instance to locate data when updating the approval task',
              ),
            user_id: z
              .string()
              .describe(
                "user_id approver, and fill in at least one of open_id. This task will appear in the approver's [Pending Approval] or [Approved] list",
              )
              .optional(),
            open_id: z.string().describe('open_id, and at least one user_id').optional(),
            title: z.string().describe('Approval task name').optional(),
            links: z
              .object({
                pc_link: z
                  .string()
                  .describe(
                    'The jump link on the pc side, when the user uses the Feishu pc side, use this field to jump',
                  ),
                mobile_link: z
                  .string()
                  .describe('Mobile end jump link, when the user uses Feishu mobile end, use this field to jump')
                  .optional(),
              })
              .describe(
                'The jump link used in [Pending Approval] or [Approved] is used to jump back to the three-party system pc_link and mobile_link must fill in one, which end of the link is filled in, that is, it will jump to the link, not affected by the platform',
              ),
            status: z
              .enum(['PENDING', 'APPROVED', 'REJECTED', 'TRANSFERRED', 'DONE'])
              .describe(
                'task status Options:PENDING(Pending approval),APPROVED(Task agreed),REJECTED(Reject Task denied),TRANSFERRED(Transefrred Task transfer),DONE(The task passed but the approver did not operate it; the approver cannot see the task. If you want to see it, you can copy the person.)',
              ),
            extra: z
              .string()
              .describe(
                'Extend json, the reason for the end of the task needs to be passed complete_reason field. The enumeration value and the corresponding description:- approved: agreed- rejected: rejected- node_auto_reject: Automatic rejection (due to logical judgment)- specific_rollback: return (including return to the sponsor, return to any intermediate approver)- add: and sign (add a new approver, approve with me)- add_pre: Pre-approver (add new approver, approve before me)- add_post: post-approver (add new approver, approve after me)- delete_assignee: Reductions- forward: manual transfer- forward_resign: automatic transfer upon resignation- recall: revocation (withdrawal of documents, invalidation of documents)- delete: delete the approval slip- admin_forward: the administrator operates the forwarding in the background- system_forward: the system automatically transfers- auto_skip: Auto Pass- manual_skip: manually skip- submit_again: resubmit tasks- restart: restart the process- others: others (as a backstop)',
              )
              .optional(),
            create_time: z.string().describe('Task creation time, Unix millisecond timestamp'),
            end_time: z
              .string()
              .describe('Task completion time: 0 for unfinished approvals, Unix millisecond timestamp'),
            update_time: z
              .string()
              .describe(
                'The last update time of the task, which is used to push data versioning; update the policy update_time in the same instance',
              )
              .optional(),
            action_context: z
              .string()
              .describe(
                'Operation context, when the user operates, this parameter is included in the callback request to pass the context data of the task',
              )
              .optional(),
            action_configs: z
              .array(
                z.object({
                  action_type: z
                    .string()
                    .describe(
                      'Operation type, each task can be configured with 2 operations, which will be displayed in the approval list. When the user operates, the callback request will bring this field, indicating whether the user has agreed to the operation or refused the operation** Optional values are **:< Md-enum >< md-enum-item key = "APPROVE" > Agree </md-enum-item >< md-enum-item key = "REJECT" > Deny </md-enum-item >< Md-enum-item key = "{KEY}" > Any string, if any string is used, you need to provide action_name </md-enum-item ></Md-enum >',
                    ),
                  action_name: z
                    .string()
                    .describe(
                      'The operation name, i18n key is used for foreground presentation, if the action_type is not APPROVAL and REJECT, this field must be provided to display the specific operation name',
                    )
                    .optional(),
                  is_need_reason: z
                    .boolean()
                    .describe(
                      'Whether you need an opinion, if true, when the user operates, it will jump to the opinion fill page',
                    )
                    .optional(),
                  is_reason_required: z.boolean().describe('Approval comment is required').optional(),
                  is_need_attachment: z
                    .boolean()
                    .describe('Opinion whether to support uploading attachments')
                    .optional(),
                }),
              )
              .describe('Task level operation configuration, fast approval currently supports mobile end operation')
              .optional(),
            display_method: z
              .enum(['BROWSER', 'SIDEBAR', 'NORMAL', 'TRUSTEESHIP'])
              .describe(
                'How to open approval tasks on the list page Options:BROWSER(Jump to the default browser of the system to open),SIDEBAR(Sidbar Feishu middle side drawer open),NORMAL(Feishu inline page opens),TRUSTEESHIP(Open in hosted mode)',
              )
              .optional(),
            exclude_statistics: z
              .boolean()
              .describe(
                'Tripartite mission support is not included in efficiency statistics.false: Include efficiency statistics.true: efficiency statistics are not included',
              )
              .optional(),
            node_id: z
              .string()
              .describe(
                'Node ID: must be satisfied at the same time- In a process, each node id is unique. For example, the Node_id of each node such as "direct manager" and "hierarchical superior" under a process are different- In the same process definition, the same node in different approval instances should Node_id remain unchanged. For example, Zhang San and Li Si initiated leave applications respectively, and the node_id of the "direct manager" node in these two approval instances should remain the same',
              )
              .optional(),
            node_name: z
              .string()
              .describe(
                'Node names, such as "Financial Approval" and "Legal Approval", support three languages: Chinese, English and Japanese. Example: i18n@name. The international copy corresponding to the name needs to be uploaded in the i18n_resources',
              )
              .optional(),
          }),
        )
        .describe('Task list')
        .optional(),
      cc_list: z
        .array(
          z.object({
            cc_id: z.string().describe('Unique identity within the approval instance'),
            user_id: z.string().describe('CC employee id').optional(),
            open_id: z.string().describe('CC person open id, and fill in at least one of both user id').optional(),
            links: z
              .object({
                pc_link: z
                  .string()
                  .describe(
                    'The jump link on the pc side, when the user uses the Feishu pc side, use this field to jump',
                  ),
                mobile_link: z
                  .string()
                  .describe('Mobile end jump link, when the user uses Feishu mobile end, use this field to jump')
                  .optional(),
              })
              .describe(
                'Jump link, used for the jump pc_link and mobile_link in the [CC My] list, you must fill in one, which end of the link is filled in, that is, you will jump to the link, not affected by the platform',
              ),
            read_status: z
              .enum(['READ', 'UNREAD'])
              .describe(
                'Read status, null value means read unread is not supported: Options:READ(read),UNREAD(unread)',
              ),
            extra: z.string().describe('Extend json').optional(),
            title: z.string().describe('CC task name').optional(),
            create_time: z.string().describe('CC initiation time, Unix millisecond timestamp'),
            update_time: z
              .string()
              .describe('CC last update time, used to push data versioning update policy same instance update_time'),
            display_method: z
              .enum(['BROWSER', 'SIDEBAR', 'NORMAL', 'TRUSTEESHIP'])
              .describe(
                'How to open approval tasks on the list page Options:BROWSER(Jump to the default browser of the system to open),SIDEBAR(Feishu middle side drawer open),NORMAL(Feishu inline page opens),TRUSTEESHIP(Open in hosted mode)',
              )
              .optional(),
          }),
        )
        .describe('CC list')
        .optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe(
                'Language options are: zh-CN: Chinese en-US: English ja-JP: Japanese Options:zh-CN(Zhcn Chinese),en-US(Enus English),ja-JP(Jajp Japanese)',
              ),
            texts: z
              .array(
                z.object({ key: z.string().describe('Copywriting key'), value: z.string().describe('copywriting') }),
              )
              .describe(
                "Copywriting key, value, i18n key starts with @i18n @; this field is mainly used for internationalization, allowing users to transmit copywriting in multiple languages at the same time. The approval center will use the corresponding copywriting according to the user's current voice environment. If the user's current voice environment copywriting, the default language copywriting will be used",
              ),
            is_default: z
              .boolean()
              .describe(
                'Whether the default language, the default language needs to include all keys, non-default language If the key does not exist, the default language will be used instead',
              ),
          }),
        )
        .describe('International copywriting'),
      trusteeship_url_token: z
        .string()
        .describe(
          'Document escrow authentication token, the escrow callback will be accompanied by this token to help the business party authenticate',
        )
        .optional(),
      trusteeship_user_id_type: z
        .string()
        .describe(
          'The type of user, which affects the selection of the user identity field of the request parameter, including the target user returned by the signature operation. Currently only "user_id" is supported',
        )
        .optional(),
      trusteeship_urls: z
        .object({
          form_detail_url: z.string().describe('Get the url address of the data related to the form schema').optional(),
          action_definition_url: z
            .string()
            .describe('Represents the url address for getting approval action area data')
            .optional(),
          approval_node_url: z.string().describe('Get the url address of the approval record related data').optional(),
          action_callback_url: z
            .string()
            .describe('The url address of the callback when the approval operation is performed')
            .optional(),
          pull_business_data_url: z
            .string()
            .describe(
              'Obtain the URL address of the hosted dynamic data. When using this interface, you must ensure that the interface address is synchronized in the data of the historical hosted document. If there is no such interface in the historical document, you need to re-synchronize the data of the historical hosted document to update the URL. This interface is used for the interactive use of the Feishu approval front-end and the line of business. Only the specific components of the approval front-end (the components provided by the Feishu approval front-end and the components that need to interface with the line of business) will be required',
            )
            .optional(),
        })
        .describe('The URL address of the interface of the document hosting callback access party')
        .optional(),
      trusteeship_cache_config: z
        .object({
          form_policy: z
            .enum(['DISABLE', 'IMMUTABLE', 'BY_NODE', 'BY_USER'])
            .describe(
              'Managed pre-cache policy Options:DISABLE(Not enabled, default),IMMUTABLE(Forms do not change with the process),BY_NODE(ByNode Update cache following process node changes),BY_USER(ByUser Store one copy for each to-do task)',
            )
            .optional(),
          form_vary_with_locale: z.boolean().describe('Whether the form changes with internationalization').optional(),
          form_version: z
            .string()
            .describe(
              'The version number of the currently used form, ensure that after the form is changed, the version number is increased, and the actual value is an int64 integer',
            )
            .optional(),
        })
        .describe('Managed pre-cache policy')
        .optional(),
    }),
  },
};
export const approvalV4ExternalTaskList = {
  project: 'approval',
  name: 'approval.v4.externalTask.list',
  sdkName: 'approval.v4.externalTask.list',
  path: '/open-apis/approval/v4/external_tasks',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-Approval-Third-party approval tasks-Status of third-party approval tasks-This API is used to obtain the third-party approval status. After a user enters the query condition, the API returns the status of the approval instances that meet the condition.The API supports a combination of multiple parameters, including the following: 1. Obtain the task status of a specified instance by using instance_ids 2. Obtain the task status of a specified user by using user_ids 3. Obtain all the tasks of a specified status by using status 4. Obtain the next batch of data',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_codes: z
        .array(z.string())
        .describe(
          'Approval definition codes, which are used to specify that only the data under these definitions will be obtained',
        )
        .optional(),
      instance_ids: z
        .array(z.string())
        .describe(
          'Approval instance IDs, which are used to specify that only the data under these instances will be obtained. Up to 20 IDs are supported',
        )
        .optional(),
      user_ids: z
        .array(z.string())
        .describe("Approver's user_ids, which are used to specify that only the data of these users will be obtained")
        .optional(),
      status: z
        .enum(['PENDING', 'APPROVED', 'REJECTED', 'TRANSFERRED', 'DONE'])
        .describe(
          'Approval task status, which is used to specify that data under this status will be obtained. For status values Options:PENDING(Approving),APPROVED(The approval process is over and the result is agreement),REJECTED(The approval process ends with a rejection),TRANSFERRED(Task transfer),DONE(The task passes but the approver does not operate; the approver cannot see the task, if you want to see it, you can cc the person.)',
        )
        .optional(),
    }),
    params: z.object({
      page_size: z.number().optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
    }),
  },
};
export const approvalV4InstanceAddSign = {
  project: 'approval',
  name: 'approval.v4.instance.addSign',
  sdkName: 'approval.v4.instance.addSign',
  path: '/open-apis/approval/v4/instances/add_sign',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Approval tasks-Add approvers',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string(),
      approval_code: z.string(),
      instance_code: z.string(),
      task_id: z.string(),
      comment: z.string().optional(),
      add_sign_user_ids: z.array(z.string()),
      add_sign_type: z
        .number()
        .describe('Options:1(add_sign_pre 前加签),2(add_sign_post 后加签),3(add_sign_parallel 并加签)'),
      approval_method: z
        .number()
        .describe('Options:1(or_sign 或签),2(add_sign 会签),3(sequential_sign 依次审批)')
        .optional(),
    }),
  },
};
export const approvalV4InstanceCancel = {
  project: 'approval',
  name: 'approval.v4.instance.cancel',
  sdkName: 'approval.v4.instance.cancel',
  path: '/open-apis/approval/v4/instances/cancel',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval instances-Revoke approval instances-If the administrator has set **Allow withdrawal of requests under approval** or **Allow withdrawal of approvals passed within x days** in the background, the submitter can call this interface to withdraw the approval instance when the rules are met',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('Approval definition code'),
      instance_code: z.string().describe('Approval instance code'),
      user_id: z.string().describe('Operation user, fill in according to user_id_type'),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4InstanceCc = {
  project: 'approval',
  name: 'approval.v4.instance.cc',
  sdkName: 'approval.v4.instance.cc',
  path: '/open-apis/approval/v4/instances/cc',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Approval instances-Notify someone of approval instances',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string(),
      instance_code: z.string(),
      user_id: z.string(),
      cc_user_ids: z.array(z.string()),
      comment: z.string().optional(),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4InstanceCommentCreate = {
  project: 'approval',
  name: 'approval.v4.instanceComment.create',
  sdkName: 'approval.v4.instanceComment.create',
  path: '/open-apis/approval/v4/instances/:instance_id/comments',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Native approval comments-Create comments-Create or modify comments, or comment on replies under an approval instance (excluding approved, rejected, transferred, and other additional reasons or opinions)',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      content: z.string().describe('Comment content in json format').optional(),
      at_info_list: z
        .array(
          z.object({
            user_id: z.string().describe('ID of the member mentioned'),
            name: z.string().describe('Name of the member mentioned'),
            offset: z
              .string()
              .describe(
                'The position of the person being mentioned in the comment, starting from 0. Used for offset override. For example:- Effect when the value is 0: @username text- Effect when the value is 2: te @username xt- Effect when the value is 4: text @username',
              ),
          }),
        )
        .describe('List of members who have been mentioned in the comments (list may be empty)')
        .optional(),
      parent_comment_id: z
        .string()
        .describe(
          'Filling in parent_comment_id means to reply to this comment. (You can either fill in comment_id or parent_comment_id.)',
        )
        .optional(),
      comment_id: z
        .string()
        .describe(
          'Filling in comment_id means to modify this comment (You can either fill in comment_id or parent_comment_id)',
        )
        .optional(),
      disable_bot: z
        .boolean()
        .describe(
          'Only publish comments without sending bot (For custom approvals in Feishu\'s Approval, fill in "False"; otherwise, fill in "True".)',
        )
        .optional(),
      extra: z.string().describe('Additional information').optional(),
    }),
    params: z.object({
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
      user_id: z.string().describe('User ID'),
    }),
    path: z.object({
      instance_id: z.string().describe('Approval instance code (or tenant custom approval instance ID)'),
    }),
  },
};
export const approvalV4InstanceCommentDelete = {
  project: 'approval',
  name: 'approval.v4.instanceComment.delete',
  sdkName: 'approval.v4.instanceComment.delete',
  path: '/open-apis/approval/v4/instances/:instance_id/comments/:comment_id',
  httpMethod: 'DELETE',
  description: '[Feishu/Lark]-Approval-Native approval comments-Delete comments',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('User ID type').optional(),
      user_id: z.string().describe('Fill in user ID according to user_id_type'),
    }),
    path: z.object({
      instance_id: z.string().describe('Approval instance code (or tenant custom approval instance ID)'),
      comment_id: z.string().describe('Comment ID'),
    }),
  },
};
export const approvalV4InstanceCommentList = {
  project: 'approval',
  name: 'approval.v4.instanceComment.list',
  sdkName: 'approval.v4.instanceComment.list',
  path: '/open-apis/approval/v4/instances/:instance_id/comments',
  httpMethod: 'GET',
  description: '[Feishu/Lark]-Approval-Native approval comments-Receive comments',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('User ID type').optional(),
      user_id: z.string().describe('User ID'),
      page_token: z.string().optional(),
      page_size: z.number().optional(),
    }),
    path: z.object({
      instance_id: z.string().describe('Approval instance code (or tenant custom approval instance ID)'),
    }),
  },
};
export const approvalV4InstanceCommentRemove = {
  project: 'approval',
  name: 'approval.v4.instanceComment.remove',
  sdkName: 'approval.v4.instanceComment.remove',
  path: '/open-apis/approval/v4/instances/:instance_id/comments/remove',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Native approval comments-Clear comments',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('User ID type').optional(),
      user_id: z.string().describe('Fill in user ID according to user_id_type').optional(),
    }),
    path: z.object({
      instance_id: z.string().describe('Approval instance code (or tenant custom approval instance ID)'),
    }),
  },
};
export const approvalV4InstanceCreate = {
  project: 'approval',
  name: 'approval.v4.instance.create',
  sdkName: 'approval.v4.instance.create',
  path: '/open-apis/approval/v4/instances',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval instances-Create an approval instance-To create an approval instance, you must have a detailed understanding of the approval definition form. Then, you must pass values through the API based on the form structure',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('Approval definition code'),
      user_id: z
        .string()
        .describe(
          'One of the user_id and open_id of the user who initiated the approval must be passed in. If user_id is passed in, user_id will be used first',
        )
        .optional(),
      open_id: z
        .string()
        .describe(
          'One of the open_id and user_id of the user who initiated the approval must be passed in. If user_id is passed in, user_id will be used first',
        )
        .optional(),
      department_id: z
        .string()
        .describe(
          'The department ID of the approval initiator. If the user only belongs to 1 department, this field can be left empty. If the user belongs to multiple departments, the first department in the department list is selected by default',
        )
        .optional(),
      form: z.string().describe('JSON array (need to be compressed and escaped into string), Widget value'),
      node_approver_user_id_list: z
        .array(
          z.object({
            key: z.string().describe('Node id or custom node id').optional(),
            value: z.array(z.string()).describe('View review definition to get value: reviewer list').optional(),
          }),
        )
        .describe(
          'For a node selected by the initiator, the code approvers must be entered.key: node id or custom node id, obtained through value: Approver list',
        )
        .optional(),
      node_approver_open_id_list: z
        .array(
          z.object({
            key: z.string().describe('Node id or custom node id').optional(),
            value: z.array(z.string()).describe('View review definition to get value: reviewer list').optional(),
          }),
        )
        .describe('Open ID selected by the approver and initiator, Create a union set with the above field')
        .optional(),
      node_cc_user_id_list: z
        .array(
          z.object({
            key: z.string().describe('Node id').optional(),
            value: z.array(z.string()).describe('View review definition to get value: reviewer list').optional(),
          }),
        )
        .describe(
          'For a node selected by the initiator, you can enter CC senders for the nodekey: node id or custom node id, obtained through value: Approver listA single node can have up to 20 CC senders',
        )
        .optional(),
      node_cc_open_id_list: z
        .array(
          z.object({
            key: z.string().describe('Node id').optional(),
            value: z.array(z.string()).describe('View review definition to get value: reviewer list').optional(),
          }),
        )
        .describe('Open ID selected by the CC recipient and initiatorA single node can have up to 20 CC senders')
        .optional(),
      uuid: z
        .string()
        .describe(
          'Approval instance uuid, used for idempotent action. A single uuid can only be used to create 1 approval instance. In the case of a conflict, the error code 60012 will be returned. The format must be: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (case-insensitive)',
        )
        .optional(),
      allow_resubmit: z
        .boolean()
        .describe(
          'The "Submit" button can be configured. This operation is suitable for the scenario where the approver returns, and the person submitting the document submits it in the same instance',
        )
        .optional(),
      allow_submit_again: z
        .boolean()
        .describe(
          'Create an approval instance interface to support configuration whether to allow submit again or not, applicable to periodic bill of lading scenarios, where a new instance is launched again based on the current form content',
        )
        .optional(),
      cancel_bot_notification: z
        .string()
        .describe(
          'Configure the bot to suppress specified notification results. Optional values:- 1: Cancel push.- 2: Cancel rejection push.- 4: Cancel the instance and cancel the push.Supports canceling a single bot notification, and also supports canceling multiple bot notifications at the same time. Bit operation, that is, if you need to cancel the two notifications 1 and 2, you need to pass in the sum value 3',
        )
        .optional(),
      forbid_revoke: z.boolean().describe('Configure whether revocation can be prohibited').optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe('Language Options:zh-CN(Zhcn Chinese),en-US(Enus English),ja-JP(Jajp Japanese)'),
            texts: z
              .array(
                z.object({ key: z.string().describe('Copywriting key'), value: z.string().describe('Copywriting') }),
              )
              .describe(
                "Key, value, and i18n key of copy starts with @i18n@.This field is mainly used for internationalized text. Word order users can pass texts in multiple languages at the same time, and the Approval Center will use the corresponding text according to the user's language environment. If the text of the user's language environment isn't passed, the text of default language will be used",
              ),
            is_default: z
              .boolean()
              .describe(
                'Whether to use the default language. If the default language is used, all keys should be contained; if a non-default language is used but its keys do not exist, the default language will be used instead',
              ),
          }),
        )
        .describe('Internationalized text. Only the value of input and textarea are supported')
        .optional(),
    }),
  },
};
export const approvalV4InstanceGet = {
  project: 'approval',
  name: 'approval.v4.instance.get',
  sdkName: 'approval.v4.instance.get',
  path: '/open-apis/approval/v4/instances/:instance_id',
  httpMethod: 'GET',
  description:
    '[Feishu/Lark]-Approval-Approval instances-Obtain details of an approval instance-This API is used to obtain approval instance details through Instance Code. You can obtain Instance Code via the  API',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe(
          'Language. The default value is the language configured in the i18n_resources field when . Options:zh-CN(Zhcn Chinese),en-US(Enus English),ja-JP(Jajp Japanese)',
        )
        .optional(),
      user_id: z.string().describe('Initiate review user id，Only self-built applications can return').optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
    }),
    path: z.object({
      instance_id: z
        .string()
        .describe(
          'Approval instance code. If you pass in the uuid when creating the approval instance, you can also obtain the code by passing in the uuid',
        ),
    }),
  },
};
export const approvalV4InstanceList = {
  project: 'approval',
  name: 'approval.v4.instance.list',
  sdkName: 'approval.v4.instance.list',
  path: '/open-apis/approval/v4/instances',
  httpMethod: 'GET',
  description: '[Feishu/Lark]-Approval-Approval instances-Obtain IDs of multiple approval instances',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      page_size: z.number().optional(),
      page_token: z.string().optional(),
      approval_code: z.string().describe('Unique identifier of approval definition'),
      start_time: z.string().describe('Approval instance creation time interval (in ms)'),
      end_time: z.string().describe('Approval instance creation time interval (in ms)'),
    }),
  },
};
export const approvalV4InstancePreview = {
  project: 'approval',
  name: 'approval.v4.instance.preview',
  sdkName: 'approval.v4.instance.preview',
  path: '/open-apis/approval/v4/instances/preview',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Approval instances-Preview approval instances',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string(),
      approval_code: z.string().optional(),
      department_id: z.string().optional(),
      form: z.string().optional(),
      instance_code: z.string().optional(),
      locale: z.string().optional(),
      task_id: z.string().optional(),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4InstanceQuery = {
  project: 'approval',
  name: 'approval.v4.instance.query',
  sdkName: 'approval.v4.instance.query',
  path: '/open-apis/approval/v4/instances/query',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval search-List of instances-The interface queries the list of qualified review instances in the review system through different conditions',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('Fill in the user id according to the user_id_type').optional(),
      approval_code: z.string().describe('Review the code').optional(),
      instance_code: z.string().describe('Review example code').optional(),
      instance_external_id: z
        .string()
        .describe('Review example third party id note: and approval_code and set')
        .optional(),
      group_external_id: z
        .string()
        .describe('Review Definition Group 3rd party id Note: and instance_code take union')
        .optional(),
      instance_title: z.string().describe('Review instance title (only for third-party reviews)').optional(),
      instance_status: z
        .enum(['PENDING', 'RECALL', 'REJECT', 'DELETED', 'APPROVED', 'ALL'])
        .describe(
          'Review instance status, note: if not set, query all status, if not in the collection, report an error Options:PENDING(Under review),RECALL(Withdraw),REJECT(Reject),DELETED(Deleted),APPROVED(Approverd Pass),ALL(All states)',
        )
        .optional(),
      instance_start_time_from: z
        .string()
        .describe('Instance query start time (unix millisecond timestamp)')
        .optional(),
      instance_start_time_to: z.string().describe('Instance query end time (unix millisecond timestamp)').optional(),
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('Area Options:zh-CN(ZhCn Chinese),en-US(EnUs English),ja-JP(JaJp Japanese)')
        .optional(),
    }),
    params: z.object({
      page_size: z.number().optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
    }),
  },
};
export const approvalV4InstanceSearchCc = {
  project: 'approval',
  name: 'approval.v4.instance.searchCc',
  sdkName: 'approval.v4.instance.searchCc',
  path: '/open-apis/approval/v4/instances/search_cc',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval search-List of cc information-The interface queries the qualified review cc list in the review system through different conditions',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('Fill in the user id according to the x_user_type').optional(),
      approval_code: z.string().describe('Review the code').optional(),
      instance_code: z.string().describe('Review example code').optional(),
      instance_external_id: z
        .string()
        .describe('Review example third party id note: and approval_code and set')
        .optional(),
      group_external_id: z
        .string()
        .describe('Review Definition Group 3rd party id Note: and instance_code take union')
        .optional(),
      cc_title: z.string().describe('Approval CC title (only for third-party reviews)').optional(),
      read_status: z
        .enum(['READ', 'UNREAD', 'ALL'])
        .describe(
          'Approval CC status Note: if not in the collection, report an error Options:READ(Read),UNREAD(Unread),ALL(All states)',
        )
        .optional(),
      cc_create_time_from: z.string().describe('CC query start time (unix millisecond timestamp)').optional(),
      cc_create_time_to: z.string().describe('CC query end time (unix millisecond timestamp)').optional(),
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('Area Options:zh-CN(ZhCn Chinese),en-US(EnUs English),ja-JP(JaJp Japanese)')
        .optional(),
    }),
    params: z.object({
      page_size: z.number().describe('Page size').optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
    }),
  },
};
export const approvalV4InstanceSpecifiedRollback = {
  project: 'approval',
  name: 'approval.v4.instance.specifiedRollback',
  sdkName: 'approval.v4.instance.specifiedRollback',
  path: '/open-apis/approval/v4/instances/specified_rollback',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval tasks-Return approval task-Rolls back the current approval to one or more approved task nodes. After the rollback, the approved nodes will generate approval tasks again',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z
        .string()
        .describe(
          'The user ID of the approver of the current approval task, obtained from the task_list field in the instance details, and the status of the corresponding task must be PENDING',
        ),
      task_id: z
        .string()
        .describe(
          'The task ID of the approval task that currently needs to be rolled back, obtained from the task_list field in the instance details, and the status of the corresponding task must be PENDING',
        ),
      reason: z.string().describe('Reason for rollback').optional(),
      extra: z.string().describe('extra info').optional(),
      task_def_key_list: z
        .array(z.string())
        .describe(
          'The task node_key that needs to be returned to. node_key is obtained from the timeline field in the instance details, and the status of the corresponding task must be PASS',
        ),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4TaskApprove = {
  project: 'approval',
  name: 'approval.v4.task.approve',
  sdkName: 'approval.v4.task.approve',
  path: '/open-apis/approval/v4/tasks/approve',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval tasks-Agree to approval task-Approves a single approval task. After that, the approval process will be transferred to the next approver',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('Approval definition code'),
      instance_code: z.string().describe('Approval instance code'),
      user_id: z.string().describe('Fill in the operation user id according to the user_id_type'),
      comment: z.string().describe('Opinion').optional(),
      task_id: z.string().describe('Task ID, approval instance details task_list id'),
      form: z
        .string()
        .describe(
          'JSON array, Widget value(Will affect the process, Required field verification, if some widget is missing)',
        )
        .optional(),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4TaskQuery = {
  project: 'approval',
  name: 'approval.v4.task.query',
  sdkName: 'approval.v4.task.query',
  path: '/open-apis/approval/v4/tasks/query',
  httpMethod: 'GET',
  description: "[Feishu/Lark]-Approval-Approval search-Query the user's task list",
  accessTokens: ['tenant', 'user'],
  schema: {
    params: z.object({
      page_size: z.number().optional(),
      page_token: z.string().optional(),
      user_id: z.string().describe('User ID to query'),
      topic: z
        .enum(['1', '2', '3', '17', '18'])
        .describe(
          'Topic of task group to query, such as "Pending", "Done", etc. Options:1(TodoApproval 待办审批),2(DoneApproval 已办审批),3(InitiatedApproval 已发起审批),17(UnreadNotice 未读知会),18(ReadNotice 已读知会)',
        ),
      user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('User ID type').optional(),
    }),

    useUAT: z.boolean().describe('Use user access token, otherwise use tenant access token').optional(),
  },
};
export const approvalV4TaskReject = {
  project: 'approval',
  name: 'approval.v4.task.reject',
  sdkName: 'approval.v4.task.reject',
  path: '/open-apis/approval/v4/tasks/reject',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Approval tasks-Refuse to approve tasks',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string(),
      instance_code: z.string(),
      user_id: z.string(),
      comment: z.string().optional(),
      task_id: z.string(),
      form: z.string().optional(),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4TaskResubmit = {
  project: 'approval',
  name: 'approval.v4.task.resubmit',
  sdkName: 'approval.v4.task.resubmit',
  path: '/open-apis/approval/v4/tasks/resubmit',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Approval tasks-Resubmit the task for approval',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string(),
      instance_code: z.string(),
      user_id: z.string(),
      comment: z.string().optional(),
      task_id: z.string(),
      form: z.string(),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4TaskSearch = {
  project: 'approval',
  name: 'approval.v4.task.search',
  sdkName: 'approval.v4.task.search',
  path: '/open-apis/approval/v4/tasks/search',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-Approval-Approval search-Query list of tasks-The interface queries the list of qualified review tasks in the review system through different conditions',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('Fill in the Approver id according to the x_user_type').optional(),
      approval_code: z.string().describe('Review the code').optional(),
      instance_code: z.string().describe('Review example code').optional(),
      instance_external_id: z
        .string()
        .describe('Review example third party id note: and approval_code and set')
        .optional(),
      group_external_id: z
        .string()
        .describe('Review Definition Group 3rd party id Note: and instance_code take union')
        .optional(),
      task_title: z.string().describe('Review task title (only for third-party reviews)').optional(),
      task_status: z
        .enum(['PENDING', 'REJECTED', 'APPROVED', 'TRANSFERRED', 'DONE', 'RM_REPEAT', 'PROCESSED', 'ALL'])
        .describe(
          'Review task status, note: if not in the collection, report an error Options:PENDING(Under review),REJECTED(Reject),APPROVED(Approverd Pass),TRANSFERRED(Transfer),DONE(Completed),RM_REPEAT(Deduplicate),PROCESSED(Processed),ALL(All states)',
        )
        .optional(),
      task_start_time_from: z.string().describe('task query start time (unix millisecond timestamp)').optional(),
      task_start_time_to: z.string().describe('task query end time (unix millisecond timestamp)').optional(),
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('Area Options:zh-CN(ZhCn Chinese),en-US(EnUs English),ja-JP(JaJp Japanese)')
        .optional(),
      task_status_list: z
        .array(z.string())
        .describe(
          'Multiple states in the task_status can be selected, when this parameter is filled, the task_status invalidated',
        )
        .optional(),
      order: z
        .number()
        .describe(
          'Sort by task time Options:0(UpdateTimeDESC Reverse update_time),1(UpdateTimeASC Line up update_time),2(StartTimeDESC Reverse start_time),3(StartTimeASC Line up start_time)',
        )
        .optional(),
    }),
    params: z.object({
      page_size: z.number().describe('Page size').optional(),
      page_token: z
        .string()
        .describe(
          'Page identifier. It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('User ID type').optional(),
    }),
  },
};
export const approvalV4TaskTransfer = {
  project: 'approval',
  name: 'approval.v4.task.transfer',
  sdkName: 'approval.v4.task.transfer',
  path: '/open-apis/approval/v4/tasks/transfer',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-Approval-Approval tasks-Transfer the approval task',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string(),
      instance_code: z.string(),
      user_id: z.string(),
      comment: z.string().optional(),
      transfer_user_id: z.string(),
      task_id: z.string(),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('User ID type').optional() }),
  },
};
export const approvalV4Tools = [
  approvalV4ApprovalCreate,
  approvalV4ApprovalGet,
  approvalV4ApprovalSubscribe,
  approvalV4ApprovalUnsubscribe,
  approvalV4ExternalApprovalCreate,
  approvalV4ExternalApprovalGet,
  approvalV4ExternalInstanceCheck,
  approvalV4ExternalInstanceCreate,
  approvalV4ExternalTaskList,
  approvalV4InstanceAddSign,
  approvalV4InstanceCancel,
  approvalV4InstanceCc,
  approvalV4InstanceCommentCreate,
  approvalV4InstanceCommentDelete,
  approvalV4InstanceCommentList,
  approvalV4InstanceCommentRemove,
  approvalV4InstanceCreate,
  approvalV4InstanceGet,
  approvalV4InstanceList,
  approvalV4InstancePreview,
  approvalV4InstanceQuery,
  approvalV4InstanceSearchCc,
  approvalV4InstanceSpecifiedRollback,
  approvalV4TaskApprove,
  approvalV4TaskQuery,
  approvalV4TaskReject,
  approvalV4TaskResubmit,
  approvalV4TaskSearch,
  approvalV4TaskTransfer,
];
