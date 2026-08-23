# dsh-better-model-selector

> 梁文谷插件 · DeepSeek Harness 模型选择器升级

DSH（DeepSeek Harness）模型选择与推理档位插件的增强版：把模型选择、思考档位、时段计价提示整合到一个按钮里，一键安装、点开即用。

**基于 [HanaAyane/dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) (MIT) 二次开发，以 Apache-2.0 协议发布。**

---

## ✨ 当前功能

### 1. 一级菜单快速选择【模型】与【思考档位】
- 优化 DSH 原生模型选择的二级菜单体验，打开后直接在一级菜单点选模型
- 选中的模型下方直接内嵌 **5 档推理强度滑条**：

| 档位 | 对应 DeepSeek 思考强度 | 说明 |
|---|---|---|
| 小难梁 | `off` | 关闭思考 |
| 梁子 | `low` | 低强度 |
| 梁文锋 | `high` | 高强度（DeepSeek 默认档） |
| 梁圣 | `max` | 最大强度 |
| 梁神 | — | 占位展示，不可选中 |

### 2. 自定义模型显示名称
- 在模型列表中直接点"编辑"即可给任何模型设置**简称**（如把 `deepseek-v4-pro` 显示为 `D-Pro`）
- 名称保存在本地，重启不丢失

### 3. 低谷基价提示与倒计时
- 模型选择按钮左侧的状态点实时显示当前时段：
  - 🟡 **梁文锋** = 高峰时段 · 全价
  - 🟢 **梁文谷** = 低谷时段 · 半价
- 点击按钮弹出的面板顶部显示**距下一状态的倒计时**（高峰→低谷绿色倒计时 / 低谷→高峰黄色倒计时）
- 时段规则：**周一至周五 9:00-12:00、14:00-18:00 为高峰**（北京时间），其余为低谷

---

## 🚀 安装（一键）

要求：已安装 DSH 且使用 web profile。

```bash
# 通过 npm（推荐）
npm exec -- dsh plugin --profile web add dsh-better-model-selector

# 或通过 GitHub 仓库
npm exec -- dsh plugin --profile web add https://github.com/DeepVite/dsh-better-model-selector.git
```

安装后**刷新浏览器**即可看到效果。若 git 安装提示 pnpm 拦截构建脚本，按提示把包名加入 profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 后再试。

## 🔄 更新

```bash
npm exec -- dsh plugin --profile web update dsh-better-model-selector
```

---

## 📸 界面预览

打开模型选择按钮即可看到：状态点（黄=高峰/绿=低谷）、模型列表（可编辑别名）、选中模型下方的 5 档滑条、顶部时段倒计时。

---

## 🗺️ 未来开发计划

- [ ] 每日 token 用量统计，按低谷基价计价时发送指令
- [ ] 设置指令等待至低谷计价后发送，以节省 token 消耗，并设置计算机不进入休眠

---

## 📄 许可证

本项目采用 **Apache License 2.0**，详情见 [LICENSE](LICENSE)。

部分代码源自 [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort)（Copyright © HanaAyane，MIT 许可），已在 LICENSE 中保留声明。

© 2026 DeepVite · ibronfree@gmail.com
