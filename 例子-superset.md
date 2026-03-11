##  superset发送报表到飞书

## 克隆代码到本地

```bash
git clone git@github.com:apache/superset.git
```

## codex 编码过程记录

**下面框起来的是发给codex的指令，其他的是简化的codex的输出**

```
我想要一个发送报表到飞书的功能，你有什么方案
```

我会先用 using-superpowers 和 brainstorming 两个 skill：前者确认技能使用流程，后者把“发送 Superset 报表到飞书”的需求先做成可落地的方案，而不是直接拍脑袋。

... ...

• Questions 1/1 answered
  • 第一版你更希望 webhook 配置放在哪一层？
    answer: 每个报表单独配置 (Recommended)

• 现在我已经能给出技术路线了，但是否需要改前端入口会显著影响工作量。你希望第一版是什么交付形态？

• Questions 1/1 answered
  • 第一版的交付边界，你更倾向哪种？
    answer: 完整 UI 支持 (Recommended)

• 按你现在的选择，第一版会是“在现有 Reports 体系里新增 Feishu 通知渠道，并在 UI 里让用户按报表填写 webhook”。还有一个会改变实现复杂度的点：飞书消息形态要到什
  么程度。

• Questions 1/1 answered
  • 飞书消息第一版希望做到哪种程度？
    answer: 简单消息 + 附件/图片 (Recommended)

• 我先给你三个方案，按你刚才选的偏好排序：

1. 直接新增 Feishu 通知渠道，复用现有 Reports 调度链路
   适合第一版，我推荐这个。做法是沿用现在 Email/Slack 的模型，在 ReportRecipientType 里增加 Feishu，后端新增一个 FeishuNotification，前端在 Alerts & Reports
   里增加“飞书”选项和 webhook 输入框。优点是改动边界清晰、和 Superset 现有报表能力一致；缺点是消息能力先以“简单文本 + 图片/文件” 为主，不追求飞书卡片。
  2. 抽象成通用 Webhook 渠道，再用飞书作为第一个实现
     这个更通用，后面还能接企业微信、钉钉。优点是扩展性最好；缺点是第一版会多做一层抽象，校验、模板、错误处理都会更复杂，容易把“先发到飞书”拖成“先做通知平
     台”。
  3. 不改 Superset 通知模型，报表完成后转发给外部中间服务
     Superset 只负责生成报表，飞书发送交给外部服务。优点是对 Superset 侵入最小；缺点是配置分散、排障链路长，用户也不能在现有 UI 里直接管理。

  我建议用方案 1，第一版设计可以定成这样：

  - 后端
    - 新增 ReportRecipientType.FEISHU
    - 新增 superset/reports/notifications/feishu.py
    - 复用现有 NotificationContent，支持发送文本、截图 PNG、CSV/PDF 文件
    - webhook 按“每个报表单独配置”存到 recipient_config_json
    - 统一把飞书接口错误映射到现有 notification 异常体系，保持调度日志一致
  - 前端
    - 在现有 Reports/Alerts 配置弹窗里增加 Feishu 作为通知方式
    - 表单新增 webhook 地址输入，可选签名密钥输入
    - 继续复用现有 report_format，让用户选 PNG/CSV/PDF/TEXT；飞书端按格式决定发图片还是文件
  - 消息形态
    - 第一版只做“简单消息 + 附件/图片”
    - 文本包含：报表名、描述、跳转链接、触发时间
    - 不做飞书卡片，不做按用户 open_id/chat_id 发送，只发群机器人 webhook
  - 测试
    - 后端单测覆盖 webhook payload、异常映射、不同 report_format
    - API/schema 测试覆盖 Feishu recipient 校验
    - 前端测试覆盖新通知类型显示、表单校验、提交 payload

  如果这个方向对，我下一轮可以把它收敛成一份“可直接实施”的详细方案，把接口字段、校验规则、失败处理和测试清单全部定死。

```
好
```

• 我现在切到 writing-plans，把刚才确认的方向整理成可直接交给实现者的决策完备方案，不做代码变更。

# Superset 飞书报表通知实现方案

  ## 摘要

  在现有 Alerts & Reports 框架内新增 Feishu 通知渠道，复用 Superset 已有的报表调度、截图/CSV/PDF 生成、执行日志和失败重试链路。第一版目标是支持“每个报表单独
  配置一个飞书群机器人 webhook”，发送简单文本消息，并按报表格式附带截图或文件，不做飞书卡片、不做用户/群 ID 直发。

  ## 关键改动

  ### 后端通知链路

  - ...

  ### Schema / API

  - ...

  ### 前端 UI

  - ...

  ## 实现分解

  ### 任务 1：梳理执行入口并补测试基线

  - ...

  ### 任务 5：联调与文档

  - ...

  ## 测试计划

  - ...

  ## 公开接口与类型变化

  - ...

  ## 假设与默认值

  - ...

 Implement this plan?

› 1. Yes, implement this plan  Switch to Default and start coding.
  2. No, stay in Plan mode     Continue planning with the model.

