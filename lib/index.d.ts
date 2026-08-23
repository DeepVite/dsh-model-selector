/**
 * Host half of dsh-model-selector: the "keep awake" switch.
 *
 * Registers the `dsh-model-selector` settings namespace and reconciles a
 * long-lived Windows helper process holding
 * `SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED)` while the
 * switch is on. See the implementation in ./index.js for details.
 *
 * @module dsh-model-selector
 */
export declare function apply(ctx: {
  get(name: string): unknown
  effect(setup: () => void | (() => void), label?: string): void
}): void;
