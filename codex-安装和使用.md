
## 1、必须步骤

最简单的命令是 `brew install codex` 如果这个命令成功，直接跳转到步骤 1.3
## 1.1、安装nodejs

最简单的命令是  `brew install node@24`， 如果安装成功，请跳到1.2去安装codex。

**老的macos (例如macos 12)不要用brew 安装，从官网安装**

官网安装如下：
https://nodejs.org/zh-cn
根据指引安装，下面copy了官网的脚本，可以直接执行

```bash
# 下载并安装 nvm：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 代替重启 shell
\. "$HOME/.nvm/nvm.sh"

# 下载并安装 Node.js：
nvm install 24

# 验证 Node.js 版本：
node -v # Should print "v24.14.0".

# 验证 npm 版本：
npm -v # Should print "11.9.0".
```

### 1.2、安装codex

```
npm i -g @openai/codex
```

### 1.3、启动codex并授权

```
codex
```

## 2、可选的
### 2.1 codex增强-安装依赖的shell工具
linux 命令行工具可以大大加强codex的能力

有一次碰到的异常提示
```
/bin/zsh -lc 'rg --files src/main/resources | rg "application|yml|yaml|properties"'
zsh:1: command not found: rg
zsh:1: command not found: rg

rg 在当前环境不可用，我改用 grep/find 继续检索配置与代码引用。
```

ripgrep 是一个文本搜索工具，搜索代码效率高。 人和ai都能用
```
brew install ripgrep
```

### 2.2  node的另类安装（我的御用方法）
mise安装和使用教程 https://chatgpt.com/share/69a815a6-b7e0-800e-8818-9aa91c908d6d

```bash
# 安装mise
brew install mise # 如果需要编译，可以去官网看怎么安装
# 安装node
mise install node@lts
mise use -g node@lts  # -g 是全局，如果是项目指定版本，-g去掉即可
# 安装code
npm i -g @openai/codex

# 安装java（可选）
mise install java@17
mise use -g java@17
```

用 mise 管理 node、java、python等各种语言的版本

另外他能处理老项目用的node 版本很低的问题（codex需要用新版本node，老项目用老版本node），mise.toml  示例如下(一个老的wax项目)

```toml
[tools]
node = "10"
python = "2.7"

[tasks.codex]
tools = { node = "24.11.0" }
run = "codex --dangerously-bypass-approvals-and-sandbox"
```


```bash
zhouxionghai@zhouxionghaideMacBook-Pro ~/S/bkk-admin (issue/ai-agent-default-menu)> mise run codex
mise 2026.2.11 by @jdx                                                                                                                                   [0/2]
node@24.11.0    download node-v24.11.0-darwin-arm64.tar.gz                                                                  28.6 MB 14s [==========>       ] ◜
node@10.24.1    download node-v10.24.1.tar.gz                                                                               28.1 MB 11s [==========>       ] ◜
```

**node 版本过多，可能得每个版本装一个 codex 并维持更新**， 上面的方法也可以解这个情况，不过也不是必须解，就是多装几次的问题。
### 2.3 codex 插件安装和云端使用

https://blog.jetbrains.com/ai/2026/01/codex-in-jetbrains-ides/

### 2.4 codex云端使用

邀请码管理后台例子 https://chatgpt.com/s/cd_69a80e9a1f148191b5f0a04f0db4974a

### 2.5 下载 codex app（只有macos版）
而且需要高版本的macos，不确定intel芯片是否支持

https://chatgpt.com/codex  这个页面截图引导前面3项（插件、云端 和 app）