• 执行前我再补一个流程性 skill：using-git-worktrees。它要求先确认当前工作区是否适合直接改，避免在脏分支上把这次功能和别的改动搅在一起。

...

• 我发现一个实施层面的关键点：飞书“群机器人 webhook”对二进制附件和私有截图并不天然友好，和 Slack/Email 不一样。为了不把功能做成伪支持，我先去确认飞书官方接口
  边界，再据此把发送实现定死。

...写代码

• 我准备收尾前先按流程补两个 skill：verification-before-completion 做结果核验，requesting-code-review 看看这个改动面是否还有明显遗漏。不会再改仓库状态之外的东
  西。

• 我再补一个 repo 级校验：git diff --check。这能抓出 patch 常见的语法外问题，比如残留冲突标记和空白错误。

...

没能跑完整 pytest / Jest，因为当前环境里没有可用的 Python test 环境，也没有 superset-frontend/node_modules。如果你要，我下一步可以继续把本地依赖补齐，然后把
  后端单测和前端测试真正跑一遍。

```
好，继续
```

• 我继续做可执行验证，先补齐当前工作区缺失的测试环境，再跑后端和前端新增用例。为此我会先加载 using-superpowers 和 systematic-debugging，因为现在的阻塞点是环境
  缺依赖，不是代码逻辑本身。

...

我现在补依赖：后端先用本地 .venv 装 requirements/development.txt，这样能直接跑 Superset 的 pytest；前端如果后端验证通过，再装 superset-frontend 的
  node_modules 跑 Jest。

...

当前实现已经可用，但有一个明确边界：飞书这里走的是群机器人 webhook，所以发送内容是“文本 + Superset 链接/说明”；PNG/CSV/PDF 不做 webhook 直传附件，而是在消息
  里明确提示。这部分如果你要升级成“真正上传图片/文件到飞书”，下一步就要改成接入飞书上传接口，不再只靠 webhook。

-----

```
升级成“真正上传图片/文件到飞书
```

要把图片和文件真正传到飞书，核心分歧只有一个：你是要继续只支持“群机器人 webhook”，还是接受改成“飞书应用凭证 + 上传接口 + 发消息接口”的正式集成？

  如果要真上传附件，我推荐后者，因为 webhook 本身不适合完整文件上传流程。

```
文件不发，只发图片呢，会不会简单点
```

我先核对飞书当前图片发送接口，确认“只发图片”能不能继续沿用 webhook，以及需要补哪一段上传流程。

...

会，明显比“图片+文件都支持”简单。

...

 如果你确认走这个方向，我再把实现方案收敛成具体改动并开始写测试。

```
确认，继续
```

• 设计已经收敛成“PNG 真发图片，其他格式继续文本 fallback”。我现在按 executing-plans 和 test-driven-development 先补失败测试，再最小化修改飞书通知实现。

...

• 继续不了原方案里的“只靠 webhook/secret 发真图片”，因为飞书这一步有硬约束。

  我刚核到的结果是：

  - 自定义机器人文档在官方这里：https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot
  - 图片上传端点 https://open.feishu.cn/open-apis/image/v4/put/ 会直接返回 Missing access token for authorization
  - 这说明“拿 Superset 的 PNG 直接换成 image_key”这一步不能只靠 webhook，必须额外有飞书应用凭证去拿 access token

  所以如果你要“真正发图片”，设计需要改成：

  - 继续用 webhook 负责往群里发消息
  - 额外配置飞书应用 app_id / app_secret
  - 后端流程变成：
      1. 用 app_id/app_secret 获取 access token
      2. 上传 PNG 到飞书拿 image_key
      3. 用 webhook 发送 msg_type=image 消息
  - TEXT/CSV/PDF 还是继续文本 fallback

  如果你确认接受这个变更，我就继续实现。
  如果你不想引入应用凭证，那当前能力边界就是“文本 + 链接”，不能真发图片。

```
接受
```

• 设计变更已经确认成“webhook + app_id/app_secret 上传图片，再用 webhook 发图片消息”。我现在先补失败测试和配置字段，再实现最小后端与前端改动。

...

 现在的使用边界是：

  - PNG 需要同时配置 Webhook URL、可选 Secret、以及 App ID / App secret
  - TEXT 只需要 webhook
  - CSV/PDF 还不会真传文件到飞书，只发文本说明和 Superset 链接

```
我想要本地启动应用，需要怎么做
Webhook URL、可选 Secret、以及 App ID / App secret 配置到哪里
```

• 配在 Superset 的报表配置弹窗里，不是配到全局配置文件。

  路径是：

  1. 打开一个 Dashboard 或 Chart
  2. 进入创建报表的入口
  3. 在 Schedule a new Feishu report 弹窗里，把 Notification method 选成 Feishu
  4. 下面会出现这几个字段：
      - Webhook URL
      - Secret
      - App ID
      - App secret

  保存后，这些值会作为当前这条报表的 recipient 配置存进数据库里的 recipient_config_json，不是写到 superset_config.py。

  对应关系是：

  - Webhook URL -> target
  - Secret -> secret
  - App ID -> app_id
  - App secret -> app_secret

  如果你找不到这个入口，我可以下一条直接告诉你从哪个页面点进去。

