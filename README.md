## 引言

今天主要讲两件事：`codex` 的使用，以及 `Agentic Engineering`。

`Agentic Engineering` 是 [Karpathy 在 2026 年 2 月 5 日、vibe coding 一周年之际提出的概念](https://x.com/karpathy/status/2019137879310836075)，可以理解为 Vibe Coding 的进化版。通过 LLM 代理进行编程，正在逐渐成为专业开发者的默认工作流，只是监管和审查会更严格。它的目标是在不牺牲软件质量的前提下，充分利用代理的优势。

如果说 Vibe Coding 是“全靠直觉和运气在调戏 AI”，那么 Agentic Engineering 就是“有组织、有纪律的特种兵作战”。

`Agentic Engineering` 可以拆成两个关键词：

- `Agentic`：由 agent 或多 agent 系统来写代码，人类开发者负责监督和验证输出，保持 human-in-the-loop。重点在人的职责变化。
- `Engineering`：使用 agentic 工作流进行有价值的软件生产，需要一定的专业能力，而这种能力是可以训练和提升的。重点在工程的科学性和艺术性。

## 大纲

下面是计划分享的大纲

### 一个示例-邀请码后台管理

这个示例提取自财务助手的需求，用邀请码做灰度控制。例子的目的是演示 `codex` 的基本使用，大家可以先忽略具体的业务细节。

由于 `codex` 运行速度不算快，为了避免浪费大家时间，我提前准备了一份可以完整跑通、也能展示关键过程的示例。同时也会现场用 `codex` 跑几轮交互，让第一次接触的同事对它的使用方式有一个直观感受。
### codex的使用
这个章节的目的是让大家快速上手 `codex`，包括安装、授权登录和基本使用。

`codex` 在老版本 macOS 上安装会有一些坑，这部分我也会给出建议。
### Agent 和 LLM（大语言模型）的关系

`codex` 是一个 Agent（智能体）。我会用一张图简单介绍 Agent 和 LLM 的关系，这对理解 `codex` 会有帮助。`codex` 是一个编程智能体，但能力并不限于编程。

### Agentic Engineering一些核心概念
包括架构设计、构建反馈闭环（让 AI 自己运行、测试、改错），以及管理复杂上下文的方法。

### 其他
例如手机上操作 `codex`，以及把 `codex` 的 token 授权给其他工具使用。

## 例子演示

我们来到分享的第一部分，从现实项目中抽取的一个功能做的例子项目，代码地址

https://github.com/herosea/gray-release 
示例我放在公开的 GitHub 仓库上，方便大家直接使用。核心资料也都在这个仓库里，例如完整的安装文档和建议。欢迎大家 fork、提 issue。后面会在这个项目上演示codex的使用，大家也可以用这个项目来练手

* clone 并切换到项目目录，启动 `codex`
```
git clone git@github.com:herosea/gray-release.git 
cd gray-release
codex 
```
* 执行 `评审邀请码需求文档 @docs/邀请码需求文档.md`，并在执行过程中介绍界面
  * 在评审需求的空档，顺便了解一下这个 TUI 界面
* 介绍 `/model`、`/resume`、`/rename` 和 `/compact` 命令
* 演示粘贴图片：`ctrl + v`
* 切换 plan 模式：`ctrl + tab`
* 取消：`esc`；退出：`ctrl + c`
* `@` 和 `$` 分别用来引用文件和 skill
* [介绍预先跑好的例子](https://chatgpt.com/s/cd_69a80e9a1f148191b5f0a04f0db4974a)。这个例子有点长，我会快速过一遍，主要是让大家体验一下完整开发流程，感受人在其中的职责，比如审核 `codex` 的输出、定义数据库表规则、构建反馈闭环
* 另外还有一份去掉了 `codex` 回复的提示词版 [例子-上手体验.md](https://github.com/herosea/gray-release/blob/main/%E4%BE%8B%E5%AD%90-%E4%B8%8A%E6%89%8B%E4%BD%93%E9%AA%8C.md)。这个例子和前面的略有不同，是用 `claude code` 跑的，使用 `minimax2.1` 模型。第一版代码有编译错误，我要求它编译、写测试用例并自行启动，通过构建闭环让它自己处理异常。

前面通过一个例子和基础操作让大家建立直觉，接下来我会更系统地讲一下 `codex` 的安装和使用，目标是大家回去以后就能自己上手。
## codex使用

### 安装
打开 [codex 首页](https://chatgpt.com/codex)，里面有安装和使用方式，可以通过 CLI、App、插件和云端使用。另外，GitHub 里现在似乎也可以使用 `codex`。

完整介绍可以参考这个文档 [codex-安装和使用](https://github.com/herosea/gray-release/blob/main/codex-%E5%AE%89%E8%A3%85%E5%92%8C%E4%BD%BF%E7%94%A8.md)，这里我只简要过一下 CLI 形式的安装。

#### 新版的macos上安装
很简单，一个命令

```
brew install codex
```

#### 老版本macos安装
如果用的是老版本 macOS，比如 12 或 13，建议先安装 Node，再安装 `codex`。下面是一种安装方式，Node.js 安装参考 [下载 Node.js](https://nodejs.org/zh-cn/download)：
```bash
# 安装 nodejs v24
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
node -v # Should print "v24.14.0".
# 验证 npm 版本：
npm -v # Should print "11.9.0".

# 安装 codex
npm i -g @openai/codex
```

#### 我的安装方法

[用mise管理软件版本](https://chatgpt.com/share/69a815a6-b7e0-800e-8818-9aa91c908d6d)

```
# 安装mise
brew install mise
# 安装node
mise install node@lts
mise use -g node@lts
# 安装 codex
npm i -g @openai/codex

# 安装java（可选）
mise install java@17
mise use -g java@17
```

### auth授权使用
订阅了 ChatGPT 会员后，一般就可以直接使用 `codex`，不需要单独购买。
[codex功能详解](https://chatgpt.com/share/69aa86a9-8190-800e-ace2-2bcc44193fbe)

我会先用 `/logout` 演示一次重新授权。

执行 `/init` 命令初始化项目，一个项目通常只需要做一次。

其他常用命令：`/status`、`/review`、`/copy`

YOLO 模式：
`alias codex='codex --dangerously-bypass-approvals-and-sandbox'`

### 自定义斜杆命令
[Custom Slash Commands（自定义斜杠命令）](https://chatgpt.com/c/69aa9c33-3ab8-832b-905a-1fb3174febb6)

下面以自定义 `/commit` 命令生成 commit message 为例：
```
~/.codex/prompts/commit.md
```
创建上面的文件，添加如下内容
```
---
description: 生成 commit message  
---  
根据 git diff 生成一个规范 commit message。  
要求：  
- 使用 Conventional Commits  
- 中文说明  
git diff:  
$ARGUMENTS
```

添加后的使用：
```
/prompts:commit
```

### MCP添加和使用

[context7](https://context7.com/docs/installation) 
[chrome-develop-tools](https://github.com/ChromeDevTools/chrome-devtools-mcp)

提示词：
```
怎么安装和使用 context7
```
或者
```
请安装 context7
```

使用：
```
我要xxx 在任意合适的位置加 use context7
```
### Skills


### 安装前端视觉优化的skill
添加 skill 时的提示词：
```
帮我安装 https://ui-ux-pro-max-skill.nextlevelbuilder.io/
```

`codex` 的回应示例：
```
• 已安装完成。

  它在当前项目里新增了技能目录：.codex/skills/ui-ux-pro-max/SKILL.md，git status 里当前只看到新增了 .codex/，没有改动前后端业务代码。

  下一步需要重启 Codex 才能识别这个新技能。重启后可以直接试一句：帮我设计一个 SaaS 落地页。
```

Anthropic 的skills仓库 https://github.com/anthropics/skills/tree/main/skills

### 创建skill

提示词：
```
给我个创建 skills 的例子
```
或者直接给出你的需求要codex创建好
```
我要做xxx，目的是xx，需求规格是xxxx、输出格式是xxx、约束条件是xx。 
帮我做一个 skill
```

### 能干啥
写代码、写文档、做测试、代码分析（架构分析、review 代码、周报提取），也能操作 shell 和浏览器（具备环境感知能力）。

通过 skill，它还可以写 PPT、Excel、写新媒体文章、配图，甚至发布内容。

例如：
- 点击某个按钮，分析对应 network request
- $slides  codex-安装和使用.md
- 帮我提取3月9日至今 nvwashi 的git 提交的功能，并组织成周报

## Agentic Engineering

karpathy举了个例子
```
举个例子，上周末我在为家里的摄像头搭建本地视频分析仪表盘，于是写道：“这是我的 DGX Spark 的本地 IP 和用户名/密码。登录，设置 ssh 密钥，配置 vLLM，下载并测试 Qwen3-VL，搭建用于视频推理的服务器端点，做一个基础的网页 UI 仪表盘，测试所有功能，用 systemd 配置服务，为你自己记录内存使用笔记，并给我写一份 markdown 报告。”这个智能代理运行了大约 30 分钟，遇到了多个问题，在线研究解决方案，逐一解决，编写代码，进行测试，调试，设置服务，最后带着报告返回——一切就这么完成了。我全程没有碰任何东西。所有这些在仅仅三个月前可能还是一个轻松的周末项目，但今天你只需启动它，然后忘掉 30 分钟就好。
```
这个例子的重点在于：写代码、调试、测试、设置服务、生成报告，全部都由 Agent 完成。人只负责启动它、提供必要信息，然后去做别的事情。
[Karpathy感慨“品味”和“判断”是最后的瓶颈点](https://x.com/karpathy/status/2026731645169185220)。AI可以吐出10中实现方案，但哪一种是优雅的、可扩展的、符合用户直觉的？这取决于你的品味。当“写”代码不再难，“选”什么代码就成了核心竞争力。

### 环境反馈闭环

构建反馈闭环，可以让 Agent 更稳定地自动工作。比如让它写测试用例并运行测试，它就能根据失败结果继续修复；让 `codex` 编译和运行代码，它也能处理编译错误和启动异常。

目标清晰、能够收集反馈并做验证的任务，`codex` 往往做得更好。

如果给 `codex` 足够的权限，配置更多“传感器”（比如安装必要的命令行工具），再配合可操作浏览器的 skill，它会更聪明，能力也会更强。
### 架构化上下文
1. 建立“Plan.md”驱动的执行流
	- 例如生成技术设计文档
	- 任务计划，定义任务步骤
2. “Token层次结构“管理
	- AGENTS.md 项目长期记忆，重复出现的问题加进去
	- 提示词： 帮我总结上面的讨论并输出到文档xxx
	- 上下文压缩策略，这个主要Agent来完成，我们能用的命令/compact /new 
3. 部署"自愈型"脚本
	* 给脚本加上纠错逻辑，出错了，唤醒Agent 去查日志等纠错

### HBS（高度定制化软件）
[Karpathy对于HBS的方向性洞察](https://x.com/karpathy/status/2024583544157458452)，内容中例子如下

以今早为例：最近我对有氧运动有些松懈，所以决定做一个更严肃、更有计划的实验，试图在 8 周内把静息心率从 50 降到 45。主要方法是设定每周 Zone 2 有氧运动和 1 次 HIIT 的总分钟数目标。  

一小时后，我即兴做出了一个超级定制的仪表盘，专门用来跟踪这个实验。Claude 需要先逆向工程 Woodway 跑步机的云端 API 提取原始数据，然后做处理、过滤、调试，并创建一个 Web 前端界面。整个过程并不顺利，我也需要指出并要求它修复一些 bug，比如它混淆了公制和英制单位，以及在日历中把日期和星期对应错了。

核心观点
1. **样本量 N=1**：HBS 是为了解决你个人的**特定、临时、极其琐碎**的需求而生的
2. **LLM 胶水 (LLM Glue)**：软件不再是下载一个 .exe 或 .apk，而是由 AI 充当“胶水”，把各种 **传感器（Sensors）** 和 **执行器（Actuators）** 粘合在一起，形成一个临时的、功能极度聚焦的 App。
3. **App Store 的终结**：他直言不讳地指出，传统的 **App Store** 模式（一堆独立的 App 供你选择）正在变得过时。未来的软件是**按需生成（Ephemeral Apps）**的。

## 其他

- **手机上操作 codex**

https://github.com/slopus/happy

```
npm install -g happy-coder
```

```
cd 项目目录
happy codex
```

- **把 ChatGPT 授权给其他工具使用（例如小龙虾）**
- 提示词：`命令行执行一次性 codex 命令怎么执行`
  - `codex exec "帮我检查当前仓库里有哪些未提交修改"`
- 提示词：`codex 有没有 sdk，有的话怎么用`
  - 目前先提供 TypeScript 版，包名是 `@openai/codex-sdk`



