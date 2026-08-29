window.__ModuleLoader__.load({
  id: "dsh-model-selector",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");




// src/client/styles.ts
var CSS = `
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
.re-glm-panel { padding: 0 12px 0; }
.re-glm-badge {
  flex: 0 0 auto;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 600;
  line-height: 14px;
  color: var(--dsw-alias-label-secondary, #9296a0);
  background: var(--dsw-alias-fill-tertiary, rgba(120, 125, 140, .14));
}
.re-peak-sep {
  height: 1px;
  margin: 6px 0 4px;
  background: var(--dsw-alias-stroke-secondary, rgba(121,126,145,.16));
}
.re-pane-gear {
  flex: none;
  margin-left: auto;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  background: transparent;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 120ms ease, color 120ms ease;
}
.re-pane-gear:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(120,125,140,.09));
  color: var(--dsw-alias-label-primary, #f2f4f8);
}
.re-pane-settings { padding: 4px 10px 10px; }
.re-pane-settings-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 2px 2px 4px;
}
.re-pane-back {
  flex: none;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  background: transparent;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 120ms ease, color 120ms ease;
}
.re-pane-back:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(120,125,140,.09));
  color: var(--dsw-alias-label-primary, #f2f4f8);
}
.re-pane-settings-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 24px;
  color: var(--dsw-alias-label-primary, #15171b);
}
.re-pane-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 2px;
}
.re-pane-setting + .re-pane-setting {
  border-top: 1px solid var(--dsw-alias-stroke-secondary, rgba(121,126,145,.16));
}
.re-pane-setting-copy { min-width: 0; }
.re-pane-setting-title {
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: var(--dsw-alias-label-primary, #15171b);
}
.re-pane-setting-desc {
  margin-top: 2px;
  font-size: 10px;
  line-height: 15px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
}
.re-pane-setting .re-setting-switch { flex: none; }
.re-pane-setting.is-path { flex-wrap: wrap; row-gap: 7px; }
.re-pane-path-row {
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.re-pane-path { flex: 1 1 auto; min-width: 0; font-size: 11px; }
.re-pane-path-note {
  flex: 1 1 100%;
  font-size: 10px;
  line-height: 14px;
}
.re-pane-path-note.is-ok { color: #3ddc84; }
.re-pane-path-note.is-err { color: var(--dsw-alias-state-error-primary, #c83e4d); }
.re-pane-path select.re-pane-path { appearance: auto; }
.re-pane-raw {
  flex: 1 1 100%;
  min-width: 0;
  min-height: 140px;
  max-height: 260px;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-stroke-secondary, rgba(121, 126, 145, .2));
  border-radius: 6px;
  color: var(--dsw-alias-label-primary, #f2f4f8);
  background: var(--dsw-alias-bg-elevated, #202126);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 16px;
  resize: vertical;
}
.re-pane-raw:focus {
  outline: 2px solid var(--dsw-static-blue-400, #5d83ff);
  outline-offset: 1px;
}
.re-glm-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  max-width: calc(var(--dsh-composer-card-max-width, 720px) - 2 * var(--dsh-composer-dock-inset, 4px));
  padding: 6px 12px;
  border: 1px solid rgba(200, 137, 44, .45);
  border-radius: 10px;
  color: var(--dsw-alias-label-primary, #15171b);
  background: rgba(200, 137, 44, .12);
  font-size: 12px;
  line-height: 18px;
}
.re-glm-alert-icon { flex: none; color: #c8892c; }
.re-glm-alert-text { flex: 1 1 auto; min-width: 0; }
.re-glm-alert-close {
  flex: none;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  background: transparent;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.re-glm-alert-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(120, 125, 140, .09));
  color: var(--dsw-alias-label-primary, #f2f4f8);
}
.re-plugin-card {
  border: 1px solid var(--dsw-alias-border-l2, rgba(121, 126, 145, .2));
  background: var(--dsw-alias-bg-layer-3, #fff);
  border-radius: 12px;
  list-style: none;
  transition: border-color .16s, background .16s;
}
.re-plugin-card:hover { border-color: var(--dsw-alias-label-dimmed, #6b6f78); }
.re-plugin-card.is-open {
  background: var(--dsw-alias-bg-layer-2, #fafbfc);
  border-color: var(--dsw-alias-label-dimmed, #6b6f78);
}
.re-plugin-header {
  appearance: none;
  width: 100%;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}
.re-plugin-header:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary, #4f73ff);
  outline-offset: -2px;
}
.re-plugin-headtext {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.re-plugin-name {
  color: var(--dsw-alias-label-primary, #15171b);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.re-plugin-desc {
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 13px;
  line-height: 1.5;
}
.re-plugin-chevron {
  flex: none;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 14px;
  line-height: 1;
  transition: transform .16s;
}
.re-plugin-chevron.is-open { transform: rotate(180deg); }
.re-plugin-body {
  border-top: 1px solid var(--dsw-alias-border-l2, rgba(121, 126, 145, .2));
  margin: 0 16px;
  padding: 4px 0 8px;
}
.re-plugin-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
}
.re-plugin-row + .re-plugin-row { border-top: 1px solid var(--dsw-alias-border-l2, rgba(121, 126, 145, .16)); }
.re-plugin-row-copy { min-width: 0; flex: 1; }
.re-plugin-row-title {
  color: var(--dsw-alias-label-primary, #15171b);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}
.re-plugin-row-desc {
  margin-top: 2px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 12px;
  line-height: 1.5;
}
.re-plugin-row .re-setting-switch { flex: none; }
.re-plugin-block {
  border-top: 1px solid var(--dsw-alias-border-l2, rgba(121, 126, 145, .2));
  margin: 8px 16px 0;
  padding: 10px 0 8px;
}
.re-plugin-block-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  color: var(--dsw-alias-label-primary, #15171b);
}
.re-plugin-block-desc {
  margin: 4px 0 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
}
.re-plugin-block .re-pane-path-row { margin-top: 6px; }
.re-pane-raw--wide { min-height: 240px; max-height: 420px; }
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
.re-model-group-title { padding: 10px 9px 5px; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 11px; flex: 1 1 auto; min-width: 0; }
.re-model-group-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.re-glm-limit-badge {
  flex: none;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 9px;
  padding: 2px 8px;
  border: 1px solid rgba(200, 137, 44, .45);
  border-radius: 999px;
  color: #c8892c;
  background: rgba(200, 137, 44, .1);
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
}
.re-model-option-copy { min-width: 0; }
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
.re-model-option-name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.re-model-option-desc { display: block; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 10px; }
.re-model-check { color: var(--dsw-static-deepseek-500, #4d70ff); font-size: 15px; text-align: center; }
.re-model-status { padding: 14px; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 12px; text-align: center; }
.re-model-error { margin: 8px; padding: 8px 10px; border-radius: 8px; color: var(--dsw-alias-state-error-primary, #c83e4d); background: var(--dsw-alias-state-error-tertiary, rgba(220,55,70,.08)); font-size: 11px; }
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

@media (prefers-reduced-motion: reduce) {
  .re-effort-slider[data-top] .re-effort-track { animation: none; }
  .re-effort-knob,
  .re-effort-flare,
  body:not([data-ds-dark-theme]) .re-effort-track::before { transition: none; }
  .re-model-menu { animation: none; }

  .re-stats-status.is-updating { animation: none; }
}
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
`;

// src/client/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SLOT = "conversation.input.model";
var SETTINGS_SLOT = "settings.general.item";
var ENABLED_STORAGE_KEY = "dsh-model-selector.enabled";
var inject = ["slots", "modelDirectories"];
function readEnabledPreference() {
  try {
    const current = window.localStorage.getItem(ENABLED_STORAGE_KEY);
    const stored = window.localStorage.getItem(ENABLED_STORAGE_KEY);
    return stored !== "false";
  } catch {
    return true;
  }
}
var enabledPreference = readEnabledPreference();
var enabledListeners = /* @__PURE__ */ new Set();
var enabledStore = {
  getSnapshot: () => enabledPreference,
  subscribe: (listener) => {
    enabledListeners.add(listener);
    return () => enabledListeners.delete(listener);
  },
  set: (enabled, persist = true) => {
    if (enabledPreference === enabled) return;
    enabledPreference = enabled;
    if (persist) {
      try {
        window.localStorage.setItem(ENABLED_STORAGE_KEY, String(enabled));
      } catch {
      }
    }
    enabledListeners.forEach((listener) => listener());
  }
};
var PLUGIN_ENABLED_STORAGE_KEY = "dsh-model-selector.plugin-enabled";
function readPluginEnabled() {
  try {
    return window.localStorage.getItem(PLUGIN_ENABLED_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}
var pluginEnabled = readPluginEnabled();
var pluginEnabledListeners = /* @__PURE__ */ new Set();
var pluginStore = {
  getSnapshot: () => pluginEnabled,
  subscribe: (listener) => {
    pluginEnabledListeners.add(listener);
    return () => pluginEnabledListeners.delete(listener);
  },
  set: (enabled, persist = true) => {
    if (pluginEnabled === enabled) return;
    pluginEnabled = enabled;
    if (persist) {
      try {
        window.localStorage.setItem(PLUGIN_ENABLED_STORAGE_KEY, String(enabled));
      } catch {
      }
    }
    pluginEnabledListeners.forEach((listener) => listener());
  }
};
var SLIDER_ENABLED_STORAGE_KEY = "dsh-model-selector.slider-enabled";
function readSliderEnabled() {
  try {
    const current = window.localStorage.getItem(SLIDER_ENABLED_STORAGE_KEY);
    if (current !== null) return current !== "false";
    const legacy = window.localStorage.getItem(ENABLED_STORAGE_KEY);
    return legacy === null ? true : legacy !== "false";
  } catch {
    return true;
  }
}
var sliderEnabled = readSliderEnabled();
var sliderEnabledListeners = /* @__PURE__ */ new Set();
var sliderStore = {
  getSnapshot: () => sliderEnabled,
  subscribe: (listener) => {
    sliderEnabledListeners.add(listener);
    return () => sliderEnabledListeners.delete(listener);
  },
  set: (enabled, persist = true) => {
    if (sliderEnabled === enabled) return;
    sliderEnabled = enabled;
    if (persist) {
      try {
        window.localStorage.setItem(SLIDER_ENABLED_STORAGE_KEY, String(enabled));
      } catch {
      }
    }
    sliderEnabledListeners.forEach((listener) => listener());
  }
};
var GLM_REMINDER_STORAGE_KEY = "dsh-model-selector.glm-reminder";
function readGlmReminder() {
  try {
    return window.localStorage.getItem(GLM_REMINDER_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}
var glmReminderEnabled = readGlmReminder();
var glmReminderListeners = /* @__PURE__ */ new Set();
var glmReminderStore = {
  getSnapshot: () => glmReminderEnabled,
  subscribe: (listener) => {
    glmReminderListeners.add(listener);
    return () => glmReminderListeners.delete(listener);
  },
  set: (enabled, persist = true) => {
    if (glmReminderEnabled === enabled) return;
    glmReminderEnabled = enabled;
    if (persist) {
      try {
        window.localStorage.setItem(GLM_REMINDER_STORAGE_KEY, String(enabled));
      } catch {
      }
    }
    glmReminderListeners.forEach((listener) => listener());
  }
};
var GLM_LIMIT_ALERT_KEY = "dsh-model-selector.glm-limit-alert";
function readGlmLimitAlert() {
  try {
    return window.localStorage.getItem(GLM_LIMIT_ALERT_KEY) !== "false";
  } catch {
    return true;
  }
}
var glmLimitAlertEnabled = readGlmLimitAlert();
var glmLimitAlertListeners = /* @__PURE__ */ new Set();
var glmLimitStore = {
  getSnapshot: () => glmLimitAlertEnabled,
  subscribe: (listener) => {
    glmLimitAlertListeners.add(listener);
    return () => glmLimitAlertListeners.delete(listener);
  },
  set: (enabled, persist = true) => {
    if (glmLimitAlertEnabled === enabled) return;
    glmLimitAlertEnabled = enabled;
    if (persist) {
      try {
        window.localStorage.setItem(GLM_LIMIT_ALERT_KEY, String(enabled));
      } catch {
      }
    }
    glmLimitAlertListeners.forEach((listener) => listener());
  }
};
var GLM_LIMIT_SEEN_KEY = "dsh-model-selector.glm-limit-seen";
function readGlmLimitSeen() {
  try {
    return Number(window.localStorage.getItem(GLM_LIMIT_SEEN_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}
function writeGlmLimitSeen(seq) {
  try {
    window.localStorage.setItem(GLM_LIMIT_SEEN_KEY, String(seq));
  } catch {
  }
}

// ---------------------------------------------------------------------------
// Model alias (short name) store.
// ---------------------------------------------------------------------------
var ALIAS_STORAGE_KEY = "dsh-model-selector.model-aliases";
function readAliases() {
  try {
    const raw = window.localStorage.getItem(ALIAS_STORAGE_KEY);
    if (raw === null) return {};
    const parsed = JSON.parse(raw);
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}
var aliases = readAliases();
var aliasListeners = new Set();
function aliasKeyOf(provider, model) {
  return `${provider}/${model}`;
}
var aliasStore = {
  getSnapshot: () => aliases,
  subscribe: (listener) => {
    aliasListeners.add(listener);
    return () => aliasListeners.delete(listener);
  },
  set: (provider, model, alias) => {
    const key = aliasKeyOf(provider, model);
    const trimmed = alias.trim();
    const next = { ...aliases };
    if (trimmed === "") {
      delete next[key];
    } else {
      next[key] = trimmed;
    }
    aliases = next;
    try {
      window.localStorage.setItem(ALIAS_STORAGE_KEY, JSON.stringify(aliases));
    } catch {
    }
    aliasListeners.forEach((listener) => listener());
  }
};
function currentModel(state) {
  if (state.current === null) return void 0;
  const group = state.groups.find((candidate) => candidate.id === state.current?.provider);
  return group?.models.find((candidate) => candidate.id === state.current?.model);
}
function sliderLevels(state) {
  const efforts = currentModel(state)?.reasoning?.efforts;
  return efforts !== void 0 && efforts.length >= 2 ? efforts : [];
}
function effortIndex(levels, id) {
  return levels.findIndex((level) => level.id === id);
}
function clampIndex(value, count) {
  return Math.max(0, Math.min(count - 1, Math.round(value)));
}
function effectiveEffortIndex(levels, state) {
  const reasoning = currentModel(state)?.reasoning;
  const current = effortIndex(levels, state.current?.reasoningEffort);
  if (current >= 0) return current;
  const fallback = effortIndex(levels, reasoning?.defaultEffort);
  if (fallback >= 0) return fallback;
  return Math.floor((levels.length - 1) / 2);
}
function drawRadiation(context, width, height, time, state) {
  const origin = state.progress * width;
  const isDark = document.body.hasAttribute("data-ds-dark-theme");
  const cell = 4;
  const speed = state.dragging ? 2.8 : 1;
  context.clearRect(0, 0, width, height);
  if (origin <= 0) return;
  context.save();
  context.beginPath();
  context.rect(0, 0, origin, height);
  context.clip();
  for (let x = 0; x < origin; x += cell) {
    const delta = x + cell * 0.5 - origin;
    const distance = Math.abs(delta);
    const phaseA = distance / 10 - time * 74e-4 * speed;
    const phaseB = distance / 23 - time * 41e-4 * speed + 1.7;
    const phaseC = distance / 40 - time * 22e-4 * speed + 3.4;
    const sinA = Math.max(0, Math.sin(phaseA));
    const sinB = Math.max(0, Math.sin(phaseB));
    const sinC = Math.max(0, Math.sin(phaseC));
    const waveA = Math.pow(sinA, 2.6);
    const waveB = Math.pow(sinB, 3.2);
    const waveC = Math.pow(sinC, 4);
    const crest = Math.pow(sinA, 15) + Math.pow(sinB, 18) * 0.78;
    const wave = Math.min(1, waveA * 0.76 + waveB * 0.58 + waveC * 0.32);
    const trail = 0.38 + 0.62 * Math.exp(-distance / Math.max(55, width * 0.72));
    const pillar = Math.pow(Math.max(0, Math.sin(x / 20 + time * 16e-4)), 3) * 0.27;
    const columnEnergy = trail * (wave * 1.04 + pillar + crest * 0.32);
    if (columnEnergy > 0.012) {
      const nearness = Math.max(0, 1 - distance / Math.max(1, width * 0.78));
      const red = isDark ? Math.round(42 + 124 * nearness + 75 * wave) : Math.round(28 + 58 * nearness + 15 * wave);
      const green = isDark ? Math.round(56 + 58 * nearness + 44 * crest) : Math.round(88 + 72 * nearness + 30 * crest);
      const blue = isDark ? Math.round(175 + 72 * nearness + 8 * wave) : Math.round(182 + 62 * nearness);
      const alpha = isDark ? Math.min(0.88, columnEnergy * 0.72) : Math.min(0.62, columnEnergy * 0.54);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      context.fillRect(x, 0, cell - 1, height);
    }
    for (let y = 0; y < height; y += cell) {
      const deltaY = y + cell * 0.5 - height * 0.5;
      const radial = Math.hypot(delta / 38, deltaY / 11);
      const halo = Math.exp(-radial * 0.96) * 1.08;
      const verticalShape = 0.58 + 0.42 * Math.cos(deltaY / height * Math.PI);
      const grain = 0.72 + 0.28 * Math.sin(x * 0.73 + y * 1.31 + time * 6e-3);
      const alpha = Math.min(0.96, (columnEnergy * 0.88 + halo + crest * 0.19) * verticalShape * grain);
      if (alpha < 0.035) continue;
      const hot = Math.max(0, 1 - radial / 2.4);
      const red = isDark ? Math.round(54 + 148 * hot + 42 * wave + 35 * crest) : Math.round(25 + 72 * hot + 12 * wave);
      const green = isDark ? Math.round(68 + 78 * hot + 46 * crest) : Math.round(98 + 72 * hot + 24 * crest);
      const blue = isDark ? Math.round(186 + 64 * hot) : Math.round(194 + 56 * hot);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${isDark ? alpha : alpha * 0.72})`;
      context.fillRect(x, y, cell - 1, cell - 1);
    }
  }
  for (let i = 0; i < 14; i += 1) {
    const travel = (time * (state.dragging ? 0.16 : 0.065) * (0.78 + i % 5 * 0.09) + i * 23) % Math.max(30, origin + 64);
    const particleX = origin - travel;
    if (particleX < -24 || particleX > width + 16) continue;
    const particleY = 3 + (i * 13 + Math.sin(time * 3e-3 + i) * 5) % Math.max(7, height - 6);
    const length = 4 + i % 4 * 4 + (state.dragging ? 6 : 0);
    const alpha = 0.28 + i % 5 * 0.1;
    const streak = context.createLinearGradient(particleX, 0, particleX + length, 0);
    streak.addColorStop(0, isDark ? "rgba(72,118,255,0)" : "rgba(24,94,184,0)");
    streak.addColorStop(0.68, isDark ? `rgba(112,135,255,${alpha})` : `rgba(36,108,202,${alpha * 0.72})`);
    streak.addColorStop(1, isDark ? `rgba(236,222,255,${Math.min(1, alpha + 0.26)})` : `rgba(103,175,248,${Math.min(0.82, alpha + 0.18)})`);
    context.fillStyle = streak;
    context.fillRect(particleX, particleY, length, i % 3 === 0 ? 2 : 1);
  }
  const glow = context.createRadialGradient(origin, height / 2, 0, origin, height / 2, 24);
  glow.addColorStop(0, isDark ? "rgba(255,255,255,.82)" : "rgba(255,255,255,.86)");
  glow.addColorStop(0.14, isDark ? "rgba(183,190,255,.54)" : "rgba(162,210,255,.48)");
  glow.addColorStop(0.44, isDark ? "rgba(103,74,255,.28)" : "rgba(37,112,207,.22)");
  glow.addColorStop(1, isDark ? "rgba(86,31,210,0)" : "rgba(25,91,181,0)");
  context.fillStyle = glow;
  context.fillRect(origin - 26, 0, 52, height);
  context.restore();
}
function EffortSlider({ directory }) {
  const directoryState = (0, import_react.useSyncExternalStore)(
    (notify) => directory.store.subscribe(notify),
    () => directory.store.getSnapshot()
  );
  const levels = sliderLevels(directoryState);
  const [effort, setEffort] = (0, import_react.useState)("");
  const [preview, setPreview] = (0, import_react.useState)(0);
  const [committing, setCommitting] = (0, import_react.useState)(false);
  const [dragging, setDragging] = (0, import_react.useState)(false);
  const [localError, setLocalError] = (0, import_react.useState)(null);
  const canvasRef = (0, import_react.useRef)(null);
  const inputRef = (0, import_react.useRef)(null);
  const committedRef = (0, import_react.useRef)("");
  const committingRef = (0, import_react.useRef)(false);
  const previewRef = (0, import_react.useRef)(0);
  const draggingRef = (0, import_react.useRef)(false);
  const pointerActiveRef = (0, import_react.useRef)(false);
  const activePointerIdRef = (0, import_react.useRef)(null);
  const globalPointerMoveRef = (0, import_react.useRef)(null);
  const globalPointerEndRef = (0, import_react.useRef)(null);
  const globalPointerCancelRef = (0, import_react.useRef)(null);
  const radiationRef = (0, import_react.useRef)({ progress: 0.5, dragging: false });
  const redrawRef = (0, import_react.useRef)(null);
  const isDeepSeekModel = (() => {
    const current = directoryState.current;
    if (current === null) return false;
    return current.provider.toLowerCase().includes("deepseek") || current.model.toLowerCase().includes("deepseek");
  })();
  const available = directoryState.current !== null && levels.length >= 2;
  const busy = committing || directoryState.status === "selecting";
  const error = localError ?? directoryState.error;
  (0, import_react.useEffect)(() => {
    if (!available || committingRef.current || draggingRef.current) return;
    const index = effectiveEffortIndex(levels, directoryState);
    const next = levels[index]?.id ?? "";
    committedRef.current = next;
    previewRef.current = index;
    setEffort(next);
    setPreview(index);
    setLocalError(null);
  }, [available, levels, directoryState]);
  (0, import_react.useEffect)(() => {
    directory.load().catch(() => void 0);
  }, [directory]);
  (0, import_react.useEffect)(() => {
    previewRef.current = preview;
    radiationRef.current.progress = levels.length >= 2 ? preview / (levels.length - 1) : 0.5;
    redrawRef.current?.();
  }, [preview, levels.length]);
  (0, import_react.useEffect)(() => {
    radiationRef.current.dragging = dragging;
    redrawRef.current?.();
  }, [dragging]);
  (0, import_react.useEffect)(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1;
    let height = 1;
    let frame = 0;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (time = performance.now()) => {
      drawRadiation(context, width, height, time, radiationRef.current);
    };
    const loop = (time) => {
      draw(time);
      frame = window.requestAnimationFrame(loop);
    };
    const redraw = () => {
      if (reducedMotion.matches) draw();
    };
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    const themeObserver = new MutationObserver(() => draw());
    resizeObserver.observe(canvas);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
    redrawRef.current = redraw;
    resize();
    draw();
    if (!reducedMotion.matches) frame = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      redrawRef.current = null;
    };
  }, []);
  const rollback = (0, import_react.useCallback)(() => {
    const previous = committedRef.current;
    previewRef.current = Math.max(0, effortIndex(levels, previous));
    pointerActiveRef.current = false;
    activePointerIdRef.current = null;
    draggingRef.current = false;
    setEffort(previous);
    setPreview(Math.max(0, effortIndex(levels, previous)));
    setDragging(false);
  }, [levels]);
  const commit = (0, import_react.useCallback)(async (raw) => {
    if (committingRef.current) return;
    committingRef.current = true;
    const previous = committedRef.current;
    setDragging(false);
    setCommitting(true);
    setLocalError(null);
    const optimisticIndex = clampIndex(raw, levels.length);
    const optimistic = levels[optimisticIndex]?.id;
    if (optimistic !== void 0) {
      previewRef.current = optimisticIndex;
      setPreview(optimisticIndex);
      setEffort(optimistic);
    }
    try {
      const models = await directory.load();
      const fresh = {
        current: models.current,
        routable: models.routable,
        groups: models.groups,
        failures: models.failures,
        status: "ready",
        error: null
      };
      const freshLevels = sliderLevels(fresh);
      const index = clampIndex(raw, freshLevels.length);
      const next = freshLevels[index]?.id;
      if (next === void 0) throw new Error("\u5F53\u524D\u6A21\u578B\u672A\u63D0\u4F9B\u63A8\u7406\u5F3A\u5EA6\u6863\u4F4D");
      previewRef.current = index;
      setPreview(index);
      setEffort(next);
      await directory.select({
        provider: models.current.provider,
        model: models.current.model,
        reasoningEffort: next
      });
      const snapshot = directory.store.getSnapshot();
      const accepted = effortIndex(freshLevels, snapshot.current?.reasoningEffort);
      const settled = accepted >= 0 ? accepted : index;
      const settledId = freshLevels[settled]?.id ?? next;
      committedRef.current = settledId;
      previewRef.current = settled;
      setEffort(settledId);
      setPreview(settled);
    } catch (cause) {
      const restore = Math.max(0, effortIndex(levels, previous));
      committedRef.current = previous;
      previewRef.current = restore;
      setEffort(previous);
      setPreview(restore);
      setLocalError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      committingRef.current = false;
      setCommitting(false);
    }
  }, [directory, levels]);
  const rawFromPointer = (input, clientX) => {
    const bounds = input.getBoundingClientRect();
    if (bounds.width <= 0 || levels.length < 2) return previewRef.current;
    // The input spans `slots` positions (real levels + the reserved 梁神 slot).
    // The thumb stops at the last real level so 梁神 can never be selected.
    return Math.max(
      0,
      Math.min(levels.length - 1, (clientX - bounds.left) / bounds.width * (slots - 1))
    );
  };
  const showPointerPreview = (raw) => {
    // The input spans `slots` positions; keep the preview inside the real
    // selectable levels so the reserved 梁神 slot never becomes active.
    const limited = Math.max(0, Math.min(levels.length - 1, raw));
    previewRef.current = limited;
    setPreview(limited);
    setEffort(levels[clampIndex(limited, levels.length)]?.id ?? "");
  };
  const beginDragging = (input, pointerId, clientX) => {
    pointerActiveRef.current = true;
    activePointerIdRef.current = pointerId;
    draggingRef.current = true;
    setDragging(true);
    showPointerPreview(rawFromPointer(input, clientX));
    try {
      if (!input.hasPointerCapture(pointerId)) input.setPointerCapture(pointerId);
    } catch {
    }
  };
  const moveDragging = (input, pointerId, clientX) => {
    if (!pointerActiveRef.current || activePointerIdRef.current !== pointerId) return;
    showPointerPreview(rawFromPointer(input, clientX));
  };
  const stopDragging = (input, pointerId, clientX) => {
    if (!pointerActiveRef.current) return;
    if (pointerId !== void 0 && activePointerIdRef.current !== pointerId) return;
    const raw = clientX === void 0 ? previewRef.current : rawFromPointer(input, clientX);
    pointerActiveRef.current = false;
    activePointerIdRef.current = null;
    draggingRef.current = false;
    if (pointerId !== void 0 && input.hasPointerCapture(pointerId)) {
      input.releasePointerCapture(pointerId);
    }
    showPointerPreview(raw);
    void commit(raw);
  };
  globalPointerMoveRef.current = (event) => {
    const input = inputRef.current;
    if (input !== null) moveDragging(input, event.pointerId, event.clientX);
  };
  globalPointerEndRef.current = (event) => {
    const input = inputRef.current;
    if (input !== null) stopDragging(input, event.pointerId, event.clientX);
  };
  globalPointerCancelRef.current = (event) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    rollback();
  };
  (0, import_react.useEffect)(() => {
    const move = (event) => globalPointerMoveRef.current?.(event);
    const end = (event) => globalPointerEndRef.current?.(event);
    const cancel = (event) => globalPointerCancelRef.current?.(event);
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", end, true);
    window.addEventListener("pointercancel", cancel, true);
    return () => {
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", cancel, true);
    };
  }, []);
  const onKeyDown = (event) => {
    const current = clampIndex(Number(event.currentTarget.value), levels.length);
    let target;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "PageDown") {
      target = Math.max(0, current - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "PageUp") {
      target = Math.min(levels.length - 1, current + 1);
    } else if (event.key === "Home") {
      target = 0;
    } else if (event.key === "End") {
      target = levels.length - 1;
    }
    if (target === void 0) return;
    event.preventDefault();
    void commit(target);
  };
  if (!available) return null;
  const count = levels.length;
  const slots = isDeepSeekModel ? count + 1 : count;
  const effortName = levels[effortIndex(levels, effort)]?.name ?? effort;
  const isTop = effortIndex(levels, effort) === count - 1;
  const progress = preview / (slots - 1) * 100;
  const style = { "--re-progress": `${progress}%` };
  const title = error === null ? `\u63A8\u7406\u5F3A\u5EA6 \xB7 ${effortName}` : `\u63A8\u7406\u5F3A\u5EA6\u8BBE\u7F6E\u5931\u8D25\uFF1A${error}`;
  const LIANG_LEVELS = [
    { name: "\u5C0F\u96BE\u6881", sub: "Off", effort: 0 },
    { name: "\u6881\u5B50", sub: "Low", effort: 1 },
    { name: "\u6881\u6587\u950B", sub: "High", effort: 2 },
    { name: "\u6881\u5723", sub: "Max", effort: 3 },
    { name: "\u6881\u795E", sub: "\u65E0\u6CD5\u9009\u4E2D", effort: null }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: `re-effort${dragging ? " is-dragging" : ""}${busy ? " is-busy" : ""}${error === null ? "" : " is-error"}`,
      title,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            className: "re-effort-inner",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: "re-effort-slider-zone",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        className: "re-effort-slider",
                        "data-top": isTop ? "true" : void 0,
                        style,
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-effort-track", "aria-hidden": "true" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-effort-fx", "aria-hidden": "true", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref: canvasRef, className: "re-effort-canvas" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-flare" })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "input",
                            {
                              ref: inputRef,
                              className: "re-effort-input",
                              type: "range",
                              min: "0",
                              max: slots - 1,
                              step: "0.01",
                              value: preview,
                              disabled: busy,
                              "aria-label": "\u63A8\u7406\u5F3A\u5EA6",
                              "aria-valuetext": effortName,
                              onChange: (event) => {
                                const raw = Number(event.currentTarget.value);
                                showPointerPreview(raw);
                              },
                              onPointerDown: (event) => {
                                event.preventDefault();
                                event.currentTarget.focus();
                                beginDragging(event.currentTarget, event.pointerId, event.clientX);
                              },
                              onPointerMove: (event) => moveDragging(event.currentTarget, event.pointerId, event.clientX),
                              onPointerUp: (event) => stopDragging(event.currentTarget, event.pointerId, event.clientX),
                              onPointerCancel: (event) => {
                                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                                  event.currentTarget.releasePointerCapture(event.pointerId);
                                }
                                rollback();
                              },
                              onBlur: (event) => {
                                stopDragging(event.currentTarget);
                              },
                              onKeyDown
                            }
                          ),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-knob", "aria-hidden": "true" })
                        ]
                      }
                    ),
                    isDeepSeekModel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-effort-labels", "aria-hidden": "true", children: LIANG_LEVELS.map((lvl) => {
                      const pos = lvl.effort === null ? 100 : lvl.effort / (slots - 1) * 100;
                      const active = lvl.effort !== null && lvl.effort === Math.round(preview);
                      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { key: lvl.name, className: `re-effort-label${active ? " is-active" : ""}`, style: { left: `${pos}%` }, children: [ /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-label-text", children: lvl.name }), lvl.sub === null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-label-sub", children: lvl.sub }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `re-effort-label-dot${lvl.effort === null ? " is-placeholder" : ""}` }) ]});
                    }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-effort-labels", "aria-hidden": "true", children: levels.map((lvl, index) => {
                      const pos = count <= 1 ? 0 : index / (count - 1) * 100;
                      const active = index === Math.round(preview);
                      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { key: lvl.id, className: `re-effort-label${active ? " is-active" : ""}`, style: { left: `${pos}%` }, children: [ /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-label-text", children: lvl.name }), lvl.id === lvl.name ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-label-sub", children: lvl.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-label-dot" }) ]});
                    }) }),
                  ]
                }
              )
            ]
          }
        ),
        error === null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-effort-sr", role: "status", children: error })
      ]
    }
  );
}
function AdvancedModelSelect({
  locked,
  available,
  controller,
  directory,
  load,
  select,
  connection,
  useSession
}) {
  const state = (0, import_react.useSyncExternalStore)(
    (notify) => directory.subscribe(notify),
    () => directory.getSnapshot()
  );
  const [open, setOpen] = (0, import_react.useState)(false);
  const [paneMode, setPaneMode] = (0, import_react.useState)("main");
  const [now, setNow] = (0, import_react.useState)(Date.now());
  const [editing, setEditing] = (0, import_react.useState)(null);
  const [aliasDraft, setAliasDraft] = (0, import_react.useState)("");
  const rootRef = (0, import_react.useRef)(null);
  const triggerRef = (0, import_react.useRef)(null);
  const aliasMap = (0, import_react.useSyncExternalStore)(aliasStore.subscribe, aliasStore.getSnapshot);
  const sliderEnabled = (0, import_react.useSyncExternalStore)(sliderStore.subscribe, sliderStore.getSnapshot);
  const glmLimitOn = (0, import_react.useSyncExternalStore)(glmLimitStore.subscribe, glmLimitStore.getSnapshot);
  const limitError = findLastLimitError(useSession?.((snapshot) => snapshot.nodes) ?? void 0);
  const limitResetAt = limitError === void 0 ? null : parseResetTime(limitError.message);
  const limitCountdownMs = limitResetAt === null ? Infinity : limitResetAt - now;
  const showLimitBadge = glmLimitOn && limitError !== void 0 && limitCountdownMs > 0;
  const choice = currentModel(state);
  const levels = sliderLevels(state);
  const effortName = levels[effectiveEffortIndex(levels, state)]?.name ?? "\u9ED8\u8BA4";
  const currentKey = state.current === null ? "" : aliasKeyOf(state.current.provider, state.current.model);
  const modelLabel = currentKey !== "" && aliasMap[currentKey] ? aliasMap[currentKey] : choice?.name ?? state.current?.model ?? "\u9009\u62E9\u6A21\u578B";
  const busy = state.status === "loading" || state.status === "selecting";
  const peak = phase(now);
  const peakStateName = peak.peak ? "\u6881\u6587\u950B" : "\u6881\u6587\u8C37";
  const peakStateDesc = peak.peak ? "\u6881\u6587\u950B\uFF08\u9AD8\u5CF0\u65F6\u6BB5\uFF09\u00B7 \u5168\u4EF7" : "\u6881\u6587\u8C37\uFF08\u7A7A\u95F2\u65F6\u6BB5\uFF09\u00B7 \u534A\u4EF7";
  const peakAccent = peak.peak ? "#f6b93b" : "#3ddc84";
  const peakTargetName = peak.peak ? "\u6881\u6587\u8C37" : "\u6881\u6587\u950B";
  const peakTargetDesc = peak.peak ? "\u7A7A\u95F2\u65F6\u6BB5" : "\u9AD8\u5CF0\u65F6\u6BB5";
  const peakTargetAccent = peak.peak ? "#3ddc84" : "#f6b93b";
  (0, import_react.useEffect)(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  (0, import_react.useEffect)(() => {
    if (!available) return;
    load();
  }, [available, load]);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [open]);
  if (!available) return null;
  const close = (restoreFocus = false) => {
    setOpen(false);
    setEditing(null);
    setPaneMode("main");
    if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus());
  };
  const onKeyDown = (event) => {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    if (editing !== null) {
      setEditing(null);
      return;
    }
    close(true);
  };
  const chooseModel = async (provider, model, defaultEffort) => {
    if (state.current?.provider === provider && state.current.model === model) return;
    await select({
      provider,
      model,
      ...defaultEffort === void 0 ? {} : { reasoningEffort: defaultEffort }
    });
  };
  const startEdit = (provider, model) => {
    const key = aliasKeyOf(provider, model);
    setAliasDraft(aliasMap[key] ?? "");
    setEditing(key);
  };
  const commitAlias = () => {
    if (editing === null) return;
    const parts = editing.split("/");
    aliasStore.set(parts[0], parts[1], aliasDraft);
    setEditing(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: rootRef, className: "re-model-root", onKeyDown, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        ref: triggerRef,
        type: "button",
        className: "re-model-trigger",
        "aria-label": `\u6A21\u578B ${modelLabel}\uFF0C\u63A8\u7406\u5F3A\u5EA6 ${effortName}`,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        title: `${modelLabel} \xB7 ${effortName} \xB7 ${peakStateDesc}`,
        disabled: locked,
        onClick: () => {
          if (open) close();
          else {
            setOpen(true);
            load();
          }
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-peak-dot", style: { background: peakAccent }, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-model-name", children: modelLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-model-effort", children: effortName }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-model-chevron", "aria-hidden": "true" })
        ]
      }
    ),
    open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-model-menu", role: paneMode === "settings" ? "dialog" : "menu", "aria-label": paneMode === "settings" ? "\u63D2\u4EF6\u8BBE\u7F6E" : "\u6A21\u578B\u4E0E\u63A8\u7406\u5F3A\u5EA6", "aria-busy": busy, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-model-pane", children: [
      paneMode === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPane, { onBack: () => setPaneMode("main"), connection, groups: state.groups }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
      (0, import_jsx_runtime.jsxs)("div", { className: "re-peak-panel", children: [
        (0, import_jsx_runtime.jsxs)("div", { className: "re-peak-row", children: [
          (0, import_jsx_runtime.jsx)("span", { className: "re-peak-dot", style: { background: peakAccent }, "aria-hidden": "true" }),
          (0, import_jsx_runtime.jsx)("span", { className: "re-peak-state", style: { color: peakAccent }, children: peakStateName }),
          (0, import_jsx_runtime.jsx)("span", { className: "re-peak-desc", children: peak.peak ? "\u9AD8\u5CF0\u65F6\u6BB5 \u00B7 \u5168\u4EF7" : "\u7A7A\u95F2\u65F6\u6BB5 \u00B7 \u534A\u4EF7" }),
          (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-pane-gear", title: "\u8BBE\u7F6E", "aria-label": "\u63D2\u4EF6\u8BBE\u7F6E", onClick: () => setPaneMode("settings"), children: "\u2699" })
        ] }),
        (0, import_jsx_runtime.jsxs)("div", { className: "re-peak-countdown", children: [
          "\u8DDD " + peakTargetName + "\uFF08" + peakTargetDesc + "\uFF09\u8FD8\u6709\uFF1A",
          (0, import_jsx_runtime.jsx)("span", { className: "re-peak-time", style: { color: peakTargetAccent }, children: formatDur(peak.secondsToTarget) })
        ] })
      ] }),
      (0, import_jsx_runtime.jsx)(GlmHint, { now }),
      (0, import_jsx_runtime.jsx)("div", { className: "re-peak-sep" }),
      (0, import_jsx_runtime.jsx)(TokenStats, { connection, groups: state.groups }),
      (0, import_jsx_runtime.jsx)("div", { className: "re-peak-sep" }),
      state.status === "loading" && state.groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-model-status", children: "\u6B63\u5728\u52A0\u8F7D\u6A21\u578B\u2026" }) : null,
      state.groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-model-group-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-model-group-title", children: group.name }),
          showLimitBadge && group.id.toLowerCase().includes("zai-coding") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-glm-limit-badge", title: `GLM Coding Plan 5 \u5C0F\u65F6\u9650\u989D\u5DF2\u7528\u5C3D\uFF0C\u5C06\u4E8E ${limitError?.message.match(/\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/)?.[0] ?? "\u672A\u77E5\u65F6\u95F4"} \u91CD\u7F6E`, children: `\u26A0 GLM \u9650\u989D\u5DF2\u7528\u5C3D \u00B7 ${fmtCountdown(limitCountdownMs)} \u540E\u91CD\u7F6E` }) : null
        ] }),
        group.models.map((model) => {
          const selected = state.current?.provider === group.id && state.current.model === model.id;
          const key = aliasKeyOf(group.id, model.id);
          const displayName = aliasMap[key] || model.name;
          const isEditing = editing === key;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              key: model.id,
              className: "re-model-item",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    role: "menuitemradio",
                    "aria-checked": selected,
                    className: "re-model-option",
                    disabled: busy,
                    onClick: () => void chooseModel(group.id, model.id, model.reasoning?.defaultEffort),
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "re-model-option-copy", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-model-option-name", children: displayName }),
                        isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-model-option-desc", children: `\u5168\u79F0\uFF1A${model.name}` }) : model.description === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-model-option-desc", children: model.description })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "re-model-option-actions", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "button",
                          {
                            type: "button",
                            className: "re-model-edit-btn",
                            onClick: (event) => {
                              event.stopPropagation();
                              startEdit(group.id, model.id);
                            },
                            children: "\u7F16\u8F91"
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-model-check", "aria-hidden": "true", children: selected ? "\u2713" : "" })
                      ] })
                    ]
                  }
                ),
                isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-model-editor", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-model-editor-full", children: `\u5168\u79F0\uFF1A${model.name}` }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-model-editor-row", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        className: "re-model-editor-input",
                        value: aliasDraft,
                        placeholder: "\u8F93\u5165\u7B80\u79F0",
                        autoFocus: true,
                        onChange: (event) => setAliasDraft(event.currentTarget.value),
                        onKeyDown: (event) => {
                          event.stopPropagation();
                          if (event.key === "Enter") commitAlias();
                          if (event.key === "Escape") setEditing(null);
                        }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-model-editor-save", onClick: commitAlias, children: "\u4FDD\u5B58" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-model-editor-cancel", onClick: () => setEditing(null), children: "\u53D6\u6D88" })
                  ] })
                ] }) : null,
                selected && levels.length >= 2 && sliderEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-advanced", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EffortSlider, { directory: controller }) }) : null
              ]
            },
            model.id
          );
        })
      ] }, group.id)),
      state.status === "ready" && state.groups.every((group) => group.models.length === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-model-status", children: "\u6CA1\u6709\u53EF\u7528\u6A21\u578B" }) : null,
      state.error === null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-model-error", children: state.error })
      ] })
    ] }) }) : null
  ] });
}
function ReasoningEffortSetting() {
  const enabled = (0, import_react.useSyncExternalStore)(enabledStore.subscribe, enabledStore.getSnapshot);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-setting-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-setting-copy", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-setting-title", children: "\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-setting-description", children: "\u5728\u6A21\u578B\u83DC\u5355\u4E2D\u663E\u793A\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757\u548C\u52A8\u6001\u8F90\u5C04\u7279\u6548\uFF0C\u6863\u4F4D\u968F\u5F53\u524D\u6A21\u578B\u81EA\u52A8\u9002\u914D" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-setting-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-state", children: enabled ? "\u542F\u7528" : "\u505C\u7528" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-label": "\u542F\u7528\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757",
          "aria-checked": enabled,
          className: `re-setting-switch${enabled ? " is-on" : ""}`,
          onClick: () => enabledStore.set(!enabled),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
        }
      )
    ] })
  ] });
}

var keepAwakeScope = null;
var EMPTY_SETTINGS_SNAPSHOT = { value: void 0 };
function KeepAwakeSetting() {
  const snap = (0, import_react.useSyncExternalStore)(
    (notify) => keepAwakeScope?.subscribe(notify) ?? (() => void 0),
    () => keepAwakeScope?.getSnapshot() ?? EMPTY_SETTINGS_SNAPSHOT
  );
  const enabled = snap.value?.keepAwake === true;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-setting-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-setting-copy", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-setting-title", children: "\u4FDD\u6301\u5524\u9192" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-setting-description", children: "DSH \u8FD0\u884C\u671F\u95F4\u963B\u6B62\u8BA1\u7B97\u673A\u7761\u7720/\u4F11\u7720\uFF0C\u7528\u4E8E\u4F4E\u8C37\u65F6\u6BB5\u5B9A\u65F6\u4EFB\u52A1" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-setting-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-state", children: enabled ? "\u542F\u7528" : "\u505C\u7528" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-label": "\u542F\u7528\u4FDD\u6301\u5524\u9192",
          "aria-checked": enabled,
          disabled: keepAwakeScope === null,
          className: `re-setting-switch${enabled ? " is-on" : ""}`,
          onClick: () => {
            void keepAwakeScope?.set("keepAwake", !enabled);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
        }
      )
    ] })
  ] });
}
var SETTINGS_PATH_KEY = "dsh-model-selector.settings-file-path";
function readSettingsPath() {
  try {
    return window.localStorage.getItem(SETTINGS_PATH_KEY) ?? "";
  } catch {
    return "";
  }
}
function writeSettingsPath(path) {
  try {
    window.localStorage.setItem(SETTINGS_PATH_KEY, path);
  } catch {
  }
}
var CREDENTIALS_PATH_KEY = "dsh-model-selector.credentials-file-path";
function readCredentialsPath() {
  try {
    return window.localStorage.getItem(CREDENTIALS_PATH_KEY) ?? "";
  } catch {
    return "";
  }
}
function writeCredentialsPath(path) {
  try {
    window.localStorage.setItem(CREDENTIALS_PATH_KEY, path);
  } catch {
  }
}
async function tryOpenHostPath(connection, path) {
  try {
    const response = await connection.api.host.openPath({ path });
    const result = response?.result;
    return result !== void 0 && result.ok;
  } catch {
    return false;
  }
}
async function openCredentialsFile(connection) {
  const remembered = readCredentialsPath();
  if (remembered !== "") {
    if (await tryOpenHostPath(connection, remembered)) return { opened: true, path: remembered };
  }
  const response = await connection.api.host.describe({});
  const result = response?.result;
  if (result === void 0 || !result.ok) return { opened: false };
  const home = result.value.home;
  const cwd = result.value.cwd ?? "";
  const sep = home.includes("\\") ? "\\" : "/";
  const candidates = [
    `${home}${sep}.dsh${sep}.credentials.yaml`,
    `${home}${sep}.credentials.yaml`,
    cwd === "" ? "" : `${cwd}${sep}.dsh${sep}.credentials.yaml`,
    cwd === "" ? "" : `${cwd}${sep}.credentials.yaml`
  ].filter((path) => path !== "");
  for (const path of candidates) {
    if (await tryOpenHostPath(connection, path)) {
      writeCredentialsPath(path);
      return { opened: true, path };
    }
  }
  return { opened: false };
}
var DEFAULT_MODEL_KEY = "dsh-model-selector.default-model";
var DEFAULT_MODEL_PRESET = {
  provider: "deepseek-official",
  model: "deepseek-v4-flash-vision-exp",
  reasoningEffort: "max"
};
function readDefaultModel() {
  try {
    const raw = window.localStorage.getItem(DEFAULT_MODEL_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && typeof parsed === "object") {
        const value = parsed;
        if (typeof value.provider === "string" && typeof value.model === "string") {
          return {
            provider: value.provider,
            model: value.model,
            reasoningEffort: typeof value.reasoningEffort === "string" ? value.reasoningEffort : ""
          };
        }
      }
    }
  } catch {
  }
  return { ...DEFAULT_MODEL_PRESET };
}
function writeDefaultModel(state) {
  try {
    window.localStorage.setItem(DEFAULT_MODEL_KEY, JSON.stringify(state));
  } catch {
  }
}
function SettingsPane({ onBack, connection, groups }) {
  const statsEnabled = (0, import_react.useSyncExternalStore)(tokenStatsStore.subscribe, tokenStatsStore.getSnapshot);
  const sliderEnabled = (0, import_react.useSyncExternalStore)(sliderStore.subscribe, sliderStore.getSnapshot);
  const glmEnabled = (0, import_react.useSyncExternalStore)(glmReminderStore.subscribe, glmReminderStore.getSnapshot);
  const glmLimitEnabled = (0, import_react.useSyncExternalStore)(glmLimitStore.subscribe, glmLimitStore.getSnapshot);
  const keepSnap = (0, import_react.useSyncExternalStore)(
    (notify) => keepAwakeScope?.subscribe(notify) ?? (() => void 0),
    () => keepAwakeScope?.getSnapshot() ?? EMPTY_SETTINGS_SNAPSHOT
  );
  const keepEnabled = keepSnap.value?.keepAwake === true;
  const [settingsPath, setSettingsPath] = (0, import_react.useState)(() => readSettingsPath());
  const [pathState, setPathState] = (0, import_react.useState)("idle");
  const [pathError, setPathError] = (0, import_react.useState)(null);
  const [defaultModel, setDefaultModel] = (0, import_react.useState)(() => readDefaultModel());
  const [defaultState, setDefaultState] = (0, import_react.useState)("idle");
  const [defaultMsg, setDefaultMsg] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    if (connection === void 0) return;
    let disposed = false;
    void connection.api.settings.describe({}).then((response) => {
      if (disposed) return;
      const result = response?.result;
      if (result === void 0 || !result.ok) return;
      const modelNs = result.value.namespaces.find((entry) => entry.ns === "agent-default-model");
      const modelValue = modelNs?.value;
      if (modelValue === null || modelValue === void 0 || typeof modelValue !== "object") return;
      const patch = { ...readDefaultModel() };
      if (typeof modelValue.provider === "string" && modelValue.provider !== "") patch.provider = modelValue.provider;
      if (typeof modelValue.model === "string" && modelValue.model !== "") patch.model = modelValue.model;
      if (typeof modelValue.reasoningEffort === "string") patch.reasoningEffort = modelValue.reasoningEffort;
      setDefaultModel(patch);
      writeDefaultModel(patch);
    }, () => void 0);
    return () => {
      disposed = true;
    };
  }, [connection]);
  (0, import_react.useEffect)(() => {
    if (settingsPath !== "" || connection === void 0) return;
    let disposed = false;
    void connection.api.host.describe({}).then((response) => {
      if (disposed) return;
      const result = response?.result;
      if (result !== void 0 && result.ok) {
        const sep = result.value.home.includes("\\") ? "\\" : "/";
        setSettingsPath(`${result.value.home}${sep}.dsh${sep}settings.yaml`);
      }
    }, () => void 0);
    return () => {
      disposed = true;
    };
  }, [connection, settingsPath]);
  const openSettingsFile = async () => {
    const path = settingsPath.trim();
    if (connection === void 0 || path === "") return;
    setPathState("opening");
    setPathError(null);
    try {
      const response = await connection.api.host.openPath({ path });
      const result = response?.result;
      if (result !== void 0 && result.ok) {
        setPathState("ok");
        writeSettingsPath(path);
      } else {
        setPathState("fail");
        setPathError(`${result?.error.code ?? "unknown"}: ${result?.error.message ?? "\u6253\u5F00\u5931\u8D25"}`);
      }
    } catch (cause) {
      setPathState("fail");
      setPathError(cause instanceof Error ? cause.message : String(cause));
    }
  };
  const saveDefaultModel = async () => {
    if (connection === void 0) return;
    setDefaultState("saving");
    setDefaultMsg("");
    const patch = {
      provider: defaultModel.provider,
      model: defaultModel.model
    };
    if (defaultModel.reasoningEffort.trim() !== "") {
      patch.reasoningEffort = defaultModel.reasoningEffort.trim();
    }
    try {
      const response = await connection.api.settings.update({ ns: "agent-default-model", patch });
      const result = response?.result;
      if (result !== void 0 && result.ok) {
        writeDefaultModel(defaultModel);
        setDefaultState("ok");
        setDefaultMsg("\u5DF2\u4FDD\u5B58\uFF0C\u65B0\u5BF9\u8BDD\u5C06\u4F7F\u7528\u6B64\u914D\u7F6E");
      } else {
        setDefaultState("fail");
        setDefaultMsg(`${result?.error.code ?? "unknown"}: ${result?.error.message ?? "\u4FDD\u5B58\u5931\u8D25"}`);
      }
    } catch (cause) {
      setDefaultState("fail");
      setDefaultMsg(cause instanceof Error ? cause.message : String(cause));
    }
  };
  const openConfigDocument = async () => {
    if (connection === void 0) return;
    setPathState("opening");
    setPathError(null);
    try {
      const response = await connection.api.settings.openDocument({});
      const result = response?.result;
      if (result !== void 0 && result.ok) setPathState("ok");
      else {
        setPathState("fail");
        setPathError(`${result?.error.code ?? "unknown"}: ${result?.error.message ?? "\u6253\u5F00\u5931\u8D25"}`);
      }
    } catch (cause) {
      setPathState("fail");
      setPathError(cause instanceof Error ? cause.message : String(cause));
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-settings-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-pane-back", title: "\u8FD4\u56DE", "aria-label": "\u8FD4\u56DE", onClick: onBack, children: "\u2190" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-settings-title", children: "\u63D2\u4EF6\u8BBE\u7F6E" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-title", children: "\u663E\u793A Token \u7EDF\u8BA1" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-desc", children: "\u5728\u6D6E\u7A97\u4E2D\u663E\u793A\u4ECA\u65E5 Token \u7528\u91CF\u7EDF\u8BA1" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-label": "\u663E\u793A Token \u7EDF\u8BA1",
          "aria-checked": statsEnabled,
          className: `re-setting-switch${statsEnabled ? " is-on" : ""}`,
          onClick: () => tokenStatsStore.set(!statsEnabled),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-title", children: "\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-desc", children: "\u5728\u6A21\u578B\u83DC\u5355\u4E2D\u663E\u793A\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757\u548C\u52A8\u6001\u8F90\u5C04\u7279\u6548\uFF0C\u6863\u4F4D\u968F\u5F53\u524D\u6A21\u578B\u81EA\u52A8\u9002\u914D" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-label": "\u542F\u7528\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757",
          "aria-checked": sliderEnabled,
          className: `re-setting-switch${sliderEnabled ? " is-on" : ""}`,
          onClick: () => sliderStore.set(!sliderEnabled),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-title", children: "\u4FDD\u6301\u5524\u9192" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-desc", children: "DSH \u8FD0\u884C\u671F\u95F4\u963B\u6B62\u8BA1\u7B97\u673A\u7761\u7720/\u4F11\u7720\uFF0C\u7528\u4E8E\u4F4E\u8C37\u65F6\u6BB5\u5B9A\u65F6\u4EFB\u52A1" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-label": "\u542F\u7528\u4FDD\u6301\u5524\u9192",
          "aria-checked": keepEnabled,
          disabled: keepAwakeScope === null,
          className: `re-setting-switch${keepEnabled ? " is-on" : ""}`,
          onClick: () => {
            void keepAwakeScope?.set("keepAwake", !keepEnabled);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-title", children: "GLM \u63D0\u9192" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-desc", children: "\u5728\u6D6E\u7A97\u663E\u793A GLM Coding Plan \u9AD8\u5CF0/\u7A7A\u95F2\u63D0\u9192\uFF08\u5468\u4E00\u81F3\u4E94 14:00\u201318:00 \u9AD8\u5CF0\uFF0C\u7A7A\u95F2 50% \u79EF\u5206\u62B5\u6263\uFF09" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-label": "\u542F\u7528 GLM \u63D0\u9192",
          "aria-checked": glmEnabled,
          className: `re-setting-switch${glmEnabled ? " is-on" : ""}`,
          onClick: () => glmReminderStore.set(!glmEnabled),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-title", children: "GLM \u9650\u989D\u63D0\u9192" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-desc", children: "\u81EA\u52A8\u8BC6\u522B\u300C\u5DF2\u8FBE\u5230 5 \u5C0F\u65F6\u7684\u4F7F\u7528\u4E0A\u9650\u2026\u9650\u989D\u5C06\u5728 \u2026\u91CD\u7F6E\u300D\u7C7B\u62A5\u9519\uFF08429/1308\uFF09\u5E76\u5728\u8F93\u5165\u6846\u4E0A\u65B9\u663E\u793A\u91CD\u7F6E\u65F6\u95F4\uFF08\u667A\u8C31 GLM \u6587\u6863\uFF1Adocs.bigmodel.cn/cn/guide/capabilities/thinking\uFF09" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-label": "\u542F\u7528 GLM \u9650\u989D\u63D0\u9192",
          "aria-checked": glmLimitEnabled,
          className: `re-setting-switch${glmLimitEnabled ? " is-on" : ""}`,
          onClick: () => glmLimitStore.set(!glmLimitEnabled),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting is-path", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-title", children: "\u9ED8\u8BA4\u6A21\u578B\u4E0E\u601D\u8003\u5F3A\u5EA6" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-desc", children: "\u6253\u5F00\u65B0\u5BF9\u8BDD\u65F6\u5C06\u4F7F\u7528\u6B64\u914D\u7F6E\uFF1B\u9884\u7559\u9ED8\u8BA4\uFF1ADeepSeek flash vision exp / max\u3002\u5176\u4ED6\u6A21\u578B\uFF08\u5982 GLM\uFF09\u7684\u601D\u8003\u6863\u4F4D\u53EF\u5728\u914D\u7F6E\u6587\u4EF6\u4E2D\u624B\u52A8\u586B\u5199\uFF08\u8BE6\u89C1\u4E0B\u65B9\u6A21\u578B\u914D\u7F6E\uFF09" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "select",
          {
            className: "re-timer-time re-pane-path",
            value: `${defaultModel.provider}/${defaultModel.model}`,
            onChange: (event) => {
              const parts = event.currentTarget.value.split("/");
              if (parts[0] === void 0 || parts[1] === void 0) return;
              setDefaultModel({ ...defaultModel, provider: parts[0], model: parts[1] });
              setDefaultState("idle");
            },
            children: [
              ...(groups ?? []).flatMap((group) => group.models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: `${group.id}/${model.id}`, children: model.name }, `${group.id}/${model.id}`))),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: `${defaultModel.provider}/${defaultModel.model}`, children: defaultModel.model || "\u5F53\u524D\u6A21\u578B" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "select",
          {
            className: "re-timer-time re-pane-path",
            value: defaultModel.reasoningEffort || "",
            onChange: (event) => {
              setDefaultModel({ ...defaultModel, reasoningEffort: event.currentTarget.value });
              setDefaultState("idle");
            },
            children: [
              !(() => {
                const effortOptions = (() => {
                  const group = (groups ?? []).find((candidate) => candidate.id === defaultModel.provider);
                  const model = group?.models.find((candidate) => candidate.id === defaultModel.model);
                  const efforts = model?.reasoning?.efforts ?? [];
                  return efforts.length > 0 ? efforts : [{ id: "off", name: "off" }, { id: "low", name: "low" }, { id: "high", name: "high" }, { id: "max", name: "max" }];
                })();
                return effortOptions.some((option) => option.id === defaultModel.reasoningEffort);
              })() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: defaultModel.reasoningEffort, children: defaultModel.reasoningEffort || "\u672A\u8BBE\u7F6E" }) : null,
              ...(() => {
                const effortOptions = (() => {
                  const group = (groups ?? []).find((candidate) => candidate.id === defaultModel.provider);
                  const model = group?.models.find((candidate) => candidate.id === defaultModel.model);
                  const efforts = model?.reasoning?.efforts ?? [];
                  return efforts.length > 0 ? efforts : [{ id: "off", name: "off" }, { id: "low", name: "low" }, { id: "high", name: "high" }, { id: "max", name: "max" }];
                })();
                return effortOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: option.id, children: option.name || option.id }, option.id));
              })()
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "re-defer-edit-ok",
            disabled: defaultState === "saving" || defaultModel.model.trim() === "" || defaultModel.provider.trim() === "",
            onClick: () => {
              void saveDefaultModel();
            },
            children: defaultState === "saving" ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u9ED8\u8BA4"
          }
        ),
        defaultState === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-ok", children: defaultMsg }) : null,
        defaultState === "fail" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-err", children: defaultMsg }) : null
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting is-path", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-setting-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-title", children: "\u6A21\u578B\u914D\u7F6E" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-pane-setting-desc", children: "\u539F\u59CB JSON \u7F16\u8F91\u5668\uFF08\u7A7A\u95F4\u66F4\u5927\uFF09\u4F4D\u4E8E \u8BBE\u7F6E \u2192 \u63D2\u4EF6 \u2192 \u6A21\u578B\u9009\u62E9\u5668\u589E\u5F3A\uFF1B\u6B64\u5904\u53EF\u5FEB\u6377\u6253\u5F00\u914D\u7F6E\u6587\u6863\uFF08settings.yaml\uFF09" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "re-defer-edit-ok",
            disabled: connection === void 0 || pathState === "opening",
            onClick: () => {
              void openConfigDocument();
            },
            children: pathState === "opening" ? "\u6253\u5F00\u4E2D\u2026" : "\u6253\u5F00\u914D\u7F6E\u6587\u6863"
          }
        ),
        pathState === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-ok", children: "\u5DF2\u8BF7\u6C42\u7CFB\u7EDF\u6253\u5F00\u914D\u7F6E\u6587\u6863" }) : null,
        pathError !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-err", children: pathError }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredentialOpenControl, { connection })
    ] })
  ] });
}
function CredentialOpenControl({ connection }) {
  const [state, setState] = (0, import_react.useState)("idle");
  const [error, setError] = (0, import_react.useState)(null);
  const [pathDraft, setPathDraft] = (0, import_react.useState)("");
  const open = async () => {
    if (connection === void 0) return;
    setState("opening");
    setError(null);
    const outcome = await openCredentialsFile(connection);
    if (outcome.opened) {
      setState("ok");
    } else {
      setState("fail");
      setError("\u672A\u627E\u5230\u51ED\u636E\u6587\u4EF6\uFF08.credentials.yaml\uFF09\uFF0C\u8BF7\u8F93\u5165\u5B8C\u6574\u8DEF\u5F84");
      setPathDraft(readCredentialsPath());
    }
  };
  const openExplicit = async () => {
    if (connection === void 0 || pathDraft.trim() === "") return;
    setState("opening");
    setError(null);
    if (await tryOpenHostPath(connection, pathDraft.trim())) {
      writeCredentialsPath(pathDraft.trim());
      setState("ok");
    } else {
      setState("fail");
      setError("\u6253\u5F00\u5931\u8D25\uFF1A" + pathDraft);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: "re-defer-edit-ok",
          disabled: connection === void 0 || state === "opening",
          onClick: () => {
            void open();
          },
          children: state === "opening" ? "\u6253\u5F00\u4E2D\u2026" : "\u6253\u5F00\u51ED\u636E\u6587\u4EF6"
        }
      ),
      state === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-ok", children: "\u5DF2\u8BF7\u6C42\u7CFB\u7EDF\u6253\u5F00\u51ED\u636E\u6587\u4EF6" }) : null
    ] }),
    state === "fail" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "re-timer-time re-pane-path",
          value: pathDraft,
          placeholder: "\u5B8C\u6574\u8DEF\u5F84\uFF0C\u5982 D:\\Data\\.dsh\\.credentials.yaml",
          spellCheck: false,
          onChange: (event) => setPathDraft(event.currentTarget.value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: "re-defer-edit-ok",
          disabled: state === "opening" || pathDraft.trim() === "",
          onClick: () => {
            void openExplicit();
          },
          children: "\u6253\u5F00"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-err", children: error })
    ] }) : null
  ] });
}
function ModelConfigBlock({ connection }) {
  const [rawNs, setRawNs] = (0, import_react.useState)("");
  const [rawText, setRawText] = (0, import_react.useState)("");
  const [rawState, setRawState] = (0, import_react.useState)("idle");
  const [rawMsg, setRawMsg] = (0, import_react.useState)("");
  const [pathState, setPathState] = (0, import_react.useState)("idle");
  const [pathError, setPathError] = (0, import_react.useState)(null);
  const loadRawNamespace = (ns, namespaces) => {
    const entry = namespaces?.find((item) => item.ns === ns);
    const value = entry?.value;
    if (value === null || value === void 0) {
      setRawText("");
      return;
    }
    setRawText(JSON.stringify(value, null, 2));
    setRawState("idle");
    setRawMsg("");
  };
  (0, import_react.useEffect)(() => {
    if (connection === void 0) return;
    let disposed = false;
    void connection.api.settings.describe({}).then((response) => {
      if (disposed) return;
      const result = response?.result;
      if (result === void 0 || !result.ok) return;
      const namespaces = result.value.namespaces;
      const llmNamespaces = namespaces.filter((entry) => entry.ns.startsWith("llm-"));
      if (rawNs === "" && llmNamespaces.length > 0) setRawNs(llmNamespaces[0].ns);
      if (rawNs !== "") loadRawNamespace(rawNs, namespaces);
    }, () => void 0);
    return () => {
      disposed = true;
    };
  }, [connection, rawNs]);
  const openConfigDocument = async () => {
    if (connection === void 0) return;
    setPathState("opening");
    setPathError(null);
    try {
      const response = await connection.api.settings.openDocument({});
      const result = response?.result;
      if (result !== void 0 && result.ok) setPathState("ok");
      else {
        setPathState("fail");
        setPathError(`${result?.error.code ?? "unknown"}: ${result?.error.message ?? "\u6253\u5F00\u5931\u8D25"}`);
      }
    } catch (cause) {
      setPathState("fail");
      setPathError(cause instanceof Error ? cause.message : String(cause));
    }
  };
  const saveRawConfig = async () => {
    if (connection === void 0 || rawNs === "") return;
    setRawState("saving");
    setRawMsg("");
    let patch;
    try {
      patch = JSON.parse(rawText);
    } catch (cause) {
      setRawState("fail");
      setRawMsg(cause instanceof Error ? `JSON \u89E3\u6790\u5931\u8D25\uFF1A${cause.message}` : "JSON \u89E3\u6790\u5931\u8D25");
      return;
    }
    if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
      setRawState("fail");
      setRawMsg("\u914D\u7F6E\u5185\u5BB9\u5FC5\u987B\u662F\u5BF9\u8C61");
      return;
    }
    try {
      const response = await connection.api.settings.update({ ns: rawNs, patch });
      const result = response?.result;
      if (result !== void 0 && result.ok) {
        setRawState("ok");
        setRawMsg(`\u5DF2\u4FDD\u5B58 ${rawNs}`);
      } else {
        setRawState("fail");
        setRawMsg(`${result?.error.code ?? "unknown"}: ${result?.error.message ?? "\u4FDD\u5B58\u5931\u8D25"}`);
      }
    } catch (cause) {
      setRawState("fail");
      setRawMsg(cause instanceof Error ? cause.message : String(cause));
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-block", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-block-title", children: "\u6A21\u578B\u914D\u7F6E" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-block-desc", children: "\u914D\u7F6E\u6587\u6863\uFF08settings.yaml\uFF09\u7531 DSH \u7BA1\u7406\uFF1B\u4E0B\u65B9\u53EF\u7F16\u8F91 llm-* \u547D\u540D\u7A7A\u95F4\u7684\u539F\u59CB\u914D\u7F6E\uFF08\u4E0E\u8BBE\u7F6E\u9875\u663E\u793A\u7684\u503C\u4E00\u81F4\uFF09\uFF0C\u5176\u4ED6\u6A21\u578B\uFF08GLM \u7B49\uFF09\u7684\u601D\u8003\u6863\u4F4D\u5728\u6B64\u586B\u5199 reasoningEfforts" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: "re-defer-edit-ok",
          disabled: connection === void 0 || pathState === "opening",
          onClick: () => {
            void openConfigDocument();
          },
          children: pathState === "opening" ? "\u6253\u5F00\u4E2D\u2026" : "\u6253\u5F00\u914D\u7F6E\u6587\u6863"
        }
      ),
      pathState === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-ok", children: "\u5DF2\u8BF7\u6C42\u7CFB\u7EDF\u6253\u5F00\u914D\u7F6E\u6587\u6863" }) : null,
      pathError !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-err", children: pathError }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredentialOpenControl, { connection }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "select",
        {
          className: "re-timer-time re-pane-path",
          value: rawNs,
          onChange: (event) => setRawNs(event.currentTarget.value),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "llm-deepseek", children: "llm-deepseek" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "llm-pi-ai", children: "llm-pi-ai" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: "re-defer-edit-ok",
          disabled: rawState === "saving" || rawNs === "",
          onClick: () => {
            void saveRawConfig();
          },
          children: rawState === "saving" ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-pane-path-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          className: "re-pane-raw re-pane-raw--wide",
          value: rawText,
          spellCheck: false,
          placeholder: "\u9009\u62E9\u4E0A\u65B9\u547D\u540D\u7A7A\u95F4\u540E\u663E\u793A\u5176\u539F\u59CB\u914D\u7F6E\uFF08JSON\uFF09\uFF0C\u53EF\u7F16\u8F91\u540E\u4FDD\u5B58",
          onChange: (event) => {
            setRawText(event.currentTarget.value);
            setRawState("idle");
            setRawMsg("");
          }
        }
      )
    ] }),
    rawState === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-ok", children: rawMsg }) : null,
    rawState === "fail" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-pane-path-note is-err", children: rawMsg }) : null
  ] });
}
function PluginConfigCard() {
  const [open, setOpen] = (0, import_react.useState)(false);
  const pluginOn = (0, import_react.useSyncExternalStore)(pluginStore.subscribe, pluginStore.getSnapshot);
  const sliderOn = (0, import_react.useSyncExternalStore)(sliderStore.subscribe, sliderStore.getSnapshot);
  const statsOn = (0, import_react.useSyncExternalStore)(tokenStatsStore.subscribe, tokenStatsStore.getSnapshot);
  const glmOn = (0, import_react.useSyncExternalStore)(glmReminderStore.subscribe, glmReminderStore.getSnapshot);
  const glmLimitOn = (0, import_react.useSyncExternalStore)(glmLimitStore.subscribe, glmLimitStore.getSnapshot);
  const keepSnap = (0, import_react.useSyncExternalStore)(
    (notify) => keepAwakeScope?.subscribe(notify) ?? (() => void 0),
    () => keepAwakeScope?.getSnapshot() ?? EMPTY_SETTINGS_SNAPSHOT
  );
  const keepOn = keepSnap.value?.keepAwake === true;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `re-plugin-card${open ? " is-open" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "re-plugin-header", "aria-expanded": open, onClick: () => setOpen(!open), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "re-plugin-headtext", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-plugin-name", children: "\u6A21\u578B\u9009\u62E9\u5668\u589E\u5F3A" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-plugin-desc", children: "\u6A21\u578B/\u601D\u8003\u6863\u4F4D/\u5CF0\u8C37\u8BA1\u4EF7/\u5B9A\u65F6\u53D1\u9001 \u4E00\u7AD9\u5F0F\u589E\u5F3A \u00B7 dsh-model-selector" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `re-plugin-chevron${open ? " is-open" : ""}`, "aria-hidden": "true", children: "\u25BE" })
    ] }),
    open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-title", children: "\u542F\u7528\u63D2\u4EF6" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-desc", children: "\u5173\u95ED\u540E\u6062\u590D DSH \u539F\u751F\u6A21\u578B\u9009\u62E9\u5668\uFF0C\u5E76\u9690\u85CF\u5B9A\u65F6\u53D1\u9001/\u7EDF\u8BA1\u7B49\u5168\u90E8\u589E\u5F3A\u754C\u9762" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-label": "\u542F\u7528\u63D2\u4EF6",
            "aria-checked": pluginOn,
            className: `re-setting-switch${pluginOn ? " is-on" : ""}`,
            onClick: () => pluginStore.set(!pluginOn),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-title", children: "\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-desc", children: "\u5728\u6A21\u578B\u83DC\u5355\u4E2D\u663E\u793A\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757\u548C\u52A8\u6001\u8F90\u5C04\u7279\u6548\uFF0C\u6863\u4F4D\u968F\u5F53\u524D\u6A21\u578B\u81EA\u52A8\u9002\u914D" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-label": "\u542F\u7528\u63A8\u7406\u5F3A\u5EA6\u6ED1\u5757",
            "aria-checked": sliderOn,
            disabled: !pluginOn,
            className: `re-setting-switch${sliderOn ? " is-on" : ""}`,
            onClick: () => sliderStore.set(!sliderOn),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-title", children: "\u663E\u793A Token \u7EDF\u8BA1" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-desc", children: "\u5728\u6D6E\u7A97\u4E2D\u663E\u793A\u4ECA\u65E5 Token \u7528\u91CF\u7EDF\u8BA1" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-label": "\u663E\u793A Token \u7EDF\u8BA1",
            "aria-checked": statsOn,
            disabled: !pluginOn,
            className: `re-setting-switch${statsOn ? " is-on" : ""}`,
            onClick: () => tokenStatsStore.set(!statsOn),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-title", children: "\u4FDD\u6301\u5524\u9192" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-desc", children: "DSH \u8FD0\u884C\u671F\u95F4\u963B\u6B62\u8BA1\u7B97\u673A\u7761\u7720/\u4F11\u7720\uFF0C\u7528\u4E8E\u4F4E\u8C37\u65F6\u6BB5\u5B9A\u65F6\u4EFB\u52A1" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-label": "\u542F\u7528\u4FDD\u6301\u5524\u9192",
            "aria-checked": keepOn,
            disabled: keepAwakeScope === null || !pluginOn,
            className: `re-setting-switch${keepOn ? " is-on" : ""}`,
            onClick: () => {
              void keepAwakeScope?.set("keepAwake", !keepOn);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-title", children: "GLM \u63D0\u9192" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-desc", children: "\u5728\u6D6E\u7A97\u663E\u793A GLM Coding Plan \u9AD8\u5CF0/\u7A7A\u95F2\u63D0\u9192\uFF08\u5468\u4E00\u81F3\u4E94 14:00\u201318:00 \u9AD8\u5CF0\uFF0C\u7A7A\u95F2 50% \u79EF\u5206\u62B5\u6263\uFF09" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-label": "\u542F\u7528 GLM \u63D0\u9192",
            "aria-checked": glmOn,
            disabled: !pluginOn,
            className: `re-setting-switch${glmOn ? " is-on" : ""}`,
            onClick: () => glmReminderStore.set(!glmOn),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-plugin-row-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-title", children: "GLM \u9650\u989D\u63D0\u9192" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-plugin-row-desc", children: "\u81EA\u52A8\u8BC6\u522B\u300C\u5DF2\u8FBE\u5230 5 \u5C0F\u65F6\u7684\u4F7F\u7528\u4E0A\u9650\u2026\u9650\u989D\u5C06\u5728 \u2026\u91CD\u7F6E\u300D\u7C7B\u62A5\u9519\u5E76\u5728\u8F93\u5165\u6846\u4E0A\u65B9\u663E\u793A\u91CD\u7F6E\u65F6\u95F4" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-label": "\u542F\u7528 GLM \u9650\u989D\u63D0\u9192",
            "aria-checked": glmLimitOn,
            disabled: !pluginOn,
            className: `re-setting-switch${glmLimitOn ? " is-on" : ""}`,
            onClick: () => glmLimitStore.set(!glmLimitOn),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-setting-switch-knob", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelConfigBlock, { connection: DEFERRED_CONNECTION })
    ] }) : null
  ] });
}
function GlmHint({ now }) {
  const enabled = (0, import_react.useSyncExternalStore)(glmReminderStore.subscribe, glmReminderStore.getSnapshot);
  if (!enabled) return null;
  const glm = glmPhase(now);
  const stateName = glm.peak ? "GLM \u9AD8\u5CF0" : "GLM \u7A7A\u95F2";
  const stateDesc = glm.peak ? "14:00\u201318:00 \u00B7 \u5168\u79EF\u5206" : "50% \u79EF\u5206\u62B5\u6263";
  const accent = glm.peak ? "#f6b93b" : "#3ddc84";
  const targetName = glm.peak ? "GLM \u7A7A\u95F2\uFF0850% \u62B5\u6263\uFF09" : "GLM \u9AD8\u5CF0\uFF08\u5168\u79EF\u5206\uFF09";
  const targetAccent = glm.peak ? "#3ddc84" : "#f6b93b";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-glm-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-peak-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-peak-dot", style: { background: accent }, "aria-hidden": "true" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-glm-badge", "aria-hidden": "true", children: "GLM" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-peak-state", style: { color: accent }, children: stateName }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-peak-desc", children: stateDesc })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-peak-countdown", children: [
      `\u8DDD ${targetName} \u8FD8\u6709\uFF1A`,
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-peak-time", style: { color: targetAccent }, children: formatDur(glm.secondsToTarget) })
    ] })
  ] });
}
function findLastLimitError(nodes) {
  if (nodes === void 0) return void 0;
  let found;
  for (const node of nodes) {
    if (node?.kind !== "turn-error") continue;
    if (!node.message.includes("\u91CD\u7F6E")) continue;
    if (!/\d{4}-\d{2}-\d{2}[ T]?\d{2}:\d{2}:\d{2}/.test(node.message)) continue;
    found = node;
  }
  return found;
}
function parseResetTime(message) {
  const match = message.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (match === null) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  return Date.UTC(year, month - 1, day, hour - 8, minute, second);
}
var BJ_OFFSET = 8 * 3600000;
var PEAK_WINDOWS = [[9 * 3600, 12 * 3600], [14 * 3600, 18 * 3600]];
function beijingParts(ms) {
  const d = new Date(ms + BJ_OFFSET);
  return { day: d.getUTCDay(), sec: d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds() };
}
function phase(ms) {
  const { day, sec } = beijingParts(ms);
  const weekday = day >= 1 && day <= 5;
  const peak = weekday && PEAK_WINDOWS.some(([s, e]) => sec >= s && sec < e);
  if (peak) {
    const end = sec < 12 * 3600 ? 12 * 3600 : 18 * 3600;
    return { peak: true, secondsToTarget: end - sec };
  }
  const shifted = ms + BJ_OFFSET;
  const startOfShiftedDay = shifted - sec * 1000;
  if (weekday && sec < 9 * 3600) {
    return { peak: false, secondsToTarget: (startOfShiftedDay + 9 * 3600 * 1000 - shifted) / 1000 };
  }
  if (weekday && sec >= 12 * 3600 && sec < 14 * 3600) {
    return { peak: false, secondsToTarget: (startOfShiftedDay + 14 * 3600 * 1000 - shifted) / 1000 };
  }
  for (let i = 1; i <= 7; i++) {
    const nd = (day + i) % 7;
    if (nd >= 1 && nd <= 5) {
      return { peak: false, secondsToTarget: (startOfShiftedDay + i * 86400000 + 9 * 3600 * 1000 - shifted) / 1000 };
    }
  }
  return { peak: false, secondsToTarget: 0 };
}
function glmPhase(ms) {
  const { day, sec } = beijingParts(ms);
  const weekday = day >= 1 && day <= 5;
  const peak = weekday && sec >= 14 * 3600 && sec < 18 * 3600;
  if (peak) return { peak: true, secondsToTarget: 18 * 3600 - sec, targetPeak: false };
  const shifted = ms + BJ_OFFSET;
  const startOfShiftedDay = shifted - sec * 1000;
  if (weekday && sec < 14 * 3600) {
    return { peak: false, secondsToTarget: (startOfShiftedDay + 14 * 3600 * 1000 - shifted) / 1000, targetPeak: true };
  }
  for (let i = 1; i <= 7; i++) {
    const nd = (day + i) % 7;
    if (nd >= 1 && nd <= 5) {
      return { peak: false, secondsToTarget: (startOfShiftedDay + i * 86400000 + 14 * 3600 * 1000 - shifted) / 1000, targetPeak: true };
    }
  }
  return { peak: false, secondsToTarget: 0, targetPeak: true };
}
function formatDur(sec) {
  sec = Math.max(0, Math.floor(sec));
  const pad = (n) => String(n).padStart(2, "0");
  const days = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const hms = pad(h) + ":" + pad(m) + ":" + pad(s);
  return days > 0 ? days + "\u5929 " + hms : hms;
}
var STATS_CACHE_KEY = "dsh-model-selector.token-stats";
var STATS_REFRESH_MS = 1.8e5;
var STATS_MAX_PAGES = 3;
var STATS_PAGE_MESSAGES = 100;
var TOKEN_STATS_ENABLED_KEY = "dsh-model-selector.token-stats-enabled";
function readTokenStatsEnabled() {
  try {
    return window.localStorage.getItem(TOKEN_STATS_ENABLED_KEY) !== "false";
  } catch {
    return true;
  }
}
let tokenStatsEnabled = readTokenStatsEnabled();
const tokenStatsListeners = new Set();
const tokenStatsStore = {
  getSnapshot: () => tokenStatsEnabled,
  subscribe: (listener) => {
    tokenStatsListeners.add(listener);
    return () => tokenStatsListeners.delete(listener);
  },
  set: (enabled, persist = true) => {
    if (tokenStatsEnabled === enabled) return;
    tokenStatsEnabled = enabled;
    if (persist) {
      try {
        window.localStorage.setItem(TOKEN_STATS_ENABLED_KEY, String(enabled));
      } catch {
      }
    }
    tokenStatsListeners.forEach((listener) => listener());
  }
};
function beijingDayStart(ms) {
  const shifted = new Date(ms + BJ_OFFSET);
  const start = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - BJ_OFFSET;
  return start;
}
function beijingDateKey(ms) {
  const shifted = new Date(ms + BJ_OFFSET);
  const pad = (n) => String(n).padStart(2, "0");
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`;
}
function fmtTokens(n) {
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n < 1000) return String(Math.round(n));
  const units = [
    { value: 1e8, name: "\u4EBF", decimals: 2 },
    { value: 1e7, name: "\u5343\u4E07", decimals: 1 },
    { value: 1e6, name: "\u767E\u4E07", decimals: 1 },
    { value: 1e5, name: "\u5341\u4E07", decimals: 1 },
    { value: 1e4, name: "\u4E07", decimals: 1 },
    { value: 1e3, name: "\u5343", decimals: 1 }
  ];
  let unit = units[units.length - 1];
  for (const candidate of units) {
    if (n >= candidate.value) {
      unit = candidate;
      break;
    }
  }
  const raw = n / unit.value;
  let text;
  if (unit.name === "\u4EBF" && raw % 1 > 0 && raw % 1 < 0.01) {
    text = String(Math.floor(raw));
  } else {
    text = raw.toFixed(unit.decimals).replace(/\.?0+$/, "");
  }
  return `${text}${unit.name}`;
}
function emptyBucket() {
  return { peak: 0, idle: 0, total: 0 };
}
function bucketOf(models, key) {
  return models[key] ?? (models[key] = emptyBucket());
}
function usageTokensOf(usage) {
  const pick = (key) => {
    const value = usage[key];
    return typeof value === "number" && value > 0 ? value : 0;
  };
  return pick("inputTokens") + pick("cacheReadTokens") + pick("cacheWriteTokens") + pick("outputTokens");
}
function aggregateEvents(events, models, prev, dayStart, prevDayStart, walk) {
  for (const entry of events) {
    const event = entry.event;
    if (!walk.seedPassed) {
      if (event.type === "session/end-seed") walk.seedPassed = true;
      continue;
    }
    const data = event.data;
    if (event.type === "request/header" && data !== null && data !== void 0 && data.header !== void 0) {
      const config = data.header.config;
      if (config !== void 0 && typeof config.provider === "string" && typeof config.model === "string") {
        walk.header = { provider: config.provider, model: config.model };
      }
    } else if (event.type === "assistant/message" && data !== null && data !== void 0 && data.usage !== void 0) {
      if (event.time < prevDayStart) continue;
      const tokens = usageTokensOf(data.usage);
      if (tokens <= 0) continue;
      const source = data.message?.source;
      const provider = typeof source?.provider === "string" ? source.provider : void 0;
      const model = typeof source?.model === "string" ? source.model : void 0;
      const key = provider !== void 0 && model !== void 0 ? `${provider}/${model}` : walk.header !== void 0 ? `${walk.header.provider}/${walk.header.model}` : "(\u672A\u77E5)";
      const into = event.time >= dayStart ? models : prev;
      const bucket = bucketOf(into, key);
      if (phase(event.time).peak) bucket.peak += tokens;
      else bucket.idle += tokens;
      bucket.total += tokens;
    }
  }
}
async function collectSessionStats(connection, sessionId, dayStart, prevDayStart, models, prev) {
  const walk = { header: void 0, seedPassed: false };
  let beforeSeq;
  for (let page = 0; page < STATS_MAX_PAGES; page += 1) {
    const response = await connection.api.sessions.history({
      sessionId,
      maxMessages: STATS_PAGE_MESSAGES,
      ...beforeSeq === void 0 ? {} : { beforeSeq }
    });
    const result = response?.result;
    if (result === void 0 || !result.ok) return;
    const events = result.value.events;
    if (events.length === 0) return;
    aggregateEvents(events, models, prev, dayStart, prevDayStart, walk);
    let minTime = Infinity;
    let minSeq = Infinity;
    for (const entry of events) {
      if (entry.event.time < minTime) minTime = entry.event.time;
      if (entry.event.seq < minSeq) minSeq = entry.event.seq;
    }
    if (minTime < prevDayStart || !result.value.hasMore) return;
    beforeSeq = minSeq;
  }
}
async function fetchTodayStats(connection) {
  if (connection === void 0) return null;
  const dayStart = beijingDayStart(Date.now());
  const prevDayStart = dayStart - 86400000;
  const models = {};
  const prev = {};
  let scanned = 0;
  let failed = 0;
  const response = await connection.api.sessions.list({});
  const result = response?.result;
  if (result === void 0 || !result.ok) return null;
  for (const item of result.value.items) {
    if (item.updatedAt < prevDayStart) continue;
    scanned += 1;
    try {
      await collectSessionStats(connection, item.sessionId, dayStart, prevDayStart, models, prev);
    } catch (cause) {
      failed += 1;
      console.error("[dsh-model-selector] token stats: session read failed", item.sessionId, cause);
    }
  }
  return { models, prev, scanned, failed };
}
function readCachedStats() {
  try {
    const raw = window.localStorage.getItem(STATS_CACHE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") return null;
    const stats = parsed;
    if (stats.date !== beijingDateKey(Date.now()) || stats.models === void 0) return null;
    if (stats.prev === void 0) stats.prev = {};
    return stats;
  } catch {
    return null;
  }
}
function writeCachedStats(stats) {
  try {
    window.localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats));
  } catch {
  }
}
function TokenStats({ connection, groups }) {
  const [expanded, setExpanded] = (0, import_react.useState)(false);
  const [stats, setStats] = (0, import_react.useState)(readCachedStats);
  const [updating, setUpdating] = (0, import_react.useState)(false);
  const [result, setResult] = (0, import_react.useState)(null);
  const [fatal, setFatal] = (0, import_react.useState)(null);
  const aliasMap = (0, import_react.useSyncExternalStore)(aliasStore.subscribe, aliasStore.getSnapshot);
  const statsVisible = (0, import_react.useSyncExternalStore)(tokenStatsStore.subscribe, tokenStatsStore.getSnapshot);
  (0, import_react.useEffect)(() => {
    if (connection === void 0 || !statsVisible) return;
    let disposed = false;
    const refresh = async () => {
      setUpdating(true);
      setFatal(null);
      try {
        const outcome = await fetchTodayStats(connection);
        if (disposed) return;
        if (outcome === null) {
          setFatal("\u7EDF\u8BA1\u6570\u636E\u52A0\u8F7D\u5931\u8D25");
          return;
        }
        setResult(outcome);
        const next = { date: beijingDateKey(Date.now()), fetchedAt: Date.now(), models: outcome.models, prev: outcome.prev };
        setStats(next);
        writeCachedStats(next);
      } catch (cause) {
        if (disposed) return;
        console.error("[dsh-model-selector] token stats: refresh failed", cause);
        setFatal(cause instanceof Error ? cause.message : String(cause));
      } finally {
        if (!disposed) setUpdating(false);
      }
    };
    void refresh();
    const id = window.setInterval(() => void refresh(), STATS_REFRESH_MS);
    return () => {
      disposed = true;
      window.clearInterval(id);
    };
  }, [connection, statsVisible]);
  if (connection === void 0) return null;
  if (!statsVisible) return null;
  const models = stats?.models ?? {};
  const prev = stats?.prev ?? {};
  const keys = Object.keys(models).sort((a, b) => models[b].total - models[a].total);
  let peakTotal = 0;
  let idleTotal = 0;
  let totalTotal = 0;
  let prevTotal = 0;
  for (const key of keys) {
    peakTotal += models[key].peak;
    idleTotal += models[key].idle;
    totalTotal += models[key].total;
  }
  for (const key of Object.keys(prev)) prevTotal += prev[key].total;
  const modelLabelOf = (key) => {
    const aliased = aliasMap[key];
    if (aliased !== void 0) return aliased;
    const parts = key.split("/");
    const group = groups.find((candidate) => candidate.id === parts[0]);
    const entry = group?.models.find((candidate) => candidate.id === parts[1]);
    return entry?.name ?? parts[1] ?? key;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-stats", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "re-stats-row", "aria-expanded": expanded, onClick: () => setExpanded(!expanded), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-stats-title", children: "\u4ECA\u65E5 Token \u603B\u7528\u91CF" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `re-stats-status${updating ? " is-updating" : ""}`, children: updating ? "\u66F4\u65B0\u4E2D\u2026" : fatal !== null ? "\u52A0\u8F7D\u5931\u8D25" : "\u5DF2\u66F4\u65B0" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-stats-value", children: fmtTokens(totalTotal) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `re-stats-chevron${expanded ? " is-open" : ""}`, "aria-hidden": "true" })
    ] }),
    expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-stats-body", children: [
      fatal !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-stats-empty", children: "\u7EDF\u8BA1\u6570\u636E\u52A0\u8F7D\u5931\u8D25" }) : keys.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-stats-empty", children: ["\u4ECA\u65E5\u6682\u65E0\u6D88\u8017", prevTotal > 0 ? `\uFF08\u6628\u65E5\u5168\u5929 ${fmtTokens(prevTotal)}\uFF09` : ""] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-stats-detail", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "re-stats-table", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "re-stats-th-model", children: "\u6A21\u578B" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "re-stats-th-peak", children: "\u9AD8\u5CF0" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "re-stats-th-idle", children: "\u4F4E\u8C37" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "re-stats-th-total", children: "\u5408\u8BA1" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
            ...keys.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { key, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-model", title: key, children: modelLabelOf(key) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-num", children: fmtTokens(models[key].peak) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-num", children: fmtTokens(models[key].idle) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-num is-total", children: fmtTokens(models[key].total) })
            ] })),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "re-stats-row-total", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-model", children: "\u5408\u8BA1" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-num", children: fmtTokens(peakTotal) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-num", children: fmtTokens(idleTotal) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "re-stats-td-num is-total", children: fmtTokens(totalTotal) })
            ] }),
            result !== null && result.failed > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-stats-note", children: `\u90E8\u5206\u4F1A\u8BDD\u8BFB\u53D6\u5931\u8D25\uFF08${result.failed}/${result.scanned}\uFF09\uFF0C\u8BE6\u60C5\u89C1\u6D4F\u89C8\u5668\u63A7\u5236\u53F0` }) : null
          ] })
        ] })
      ] })
    ] }) : null
  ] });
}
var DEFER_STORAGE_KEY = "dsh-model-selector.deferred-queue";
var DEFER_DELAY_MS = 3e4;
let deferredItems = readDeferred();
const deferListeners = new Set();
let DEFERRED_CONNECTION;
function deferGroupKey(item) {
  if (item.mode === "idle") return "idle";
  const at = item.at ?? { hour: 9, minute: 0 };
  return `${String(at.hour).padStart(2, "0")}:${String(at.minute).padStart(2, "0")}`;
}
function deferTimeLabel(item) {
  if (item.mode === "idle") return "\u7A7A\u95F2\u53D1\u9001";
  const at = item.at ?? { hour: 9, minute: 0 };
  return `${String(at.hour).padStart(2, "0")}:${String(at.minute).padStart(2, "0")}`;
}
function readDeferred() {
  try {
    const raw = window.localStorage.getItem(DEFER_STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((entry) => entry !== null && typeof entry === "object").map((entry) => entry).filter((entry) => entry.id !== void 0 && typeof entry.text === "string").map((entry) => entry.mode === "custom" ? entry : { ...entry, mode: "idle" });
    }
    return [];
  } catch {
    return [];
  }
}
function persistDeferred() {
  try {
    window.localStorage.setItem(DEFER_STORAGE_KEY, JSON.stringify(deferredItems));
  } catch {
  }
}
const deferStore = {
  getSnapshot: () => deferredItems,
  subscribe: (listener) => {
    deferListeners.add(listener);
    return () => deferListeners.delete(listener);
  },
  enqueue: (sessionId, text, mode, at) => {
    const base = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      seq: 0,
      sessionId,
      text,
      createdAt: Date.now(),
      mode,
      ...mode === "custom" ? { at: at ?? { hour: 9, minute: 0 } } : {}
    };
    const group = deferGroupKey(base);
    const seq = deferredItems.filter((item) => deferGroupKey(item) === group).reduce((max, item) => Math.max(max, item.seq), 0) + 1;
    deferredItems = [...deferredItems, { ...base, seq }];
    persistDeferred();
    deferListeners.forEach((listener) => listener());
  },
  remove: (id) => {
    if (!deferredItems.some((item) => item.id === id)) return;
    deferredItems = deferredItems.filter((item) => item.id !== id);
    persistDeferred();
    deferListeners.forEach((listener) => listener());
  },
  retarget: (id, mode, at) => {
    const current = deferredItems.find((item) => item.id === id);
    if (current === void 0) return;
    const next = {
      ...current,
      mode,
      error: void 0,
      ...mode === "custom" ? { at: at ?? current.at ?? { hour: 9, minute: 0 } } : {}
    };
    const group = deferGroupKey(next);
    const seq = deferredItems.filter((item) => item.id !== id && deferGroupKey(item) === group).reduce((max, item) => Math.max(max, item.seq), 0) + 1;
    deferredItems = deferredItems.map((item) => item.id === id ? { ...next, seq } : item);
    persistDeferred();
    deferListeners.forEach((listener) => listener());
  },
  setError: (id, error) => {
    if (!deferredItems.some((item) => item.id === id)) return;
    deferredItems = deferredItems.map((item) => item.id === id ? { ...item, error } : item);
    persistDeferred();
    deferListeners.forEach((listener) => listener());
  }
};
function nextIdleStartMs(ms) {
  const { day, sec } = beijingParts(ms);
  if (day < 1 || day > 5) return null;
  const shifted = new Date(ms + BJ_OFFSET);
  const dayStartMs = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - BJ_OFFSET;
  if (sec >= 9 * 3600 && sec < 12 * 3600) return dayStartMs + 12 * 3600 * 1000;
  if (sec >= 14 * 3600 && sec < 18 * 3600) return dayStartMs + 18 * 3600 * 1000;
  return null;
}
function idleSendAt(ms) {
  return (nextIdleStartMs(ms) ?? ms) + DEFER_DELAY_MS;
}
function customNextAt(at, ms) {
  const shifted = new Date(ms + BJ_OFFSET);
  const dayStartMs = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - BJ_OFFSET;
  const today = dayStartMs + at.hour * 3600000 + at.minute * 60000;
  return today > ms ? today : today + 86400000;
}
function sendAtOf(item, ms) {
  if (item.mode === "idle") return idleSendAt(ms);
  return customNextAt(item.at ?? { hour: 9, minute: 0 }, ms);
}
async function sendDeferredItem(connection, item) {
  if (connection === void 0) return false;
  try {
    const response = await connection.api.sessions.prompt({
      sessionId: item.sessionId,
      mode: "queue",
      content: [{ type: "text", text: item.text }],
      clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    const result = response?.result;
    if (result === void 0 || !result.ok) {
      console.error("[dsh-model-selector] deferred send failed", item.id, result?.error);
      deferStore.setError(item.id, `${result?.error.code ?? "unknown"}: ${result?.error.message ?? "\u53D1\u9001\u5931\u8D25"}`);
      return false;
    }
    deferStore.remove(item.id);
    return true;
  } catch (cause) {
    console.error("[dsh-model-selector] deferred send threw", item.id, cause);
    deferStore.setError(item.id, cause instanceof Error ? cause.message : String(cause));
    return false;
  }
}
function fmtCountdown(ms) {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  const pad = (n) => String(n).padStart(2, "0");
  const days = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const hms = pad(h) + ":" + pad(m) + ":" + pad(s);
  return days > 0 ? `${days}\u5929 ${hms}` : hms;
}
function TimerSendButton({ input, sessionId, inputActions }) {
  const draft = input?.draft ?? "";
  const canQueue = draft.trim() !== "" && inputActions !== void 0 && sessionId !== void 0;
  const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
  const [picking, setPicking] = (0, import_react.useState)(false);
  const [timeDraft, setTimeDraft] = (0, import_react.useState)("09:00");
  const rootRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!menuOpen) return;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [menuOpen]);
  if (!canQueue) return null;
  const close = () => {
    setMenuOpen(false);
    setPicking(false);
  };
  const commit = (mode, at) => {
    if (!canQueue) return;
    inputActions?.setDraft("");
    deferStore.enqueue(sessionId, draft, mode, at);
    close();
  };
  const submitCustom = () => {
    const parts = timeDraft.split(":");
    const hour = Number(parts[0]);
    const minute = Number(parts[1] ?? 0);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;
    commit("custom", { hour: Math.max(0, Math.min(23, hour)), minute: Math.max(0, Math.min(59, minute)) });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: rootRef, className: "re-timer-root", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "re-timer-btn", title: "\u5B9A\u65F6\u53D1\u9001", "aria-label": "\u5B9A\u65F6\u53D1\u9001", "aria-expanded": menuOpen, onClick: () => {
      setMenuOpen(!menuOpen);
      setPicking(false);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-timer-btn-icon", "aria-hidden": "true" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-timer-btn-text", children: "\u5B9A\u65F6\u53D1\u9001" })
    ] }),
    menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-timer-menu", children: [
      !picking ? [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "re-timer-option", onClick: () => commit("idle"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-timer-option-name", children: "\u7A7A\u95F2\u53D1\u9001" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-timer-option-desc", children: "\u7B49\u5230\u4E0B\u4E00\u4E2A\u7A7A\u95F2\u65F6\u95F4\u81EA\u52A8\u53D1\u9001" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "re-timer-option", onClick: () => setPicking(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-timer-option-name", children: "\u81EA\u5B9A\u4E49\u65F6\u95F4\u53D1\u9001" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-timer-option-desc", children: "\u8F93\u5165\u4E00\u4E2A\u65F6\u95F4\uFF0C\u6BCF\u5929\u5230\u70B9\u53D1\u9001" })
        ] })
      ] : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-timer-picker", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-timer-picker-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "time", className: "re-timer-time", value: timeDraft, onChange: (event) => setTimeDraft(event.currentTarget.value), autoFocus: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-timer-picker-ok", onClick: submitCustom, children: "\u786E\u5B9A" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-timer-picker-cancel", onClick: () => setPicking(false), children: "\u8FD4\u56DE" })
      ] }) })
    ] }) : null
  ] });
}
function DeferredPanel({ sessionId }) {
  const items = (0, import_react.useSyncExternalStore)(deferStore.subscribe, deferStore.getSnapshot);
  const [now, setNow] = (0, import_react.useState)(Date.now());
  const [expanded, setExpanded] = (0, import_react.useState)({});
  const [editing, setEditing] = (0, import_react.useState)({});
  (0, import_react.useEffect)(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  (0, import_react.useEffect)(() => {
    if (DEFERRED_CONNECTION === void 0) return;
    for (const item of items) {
      if (sendAtOf(item, now) > now) continue;
      void sendDeferredItem(DEFERRED_CONNECTION, item);
    }
  }, [now, items]);
  const own = items.filter((item) => item.sessionId === sessionId).sort((a, b) => a.createdAt - b.createdAt);
  const idleRows = own.filter((item) => item.mode === "idle").sort((a, b) => a.seq - b.seq);
  const customRows = own.filter((item) => item.mode === "custom").sort((a, b) => a.seq - b.seq);
  const customGroups = [];
  for (const row of customRows.sort((a, b) => deferGroupKey(a).localeCompare(deferGroupKey(b)))) {
    const group = customGroups.find((entries) => deferGroupKey(entries[0]) === deferGroupKey(row));
    if (group === void 0) customGroups.push([row]);
    else group.push(row);
  }
  if (own.length === 0 || DEFERRED_CONNECTION === void 0) return null;
  const toggle = (id) => {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  };
  const nextIdle = nextIdleStartMs(now);
  const idleGroupLabel = nextIdle === null ? "\u5F53\u524D\u7A7A\u95F2\u65F6\u6BB5" : `\u8DDD\u7A7A\u95F2 ${fmtCountdown(nextIdle - now)}`;
  const renderRow = (item) => {
    const isIdle = item.mode === "idle";
    const sendAt = sendAtOf(item, now);
    const open = expanded[item.id] === true;
    const editingDraft = editing[item.id];
    const isEditing = editingDraft !== void 0;
    const label = deferTimeLabel(item);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { key: item.id, className: `re-defer-row${open ? " is-open" : ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "re-defer-toggle", onClick: () => toggle(item.id), "aria-expanded": open, title: open ? "\u6298\u53E0\u5185\u5BB9" : "\u5C55\u5F00\u5185\u5BB9", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-chevron", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-seq", children: `#${item.seq}` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `re-defer-mode${isIdle ? " is-idle" : " is-custom"}`, children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-summary", children: open ? "" : item.text })
      ] }),
      open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-defer-full", children: item.text }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "re-defer-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-countdown", title: `\u9884\u8BA1 ${new Date(sendAt).toLocaleTimeString()} \u53D1\u9001`, children: fmtCountdown(sendAt - now) }),
        isIdle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-defer-toidle", title: "\u6539\u4E3A\u81EA\u5B9A\u4E49\u65F6\u95F4\u53D1\u9001", onClick: () => {
          setEditing((current) => ({ ...current, [item.id]: "09:00" }));
        }, children: "\u8F6C\u81EA\u5B9A\u4E49" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-defer-cancel", title: "\u6539\u4E3A\u7A7A\u95F2\u53D1\u9001", onClick: () => deferStore.retarget(item.id, "idle"), children: "\u8F6C\u7A7A\u95F2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-defer-toidle", title: "\u4FEE\u6539\u53D1\u9001\u65F6\u95F4", onClick: () => {
            const at = item.at ?? { hour: 9, minute: 0 };
            setEditing((current) => ({ ...current, [item.id]: `${String(at.hour).padStart(2, "0")}:${String(at.minute).padStart(2, "0")}` }));
          }, children: "\u6539\u65F6\u95F4" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-defer-send", onClick: () => {
          void sendDeferredItem(DEFERRED_CONNECTION, item);
        }, children: "\u7ACB\u5373\u53D1\u9001" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-defer-remove", title: "\u5220\u9664", onClick: () => deferStore.remove(item.id), children: "\u2715" })
      ] }),
      isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "re-defer-edit", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "time", className: "re-defer-time", value: editingDraft, onChange: (event) => setEditing((current) => ({ ...current, [item.id]: event.currentTarget.value })), autoFocus: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-defer-edit-ok", onClick: () => {
          const parts = editingDraft.split(":");
          const hour = Number(parts[0]);
          const minute = Number(parts[1] ?? 0);
          if (Number.isFinite(hour) && Number.isFinite(minute)) {
            deferStore.retarget(item.id, "custom", { hour: Math.max(0, Math.min(23, hour)), minute: Math.max(0, Math.min(59, minute)) });
          }
          setEditing((current) => {
            const next = { ...current };
            delete next[item.id];
            return next;
          });
        }, children: "\u786E\u5B9A" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "re-defer-edit-cancel", onClick: () => {
          setEditing((current) => {
            const next = { ...current };
            delete next[item.id];
            return next;
          });
        }, children: "\u53D6\u6D88" })
      ] }) : null,
      item.error === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-defer-error", children: item.error })
    ] });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-dock", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-lead", "aria-hidden": "true", children: "\u23F3" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-title", children: `\u5B9A\u65F6\u53D1\u9001 \u00B7 ${own.length} \u6761` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-hint", children: "\u7A7A\u95F2\u53D1\u9001 = \u5317\u4EAC\u65F6\u95F4\u7A7A\u95F2\u65F6\u6BB5\uFF08\u5F00\u59CB 30 \u79D2\u540E\u81EA\u52A8\u53D1\uFF09\uFF1B\u81EA\u5B9A\u4E49 = \u6BCF\u5929\u5230\u70B9\u53D1\u9001\uFF1B\u8BF7\u4FDD\u6301\u9875\u9762\u6253\u5F00" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-list", children: [
      idleRows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-group-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-group-dot is-idle", "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-group-title", children: `\u7A7A\u95F2\u53D1\u9001 \u00B7 ${idleRows.length} \u6761` }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-group-count", children: idleGroupLabel })
        ] }),
        idleRows.map(renderRow)
      ] }) : null,
      customRows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "re-defer-group-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-group-dot is-custom", "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "re-defer-group-title", children: `\u81EA\u5B9A\u4E49\u65F6\u95F4 \u00B7 ${customRows.length} \u6761` })
        ] }),
        customGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { key: deferGroupKey(group[0]), className: "re-defer-subgroup", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "re-defer-subhead", children: `${deferGroupKey(group[0])} \u00B7 ${group.length} \u6761` }),
          group.map(renderRow)
        ] }))
      ] }) : null
      ] })
    ] })
  ] });
}
function apply(ctx) {
  const modelDirectories = ctx.get("modelDirectories");
  if (modelDirectories === void 0) return;
  const connection = ctx.get("connection");
  DEFERRED_CONNECTION = connection;
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "dsh-model-selector";
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, "reasoning-effort: styles");
  ctx.effect(() => {
    const syncStorage = (event) => {
      if (event.key === PLUGIN_ENABLED_STORAGE_KEY) {
        pluginStore.set(event.newValue !== "false", false);
      } else if (event.key === SLIDER_ENABLED_STORAGE_KEY) {
        sliderStore.set(event.newValue !== "false", false);
      } else if (event.key === GLM_REMINDER_STORAGE_KEY) {
        glmReminderStore.set(event.newValue === "true", false);
      } else if (event.key === GLM_LIMIT_ALERT_KEY) {
        glmLimitStore.set(event.newValue !== "false", false);
      } else if (event.key === ENABLED_STORAGE_KEY) {
        enabledStore.set(event.newValue !== "false", false);
      }
    };
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, "reasoning-effort: preference sync");
  // 插件设置已迁移到"设置 → 插件"的插件卡（PluginConfigCard）与模型浮窗
  // 齿轮设置页（SettingsPane），不再占用 DSH"设置 → 通用"分区。
  const settingsScope = ctx.get("settingsScope");
  if (settingsScope !== void 0) {
    keepAwakeScope = settingsScope.bind({
      namespace: "dsh-model-selector",
      decode: (value) => value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0
    });
  }
  let disposeTimerSeat;
  let disposeDockSeat;
  let disposeModelSeat;
  const syncFeatureSeats = () => {
    if (!pluginStore.getSnapshot()) {
      disposeTimerSeat?.();
      disposeTimerSeat = void 0;
      disposeDockSeat?.();
      disposeDockSeat = void 0;
      disposeModelSeat?.();
      disposeModelSeat = void 0;
      return;
    }
    if (disposeModelSeat !== void 0) return;
    disposeTimerSeat = ctx.slots.register(
      { name: "conversation.input.right", id: "dsh-model-selector-idle-send", order: 30 },
      TimerSendButton
    );
    disposeDockSeat = ctx.slots.register(
      { name: "conversation.input.dock", id: "dsh-model-selector-deferred", order: 21 },
      DeferredPanel
    );
    disposeModelSeat = ctx.slots.register(
      {
        name: SLOT,
        priority: -100,
        inject: (sessionId) => {
          const controller = modelDirectories.directoryFor(sessionId);
          return {
            available: true,
            controller,
            directory: controller.store,
            load: () => controller.load().then(() => void 0, () => void 0),
            select: (selection) => controller.select(selection).then(() => true, () => false),
            connection
          };
        }
      },
      AdvancedModelSelect
    );
  };
  const unsubscribePlugin = pluginStore.subscribe(syncFeatureSeats);
  syncFeatureSeats();
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register(
    { name: "settings.plugins.tab", id: "dsh-model-selector", order: 10, label: "\u6A21\u578B\u9009\u62E9\u5668\u589E\u5F3A" },
    PluginConfigCard
  ));
  return () => {
    unsubscribePlugin();
    disposeTimerSeat?.();
    disposeDockSeat?.();
    disposeModelSeat?.();
  };
}

    return module.exports;
  },
});
