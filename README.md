## 项目简介

这是用于codex 使用演示的项目

## 例子演示

例子项目的地址 https://github.com/herosea/gray-release 包含了代码和相关文档，欢迎大家 fork、提 issue。

###  clone项目

* clone 并切换到项目目录，启动 `codex`
```
git clone git@github.com:herosea/gray-release.git 
cd gray-release
codex 
```
### auth授权使用

订阅了 ChatGPT 会员后，一般就可以直接使用 `codex`，不需要单独购买。
[codex功能详解](https://chatgpt.com/share/69aa86a9-8190-800e-ace2-2bcc44193fbe)

我会先用 `/logout` 演示一次重新授权。

执行 `/init` 命令初始化项目，一个项目通常只需要做一次。

如果授权总是不成功（或者授权后用不了），可以试着**删除文件 ~/.codex/auth.json 和 ~/.codex/config.toml，再授权一次**

### 配置YOLO模式

~/.bashrc  或者对应shell的配置里面加如下一行启用YOLO 模式（You only live once）：
`alias codex='codex --dangerously-bypass-approvals-and-sandbox'`

这个模式自动通过需要审批的请求，在沙箱外运行

### 常用命令演示

* 在codex的交互界面输入 `评审邀请码需求文档 @docs/邀请码需求文档.md`，codex会对这个文档进行评审给出意见
  * 在评审需求的空档，可以了解下这个 TUI 界面，有些指令在任务运行时也可以执行的
* 介绍 `/model`、`/resume`、`/rename` 和 `/compact` 命令
* 其他常用命令：`/status`、`/review`、`/copy`
* 演示粘贴图片：`ctrl + v`
* 切换 plan 模式：`ctrl + tab`
* 取消：`esc`；退出：`ctrl + c`
* `@` 和 `$` 分别用来引用文件和 skill；`!`开头执行shell命令
* [介绍预先跑好的例子](https://chatgpt.com/s/cd_69a80e9a1f148191b5f0a04f0db4974a)。这个例子有点长，我会快速过一遍，主要是让大家体验一下完整开发流程，感受人在其中的职责，比如审核 `codex` 的输出、定义数据库表规则、构建反馈闭环
* 另外还有一份去掉了 `codex` 回复的提示词版 [例子-上手体验.md](https://github.com/herosea/gray-release/blob/main/%E4%BE%8B%E5%AD%90-%E4%B8%8A%E6%89%8B%E4%BD%93%E9%AA%8C.md)。这个例子是用 `claude code` 的时候记录的，使用 `minimax2.1` 模型，初版代码有编译错误，我要求它自己编译、写测试用例并自行启动，通过构建闭环让它自己处理编译异常。

### git worktree

```
git worktree add ../project-auth -b feature/auth
```

https://chatgpt.com/share/69b0d87d-13c0-800e-9fa0-a8530bcd0c3c

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

##### skill推荐 

- Anthropic 的skills仓库 https://github.com/anthropics/skills/tree/main/skills

- https://github.com/obra/superpowers  简单来说作用是开发过程标准化，需求澄清-》写设计-》拆任务-》执行任务-》code review-》测试驱动。  [chatGPT回答 superpowers有什么用](https://chatgpt.com/share/69afda12-c7a0-800e-90df-672e5f966a9d)

​	给codex 发这个提示词进行安装 `Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md`

##### skill市场



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

### 使用superpowers 在 superset上开发的例子

[例子-superset.md] (例子-superset.md)



## 其他

### 让 AGENTS.md  GEMINI.md CLAUDS.md 指向同一个文件

这样如果要切换AI code Agent，也不用同步记忆。 目前业界在逐步统一规范，后续也许不需要这么做了

```bash
# 下面假设 AGENTS.md 文件存在，其他两个删除了
ln -s AGENTS.md GEMINI.md  # GEMINI.md 软链到 AGENTS.md。 这样codex 使用的记忆文件和 gemini/antigravity一致
ln -s AGENTS.md CLAUDE.md
```

### 未归类

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

## **相关链接**

- 示用项目:  https://github.com/herosea/gray-release
- codex云环境编码过程例子：  https://chatgpt.com/s/cd_69a80e9a1f148191b5f0a04f0db4974a
- codex首页：  https://chatgpt.com/codex
- 可按照这个文档 [安装codex](codex-安装和使用.md)
- 可按照这个文档 [上手体验codex使用](例子-上手体验.md)
- [场景例子](场景例子.md)
- [superset添加报表图片发飞书群功能例子，使用了superpower 这个skill](https://github.com/herosea/gray-release/blob/main/例子-superset.md)

