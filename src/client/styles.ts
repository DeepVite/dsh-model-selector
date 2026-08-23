/**
 * Stylesheet for the reasoning-effort slider and the composer model seat.
 *
 * The slider visualizes whatever effort levels the current model exposes, so
 * the "peak intensity" effects key off the `[data-top]` existence flag the
 * component stamps on the highest level rather than any hardcoded effort id.
 *
 * @module dsh-better-model-selector/client/styles
 */
import chibiRunnerSprite from '../../assets/chibi-runner-strip.png'

export const CSS = `
.re-effort {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  width: 100%;
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  user-select: none;
  box-sizing: border-box;
}
.re-effort-inner {
  width: 100%;
}
.re-effort-slider-zone {
  display: flex;
  flex-direction: column-reverse;
  gap: 6px;
  width: calc(100% - 32px);
  margin: 0 16px;
  min-width: 0;
}
.re-effort-slider {
  --re-progress: 50%;
  position: relative;
  width: 100%;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 999px;
  isolation: isolate;
  transition: filter 180ms ease;
}
.re-effort-track {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 0;
  right: 0;
  overflow: hidden;
  border-radius: 999px;
  background: #1e2330;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 2px 8px rgba(0,0,0,.25);
}
.re-effort-track::after {
  content: "";
  position: absolute;
  inset: 0;
  background: none;
  pointer-events: none;
}
.re-effort-track::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0 auto 0 0;
  width: var(--re-progress);
  border-radius: inherit;
  background: linear-gradient(90deg, #4f7bff, #8f7bff);
  box-shadow: 0 0 12px rgba(112,122,255,.4);
  transition: width 190ms cubic-bezier(.22,1,.36,1);
}
.re-effort.is-dragging .re-effort-track::before {
  transition: none;
}
.re-effort-fx {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}
.re-effort-canvas {
  position: absolute;
  z-index: 2;
  inset: 0;
  width: 100%;
  height: 100%;
  display: none;
}
.re-effort-flare {
  display: none;
  position: absolute;
  z-index: 3;
  top: 50%;
  left: var(--re-progress);
  width: 78px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 100% 50%, rgba(255,255,255,.96) 0 4%, rgba(188,189,255,.8) 11%, rgba(106,87,255,.5) 28%, rgba(105,31,255,.2) 49%, transparent 74%);
  filter: blur(2px) saturate(1.25);
  mix-blend-mode: screen;
  transform: translate(-100%, -50%);
  transition: left 70ms linear, filter 140ms ease;
  pointer-events: none;
}
.re-effort-flare::before,
.re-effort-flare::after {
  content: "";
  position: absolute;
  inset: 50% auto auto 100%;
  border-radius: 999px;
  transform: translate(-50%, -50%);
}
.re-effort-flare::before {
  width: 52px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100,160,255,.42), #f1ecff, rgba(193,82,255,.65), transparent);
  box-shadow: 0 0 7px #9b7cff, 0 0 13px rgba(72,132,255,.64);
}
.re-effort-flare::after {
  width: 1px;
  height: 20px;
  background: linear-gradient(180deg, transparent, rgba(196,190,255,.84), transparent);
  box-shadow: 0 0 7px #9c7cff;
}
.re-effort-knob {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: var(--re-progress);
  width: 18px;
  height: 18px;
  border: 1px solid rgba(255,255,255,.9);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px rgba(122,124,255,.9), 0 0 24px rgba(122,124,255,.5), 0 1px 3px rgba(0,0,0,.4);
  transform: translate(-50%, -50%);
  transition: left 190ms cubic-bezier(.22,1,.36,1), transform 160ms ease, box-shadow 180ms ease;
  pointer-events: none;
}
.re-effort.is-chibi {
  height: 56px;
}
.re-effort.is-chibi .re-effort-knob {
  left: clamp(10px, var(--re-progress), calc(100% - 10px));
  width: 40px;
  height: 55px;
  border: 0;
  border-radius: 8px;
  background-color: transparent;
  background-image: url("${chibiRunnerSprite}");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 800% 100%;
  box-shadow: none !important;
  filter:
    drop-shadow(0 1px 1px rgba(0, 0, 0, .28))
    drop-shadow(0 0 5px rgba(92, 105, 255, .34));
  animation: re-chibi-run 720ms step-end infinite;
  transform-origin: 50% 68%;
}
.re-effort.is-chibi.is-dragging .re-effort-knob {
  animation-duration: 420ms;
  filter:
    drop-shadow(0 2px 1px rgba(0, 0, 0, .28))
    drop-shadow(0 0 8px rgba(87, 137, 255, .68));
}
.re-effort-input {
  position: absolute;
  z-index: 5;
  inset: -5px 0;
  width: 100%;
  height: calc(100% + 10px);
  margin: 0;
  opacity: 0;
  cursor: grab;
  touch-action: none;
}
.re-effort-input:active { cursor: grabbing; }
.re-effort-input:focus-visible + .re-effort-knob {
  outline: 2px solid var(--dsw-static-blue-400);
  outline-offset: 2px;
}
.re-effort.is-dragging .re-effort-canvas {
  filter: saturate(1.45) brightness(1.28) contrast(1.06);
}
.re-effort.is-dragging .re-effort-flare {
  filter: blur(1.5px) saturate(1.6) brightness(1.42);
  transition: none;
}
.re-effort.is-dragging .re-effort-knob {
  transform: translate(-50%, -50%) scale(1.15);
  transition: none;
  box-shadow: 0 0 16px rgba(122,124,255,1), 0 0 32px rgba(122,124,255,.65), 0 2px 6px rgba(0,0,0,.4);
}
.re-effort-slider[data-top] .re-effort-track {
  animation: none;
}
.re-effort-slider[data-top] .re-effort-knob {
  box-shadow: 0 0 18px rgba(140,124,255,1), 0 0 36px rgba(122,124,255,.7), 0 1px 3px rgba(0,0,0,.4);
}
.re-effort.is-error .re-effort-slider {
  outline: 1px solid var(--dsw-alias-state-error-secondary);
  outline-offset: 2px;
}
.re-effort.is-busy { opacity: .72; }
.re-effort-labels {
  position: relative;
  width: 100%;
  height: 30px;
}
.re-effort-label {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  transform: translateX(-50%);
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
}
.re-effort-label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.35));
}
.re-effort-label-sub {
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 9px;
  font-weight: 400;
  opacity: .72;
}
.re-effort-label.is-active .re-effort-label-sub {
  color: var(--dsw-alias-label-secondary, #9296a0);
  opacity: .9;
}
.re-effort-label-dot.is-placeholder {
  background: var(--dsw-alias-fill-quaternary, rgba(121,126,145,.18));
  box-shadow: none;
}
.re-effort-label.is-active {
  color: var(--dsw-alias-label-primary, #f2f4f8);
  font-weight: 600;
}
.re-effort-label.is-active .re-effort-label-dot {
  background: var(--dsw-alias-label-primary, #e5e8ef);
  box-shadow: 0 0 0 2px rgba(255,255,255,.15);
}
.re-effort-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.re-model-root {
  position: relative;
  display: inline-flex;
  min-width: 0;
}
.re-model-trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  max-width: 230px;
  height: 28px;
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 9px;
  color: var(--dsw-alias-label-primary, #15171b);
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition: background 140ms ease;
}
.re-model-trigger:hover,
.re-model-trigger[aria-expanded="true"] {
  background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.1));
}
.re-model-trigger:disabled { cursor: not-allowed; opacity: .5; }
.re-peak-dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
  margin-right: 4px;
}
.re-peak-panel {
  padding: 10px 12px 8px;
}
.re-peak-row {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 22px;
}
.re-peak-state {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
}
.re-peak-desc {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #9296a0);
  line-height: 1;
}
.re-peak-countdown {
  margin-top: 7px;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #9296a0);
}
.re-peak-time {
  margin-left: 3px;
  font-weight: 700;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.re-peak-sep {
  height: 1px;
  margin: 6px 0 4px;
  background: var(--dsw-alias-stroke-secondary, rgba(121,126,145,.16));
}
.re-model-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 28px;
}
.re-model-effort {
  flex: 0 0 auto;
  color: var(--dsw-static-deepseek-500, #4d70ff);
  font-size: 12px;
  line-height: 28px;
}
.re-model-chevron {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  margin: -3px 1px 0 3px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  opacity: .55;
  transform: rotate(45deg);
  transition: transform 150ms ease, margin 150ms ease;
}
.re-model-trigger[aria-expanded="true"] .re-model-chevron {
  margin-top: 3px;
  transform: rotate(225deg);
}
.re-model-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 1200;
  width: min(312px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid var(--dsw-alias-stroke-secondary, rgba(121,126,145,.2));
  border-radius: 16px;
  color: var(--dsw-alias-label-primary, #15171b);
  background: var(--dsw-alias-bg-elevated, #fff);
  box-shadow: 0 14px 42px rgba(18, 24, 42, .18), 0 3px 10px rgba(18, 24, 42, .08);
  animation: re-menu-in 150ms cubic-bezier(.22,1,.36,1);
}
.re-advanced {
  padding: 6px 9px 14px 9px;
}
.re-model-option {
  width: 100%;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 7px 9px;
  border-radius: 9px;
  text-align: left;
}
.re-model-option:hover { background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.09)); }
.re-model-pane { max-height: min(545px, 84vh); overflow-y: auto; padding: 7px; }
.re-model-group-title { padding: 10px 9px 5px; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 11px; }
.re-model-option-copy { min-width: 0; }
.re-model-option-name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.re-model-option-desc { display: block; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 10px; }
.re-model-option-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
}
.re-model-edit-btn {
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 10px;
  line-height: 1;
  padding: 3px 5px;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease, background 120ms ease, color 120ms ease;
}
.re-model-item:hover .re-model-edit-btn,
.re-model-edit-btn:focus-visible {
  opacity: 1;
  pointer-events: auto;
}
.re-model-edit-btn:hover {
  background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.12));
  color: var(--dsw-alias-label-primary, #f2f4f8);
}
.re-model-editor {
  margin: 2px 9px 6px;
  padding: 8px 10px;
  border-radius: 9px;
  background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.08));
}
.re-model-editor-full {
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 10px;
}
.re-model-editor-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.re-model-editor-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 24px;
  padding: 0 7px;
  border: 1px solid var(--dsw-alias-stroke-secondary, rgba(121,126,145,.2));
  border-radius: 6px;
  color: var(--dsw-alias-label-primary, #f2f4f8);
  background: var(--dsw-alias-bg-elevated, #202126);
  font-size: 12px;
}
.re-model-editor-input:focus {
  outline: 2px solid var(--dsw-static-blue-400, #5d83ff);
  outline-offset: 1px;
}
.re-model-editor-save,
.re-model-editor-cancel {
  border: 0;
  padding: 0 8px;
  height: 24px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  flex: none;
}
.re-model-editor-save {
  color: #fff;
  background: var(--dsw-alias-state-business-primary, #4f73ff);
}
.re-model-editor-cancel {
  color: var(--dsw-alias-label-secondary, #686c75);
  background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.12));
}
.re-model-check { color: var(--dsw-static-deepseek-500, #4d70ff); font-size: 15px; text-align: center; }
.re-model-status { padding: 14px; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 12px; text-align: center; }
.re-model-error { margin: 8px; padding: 8px 10px; border-radius: 8px; color: var(--dsw-alias-state-error-primary, #c83e4d); background: var(--dsw-alias-state-error-tertiary, rgba(220,55,70,.08)); font-size: 11px; }
.re-stats { margin: 2px 0 4px; }
.re-stats-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 0;
  border-radius: 9px;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
  text-align: left;
}
.re-stats-row:hover { background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.09)); }
.re-stats-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #9296a0);
}
.re-stats-value {
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary, #15171b);
}
.re-stats-status {
  flex: 0 0 auto;
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  white-space: nowrap;
}
.re-stats-status.is-updating {
  color: var(--dsw-alias-state-warn-label, #c8892c);
  animation: re-stats-pulse 1.2s ease-in-out infinite;
}
@keyframes re-stats-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
}
.re-stats-chevron {
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  margin: -2px 2px 0 0;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  opacity: .5;
  transform: rotate(45deg);
  transition: transform 150ms ease, margin 150ms ease;
}
.re-stats-chevron.is-open { margin-top: 2px; transform: rotate(225deg); }
.re-stats-body { padding: 2px 10px 10px; }
.re-stats-empty { padding: 6px 0 2px; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 11px; text-align: center; }
.re-stats-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.re-stats-table th { padding: 3px 4px 5px; font-size: 10px; font-weight: 600; text-align: right; color: var(--dsw-alias-label-tertiary, #9296a0); }
.re-stats-table th.re-stats-th-model { text-align: left; }
.re-stats-table th.re-stats-th-peak { color: #f6b93b; opacity: .85; }
.re-stats-table th.re-stats-th-idle { color: #3ddc84; opacity: .85; }
.re-stats-table td { padding: 3px 4px; text-align: right; font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-secondary, #9296a0); }
.re-stats-table td.re-stats-td-model {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 130px;
  color: var(--dsw-alias-label-primary, #15171b);
}
.re-stats-table td.is-total { color: var(--dsw-alias-label-primary, #15171b); font-weight: 600; }
.re-stats-row-total td { border-top: 1px solid var(--dsw-alias-stroke-secondary, rgba(121,126,145,.16)); padding-top: 6px; }
.re-stats-note { margin-top: 7px; color: var(--dsw-alias-state-warn-label, #c8892c); font-size: 10px; }
.re-timer-root { position: relative; }
.re-timer-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 8px;
  border: 1px solid rgba(61, 220, 132, .35);
  border-radius: 8px;
  color: #3ddc84;
  background: rgba(61, 220, 132, .06);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, opacity 120ms ease;
}
.re-timer-btn:hover,
.re-timer-btn[aria-expanded="true"] {
  background: rgba(61, 220, 132, .14);
  border-color: rgba(61, 220, 132, .55);
}
.re-timer-btn-icon {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3ddc84;
  box-shadow: 0 0 6px #3ddc84;
}
.re-timer-btn-text { line-height: 1; }
.re-timer-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 6px);
  z-index: 1300;
  width: 220px;
  padding: 4px;
  border: 1px solid var(--dsw-alias-stroke-secondary, rgba(121, 126, 145, .2));
  border-radius: 12px;
  color: var(--dsw-alias-label-primary, #15171b);
  background: var(--dsw-alias-bg-elevated, #fff);
  box-shadow: 0 10px 30px rgba(18, 24, 42, .18), 0 2px 8px rgba(18, 24, 42, .08);
  animation: re-menu-in 120ms cubic-bezier(.22, 1, .36, 1);
}
.re-timer-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding: 7px 9px;
  border: 0;
  border-radius: 8px;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.re-timer-option:hover { background: var(--dsw-alias-fill-tertiary, rgba(120, 125, 140, .09)); }
.re-timer-option-name { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary, #15171b); }
.re-timer-option-desc { font-size: 10px; color: var(--dsw-alias-label-tertiary, #9296a0); }
.re-timer-picker { padding: 6px 4px 2px; }
.re-timer-picker-row { display: flex; align-items: center; gap: 6px; }
.re-timer-time, .re-defer-time {
  flex: 1 1 auto;
  min-width: 0;
  height: 24px;
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-stroke-secondary, rgba(121, 126, 145, .2));
  border-radius: 6px;
  color: var(--dsw-alias-label-primary, #f2f4f8);
  background: var(--dsw-alias-bg-elevated, #202126);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.re-timer-picker-ok, .re-timer-picker-cancel, .re-defer-edit-ok, .re-defer-edit-cancel {
  border: 0;
  padding: 0 8px;
  height: 24px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  flex: none;
}
.re-timer-picker-ok, .re-defer-edit-ok {
  color: #fff;
  background: var(--dsw-alias-state-business-primary, #4f73ff);
}
.re-timer-picker-cancel, .re-defer-edit-cancel {
  color: var(--dsw-alias-label-secondary, #686c75);
  background: var(--dsw-alias-fill-tertiary, rgba(120, 125, 140, .12));
}
.re-defer-dock {
  box-sizing: border-box;
  flex: none;
  width: calc(100% - var(--dsh-composer-side-clearance, 16px) - var(--dsh-composer-side-clearance, 16px) - var(--dsh-composer-dock-inset, 4px) - var(--dsh-composer-dock-inset, 4px));
  max-width: calc(var(--dsh-composer-card-max-width, 720px) - var(--dsh-composer-dock-inset, 4px) - var(--dsh-composer-dock-inset, 4px));
  margin: 0 auto calc(0px - var(--dsh-composer-stack-gap, 12px) - 3px);
  padding: 0 var(--dsh-composer-dock-inset, 4px);
}
.re-defer-panel {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 2px 0;
  border-radius: 12px 12px 0 0;
  background: var(--dsw-specific-tip, #f7f8fa);
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
}
.re-defer-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid var(--dsw-alias-border-l1, rgba(121, 126, 145, .2));
  border-bottom: none;
  border-radius: inherit;
  pointer-events: none;
}
.re-defer-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 4px 12px;
}
.re-defer-lead {
  flex: none;
  display: grid;
  place-items: center;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 13px;
  line-height: 1;
}
.re-defer-title {
  min-width: 0;
  flex: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
  color: var(--dsw-alias-label-primary, #15171b);
}
.re-defer-hint {
  flex: none;
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 10px;
  line-height: 1;
  color: var(--dsw-alias-label-tertiary, #9296a0);
}
.re-defer-list { max-height: 180px; margin: 0; padding: 0; overflow-y: auto; }
.re-defer-group { display: flex; flex-direction: column; }
.re-defer-group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  padding: 0 12px;
}
.re-defer-group-dot { width: 6px; height: 6px; border-radius: 50%; flex: none; }
.re-defer-group-dot.is-idle { background: #3ddc84; }
.re-defer-group-dot.is-custom { background: var(--dsw-static-blue-400, #5d83ff); }
.re-defer-group-title {
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 11px;
  font-weight: 500;
  line-height: 24px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
}
.re-defer-group-count {
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  font-family: Inter, var(--dsw-font-family, sans-serif);
  color: var(--dsw-alias-label-tertiary, #9296a0);
}
.re-defer-subgroup {
  display: flex;
  flex-direction: column;
  padding-left: 16px;
}
.re-defer-subhead {
  min-height: 26px;
  display: flex;
  align-items: center;
  padding: 0 12px 0 2px;
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 11px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-tertiary, #9296a0);
}
.re-defer-row {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 36px;
  padding: 4px 5px 4px 12px;
  border-radius: 8px;
}
.re-defer-row + .re-defer-row { box-shadow: inset 0 1px 0 var(--dsw-alias-border-l1, rgba(121, 126, 145, .16)); }
.re-defer-toggle {
  flex: 1 1 auto;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  text-align: left;
}
.re-defer-chevron {
  flex: none;
  width: 7px;
  height: 7px;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  opacity: .8;
  transform: rotate(-45deg);
  transition: transform 120ms ease;
}
.re-defer-row.is-open .re-defer-chevron { transform: rotate(45deg); }
.re-defer-seq {
  flex: none;
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-tertiary, #9296a0);
}
.re-defer-mode {
  flex: none;
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 11px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.re-defer-mode.is-idle { color: #3ddc84; }
.re-defer-mode.is-custom { color: var(--dsw-static-blue-400, #5d83ff); }
.re-defer-summary {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-word;
  font: var(--dsw-font-xs-13, 13px/20px sans-serif);
  font-family: Inter, var(--dsw-font-family, sans-serif);
  color: var(--dsw-alias-label-primary-dimmed, #6b6f78);
}
.re-defer-full {
  flex: 1 1 100%;
  margin: 2px 0 0 17px;
  white-space: pre-wrap;
  word-break: break-word;
  font: var(--dsw-font-xs-13, 13px/20px sans-serif);
  font-family: Inter, var(--dsw-font-family, sans-serif);
  color: var(--dsw-alias-label-primary-dimmed, #6b6f78);
}
.re-defer-actions { flex: none; display: inline-flex; align-items: center; gap: 6px; }
.re-defer-countdown {
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: #3ddc84;
}
.re-defer-cancel, .re-defer-toidle, .re-defer-send, .re-defer-remove {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  font-family: Inter, var(--dsw-font-family, sans-serif);
  font-size: 11px;
  line-height: 1;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  background: transparent;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.re-defer-cancel:hover:not(:disabled), .re-defer-toidle:hover:not(:disabled), .re-defer-send:hover:not(:disabled), .re-defer-remove:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(120, 125, 140, .09));
  color: var(--dsw-alias-label-primary, #15171b);
}
.re-defer-send { color: var(--dsw-alias-state-business-primary, #4f73ff); }
.re-defer-remove { padding: 0; }
.re-defer-error { flex: 1 1 100%; font-size: 10px; color: var(--dsw-alias-state-error-primary, #c83e4d); margin-left: 17px; }
.re-defer-edit { flex: 1 1 100%; display: inline-flex; align-items: center; gap: 6px; margin: 2px 0 0 17px; }
.re-defer-edit .re-defer-time { height: 28px; }
.re-setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(121,126,145,.18));
}
.re-setting-copy { min-width: 0; }
.re-setting-title {
  color: var(--dsw-alias-label-primary, #15171b);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.re-setting-description {
  margin-top: 3px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 12px;
  line-height: 18px;
}
.re-setting-control { display: inline-flex; align-items: center; gap: 10px; flex: none; }
.re-setting-state { color: var(--dsw-alias-label-secondary, #686c75); font-size: 13px; }
.re-setting-switch {
  position: relative;
  width: 38px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--dsw-alias-fill-quaternary, #c7cbd3);
  cursor: pointer;
  transition: background 150ms ease;
}
.re-setting-switch:hover { filter: brightness(.97); }
.re-setting-switch:disabled { cursor: not-allowed; opacity: .45; }
.re-setting-switch:focus-visible {
  outline: 2px solid var(--dsw-static-blue-400, #5d83ff);
  outline-offset: 2px;
}
.re-setting-switch.is-on { background: var(--dsw-alias-state-business-primary, #4f73ff); }
.re-setting-switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
  transition: transform 170ms cubic-bezier(.22,1,.36,1);
}
.re-setting-switch.is-on .re-setting-switch-knob { transform: translateX(16px); }
body[data-ds-dark-theme] .re-model-menu {
  border-color: rgba(136, 145, 180, .2);
  color: var(--dsw-alias-label-primary, #f2f4f8);
  background: var(--dsw-alias-bg-elevated, #202126);
  box-shadow: 0 18px 46px rgba(0,0,0,.48), 0 3px 12px rgba(0,0,0,.32);
}
body[data-ds-dark-theme] .re-model-trigger { color: var(--dsw-alias-label-primary, #f2f4f8); }
@keyframes re-menu-in {
  from { opacity: 0; transform: translateY(5px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
body:not([data-ds-dark-theme]) .re-effort-slider {
  filter: none;
}
body:not([data-ds-dark-theme]) .re-effort-track {
  background: #dfe3eb;
  box-shadow: inset 0 0 0 1px rgba(120,130,150,.12);
}
body:not([data-ds-dark-theme]) .re-effort-track::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0 auto 0 0;
  width: var(--re-progress);
  border-radius: inherit;
  background: linear-gradient(90deg, #7d9cf0, #9d86e8);
  box-shadow: 0 0 8px rgba(110,120,220,.25);
  transition: width 190ms cubic-bezier(.22,1,.36,1);
}
body:not([data-ds-dark-theme]) .re-effort-slider[data-top] .re-effort-track::before {
  background: linear-gradient(90deg, #6f8eec, #9480e6);
}
body:not([data-ds-dark-theme]) .re-effort.is-dragging .re-effort-track::before {
  transition: none;
}
body:not([data-ds-dark-theme]) .re-effort-track::after {
  background: none;
}
body:not([data-ds-dark-theme]) .re-effort-canvas {
  display: none;
}
body:not([data-ds-dark-theme]) .re-effort-knob {
  border-color: rgba(255,255,255,.95);
  box-shadow: 0 0 10px rgba(100,110,220,.5), 0 1px 3px rgba(60,70,110,.2);
}
body:not([data-ds-dark-theme]) .re-effort-slider[data-top] .re-effort-track {
  animation: none;
}
body:not([data-ds-dark-theme]) .re-effort-slider[data-top] .re-effort-knob,
body:not([data-ds-dark-theme]) .re-effort.is-dragging .re-effort-knob {
  box-shadow: 0 0 12px rgba(100,110,220,.6), 0 1px 3px rgba(60,70,110,.2);
}
@keyframes re-effort-dark-breathe {
  0%, 100% { box-shadow: inset 0 1px 0 rgba(196,204,255,.16), 0 3px 10px rgba(18,25,72,.4); }
  50% { box-shadow: inset 0 1px 0 rgba(220,214,255,.24), 0 0 21px rgba(111,66,255,.5); }
}
@keyframes re-effort-light-breathe {
  0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,.9), inset 0 0 0 1px rgba(67,124,193,.16), 0 3px 10px rgba(48,101,165,.13); }
  50% { box-shadow: inset 0 1px 0 rgba(255,255,255,.96), inset 0 0 0 1px rgba(31,102,190,.22), 0 0 19px rgba(31,105,201,.24); }
}
@keyframes re-chibi-run {
  0% { background-position: 0 0; }
  12.5% { background-position: 14.285714% 0; }
  25% { background-position: 28.571429% 0; }
  37.5% { background-position: 42.857143% 0; }
  50% { background-position: 57.142857% 0; }
  62.5% { background-position: 71.428571% 0; }
  75% { background-position: 85.714286% 0; }
  87.5%, 100% { background-position: 100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .re-effort-slider[data-top] .re-effort-track { animation: none; }
  .re-effort-knob,
  .re-effort-flare,
  body:not([data-ds-dark-theme]) .re-effort-track::before { transition: none; }
  .re-model-menu { animation: none; }
  .re-effort.is-chibi .re-effort-knob { animation: none; }
  .re-stats-status.is-updating { animation: none; }
}
`
