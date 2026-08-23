/**
 * Host half of dsh-model-selector: the "keep awake" switch.
 *
 * The browser UI writes one boolean into the `dsh-model-selector` settings
 * namespace (see the client bundle). This Host half registers that namespace
 * and reconciles a long-lived Windows helper process that holds
 * `SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED)`, so the
 * machine does not idle-sleep while DSH runs and the switch is on. Turning
 * the switch off, or disposing the plugin fiber (DSH exit / reload), releases
 * the helper and therefore the execution state.
 *
 * The helper is spawned via the subprocess seam with `-EncodedCommand` so
 * quoting never matters; Windows terminates the whole tree (`taskkill /T`)
 * through `SubprocessHandle.terminate()`.
 *
 * @module dsh-model-selector
 */
import z from '@deepseek-ai/schemastery';
import { settingsNamespace } from '@deepseek-ai/dsh-settings';

const NAMESPACE = settingsNamespace('dsh-model-selector');

/** ES_CONTINUOUS | ES_SYSTEM_REQUIRED — blocks idle sleep/hibernate, display may still sleep. */
const KEEP_AWAKE_FLAGS = 0x80000001;

const HELPER_SCRIPT = [
  'Add-Type -TypeDefinition @"',
  'using System;',
  'using System.Runtime.InteropServices;',
  'public static class DshKeepAwake {',
  '  [DllImport("kernel32.dll", SetLastError = true)] public static extern uint SetThreadExecutionState(uint esFlags);',
  '}',
  '"@;',
  '[DshKeepAwake]::SetThreadExecutionState(0x80000001);',
  'while ($true) { Start-Sleep -Seconds 3600 }',
].join('\n');

function helperArgv() {
  const encoded = Buffer.from(HELPER_SCRIPT, 'utf16le').toString('base64');
  return ['powershell.exe', '-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-EncodedCommand', encoded];
}

export function apply(ctx) {
  const settings = ctx.get('settings');
  const subprocess = ctx.get('subprocess');
  if (settings === undefined || subprocess === undefined) return;
  const timer = ctx.get('timer');
  const logger = ctx.get('logger') ?? console;

  let helper;
  let enabled = false;
  let spawning = false;
  let retry;

  const stopHelper = () => {
    const current = helper;
    helper = undefined;
    current?.terminate();
  };

  const startHelper = () => {
    if (spawning || helper !== undefined) return;
    spawning = true;
    let child;
    try {
      child = subprocess.spawn({
        argv: helperArgv(),
        cwd: process.cwd(),
        stdio: { stdin: 'ignore', stdout: 'inherit', stderr: 'inherit' },
        graceMs: 2000,
      });
    } catch (cause) {
      spawning = false;
      logger.error('[dsh-model-selector] keep-awake: helper spawn failed', cause);
      return;
    }
    helper = child;
    child.done.then(
      () => {
        if (helper === child) helper = undefined;
        logger.info(`[dsh-model-selector] keep-awake helper exited (pid ${child.pid})`);
        if (enabled && retry === undefined) {
          retry = timer?.timeout(() => {
            retry = undefined;
            startHelper();
          }, 10000);
        }
      },
      (cause) => {
        if (helper === child) helper = undefined;
        logger.error('[dsh-model-selector] keep-awake helper failed', cause);
      },
    );
    spawning = false;
  };

  const reconcile = (value) => {
    const next = value?.keepAwake === true;
    if (next === enabled) return;
    enabled = next;
    if (enabled) {
      logger.info('[dsh-model-selector] keep-awake: ON');
      startHelper();
    } else {
      logger.info('[dsh-model-selector] keep-awake: OFF');
      retry?.();
      retry = undefined;
      stopHelper();
    }
  };

  let scope;
  try {
    scope = settings.register(NAMESPACE, z.object({ keepAwake: z.boolean() }), { base: { keepAwake: false } });
  } catch (cause) {
    logger.error('[dsh-model-selector] keep-awake: settings namespace registration failed', cause);
    return;
  }
  const disposeWatch = scope.watch(reconcile);
  reconcile(scope.get());

  ctx.effect(() => {
    return () => {
      disposeWatch();
      retry?.();
      retry = undefined;
      stopHelper();
    };
  }, 'dsh-model-selector: keep-awake cleanup');
}
