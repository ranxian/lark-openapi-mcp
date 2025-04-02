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
    '[Feishu/Lark]-审批-原生审批定义-创建审批定义-用于通过接口创建简单的审批定义，可以灵活指定定义的基础信息、表单和流程等。创建成功后，不支持从审批管理后台删除该定义。不推荐企业自建应用使用，如有需要尽量联系管理员在审批管理后台创建定义',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_name: z.string().describe('审批名称的国际化文案 Key，以 @i18n@ 开头，长度不得少于 9 个字符'),
      approval_code: z
        .string()
        .describe('审批定义 Code。不传值表示新建；传入指定 Code 表示覆盖原定义内容进行全量更新')
        .optional(),
      description: z.string().describe('审批描述的国际化文案 Key，以 @i18n@ 开头，长度不得少于 9 个字符').optional(),
      viewers: z
        .array(
          z.object({
            viewer_type: z
              .enum(['TENANT', 'DEPARTMENT', 'USER', 'NONE'])
              .describe(
                '可见人类型 Options:TENANT(租户内可见),DEPARTMENT(指定部门),USER(指定用户),NONE(任何人都不可见)',
              )
              .optional(),
            viewer_user_id: z.string().describe('当 viewer_type 是 USER，根据user_id_type填写用户id').optional(),
            viewer_department_id: z
              .string()
              .describe('当 viewer_type 为DEPARTMENT，根据department_id_type填写部门id')
              .optional(),
          }),
        )
        .describe(
          'viewers 字段指定了哪些人能从审批应用的前台发起该审批（列表最大支持长度200）。 1. 当 viewer_type 为 USER，需要填写viewer_user_id； 2. 当 viewer_type 为DEPARTMENT，需要填写viewer_department_id； 3. 当 viewer_type 为TENANT或NONE时，viewer_user_id和viewer_department_id无需填写',
        ),
      form: z
        .object({ form_content: z.string().describe('审批定义表单，json 数组，见下方form_content字段说明') })
        .describe('审批定义表单'),
      node_list: z
        .array(
          z.object({
            id: z
              .string()
              .describe(
                '节点 ID，开始节点的 ID 为 START，结束节点的 ID 为 END，开始和结束节点不需要指定 name、node_type 以及 approver',
              ),
            name: z.string().describe('节点名称的国际化文案 Key，以 @i18n@ 开头，长度不得少于 9 个字符').optional(),
            node_type: z
              .enum(['AND', 'OR', 'SEQUENTIAL'])
              .describe(
                '审批类型枚举,当 node_type 为依次审批时，审批人必须为『发起人自选』 Options:AND(会签),OR(或签),SEQUENTIAL(Sequental 依次审批)',
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
                      '审批/抄送人类型， 1. 当 type 为 Supervisor、SupervisorTopDown、DepartmentManager 、DepartmentManagerTopDown 这 4 种时，需要在 level 中填写对应的级数，例如：由下往上三级主管审批，level = 3； 2. 当 type 为 Personal 时，需要填写对应的user_id ，用于指定用户； 3. 当 type 为 Free 发起人自选时，不需要指定 user_id 和level； 4. ccer不支持 Free 发起人自选 Options:Supervisor(主管审批（由下往上）),SupervisorTopDown(主管审批（从上往下）),DepartmentManager(部门负责人审批（由下往上）),DepartmentManagerTopDown(部门负责人审批（从上往下）),Personal(指定成员),Free(发起人自选)',
                    ),
                  user_id: z.string().describe('用户id，根据user_id_type填写').optional(),
                  level: z
                    .string()
                    .describe(
                      '审批级数，当 type 为 Supervisor、SupervisorTopDown、DepartmentManager 、DepartmentManagerTopDown 这 4 种时，需要在 level 中填写对应的级数，例如：由下往上三级主管审批，level = 3',
                    )
                    .optional(),
                }),
              )
              .describe('审批人列表')
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
                      '审批/抄送人类型， 1. 当 type 为 Supervisor、SupervisorTopDown、DepartmentManager 、DepartmentManagerTopDown 这 4 种时，需要在 level 中填写对应的级数，例如：由下往上三级主管审批，level = 3； 2. 当 type 为 Personal 时，需要填写对应的user_id ，用于指定用户； 3. 当 type 为 Free 发起人自选时，不需要指定 user_id 和level； 4. ccer不支持 Free 发起人自选 Options:Supervisor(主管审批（由下往上）),SupervisorTopDown(主管审批（从上往下）),DepartmentManager(部门负责人审批（由下往上）),DepartmentManagerTopDown(部门负责人审批（从上往下）),Personal(指定成员),Free(发起人自选)',
                    ),
                  user_id: z.string().describe('用户id，根据user_id_type填写').optional(),
                  level: z
                    .string()
                    .describe(
                      '审批级数，当 type 为 Supervisor、SupervisorTopDown、DepartmentManager 、DepartmentManagerTopDown 这 4 种时，需要在 level 中填写对应的级数，例如：由下往上三级主管审批，level = 3',
                    )
                    .optional(),
                }),
              )
              .describe('抄送人列表')
              .optional(),
            privilege_field: z
              .object({
                writable: z.array(z.string()).describe('可写权限的表单项的 id列表'),
                readable: z.array(z.string()).describe('可读权限的表单项的 id列表'),
              })
              .describe('表单项的控件权限')
              .optional(),
            approver_chosen_multi: z.boolean().describe('自选审批人是否允许多选').optional(),
            approver_chosen_range: z
              .array(
                z.object({
                  type: z
                    .enum(['ALL', 'PERSONAL', 'ROLE'])
                    .describe('审批人类型 Options:ALL(全租户),PERSONAL(指定审批人),ROLE(指定角色)')
                    .optional(),
                  id_list: z.array(z.string()).describe('审批人id').optional(),
                }),
              )
              .describe('自选审批人选择范围')
              .optional(),
            starter_assignee: z
              .enum(['STARTER', 'AUTO_PASS', 'SUPERVISOR', 'DEPARTMENT_MANAGER'])
              .describe(
                '审批人为提交人时的操作 Options:STARTER(发起人本人审批),AUTO_PASS(自动通过),SUPERVISOR(直属上级审批),DEPARTMENT_MANAGER(直属部门负责人审批)',
              )
              .optional(),
          }),
        )
        .describe('审批定义节点，需要将开始节点作为 list 第一个元素，结束节点作为最后一个元素'),
      settings: z
        .object({
          revert_interval: z
            .number()
            .describe('审批实例通过后允许撤回的时间，以秒为单位，默认 31 天，0 为不可撤回')
            .optional(),
          revert_option: z.number().describe('是否支持审批通过第一个节点后撤回，默认为1，0为不支持').optional(),
          reject_option: z
            .number()
            .describe(
              '拒绝设置 Options:0(RejectDefault 默认设置，流程被终止),1(RejectSubmit 退回至发起人，发起人可编辑流程后重新提交)',
            )
            .optional(),
          quick_approval_option: z
            .number()
            .describe(
              '快捷审批配置项，开启后可在卡片上直接审批。默认值1为启用， 0为禁用 Options:0(Close 禁用),1(Open 启用)',
            )
            .optional(),
        })
        .describe('审批定义其他设置')
        .optional(),
      config: z
        .object({
          can_update_viewer: z.boolean().describe('允许用户修改可见范围'),
          can_update_form: z.boolean().describe('允许用户更新表单'),
          can_update_process: z.boolean().describe('允许用户更新流程定义'),
          can_update_revert: z.boolean().describe('允许用户更新撤回设置'),
          help_url: z.string().describe('帮助文档链接').optional(),
        })
        .describe('审批定义配置项，用于配置对应审批定义是否可以由用户在审批后台进行修改')
        .optional(),
      icon: z
        .number()
        .describe(
          '审批图标枚举，默认为 0。详情参考',
        )
        .optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe(
                '语言可选值有： zh-CN：中文 en-US：英文 ja-JP：日文 Options:zh-CN(Zhcn 中文),en-US(Enus 英文),ja-JP(Jajp 日文)',
              ),
            texts: z
              .array(z.object({ key: z.string().describe('文案key'), value: z.string().describe('文案') }))
              .describe(
                '文案 key, value, i18n key 以 @i18n@ 开头； 该字段主要用于做国际化，允许用户同时传多个语言的文案，审批中心会根据用户当前的语音环境使用对应的文案，如果没有传用户当前的语音环境文案，则会使用默认的语言文案',
              ),
            is_default: z
              .boolean()
              .describe('是否默认语言，默认语言需要包含所有key，非默认语言如果key不存在会使用默认语言代替'),
          }),
        )
        .describe('国际化文案'),
      process_manager_ids: z
        .array(z.string())
        .describe('根据user_id_type填写流程管理员的用户id（列表最大支持长度200）')
        .optional(),
    }),
    params: z.object({
      department_id_type: z
        .enum(['department_id', 'open_department_id'])
        .describe(
          '此次调用中使用的部门ID的类型 Options:department_id(DepartmentId 以自定义department_id来标识部门),open_department_id(OpenDepartmentId 以open_department_id来标识部门)',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
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
    '[Feishu/Lark]-审批-原生审批定义-查看指定审批定义-根据 Approval Code 获取某个审批定义的详情，用于构造创建审批实例的请求',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('语言可选值 Options:zh-CN(Zhcn 中文),en-US(Enus 英文),ja-JP(Jajp 日文)')
        .optional(),
      with_admin_id: z.boolean().describe('可选是否返回有数据权限审批流程管理员ID列表').optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
    }),
    path: z.object({ approval_code: z.string().describe('审批定义 Code') }),
  },
};
export const approvalV4ApprovalSubscribe = {
  project: 'approval',
  name: 'approval.v4.approval.subscribe',
  sdkName: 'approval.v4.approval.subscribe',
  path: '/open-apis/approval/v4/approvals/:approval_code/subscribe',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-审批-审批事件-事件接口-订阅审批事件-当应用后，需要调用该接口指定审批定义 Code（approval_code）开启订阅，开启后应用才可以接收该审批定义对应的事件',
  accessTokens: ['tenant'],
  schema: {
    path: z.object({
      approval_code: z
        .string()
        .describe(
          '审批定义 Code。获取方式：- 调用接口后，从响应参数 approval_code 获取。- 登录审批管理后台，在指定审批定义的 URL 中获取，具体操作参见',
        ),
    }),
  },
};
export const approvalV4ApprovalUnsubscribe = {
  project: 'approval',
  name: 'approval.v4.approval.unsubscribe',
  sdkName: 'approval.v4.approval.unsubscribe',
  path: '/open-apis/approval/v4/approvals/:approval_code/unsubscribe',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-审批-审批事件-事件接口-取消订阅审批事件-调用接口订阅审批定义 Code 后，如果不再需要接收该审批定义下的事件订阅通知，可以调用本接口取消订阅审批定义 Code，取消后应用无法再收到该审批定义对应实例的事件通知',
  accessTokens: ['tenant'],
  schema: {
    path: z.object({
      approval_code: z
        .string()
        .describe(
          '审批定义 Code。获取方式：- 调用接口后，从响应参数 approval_code 获取。- 登录审批管理后台，在指定审批定义的 URL 中获取，具体操作参见',
        )
        .optional(),
    }),
  },
};
export const approvalV4ExternalApprovalCreate = {
  project: 'approval',
  name: 'approval.v4.externalApproval.create',
  sdkName: 'approval.v4.externalApproval.create',
  path: '/open-apis/approval/v4/external_approvals',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-审批-三方审批定义-创建三方审批定义-审批定义是审批的描述，包括审批名称、描述等基础信息。创建好审批定义，用户就可以在审批应用的发起页中看到审批，如果用户点击发起，则会跳转到配置的发起三方系统地址去发起审批。另外，审批定义还配置了审批操作时的回调地址：审批人在待审批列表中进行【同意】【拒绝】操作时，审批中心会调用回调地址通知三方系统',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_name: z.string().describe('审批名称的国际化文案 Key，以 @i18n@ 开头，长度不得少于 9 个字符'),
      approval_code: z
        .string()
        .describe(
          '该值用于判断调用当前接口是创建审批定义还是更新审批定义。具体说明：- 如果传入的值系统可以匹配到已存在的审批定义 approval_code，则调用该接口会更新相应的审批定义。- 如果传入的值系统匹配不到任何审批定义 approval_code，则会新建一个审批定义，并返回新建的审批定义真实的 approval_code（并非你通过该参数传入的值）',
        ),
      group_code: z
        .string()
        .describe(
          '审批定义所属审批分组，用户自定义； 如果group_code当前不存在，则会新建审批分组； 如果group_code已经存在，则会使用group_name更新审批分组名称',
        ),
      group_name: z
        .string()
        .describe(
          '分组名称，值的格式是 i18n key，文案放在 i18n_resource； 如果是 group_code 当前不存在，则该 group_name 必填，否则，如果填写了则会更新分组名称，不填则不更新分组名称； 审批发起页 审批定义的分组名称来自该字段',
        )
        .optional(),
      description: z
        .string()
        .describe(
          '审批定义的说明，值的格式是 i18n key，文案放在 i18n_resource； 审批发起页 审批定义的说明内容来自该字段',
        )
        .optional(),
      external: z
        .object({
          biz_name: z
            .string()
            .describe('列表中用于提示审批来自哪里，i18n key， 注意不需要“来自”前缀，审批中心会拼上前缀')
            .optional(),
          biz_type: z.string().describe('审批定义业务类别').optional(),
          create_link_mobile: z
            .string()
            .describe(
              '移动端发起链接，如果设置了该链接，则会在移动端审批发起页展示该审批，用户点击后会跳转到该链接进行发起； 如果不填，则在mobile端不显示该审批',
            )
            .optional(),
          create_link_pc: z
            .string()
            .describe(
              'PC端发起链接，如果设置了该链接，则会在PC端审批发起页展示该审批，用户点击后会跳转到该链接进行发起； 如果不填，则在PC端不显示该审批；',
            )
            .optional(),
          support_pc: z
            .boolean()
            .describe('审批定义是否要在PC端的发起审批页面展示，如果为 true则展示，否则不展示')
            .optional(),
          support_mobile: z
            .boolean()
            .describe(
              '审批定义是否要在移动端的发起审批页面展示，如果为 true则展示，否则不展示；support_pc和support_mobile不可都为false；',
            )
            .optional(),
          support_batch_read: z.boolean().describe('是否支持批量已读').optional(),
          enable_mark_readed: z.boolean().describe('是否支持标注可读（该字段无效）').optional(),
          enable_quick_operate: z.boolean().describe('是否支持快速操作（该字段无效）').optional(),
          action_callback_url: z
            .string()
            .describe(
              '三方系统的操作回调 url，【待审批】列表的任务审批人点同意或拒绝操作后，审批中心调用该地址通知三方系统，回调地址相关信息可参见：',
            )
            .optional(),
          action_callback_token: z
            .string()
            .describe(
              '回调时带的 token， 用于业务系统验证请求来自审批,具体参考 ',
            )
            .optional(),
          action_callback_key: z
            .string()
            .describe(
              '请求参数加密密钥，如果配置了该参数，则会对请求参数进行加密，业务需要对请求进行解密，加解密算法参考 ',
            )
            .optional(),
          allow_batch_operate: z.boolean().describe('是否支持批量审批').optional(),
          exclude_efficiency_statistics: z.boolean().describe('审批流程数据是否不纳入效率统计').optional(),
        })
        .describe('三方审批相关'),
      viewers: z
        .array(
          z.object({
            viewer_type: z
              .enum(['TENANT', 'DEPARTMENT', 'USER', 'NONE'])
              .describe(
                '可见人类型 Options:TENANT(租户内可见),DEPARTMENT(指定部门),USER(指定用户),NONE(任何人都不可见)',
              )
              .optional(),
            viewer_user_id: z.string().describe('当 viewer_type 是 USER，根据user_id_type填写用户id').optional(),
            viewer_department_id: z
              .string()
              .describe('当 viewer_type 为DEPARTMENT，根据department_id_type填写部门id')
              .optional(),
          }),
        )
        .describe(
          '可见人列表（最大支持长度200），可通知配置多个可见人，只有在配置的范围内用户可以在审批发起页看到该审批，默认不传，则是任何人不可见',
        )
        .optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe(
                '语言可选值有： zh-CN：中文 en-US：英文 ja-JP：日文 Options:zh-CN(Zhcn 中文),en-US(Enus 英文),ja-JP(Jajp 日文)',
              ),
            texts: z
              .array(z.object({ key: z.string().describe('文案key'), value: z.string().describe('文案') }))
              .describe(
                '文案 key, value, i18n key 以 @i18n@ 开头； 该字段主要用于做国际化，允许用户同时传多个语言的文案，审批中心会根据用户当前的语音环境使用对应的文案，如果没有传用户当前的语音环境文案，则会使用默认的语言文案',
              ),
            is_default: z
              .boolean()
              .describe('是否默认语言，默认语言需要包含所有key，非默认语言如果key不存在会使用默认语言代替'),
          }),
        )
        .describe('国际化文案')
        .optional(),
      managers: z.array(z.string()).describe('根据user_id_type填写流程管理员id列表（最大支持长度200）').optional(),
    }),
    params: z.object({
      department_id_type: z
        .enum(['department_id', 'open_department_id'])
        .describe(
          '此次调用中使用的部门ID的类型 Options:department_id(DepartmentId 以自定义department_id来标识部门),open_department_id(OpenDepartmentId 以open_department_id来标识部门)',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
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
    '[Feishu/Lark]-审批-三方审批定义-查看指定三方审批定义-根据 Approval Code 获取之前同步的某个三方审批定义的详情数据',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional() }),
    path: z.object({
      approval_code: z
        .string()
        .describe(
          '调用时返回的审批定义code',
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
  description: '[Feishu/Lark]-审批-三方审批实例-校验三方审批实例',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      instances: z
        .array(
          z.object({
            instance_id: z.string().describe('审批实例 id'),
            update_time: z.string().describe('审批实例最近更新时间'),
            tasks: z
              .array(
                z.object({
                  task_id: z.string().describe('任务 id'),
                  update_time: z.string().describe('任务最近更新时间'),
                }),
              )
              .describe('任务信息'),
          }),
        )
        .describe('校验的实例信息'),
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
    '[Feishu/Lark]-审批-三方审批实例-同步三方审批实例-审批中心不负责审批的流转，审批的流转在三方系统，三方系统在审批流转后生成的审批实例、审批任务、审批抄送数据同步到审批中心。用户可以在审批中心中浏览三方系统同步过来的实例、任务、抄送信息，并且可以跳转回三方系统进行更详细的查看和操作，其中实例信息在【已发起】列表，任务信息在【待审批】和【已审批】列表，抄送信息在【抄送我】列表。对于审批任务，三方系统也可以配置审批任务的回调接口，这样审批人可以在审批中心中直接进行审批操作，审批中心会回调三方系统，三方系统收到回调后更新任务信息，并将新的任务信息同步回审批中心，形成闭环。',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z
        .string()
        .describe(
          '审批定义 code， 创建审批定义返回的值，表示该实例属于哪个流程；该字段会影响到列表中该实例的标题，标题取自对应定义的 name 字段',
        ),
      status: z
        .enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'DELETED', 'HIDDEN', 'TERMINATED'])
        .describe(
          '审批实例状态 Options:PENDING(审批中),APPROVED(审批流程结束，结果为同意),REJECTED(审批流程结束，结果为拒绝),CANCELED(审批发起人撤回),DELETED(审批被删除),HIDDEN(状态隐藏(不显示状态)),TERMINATED(审批终止)',
        ),
      extra: z
        .string()
        .describe(
          '审批实例扩展 JSON。单据编号通过传business_key字段来实现。以下示例值未转义，使用时请注意转义。你可查看请求体示例中转义后的 extra 示例值',
        )
        .optional(),
      instance_id: z.string().describe('审批实例唯一标识，用户自定义，需确保证租户和应用下都唯一'),
      links: z
        .object({
          pc_link: z
            .string()
            .describe('pc 端的跳转链接，当用户使用飞书 pc 端时，使用该字段进行跳转，托管的链接保持不变'),
          mobile_link: z
            .string()
            .describe('移动端 跳转链接，当用户使用飞书 移动端时，使用该字段进行跳转，托管的链接保持不变')
            .optional(),
        })
        .describe(
          '审批实例链接集合 ，用于【已发起】列表的跳转，跳转回三方系统； pc_link 和 mobile_link 必须填一个，填写的是哪一端的链接，即会跳转到该链接，不受平台影响',
        ),
      title: z
        .string()
        .describe(
          '审批展示名称，如果填写了该字段，则审批列表中的审批名称使用该字段，如果不填该字段，则审批名称使用审批定义的名称',
        )
        .optional(),
      form: z
        .array(
          z.object({
            name: z.string().describe('表单字段名称').optional(),
            value: z.string().describe('表单值').optional(),
          }),
        )
        .describe(
          '用户提交审批时填写的表单数据，用于所有审批列表中展示。可传多个值，但审批中心仅展示前 3 个，长度不超过 2048 字符',
        )
        .optional(),
      user_id: z
        .string()
        .describe(
          '审批发起人 user_id，发起人可在【已发起】列表中看到所有已发起的审批; 在【待审批】，【已审批】【抄送我】列表中，该字段展示审批是谁发起的',
        )
        .optional(),
      user_name: z
        .string()
        .describe('审批发起人 用户名，如果发起人不是真实的用户（例如是某个部门），没有 user_id，则可以使用该字段传名称')
        .optional(),
      open_id: z.string().describe('审批发起人 open id').optional(),
      department_id: z
        .string()
        .describe(
          '发起人部门，用于列表中展示发起人所属部门。不传则不展示。如果用户没加入任何部门，传 ""，将展示租户名称传 department_name 展示部门名称',
        )
        .optional(),
      department_name: z
        .string()
        .describe(
          '审批发起人 部门，如果发起人不是真实的用户（例如是某个部门），没有 department_id，则可以使用该字段传名称',
        )
        .optional(),
      start_time: z.string().describe('审批发起时间，Unix毫秒时间戳'),
      end_time: z.string().describe('审批实例结束时间：未结束的审批为 0，Unix毫秒时间戳'),
      update_time: z
        .string()
        .describe(
          '审批实例最近更新时间；用于推送数据版本控制如果 update_mode 值为 UPDATE，则只有传过来的 update_time 有变化时（变大），才会更新审批中心中的审批实例信息。使用该字段主要用来避免并发时老的数据更新了新的数据',
        ),
      display_method: z
        .enum(['BROWSER', 'SIDEBAR', 'NORMAL', 'TRUSTEESHIP'])
        .describe(
          '列表页打开审批实例的方式 Options:BROWSER(跳转系统默认浏览器打开),SIDEBAR(飞书中侧边抽屉打开),NORMAL(飞书内嵌页面打开),TRUSTEESHIP(以托管打开)',
        )
        .optional(),
      update_mode: z
        .enum(['REPLACE', 'UPDATE'])
        .describe(
          '更新方式， 当 update_mode=REPLACE时，每次都以当前推送的数据为最终数据，会删掉审批中心中多余的任务、抄送数据（不在这次推送的数据中）; 当 update_mode=UPDATE时，则不会删除审批中心的数据，而只是进行新增和更新实例、任务数据 Options:REPLACE(全量替换，默认值),UPDATE(增量更新)',
        )
        .optional(),
      task_list: z
        .array(
          z.object({
            task_id: z.string().describe('审批实例内的唯一标识，用于更新审批任务时定位数据'),
            user_id: z
              .string()
              .describe('审批人 user_id，和 open_id 二者至少填一个。该任务会出现在审批人的【待审批】或【已审批】列表中')
              .optional(),
            open_id: z.string().describe('审批人 open_id，和 user_id 二者至少填一个').optional(),
            title: z.string().describe('审批任务名称').optional(),
            links: z
              .object({
                pc_link: z.string().describe('pc 端的跳转链接，当用户使用飞书 pc 端时，使用该字段进行跳转'),
                mobile_link: z
                  .string()
                  .describe('移动端 跳转链接，当用户使用飞书 移动端时，使用该字段进行跳转')
                  .optional(),
              })
              .describe(
                '【待审批】或【已审批】中使用的跳转链接，用于跳转回三方系统pc_link 和 mobile_link 必须填一个，填写的是哪一端的链接，即会跳转到该链接，不受平台影响',
              ),
            status: z
              .enum(['PENDING', 'APPROVED', 'REJECTED', 'TRANSFERRED', 'DONE'])
              .describe(
                '任务状态 Options:PENDING(待审批),APPROVED(任务同意),REJECTED(Reject 任务拒绝),TRANSFERRED(Transefrred 任务转交),DONE(任务通过但审批人未操作；审批人看不到这个任务, 若想要看到, 可以通过抄送该人.)',
              ),
            extra: z
              .string()
              .describe(
                '扩展 json，任务结束原因需传complete_reason字段。枚举值与对应说明： - approved：同意 - rejected：拒绝 - node_auto_reject：（因逻辑判断产生的）自动拒绝 - specific_rollback：退回（包括退回到发起人、退回到中间任一审批人） - add：并加签（添加新审批人，和我一起审批） - add_pre：前加签（添加新审批人，在我之前审批） - add_post：后加签（添加新审批人，在我之后审批） - delete_assignee：减签 - forward: 手动转交 - forward_resign：离职自动转交 - recall：撤销（撤回单据，单据失效） - delete ：删除审批单 - admin_forward：管理员在后台操作转交 - system_forward：系统自动转交 - auto_skip：自动通过 - manual_skip：手动跳过 - submit_again：重新提交任务 - restart：重新启动流程 - others：其他（作为兜底）',
              )
              .optional(),
            create_time: z.string().describe('任务创建时间，Unix 毫秒时间戳'),
            end_time: z.string().describe('任务完成时间：未结束的审批为 0，Unix 毫秒时间戳'),
            update_time: z
              .string()
              .describe('task最近更新时间，用于推送数据版本控制； 更新策略同 instance 中的 update_time')
              .optional(),
            action_context: z
              .string()
              .describe('操作上下文，当用户操作时，回调请求中带上该参数，用于传递该任务的上下文数据')
              .optional(),
            action_configs: z
              .array(
                z.object({
                  action_type: z
                    .string()
                    .describe(
                      '操作类型，每个任务都可以配置2个操作，会展示审批列表中，当用户操作时，回调请求会带上该字段，表示用户进行了同意操作还是拒绝操作**可选值有**：<md-enum><md-enum-item key="APPROVE" >同意</md-enum-item><md-enum-item key="REJECT" >拒绝</md-enum-item><md-enum-item key="{KEY}" >任意字符串，如果使用任意字符串，则需要提供 action_name</md-enum-item></md-enum>',
                    ),
                  action_name: z
                    .string()
                    .describe(
                      '操作名称，i18n key 用于前台展示，如果 action_type 不是 APPROVAL和REJECT，则必须提供该字段，用于展示特定的操作名称',
                    )
                    .optional(),
                  is_need_reason: z
                    .boolean()
                    .describe('是否需要意见, 如果为true,则用户操作时，会跳转到 意见填写页面')
                    .optional(),
                  is_reason_required: z.boolean().describe('审批意见是否必填').optional(),
                  is_need_attachment: z.boolean().describe('意见是否支持上传附件').optional(),
                }),
              )
              .describe('任务级别操作配置,快捷审批目前支持移动端操作')
              .optional(),
            display_method: z
              .enum(['BROWSER', 'SIDEBAR', 'NORMAL', 'TRUSTEESHIP'])
              .describe(
                '列表页打开审批任务的方式 Options:BROWSER(跳转系统默认浏览器打开),SIDEBAR(Sidbar 飞书中侧边抽屉打开),NORMAL(飞书内嵌页面打开),TRUSTEESHIP(以托管模式打开)',
              )
              .optional(),
            exclude_statistics: z
              .boolean()
              .describe('三方任务支持不纳入效率统计。false：纳入效率统计。true：不纳入效率统计')
              .optional(),
            node_id: z
              .string()
              .describe(
                '节点id：必须同时满足- 一个流程内，每个节点id唯一。如一个流程下「直属上级」、「隔级上级」等每个节点的Node_id均不一样- 同一个流程定义内，不同审批实例中的相同节点，Node_id要保持不变。例如张三和李四分别发起了请假申请，这2个审批实例中的「直属上级」节点的node_id应该保持一致',
              )
              .optional(),
            node_name: z
              .string()
              .describe(
                '节点名称，如「财务审批」「法务审批」，支持中英日三种语言。示例：i18n@name。需要在i18n_resources中传该名称对应的国际化文案',
              )
              .optional(),
          }),
        )
        .describe('任务列表')
        .optional(),
      cc_list: z
        .array(
          z.object({
            cc_id: z.string().describe('审批实例内唯一标识'),
            user_id: z.string().describe('抄送人 employee id').optional(),
            open_id: z.string().describe('抄送人 open id，和user id 二者至少填一个').optional(),
            links: z
              .object({
                pc_link: z.string().describe('pc 端的跳转链接，当用户使用飞书 pc 端时，使用该字段进行跳转'),
                mobile_link: z
                  .string()
                  .describe('移动端 跳转链接，当用户使用飞书 移动端时，使用该字段进行跳转')
                  .optional(),
              })
              .describe(
                '跳转链接，用于【抄送我的】列表中的跳转pc_link 和 mobile_link 必须填一个，填写的是哪一端的链接，即会跳转到该链接，不受平台影响',
              ),
            read_status: z.enum(['READ', 'UNREAD']).describe('阅读状态 Options:READ(已读),UNREAD(未读)'),
            extra: z.string().describe('扩展 json').optional(),
            title: z.string().describe('抄送任务名称').optional(),
            create_time: z.string().describe('抄送发起时间，Unix 毫秒时间戳'),
            update_time: z.string().describe('抄送最近更新时间，用于推送数据版本控制更新策略同 instance 的update_time'),
            display_method: z
              .enum(['BROWSER', 'SIDEBAR', 'NORMAL', 'TRUSTEESHIP'])
              .describe(
                '列表页打开审批任务的方式 Options:BROWSER(跳转系统默认浏览器打开),SIDEBAR(飞书中侧边抽屉打开),NORMAL(飞书内嵌页面打开),TRUSTEESHIP(以托管模式打开)',
              )
              .optional(),
          }),
        )
        .describe('抄送列表')
        .optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe(
                '语言可选值有： zh-CN：中文 en-US：英文 ja-JP：日文 Options:zh-CN(Zhcn 中文),en-US(Enus 英文),ja-JP(Jajp 日文)',
              ),
            texts: z
              .array(z.object({ key: z.string().describe('文案 key'), value: z.string().describe('文案') }))
              .describe(
                '文案 key, value, i18n key 以 @i18n@ 开头； 该字段主要用于做国际化，允许用户同时传多个语言的文案，审批中心会根据用户当前的语音环境使用对应的文案，如果没有传用户当前的语音环境文案，则会使用默认的语言文案',
              ),
            is_default: z
              .boolean()
              .describe('是否默认语言，默认语言需要包含所有key，非默认语言如果key不存在会使用默认语言代替'),
          }),
        )
        .describe('国际化文案'),
      trusteeship_url_token: z.string().describe('单据托管认证token，托管回调会附带此token，帮助业务方认证').optional(),
      trusteeship_user_id_type: z
        .string()
        .describe('用户的类型，会影响请求参数用户标识域的选择，包括加签操作回传的目标用户， 目前仅支持 "user_id"')
        .optional(),
      trusteeship_urls: z
        .object({
          form_detail_url: z.string().describe('获取表单schema相关数据的url地址').optional(),
          action_definition_url: z.string().describe('表示获取审批操作区数据的url地址').optional(),
          approval_node_url: z.string().describe('获取审批记录相关数据的url地址').optional(),
          action_callback_url: z.string().describe('进行审批操作时回调的url地址').optional(),
          pull_business_data_url: z
            .string()
            .describe(
              '获取托管动态数据url 地址，使用该接口时必须要保证历史托管单据的数据中都同步了该接口地址，如果历史单据中没有该接口需要重新同步历史托管单据的数据来更新该URL。该接口用于飞书审批前端和业务线进行交互使用,只有使用审批前端的特定组件(由飞书审批前端提供的组件，并且需要和业务线进行接口交互的组件)才会需要',
            )
            .optional(),
        })
        .describe('单据托管回调接入方的接口的URL地址')
        .optional(),
      trusteeship_cache_config: z
        .object({
          form_policy: z
            .enum(['DISABLE', 'IMMUTABLE', 'BY_NODE', 'BY_USER'])
            .describe(
              '托管预缓存策略 Options:DISABLE(不启用，默认),IMMUTABLE(表单不会随流程进行改变),BY_NODE(ByNode 跟随流程节点变更更新缓存),BY_USER(ByUser 对于每个待办任务存储一份)',
            )
            .optional(),
          form_vary_with_locale: z.boolean().describe('表单是否随国际化改变').optional(),
          form_version: z
            .string()
            .describe('当前使用的表单版本号，保证表单改变后，版本号增加，实际值为int64整数')
            .optional(),
        })
        .describe('托管预缓存策略')
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
    '[Feishu/Lark]-审批-三方审批任务-获取三方审批任务状态-该接口用于获取三方审批的状态。用户传入查询条件，接口返回满足条件的审批实例的状态',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_codes: z.array(z.string()).describe('审批定义 Code，用于指定只获取这些定义下的数据').optional(),
      instance_ids: z
        .array(z.string())
        .describe('审批实例 ID, 用于指定只获取这些实例下的数据，最多支持 20 个')
        .optional(),
      user_ids: z.array(z.string()).describe('审批人 user_id，用于指定只获取这些用户的数据').optional(),
      status: z
        .enum(['PENDING', 'APPROVED', 'REJECTED', 'TRANSFERRED', 'DONE'])
        .describe(
          '审批任务状态，用于指定获取该状态下的数据 Options:PENDING(审批中),APPROVED(审批流程结束，结果为同意),REJECTED(审批流程结束，结果为拒绝),TRANSFERRED(任务转交),DONE(任务通过但审批人未操作；审批人看不到这个任务, 若想要看到, 可以通过抄送该人.)',
        )
        .optional(),
    }),
    params: z.object({
      page_size: z.number().describe('分页大小').optional(),
      page_token: z
        .string()
        .describe(
          '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
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
  description: '[Feishu/Lark]-审批-原生审批任务-审批任务加签',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('操作用户id'),
      approval_code: z.string().describe('审批定义code'),
      instance_code: z.string().describe('审批实例code'),
      task_id: z.string().describe('任务id'),
      comment: z.string().describe('意见').optional(),
      add_sign_user_ids: z.array(z.string()).describe('被加签人id'),
      add_sign_type: z
        .number()
        .describe(
          '1/2/3分别代表前加签/后加签/并加签 Options:1(add_sign_pre 前加签),2(add_sign_post 后加签),3(add_sign_parallel 并加签)',
        ),
      approval_method: z
        .number()
        .describe(
          '仅在前加签、后加签时需要填写，1/2 分别代表或签/会签 Options:1(or_sign 或签),2(add_sign 会签),3(sequential_sign 依次审批)',
        )
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
    '[Feishu/Lark]-审批-原生审批实例-撤回审批实例-如果管理员在后台设置了 **允许撤销审批中的申请** 或者 **允许撤销 x 天内通过的审批**，则在符合规则时，提交人可以调用该接口撤回审批实例',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('审批定义Code'),
      instance_code: z.string().describe('审批实例Code'),
      user_id: z.string().describe('操作用户, 根据user_id_type填写'),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional() }),
  },
};
export const approvalV4InstanceCc = {
  project: 'approval',
  name: 'approval.v4.instance.cc',
  sdkName: 'approval.v4.instance.cc',
  path: '/open-apis/approval/v4/instances/cc',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-原生审批实例-抄送审批实例',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('审批定义 code'),
      instance_code: z.string().describe('审批实例 code'),
      user_id: z.string().describe('根据user_id_type填写发起抄送的人的用户id'),
      cc_user_ids: z.array(z.string()).describe('根据user_id_type填写被抄送人的 用户id 列表'),
      comment: z.string().describe('抄送留言').optional(),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('用户ID类型').optional() }),
  },
};
export const approvalV4InstanceCommentCreate = {
  project: 'approval',
  name: 'approval.v4.instanceComment.create',
  sdkName: 'approval.v4.instanceComment.create',
  path: '/open-apis/approval/v4/instances/:instance_id/comments',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-审批-原生审批评论-创建评论-在某审批实例下创建、修改评论或评论回复（不包含审批同意、拒绝、转交等附加的理由或意见）',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      content: z
        .string()
        .describe(
          '评论内容，包含艾特人、附件等。**注意**：- 以下示例值未转义，你可参考请求体示例中的示例 content。- 对于附件，在 PC 端使用 HTTP 资源链接传图片资源可能会导致缩略图异常，建议使用 HTTPS 传资源附件',
        )
        .optional(),
      at_info_list: z
        .array(
          z.object({
            user_id: z.string().describe('被艾特人的ID'),
            name: z.string().describe('被艾特人的姓名'),
            offset: z
              .string()
              .describe(
                '被艾特人在评论中的位置，从0开始。用于偏移覆盖。例如：- 取值为 0 时的效果：@username 示例文本- 取值为 2 时的效果：示例 @username 文本- 取值为 4 时的效果：示例文本 @username',
              ),
          }),
        )
        .describe('评论中艾特人信息')
        .optional(),
      parent_comment_id: z.string().describe('父评论ID，如果是回复评论，需要传').optional(),
      comment_id: z.string().describe('评论ID，如果是编辑、删除一条评论，需要传').optional(),
      disable_bot: z.boolean().describe('disable_bot=true只同步数据，不触发bot').optional(),
      extra: z.string().describe('附加字段').optional(),
    }),
    params: z.object({
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
      user_id: z.string().describe('用户ID'),
    }),
    path: z.object({ instance_id: z.string().describe('审批实例code（或租户自定义审批实例ID）') }),
  },
};
export const approvalV4InstanceCommentDelete = {
  project: 'approval',
  name: 'approval.v4.instanceComment.delete',
  sdkName: 'approval.v4.instanceComment.delete',
  path: '/open-apis/approval/v4/instances/:instance_id/comments/:comment_id',
  httpMethod: 'DELETE',
  description: '[Feishu/Lark]-审批-原生审批评论-删除评论',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('用户ID类型').optional(),
      user_id: z.string().describe('根据user_id_type填写用户ID'),
    }),
    path: z.object({
      instance_id: z.string().describe('审批实例code（或者租户自定义审批实例ID）'),
      comment_id: z.string().describe('评论ID'),
    }),
  },
};
export const approvalV4InstanceCommentList = {
  project: 'approval',
  name: 'approval.v4.instanceComment.list',
  sdkName: 'approval.v4.instanceComment.list',
  path: '/open-apis/approval/v4/instances/:instance_id/comments',
  httpMethod: 'GET',
  description: '[Feishu/Lark]-审批-原生审批评论-获取评论',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('用户ID类型').optional(),
      user_id: z.string().describe('用户ID'),
      page_token: z
        .string()
        .describe(
          '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
        )
        .optional(),
      page_size: z.number().describe('分页大小').optional(),
    }),
    path: z.object({ instance_id: z.string().describe('审批实例code（或者租户自定义审批实例ID）') }),
  },
};
export const approvalV4InstanceCommentRemove = {
  project: 'approval',
  name: 'approval.v4.instanceComment.remove',
  sdkName: 'approval.v4.instanceComment.remove',
  path: '/open-apis/approval/v4/instances/:instance_id/comments/remove',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-原生审批评论-清空评论',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('用户ID类型').optional(),
      user_id: z.string().describe('根据user_id_type填写用户ID').optional(),
    }),
    path: z.object({ instance_id: z.string().describe('审批实例code（或者租户自定义审批实例ID）') }),
  },
};
export const approvalV4InstanceCreate = {
  project: 'approval',
  name: 'approval.v4.instance.create',
  sdkName: 'approval.v4.instance.create',
  path: '/open-apis/approval/v4/instances',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-审批-原生审批实例-创建审批实例-创建一个审批实例，调用方需对审批定义的表单有详细了解，将按照定义的表单结构，将表单 Value 通过接口传入',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('审批定义 code'),
      user_id: z
        .string()
        .describe('发起审批用户的 user_id，与 open_id 必须传入其中一个。如果传入了 user_id 则优先使用 user_id')
        .optional(),
      open_id: z
        .string()
        .describe('发起审批用户的 open_id，与 user_id 必须传入其中一个。如果传入了 user_id 则优先使用 user_id')
        .optional(),
      department_id: z
        .string()
        .describe(
          '发起审批用户部门id，如果用户只属于一个部门，可以不填。如果属于多个部门，默认会选择部门列表第一个部门',
        )
        .optional(),
      form: z.string().describe('json 数组（需压缩转义成string），控件值'),
      node_approver_user_id_list: z
        .array(
          z.object({
            key: z
              .string()
              .describe(
                'node id 或 custom node id，通过  获取',
              )
              .optional(),
            value: z.array(z.string()).describe('value: 审批人列表').optional(),
          }),
        )
        .describe('如果有发起人自选节点，则需要填写对应节点的审批人')
        .optional(),
      node_approver_open_id_list: z
        .array(
          z.object({
            key: z
              .string()
              .describe(
                'node id 或 custom node id，通过  获取',
              )
              .optional(),
            value: z.array(z.string()).describe('value: 审批人列表').optional(),
          }),
        )
        .describe('审批人发起人自选 open id，与上述node_approver_user_id_list字段取并集')
        .optional(),
      node_cc_user_id_list: z
        .array(
          z.object({
            key: z
              .string()
              .describe(
                'node id ，通过  获取',
              )
              .optional(),
            value: z.array(z.string()).describe('value: 审批人列表').optional(),
          }),
        )
        .describe('如果有发起人自选节点，则可填写对应节点的抄送人，单个节点最多选择20位抄送人')
        .optional(),
      node_cc_open_id_list: z
        .array(
          z.object({
            key: z
              .string()
              .describe(
                'node id ，通过  获取',
              )
              .optional(),
            value: z.array(z.string()).describe('value: 审批人列表').optional(),
          }),
        )
        .describe('抄送人发起人自选 open id 单个节点最多选择20位抄送人')
        .optional(),
      uuid: z
        .string()
        .describe(
          '审批实例 uuid，用于幂等操作, 每个租户下面的唯一key，同一个 uuid 只能用于创建一个审批实例，如果冲突，返回错误码 60012 ，格式建议为 XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX，不区分大小写',
        )
        .optional(),
      allow_resubmit: z
        .boolean()
        .describe('可配置“提交”按钮，该操作适用于审批人退回场景，提单人在同一实例提交单据')
        .optional(),
      allow_submit_again: z
        .boolean()
        .describe('可配置是否可以再次提交，适用于周期性提单场景，按照当前表单内容再次发起一个新实例')
        .optional(),
      cancel_bot_notification: z
        .string()
        .describe(
          '取消指定的 bot 推送通知。可选值:- 1：取消通过推送。- 2：取消拒绝推送。- 4：取消实例取消推送。支持同时取消多个 bot 推送通知。位运算，即如需取消 1 和 2 两种通知，则需要传入加和值 3',
        )
        .optional(),
      forbid_revoke: z.boolean().describe('配置是否可以禁止撤销').optional(),
      i18n_resources: z
        .array(
          z.object({
            locale: z
              .enum(['zh-CN', 'en-US', 'ja-JP'])
              .describe('语言 Options:zh-CN(Zhcn 中文),en-US(Enus 英文),ja-JP(Jajp 日文)'),
            texts: z
              .array(z.object({ key: z.string().describe('文案key'), value: z.string().describe('文案') }))
              .describe(
                '文案 key, value, i18n key 以 @i18n@ 开头； 该字段主要用于做国际化，允许用户同时传多个语言的文案，审批中心会根据用户当前的语音环境使用对应的文案，如果没有传用户当前的语音环境文案，则会使用默认的语言文案',
              ),
            is_default: z
              .boolean()
              .describe('是否默认语言，默认语言需要包含所有key，非默认语言如果key不存在会使用默认语言代替'),
          }),
        )
        .describe('国际化文案。目前只支单行、多行文本的值')
        .optional(),
      title: z
        .string()
        .describe(
          '审批展示名称，如果填写了该字段，则审批列表中的审批名称使用该字段，如果不填该字段，则审批名称使用审批定义的名称',
        )
        .optional(),
      title_display_method: z
        .number()
        .describe(
          '详情页title展示模式 Options:0(display_all 如果都有title，展示approval 和instance的title，竖线分割。),1(display_instance_title 如果都有title，只展示instance的title)',
        )
        .optional(),
      node_auto_approval_list: z
        .array(
          z.object({
            node_id_type: z
              .enum(['CUSTOM', 'NON_CUSTOM'])
              .describe('节点id的类型 Options:CUSTOM(自定义节点ID),NON_CUSTOM(NonCustom 非自定义节点ID)')
              .optional(),
            node_id: z.string().describe('节点id').optional(),
          }),
        )
        .describe('自动通过节点ID')
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
    '[Feishu/Lark]-审批-原生审批实例-获取单个审批实例详情-通过审批实例 Instance Code 获取审批实例详情。Instance Code 由  接口获取',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe(
          '语言。默认值为时在 i18n_resources 字段中配置的语言。 Options:zh-CN(Zhcn 中文),en-US(Enus 英文),ja-JP(Jajp 日文)',
        )
        .optional(),
      user_id: z.string().describe('发起审批用户 id，仅自建应用可返回').optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
    }),
    path: z.object({
      instance_id: z.string().describe('审批实例 Code，若在创建的时候传了 uuid，也可以通过传 uuid 获取'),
    }),
  },
};
export const approvalV4InstanceList = {
  project: 'approval',
  name: 'approval.v4.instance.list',
  sdkName: 'approval.v4.instance.list',
  path: '/open-apis/approval/v4/instances',
  httpMethod: 'GET',
  description: '[Feishu/Lark]-审批-原生审批实例-批量获取审批实例 ID',
  accessTokens: ['tenant'],
  schema: {
    params: z.object({
      page_size: z.number().describe('分页大小').optional(),
      page_token: z
        .string()
        .describe(
          '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
        )
        .optional(),
      approval_code: z.string().describe('审批定义唯一标识'),
      start_time: z.string().describe('审批实例创建时间区间（毫秒）'),
      end_time: z.string().describe('审批实例创建时间区间（毫秒）'),
    }),
  },
};
export const approvalV4InstancePreview = {
  project: 'approval',
  name: 'approval.v4.instance.preview',
  sdkName: 'approval.v4.instance.preview',
  path: '/open-apis/approval/v4/instances/preview',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-原生审批实例-预览审批流程',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('用户id'),
      approval_code: z.string().describe('审批定义code').optional(),
      department_id: z.string().describe('部门id').optional(),
      form: z.string().describe('表单数据').optional(),
      instance_code: z.string().describe('审批实例code').optional(),
      locale: z.string().describe('语言类型').optional(),
      task_id: z.string().describe('任务id').optional(),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'user_id', 'union_id']).describe('用户ID类型').optional() }),
  },
};
export const approvalV4InstanceQuery = {
  project: 'approval',
  name: 'approval.v4.instance.query',
  sdkName: 'approval.v4.instance.query',
  path: '/open-apis/approval/v4/instances/query',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-审批查询-查询实例列表-该接口通过不同条件查询审批系统中符合条件的审批实例列表',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('根据user_id_type填写用户 id').optional(),
      approval_code: z.string().describe('审批定义 code').optional(),
      instance_code: z.string().describe('审批实例 code').optional(),
      instance_external_id: z.string().describe('审批实例第三方 id 注：和 approval_code 取并集').optional(),
      group_external_id: z.string().describe('审批定义分组第三方 id 注：和 instance_code 取并集').optional(),
      instance_title: z.string().describe('审批实例标题（只有第三方审批有）').optional(),
      instance_status: z
        .enum(['PENDING', 'RECALL', 'REJECT', 'DELETED', 'APPROVED', 'ALL'])
        .describe(
          '审批实例状态，注：若不设置，查询全部状态 若不在集合中，报错 Options:PENDING(审批中),RECALL(撤回),REJECT(拒绝),DELETED(已删除),APPROVED(Approverd 通过),ALL(所有状态)',
        )
        .optional(),
      instance_start_time_from: z.string().describe('实例查询开始时间（unix毫秒时间戳）').optional(),
      instance_start_time_to: z.string().describe('实例查询结束时间 (unix毫秒时间戳)').optional(),
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('地区 Options:zh-CN(ZhCn 中文),en-US(EnUs 英文),ja-JP(JaJp 日文)')
        .optional(),
    }),
    params: z.object({
      page_size: z.number().describe('分页大小').optional(),
      page_token: z
        .string()
        .describe(
          '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
    }),
  },
};
export const approvalV4InstanceSearchCc = {
  project: 'approval',
  name: 'approval.v4.instance.searchCc',
  sdkName: 'approval.v4.instance.searchCc',
  path: '/open-apis/approval/v4/instances/search_cc',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-审批查询-查询抄送列表-该接口通过不同条件查询审批系统中符合条件的审批抄送列表',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('根据x_user_type填写用户 id').optional(),
      approval_code: z.string().describe('审批定义 code').optional(),
      instance_code: z.string().describe('审批实例 code').optional(),
      instance_external_id: z.string().describe('审批实例第三方 id 注：和 approval_code 取并集').optional(),
      group_external_id: z.string().describe('审批定义分组第三方 id 注：和 instance_code 取并集').optional(),
      cc_title: z.string().describe('审批抄送标题（只有第三方审批有）').optional(),
      read_status: z
        .enum(['READ', 'UNREAD', 'ALL'])
        .describe(
          '审批抄送状态，注：若不设置，查询全部状态 若不在集合中，报错 Options:READ(已读),UNREAD(未读),ALL(所有状态)',
        )
        .optional(),
      cc_create_time_from: z.string().describe('抄送查询开始时间（unix毫秒时间戳）').optional(),
      cc_create_time_to: z.string().describe('抄送查询结束时间 (unix毫秒时间戳)').optional(),
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('地区 Options:zh-CN(ZhCn 中文),en-US(EnUs 英文),ja-JP(JaJp 日文)')
        .optional(),
    }),
    params: z.object({
      page_size: z.number().describe('分页大小').optional(),
      page_token: z
        .string()
        .describe(
          '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
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
    '[Feishu/Lark]-审批-原生审批任务-退回审批任务-从当前审批任务，退回到已审批的一个或多个任务节点。退回后，已审批节点重新生成审批任务',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z
        .string()
        .describe('当前审批任务的审批人的用户 ID，从实例详情中的 task_list 字段获取，且相应任务的状态必须为 PENDING'),
      task_id: z
        .string()
        .describe('当前需要回退的审批任务的任务 ID，从实例详情中的 task_list 字段获取，且相应任务的状态必须为 PENDING'),
      reason: z.string().describe('退回原因').optional(),
      extra: z.string().describe('扩展字段').optional(),
      task_def_key_list: z
        .array(z.string())
        .describe('需要退回到的任务 node_key。node_key 从实例详情中 timeline 字段获取，且相应任务的状态必须为 PASS'),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional() }),
  },
};
export const approvalV4TaskApprove = {
  project: 'approval',
  name: 'approval.v4.task.approve',
  sdkName: 'approval.v4.task.approve',
  path: '/open-apis/approval/v4/tasks/approve',
  httpMethod: 'POST',
  description:
    '[Feishu/Lark]-审批-原生审批任务-同意审批任务-对于单个审批任务进行同意操作。同意后审批流程会流转到下一个审批人',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('审批定义 Code'),
      instance_code: z.string().describe('审批实例 Code'),
      user_id: z.string().describe('根据user_id_type填写操作用户id'),
      comment: z.string().describe('意见').optional(),
      task_id: z.string().describe('任务 ID， 审批实例详情task_list中id'),
      form: z.string().describe('json 数组，控件值（如果缺少控件，会影响后续分支条件流转，必填字段校验）').optional(),
    }),
    params: z.object({ user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional() }),
  },
};
export const approvalV4TaskQuery = {
  project: 'approval',
  name: 'approval.v4.task.query',
  sdkName: 'approval.v4.task.query',
  path: '/open-apis/approval/v4/tasks/query',
  httpMethod: 'GET',
  description: '[Feishu/Lark]-审批-审批查询-查询用户的任务列表',
  accessTokens: ['tenant', 'user'],
  schema: {
    params: z.object({
      page_size: z.number().describe('分页大小').optional(),
      page_token: z
        .string()
        .describe(
          '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
        )
        .optional(),
      user_id: z.string().describe('需要查询的 User ID'),
      topic: z
        .enum(['1', '2', '3', '17', '18'])
        .describe(
          '需要查询的任务分组主题，如「待办」、「已办」等 Options:1(TodoApproval 待办审批),2(DoneApproval 已办审批),3(InitiatedApproval 已发起审批),17(UnreadNotice 未读知会),18(ReadNotice 已读知会)',
        ),
      user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('用户ID类型').optional(),
    }),

    useUAT: z.boolean().describe('使用用户身份请求, 否则使用应用身份').optional(),
  },
};
export const approvalV4TaskReject = {
  project: 'approval',
  name: 'approval.v4.task.reject',
  sdkName: 'approval.v4.task.reject',
  path: '/open-apis/approval/v4/tasks/reject',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-原生审批任务-拒绝审批任务',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('审批定义 Code'),
      instance_code: z.string().describe('审批实例 Code'),
      user_id: z.string().describe('根据user_id_type填写操作用户id'),
      comment: z.string().describe('意见').optional(),
      task_id: z.string().describe('任务 ID， 审批实例详情task_list中id'),
      form: z.string().describe('json 数组，控件值').optional(),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('用户ID类型').optional() }),
  },
};
export const approvalV4TaskResubmit = {
  project: 'approval',
  name: 'approval.v4.task.resubmit',
  sdkName: 'approval.v4.task.resubmit',
  path: '/open-apis/approval/v4/tasks/resubmit',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-原生审批任务-重新提交审批任务',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('审批定义 Code'),
      instance_code: z.string().describe('审批实例 Code'),
      user_id: z.string().describe('根据user_id_type填写操作用户id'),
      comment: z.string().describe('意见').optional(),
      task_id: z.string().describe('任务 ID， 审批实例详情task_list中id'),
      form: z.string().describe('json 数组，控件值'),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('用户ID类型').optional() }),
  },
};
export const approvalV4TaskSearch = {
  project: 'approval',
  name: 'approval.v4.task.search',
  sdkName: 'approval.v4.task.search',
  path: '/open-apis/approval/v4/tasks/search',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-审批查询-查询任务列表-该接口通过不同条件查询审批系统中符合条件的审批任务列表',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      user_id: z.string().describe('根据x_user_type填写审批人id').optional(),
      approval_code: z.string().describe('审批定义 code').optional(),
      instance_code: z.string().describe('审批实例 code').optional(),
      instance_external_id: z.string().describe('审批实例第三方 id 注：和 approval_code 取并集').optional(),
      group_external_id: z.string().describe('审批定义分组第三方 id 注：和 instance_code 取并集').optional(),
      task_title: z.string().describe('审批任务标题（只有第三方审批有）').optional(),
      task_status: z
        .enum(['PENDING', 'REJECTED', 'APPROVED', 'TRANSFERRED', 'DONE', 'RM_REPEAT', 'PROCESSED', 'ALL'])
        .describe(
          '审批任务状态，注：若不设置，查询全部状态 若不在集合中，报错 Options:PENDING(审批中),REJECTED(Reject 拒绝),APPROVED(Approverd 通过),TRANSFERRED(转交),DONE(已完成),RM_REPEAT(去重),PROCESSED(已处理),ALL(所有状态)',
        )
        .optional(),
      task_start_time_from: z.string().describe('任务查询开始时间（unix毫秒时间戳）').optional(),
      task_start_time_to: z.string().describe('任务查询结束时间 (unix毫秒时间戳)').optional(),
      locale: z
        .enum(['zh-CN', 'en-US', 'ja-JP'])
        .describe('地区 Options:zh-CN(ZhCn 中文),en-US(EnUs 英文),ja-JP(JaJp 日文)')
        .optional(),
      task_status_list: z
        .array(z.string())
        .describe('可选择task_status中的多个状态，当填写此参数时，task_status失效')
        .optional(),
      order: z
        .number()
        .describe(
          '按任务时间排序 Options:0(UpdateTimeDESC 按update_time倒排),1(UpdateTimeASC 按update_time正排),2(StartTimeDESC 按start_time倒排),3(StartTimeASC 按start_time正排)',
        )
        .optional(),
    }),
    params: z.object({
      page_size: z.number().describe('分页大小').optional(),
      page_token: z
        .string()
        .describe(
          '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
        )
        .optional(),
      user_id_type: z.enum(['open_id', 'union_id', 'user_id']).describe('用户ID类型').optional(),
    }),
  },
};
export const approvalV4TaskTransfer = {
  project: 'approval',
  name: 'approval.v4.task.transfer',
  sdkName: 'approval.v4.task.transfer',
  path: '/open-apis/approval/v4/tasks/transfer',
  httpMethod: 'POST',
  description: '[Feishu/Lark]-审批-原生审批任务-转交审批任务',
  accessTokens: ['tenant'],
  schema: {
    data: z.object({
      approval_code: z.string().describe('审批定义 Code'),
      instance_code: z.string().describe('审批实例 Code'),
      user_id: z.string().describe('根据user_id_type填写操作用户id'),
      comment: z.string().describe('意见').optional(),
      transfer_user_id: z.string().describe('根据user_id_type填写被转交人唯一 ID'),
      task_id: z.string().describe('任务 ID， 审批实例详情task_list中id'),
    }),
    params: z.object({ user_id_type: z.enum(['user_id', 'union_id', 'open_id']).describe('用户ID类型').optional() }),
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
