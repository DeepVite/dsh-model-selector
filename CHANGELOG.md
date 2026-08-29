# Changelog

All notable changes to this project are documented in this file.

## [0.5.0] - 2026-08-28

### Added
- **GLM Coding Plan limit alert** (default on): detects 429/1308-style "5-hour usage limit reached" errors, dismisses repeats by turn-error seq, and shows the reset time above the composer input. Includes a settings toggle (`dsh-model-selector.glm-limit-alert`) and wiring for host side (settings domain + session use) to back the alert.

## [0.4.1] - 2026-08-28

### Changed
- Package is now fully standalone: removed all upstream references and the legacy storage-key fallback chain (enabled/slider/alias keys now read only their own `dsh-model-selector.*` names). Existing users' settings stored under newer keys are unaffected; older exported keys are no longer migrated.

## [0.4.0] - 2026-08-26

### Added
- **GLM Coding Plan peak/idle reminder**: new optional hint (default off) shown in the model popup, with a settings toggle — weekday peak window is Mon–Fri 14:00–18:00; off-peak calls earn a 50% credit discount.

### Removed
- The "big fish" thumb feature entirely (asset, CSS, keyframes, hidden store, dormant components, storage keys). The slider always renders the standard neon knob now; the npm bundle drops from ~2.6 MB to ~130 KB.

### Notes
- README and LICENSE no longer reference any upstream project; the package is fully standalone.

## [0.3.0] - 2026-08-23

### Added
- **Plugin master toggle**: a new plugin card (settings → plugins) controlling the whole enhanced UI (model picker / scheduled sending / pending queue / token stats); when off, DSH's native model selector is restored and all enhanced surfaces are hidden. Old "slider toggle" semantics migrated to an independent slider switch.
- **Settings panel** (`re-pane-settings`): in-menu gear panel with per-option switches, including **keep-awake (WakeLock/compute sleep prevention)** used for off-peak scheduled tasks.
- Pending queue / scheduled sending groundwork for off-peak (低谷) execution.

## [0.2.0] - 2026-08-23

### Added
- **Daily token usage stats**: a token panel that polls all sessions every 3 minutes and aggregates today's token usage per model, split into peak (梁文锋, full price) and off-peak (梁文谷, half price) buckets; shows "updating" state during the scan and a live result afterwards, with a `localStorage` cache between refreshes.
- Both host and client halves ship the new stats capability (`connection.api.sessions.list` / `.history` walking with paging), new peer dependencies `@deepseek-ai/dsh-settings` + `@deepseek-ai/schemastery`.

## [0.1.0] - 2026-08-23

### Added
- **5-tier Huang/Liang reasoning slider**: 小难梁(off) / 梁子(low) / 梁文锋(high) / 梁圣(max) / 梁神(placeholder, not selectable), with the original tier names shown as gray notes below each tier.
- **Custom model aliases**: per-model short names editable inline in the model list, persisted in localStorage.
- **Peak/off-peak pricing hint**: Beijing-time phase (Mon–Fri 9–12 & 14–18 peak) shown as a colored dot on the model trigger; the popup panel shows the phase and a live countdown to the next phase (green when heading to off-peak, yellow when heading to peak).
- **Unified popup**: phase panel on top, one-level model list + embedded reasoning slider below; the old separate rail pill was removed and merged.
- Plain/neon "radiance" visual theme, label row above the slider, inset margins for edge breathing room.

### Changed
- Model menu is now a single-level list: click a model to select it; the slider appears under the selected model.
- The slider tracks 5 visual slots while the last one (梁神) stays unselectable.
- Package metadata: new name, author (DeepVite), Apache-2.0 license, GitHub repository, v0.1.0.

### Removed
- The separate `conversation.input.left` peak pill component (logic merged into the model selector).
- The `prepack` build step (runtime bundle `lib/client/index.js` is shipped pre-built).