```
帮我启动应用
```

  -  如果你现在要验证飞书报表功能，直接打开 http://127.0.0.1:8088 登录即可。
      如果你要，我下一条可以继续帮你检查默认账号是否已经可登录，或者直接带你走一遍创建 Feishu report 的路径。

```
账号密码是多少
```

• 如果你还没改过，本地默认是：

  - 用户名：admin
  - 密码：general

  这是我之前初始化测试环境时用的创建命令对应的账号。
  如果登不上，说明你本地数据库里已有别的管理员密码，我可以继续帮你重置。

```
重置一下
```

• 管理员账号已经补建好了。

  现在可以用：

  - 用户名：admin
  - 密码：general

  我实际执行的结果是：Admin User admin created.

  登录地址还是：

  - http://127.0.0.1:8088

  如果你要，我可以继续帮你走到创建 Feishu report 的页面。

```
好啊，创建Feishu report 的页面
```

• 登录后这样进：

  如果你要给整个 Dashboard 建报表：

  1. 打开任意 Dashboard
  2. 右上角找到菜单或 ...
  3. 进入 Schedule email report / Report / Alerts & Reports 相关入口
  4. 弹窗打开后，把 Notification method 选成 Feishu

  如果你要给单个 Chart 建报表：

  1. 打开一个 Chart 的 Explore 或查看页面
  2. 找右上角菜单里的报表入口
  3. 打开弹窗后同样把 Notification method 选成 Feishu

  进入弹窗后你会看到这些字段：

  - Webhook URL
  - Secret
  - App ID
  - App secret

  如果你想验证“真发图片”，还要把 Message content 选成 Image (PNG) posted in Feishu。

  你也可以直接进统一列表页找：

  - Settings 或顶部导航里的 Alerts & Reports

  如果你愿意，我下一条可以继续按你当前页面状态，一步一步告诉你该点哪里。

```
帮我导入例子
```

• 例子已经导入完成了。

  我实际执行的是：

  .venv/bin/superset load-examples

```
Settings 或顶部导航里的 Alerts & Reports 这个菜单没有
```

```
启用 chrome-devtools mcp， 打开浏览器，帮我找下发飞书报表的菜单
```

如果这个菜单还是没有，基本就是权限或 feature flag 问题。我可以下一步直接帮你在本地把这两个条件查出来。

```
看是不是 feature flag 问题
```

• 是，基本就是 feature flag 问题。

  我查到的结果是：

  - 当前代码默认配置里 config.py:534 明确是 "ALERT_REPORTS": False
  - 你本地没有 ~/.superset/superset_config.py，所以没有任何本地 override
  - 这个菜单在前端显示前，会先检查 FeatureFlag.AlertReports，对应代码在 index.tsx:102

  所以现在看不到 Manage email report 是符合现状的。

  要开它，最直接是在 ~/.superset/superset_config.py 加：

  FEATURE_FLAGS = {
      "ALERT_REPORTS": True,
  }

  如果你要用我们刚加的飞书能力，我建议顺手再放一个真实 SECRET_KEY，例如：

  FEATURE_FLAGS = {
      "ALERT_REPORTS": True,
  }

  SECRET_KEY = "replace-with-a-long-random-string"

  然后重启后端服务。前端 dev server 不一定要重启，但后端一定要重启。

  如果你要，我下一步可以直接帮你：

    1. 创建 ~/.superset/superset_config.py
    2. 写入 ALERT_REPORTS=True
    3. 重启本地 Superset 服务

```
好，帮我处理下
```

• 处理好了，根因不是代码，而是本地配置没被 Superset 读到。

  我已经做了这几件事：

  - 新建了 /Users/zhouxionghai/.superset/superset_config.py
  - 写入了：
      - FEATURE_FLAGS = {"ALERT_REPORTS": True}
      - 本地开发用 SECRET_KEY
  - 用 SUPERSET_CONFIG_PATH=/Users/zhouxionghai/.superset/superset_config.py 重启了后端

  实际验证结果：

  - Superset 启动日志明确显示：
      - Loaded your LOCAL configuration at [/Users/zhouxionghai/.superset/superset_config.py]
  - 运行时配置检查确认：
      - ALERT_REPORTS = True
  - 后端已恢复监听：
      - http://127.0.0.1:8088
  - 前端 dev server 还在：
      - http://localhost:9000

  你现在刷新页面后，再去任意 Dashboard 的右上角菜单，应该就能看到：

  - Manage email report
  - 然后点 Set up an email report
  - 在弹窗里切成 Feishu

  如果刷新后还是没有，我下一步就直接帮你查当前 admin 账号的 Manage 菜单权限。



