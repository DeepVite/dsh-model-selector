# dsh-model-selector

> Liang Valley plugin · Better model selector for DeepSeek Harness

An enhanced model-selector and reasoning-effort plugin for DSH (DeepSeek Harness): model picking, thinking tiers, and peak/off-peak pricing hints unified into one button. One-command install, open and go.

**Derived from [HanaAyane/dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) (MIT), released under Apache-2.0.**

---

## ✨ Features

### 1. One-level menu: pick 【model】 and 【thinking tier】 fast
- Replaces DSH's stock two-level model menu: everything is on one level
- The selected model embeds a **5-tier reasoning slider** directly below it:

| Tier | DeepSeek effort | Notes |
|---|---|---|
| 小难梁 | `off` | thinking disabled |
| 梁子 | `low` | low |
| 梁文锋 | `high` | high (DeepSeek default) |
| 梁圣 | `max` | maximum |
| 梁神 | — | placeholder, not selectable |

### 2. Custom model display names
- Click "编辑" (Edit) on any model in the list to set a **short name** (e.g. `deepseek-v4-pro` → `D-Pro`)
- Stored locally, survives restarts

### 3. Off-peak base-price hint & countdown
- The state dot on the left of the trigger button shows the current phase in real time:
  - 🟡 **梁文锋** = peak hours · full price
  - 🟢 **梁文谷** = off-peak hours · half price
- The panel (opened by clicking the button) shows a **countdown to the next phase** on top (peak→off-peak counts down in green; off-peak→peak in yellow)
- Phase rules: **Mon–Fri 9:00–12:00 & 14:00–18:00 are peak** (Beijing time); everything else is off-peak

---

## 🚀 Install (one command)

Requires DSH with a web profile.

```bash
# via npm (recommended)
npm exec -- dsh plugin --profile web add dsh-model-selector

# or via GitHub
npm exec -- dsh plugin --profile web add https://github.com/DeepVite/dsh-model-selector.git
```

Then **refresh the browser**. If a git install is blocked by pnpm's build-script guard, add the printed package key under `allowBuilds` in the profile's `pnpm-workspace.yaml` and re-run.

## 🔄 Update

```bash
npm exec -- dsh plugin --profile web update dsh-model-selector
```

---

## 🗺️ Roadmap

- [ ] Daily token usage stats, billed at off-peak base price
- [ ] Queue commands until off-peak pricing to save tokens; keep the computer awake

---

## 📄 License

Licensed under the **Apache License 2.0** — see [LICENSE](LICENSE).

Portions derived from [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) (Copyright © HanaAyane, MIT), preserved in LICENSE.

© 2026 DeepVite · ibronfree@gmail.com
