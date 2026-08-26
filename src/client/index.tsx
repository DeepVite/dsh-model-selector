/**
 * Session-scoped model and reasoning-effort control for the DSH composer model seat.
 *
 * The control deliberately follows DSH's own session model-selection contract:
 * `sessions.models()` supplies the exact current route and its adapter-owned
 * effort metadata; `sessions.selectModel()` submits the complete selection for
 * the next assembled turn. The slider adapts to whatever effort levels the
 * current model exposes — their count and order are the adapter's, never
 * assumed here.
 *
 * @module dsh-model-selector/client
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { ModelSelection, SessionId } from '@deepseek-ai/dsh-api-remotes/client'
import type {
  ModelDirectory,
  ModelDirectoryResolver,
  ModelDirectoryState,
} from '@deepseek-ai/dsh-client-ui-model-selection/client'
import { CSS } from './styles'

/** One selectable effort exactly as the owning adapter advertised it. */
interface EffortLevel {
  readonly id: string
  readonly name: string
}

interface ModelSeatProps {
  readonly locked: boolean
  readonly available: boolean
  readonly controller: ModelDirectory
  readonly directory: SnapshotStore<ModelDirectoryState>
  readonly load: () => void
  readonly select: (selection: ModelSelection) => Promise<boolean>
  readonly connection?: StatsConnection
}

/** Minimal wire faces for the token-stats reader (sessions domain only). */
interface StatsConnection {
  readonly api: {
    readonly sessions: {
      list(req: { cursor?: string }): Promise<StatsRpc<{ items: StatsSession[] }>>
      history(req: { sessionId: string; beforeSeq?: number; maxMessages?: number }): Promise<StatsRpc<{ events: StatsHistoryEntry[]; hasMore: boolean }>>
    }
  }
}

interface StatsRpc<T> {
  readonly result: { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: { readonly code: string; readonly message: string } }
}

interface StatsSession {
  readonly sessionId: string
  readonly updatedAt: number
}

interface StatsHistoryEntry {
  readonly event: { readonly type: string; readonly seq: number; readonly time: number; readonly data: unknown }
}

const SLOT = 'conversation.input.model'
const SETTINGS_SLOT = 'settings.general.item'
const ENABLED_STORAGE_KEY = 'dsh-model-selector.enabled'
const LEGACY_ENABLED_STORAGE_KEY = '@dsh-external/dsh-reasoning-effort.enabled'
const OLD_ENABLED_STORAGE_KEY = 'dsh-better-model-selector.enabled'
const OLDER_ENABLED_STORAGE_KEY = 'dsh-reasoning-effort.enabled'
const CHIBI_THUMB_STORAGE_KEY = 'dsh-model-selector.chibi-thumb'
const OLD_CHIBI_THUMB_STORAGE_KEY = 'dsh-better-model-selector.chibi-thumb'
const OLDER_CHIBI_THUMB_STORAGE_KEY = 'dsh-reasoning-effort.chibi-thumb'
export const inject = ['slots', 'modelDirectories']

function readEnabledPreference(): boolean {
  try {
    const current = window.localStorage.getItem(ENABLED_STORAGE_KEY)
    const stored = current ?? window.localStorage.getItem(OLD_ENABLED_STORAGE_KEY) ?? window.localStorage.getItem(OLDER_ENABLED_STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_ENABLED_STORAGE_KEY)
    return stored !== 'false'
  } catch {
    return true
  }
}

let enabledPreference = readEnabledPreference()
const enabledListeners = new Set<() => void>()

const enabledStore = {
  getSnapshot: () => enabledPreference,
  subscribe: (listener: () => void) => {
    enabledListeners.add(listener)
    return () => enabledListeners.delete(listener)
  },
  set: (enabled: boolean, persist = true) => {
    if (enabledPreference === enabled) return
    enabledPreference = enabled
    if (persist) {
      try {
        window.localStorage.setItem(ENABLED_STORAGE_KEY, String(enabled))
      } catch {
        // The current page still follows the choice when storage is unavailable.
      }
    }
    enabledListeners.forEach((listener) => listener())
  },
}

// ---------------------------------------------------------------------------
// 插件总开关（新语义）：控制整个插件的功能 UI（模型浮窗 / 定时发送 /
// 待发队列 / Token 统计）。与旧的 enabledStore（原"推理强度滑块"开关）
// 解耦：旧值迁移为滑块开关，总开关默认开启；设置 → 插件 的插件卡永远
// 保留，因此总开关关闭也不会失去配置入口。
// ---------------------------------------------------------------------------
const PLUGIN_ENABLED_STORAGE_KEY = 'dsh-model-selector.plugin-enabled'

function readPluginEnabled(): boolean {
  try {
    return window.localStorage.getItem(PLUGIN_ENABLED_STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

let pluginEnabled = readPluginEnabled()
const pluginEnabledListeners = new Set<() => void>()

const pluginStore = {
  getSnapshot: () => pluginEnabled,
  subscribe: (listener: () => void) => {
    pluginEnabledListeners.add(listener)
    return () => pluginEnabledListeners.delete(listener)
  },
  set: (enabled: boolean, persist = true) => {
    if (pluginEnabled === enabled) return
    pluginEnabled = enabled
    if (persist) {
      try {
        window.localStorage.setItem(PLUGIN_ENABLED_STORAGE_KEY, String(enabled))
      } catch {
        // The current page still follows the choice when storage is unavailable.
      }
    }
    pluginEnabledListeners.forEach((listener) => listener())
  },
}

// ---------------------------------------------------------------------------
// 推理强度滑块开关（由旧 enabledStore 语义迁移而来）：只控制模型浮窗内
// 滑块的显隐。默认值继承旧 key（dsh-model-selector.enabled 系列）。
// ---------------------------------------------------------------------------
const SLIDER_ENABLED_STORAGE_KEY = 'dsh-model-selector.slider-enabled'

function readSliderEnabled(): boolean {
  try {
    const current = window.localStorage.getItem(SLIDER_ENABLED_STORAGE_KEY)
    if (current !== null) return current !== 'false'
    const legacy = window.localStorage.getItem(ENABLED_STORAGE_KEY)
      ?? window.localStorage.getItem(OLD_ENABLED_STORAGE_KEY)
      ?? window.localStorage.getItem(OLDER_ENABLED_STORAGE_KEY)
      ?? window.localStorage.getItem(LEGACY_ENABLED_STORAGE_KEY)
    return legacy === null ? true : legacy !== 'false'
  } catch {
    return true
  }
}

let sliderEnabled = readSliderEnabled()
const sliderEnabledListeners = new Set<() => void>()

const sliderStore = {
  getSnapshot: () => sliderEnabled,
  subscribe: (listener: () => void) => {
    sliderEnabledListeners.add(listener)
    return () => sliderEnabledListeners.delete(listener)
  },
  set: (enabled: boolean, persist = true) => {
    if (sliderEnabled === enabled) return
    sliderEnabled = enabled
    if (persist) {
      try {
        window.localStorage.setItem(SLIDER_ENABLED_STORAGE_KEY, String(enabled))
      } catch {
        // The current page still follows the choice when storage is unavailable.
      }
    }
    sliderEnabledListeners.forEach((listener) => listener())
  },
}

function readChibiThumbPreference(): boolean {
  try {
    return (window.localStorage.getItem(CHIBI_THUMB_STORAGE_KEY) ?? window.localStorage.getItem(OLD_CHIBI_THUMB_STORAGE_KEY) ?? window.localStorage.getItem(OLDER_CHIBI_THUMB_STORAGE_KEY)) === 'true'
  } catch {
    return false
  }
}

let chibiThumbPreference = readChibiThumbPreference()
const chibiThumbListeners = new Set<() => void>()

const chibiThumbStore = {
  getSnapshot: () => chibiThumbPreference,
  subscribe: (listener: () => void) => {
    chibiThumbListeners.add(listener)
    return () => chibiThumbListeners.delete(listener)
  },
  set: (enabled: boolean, persist = true) => {
    if (chibiThumbPreference === enabled) return
    chibiThumbPreference = enabled
    if (persist) {
      try {
        window.localStorage.setItem(CHIBI_THUMB_STORAGE_KEY, String(enabled))
      } catch {
        // The current page still follows the choice when storage is unavailable.
      }
    }
    chibiThumbListeners.forEach((listener) => listener())
  },
}

// ---------------------------------------------------------------------------
// Model alias (short name) store.
// ---------------------------------------------------------------------------
const ALIAS_STORAGE_KEY = 'dsh-model-selector.model-aliases'
const OLD_ALIAS_STORAGE_KEY = 'dsh-better-model-selector.model-aliases'
const OLDER_ALIAS_STORAGE_KEY = 'dsh-reasoning-effort.model-aliases'
type AliasMap = Record<string, string>

function readAliases(): AliasMap {
  try {
    const raw = window.localStorage.getItem(ALIAS_STORAGE_KEY) ?? window.localStorage.getItem(OLD_ALIAS_STORAGE_KEY) ?? window.localStorage.getItem(OLDER_ALIAS_STORAGE_KEY)
    if (raw === null) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as AliasMap
    }
    return {}
  } catch {
    return {}
  }
}

let aliases: AliasMap = readAliases()
const aliasListeners = new Set<() => void>()

function aliasKeyOf(provider: string, model: string): string {
  return `${provider}/${model}`
}

const aliasStore = {
  getSnapshot: () => aliases,
  subscribe: (listener: () => void) => {
    aliasListeners.add(listener)
    return () => aliasListeners.delete(listener)
  },
  set: (provider: string, model: string, alias: string) => {
    const key = aliasKeyOf(provider, model)
    const trimmed = alias.trim()
    const next: AliasMap = { ...aliases }
    if (trimmed === '') {
      delete next[key]
    } else {
      next[key] = trimmed
    }
    aliases = next
    try {
      window.localStorage.setItem(ALIAS_STORAGE_KEY, JSON.stringify(aliases))
    } catch {
      // The current page still follows the choice when storage is unavailable.
    }
    aliasListeners.forEach((listener) => listener())
  },
}

function currentModel(state: ModelDirectoryState) {
  if (state.current === null) return undefined
  const group = state.groups.find((candidate) => candidate.id === state.current?.provider)
  return group?.models.find((candidate) => candidate.id === state.current?.model)
}

/**
 * Effort levels the current model advertises, in adapter order. A model needs
 * at least two before a slider says anything a plain label would not, so
 * fewer-than-two collapses to none.
 */
function sliderLevels(state: ModelDirectoryState): readonly EffortLevel[] {
  const efforts = currentModel(state)?.reasoning?.efforts
  return efforts !== undefined && efforts.length >= 2 ? efforts : []
}

function effortIndex(levels: readonly EffortLevel[], id: string | undefined): number {
  return levels.findIndex((level) => level.id === id)
}

function clampIndex(value: number, count: number): number {
  return Math.max(0, Math.min(count - 1, Math.round(value)))
}

/**
 * Level index the slider should rest at: the session's current effort when the
 * model still offers it, else the adapter default, else the middle level.
 */
function effectiveEffortIndex(levels: readonly EffortLevel[], state: ModelDirectoryState): number {
  const reasoning = currentModel(state)?.reasoning
  const current = effortIndex(levels, state.current?.reasoningEffort)
  if (current >= 0) return current
  const fallback = effortIndex(levels, reasoning?.defaultEffort)
  if (fallback >= 0) return fallback
  return Math.floor((levels.length - 1) / 2)
}

interface RadiationState {
  progress: number
  dragging: boolean
}

function drawRadiation(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  state: RadiationState,
): void {
  const origin = state.progress * width
  const isDark = document.body.hasAttribute('data-ds-dark-theme')
  const cell = 4
  const speed = state.dragging ? 2.8 : 1

  context.clearRect(0, 0, width, height)
  if (origin <= 0) return

  context.save()
  context.beginPath()
  context.rect(0, 0, origin, height)
  context.clip()

  for (let x = 0; x < origin; x += cell) {
    const delta = x + cell * 0.5 - origin
    const distance = Math.abs(delta)
    const phaseA = distance / 10 - time * 0.0074 * speed
    const phaseB = distance / 23 - time * 0.0041 * speed + 1.7
    const phaseC = distance / 40 - time * 0.0022 * speed + 3.4
    const sinA = Math.max(0, Math.sin(phaseA))
    const sinB = Math.max(0, Math.sin(phaseB))
    const sinC = Math.max(0, Math.sin(phaseC))
    const waveA = Math.pow(sinA, 2.6)
    const waveB = Math.pow(sinB, 3.2)
    const waveC = Math.pow(sinC, 4)
    const crest = Math.pow(sinA, 15) + Math.pow(sinB, 18) * 0.78
    const wave = Math.min(1, waveA * 0.76 + waveB * 0.58 + waveC * 0.32)
    const trail = 0.38 + 0.62 * Math.exp(-distance / Math.max(55, width * 0.72))
    const pillar = Math.pow(Math.max(0, Math.sin(x / 20 + time * 0.0016)), 3) * 0.27
    const columnEnergy = trail * (wave * 1.04 + pillar + crest * 0.32)

    if (columnEnergy > 0.012) {
      const nearness = Math.max(0, 1 - distance / Math.max(1, width * 0.78))
      const red = isDark
        ? Math.round(42 + 124 * nearness + 75 * wave)
        : Math.round(28 + 58 * nearness + 15 * wave)
      const green = isDark
        ? Math.round(56 + 58 * nearness + 44 * crest)
        : Math.round(88 + 72 * nearness + 30 * crest)
      const blue = isDark
        ? Math.round(175 + 72 * nearness + 8 * wave)
        : Math.round(182 + 62 * nearness)
      const alpha = isDark
        ? Math.min(0.88, columnEnergy * 0.72)
        : Math.min(0.62, columnEnergy * 0.54)
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`
      context.fillRect(x, 0, cell - 1, height)
    }

    for (let y = 0; y < height; y += cell) {
      const deltaY = y + cell * 0.5 - height * 0.5
      const radial = Math.hypot(delta / 38, deltaY / 11)
      const halo = Math.exp(-radial * 0.96) * 1.08
      const verticalShape = 0.58 + 0.42 * Math.cos((deltaY / height) * Math.PI)
      const grain = 0.72 + 0.28 * Math.sin(x * 0.73 + y * 1.31 + time * 0.006)
      const alpha = Math.min(0.96, (columnEnergy * 0.88 + halo + crest * 0.19) * verticalShape * grain)
      if (alpha < 0.035) continue

      const hot = Math.max(0, 1 - radial / 2.4)
      const red = isDark
        ? Math.round(54 + 148 * hot + 42 * wave + 35 * crest)
        : Math.round(25 + 72 * hot + 12 * wave)
      const green = isDark
        ? Math.round(68 + 78 * hot + 46 * crest)
        : Math.round(98 + 72 * hot + 24 * crest)
      const blue = isDark
        ? Math.round(186 + 64 * hot)
        : Math.round(194 + 56 * hot)
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${isDark ? alpha : alpha * 0.72})`
      context.fillRect(x, y, cell - 1, cell - 1)
    }
  }

  for (let i = 0; i < 14; i += 1) {
    const travel = (time * (state.dragging ? 0.16 : 0.065) * (0.78 + (i % 5) * 0.09) + i * 23) % Math.max(30, origin + 64)
    const particleX = origin - travel
    if (particleX < -24 || particleX > width + 16) continue
    const particleY = 3 + ((i * 13 + Math.sin(time * 0.003 + i) * 5) % Math.max(7, height - 6))
    const length = 4 + (i % 4) * 4 + (state.dragging ? 6 : 0)
    const alpha = 0.28 + (i % 5) * 0.1
    const streak = context.createLinearGradient(particleX, 0, particleX + length, 0)
    streak.addColorStop(0, isDark ? 'rgba(72,118,255,0)' : 'rgba(24,94,184,0)')
    streak.addColorStop(0.68, isDark ? `rgba(112,135,255,${alpha})` : `rgba(36,108,202,${alpha * 0.72})`)
    streak.addColorStop(1, isDark ? `rgba(236,222,255,${Math.min(1, alpha + 0.26)})` : `rgba(103,175,248,${Math.min(0.82, alpha + 0.18)})`)
    context.fillStyle = streak
    context.fillRect(particleX, particleY, length, i % 3 === 0 ? 2 : 1)
  }

  const glow = context.createRadialGradient(origin, height / 2, 0, origin, height / 2, 24)
  glow.addColorStop(0, isDark ? 'rgba(255,255,255,.82)' : 'rgba(255,255,255,.86)')
  glow.addColorStop(0.14, isDark ? 'rgba(183,190,255,.54)' : 'rgba(162,210,255,.48)')
  glow.addColorStop(0.44, isDark ? 'rgba(103,74,255,.28)' : 'rgba(37,112,207,.22)')
  glow.addColorStop(1, isDark ? 'rgba(86,31,210,0)' : 'rgba(25,91,181,0)')
  context.fillStyle = glow
  context.fillRect(origin - 26, 0, 52, height)
  context.restore()
}

function EffortSlider({ directory }: { directory: ModelDirectory }) {
  const directoryState = useSyncExternalStore(
    (notify) => directory.store.subscribe(notify),
    () => directory.store.getSnapshot(),
  )
  const levels = sliderLevels(directoryState)
  const [effort, setEffort] = useState('')
  const [preview, setPreview] = useState(0)
  const [committing, setCommitting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const chibiThumb = useSyncExternalStore(chibiThumbStore.subscribe, chibiThumbStore.getSnapshot)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const committedRef = useRef('')
  const committingRef = useRef(false)
  const previewRef = useRef(0)
  const draggingRef = useRef(false)
  const pointerActiveRef = useRef(false)
  const activePointerIdRef = useRef<number | null>(null)
  const globalPointerMoveRef = useRef<((event: PointerEvent) => void) | null>(null)
  const globalPointerEndRef = useRef<((event: PointerEvent) => void) | null>(null)
  const globalPointerCancelRef = useRef<((event: PointerEvent) => void) | null>(null)
  const radiationRef = useRef<RadiationState>({ progress: 0.5, dragging: false })
  const redrawRef = useRef<(() => void) | null>(null)
  const available = directoryState.current !== null && levels.length >= 2
  const busy = committing || directoryState.status === 'selecting'
  const error = localError ?? directoryState.error

  useEffect(() => {
    if (!available || committingRef.current || draggingRef.current) return
    const index = effectiveEffortIndex(levels, directoryState)
    const next = levels[index]?.id ?? ''
    committedRef.current = next
    previewRef.current = index
    setEffort(next)
    setPreview(index)
    setLocalError(null)
  }, [available, levels, directoryState])

  useEffect(() => {
    directory.load().catch(() => undefined)
  }, [directory])

  useEffect(() => {
    previewRef.current = preview
    radiationRef.current.progress = levels.length >= 2 ? preview / (levels.length - 1) : 0.5
    redrawRef.current?.()
  }, [preview, levels.length])

  useEffect(() => {
    radiationRef.current.dragging = dragging
    redrawRef.current?.()
  }, [dragging])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const context = canvas.getContext('2d')
    if (context === null) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 1
    let height = 1
    let frame = 0

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time = performance.now()) => {
      drawRadiation(context, width, height, time, radiationRef.current)
    }

    const loop = (time: number) => {
      draw(time)
      frame = window.requestAnimationFrame(loop)
    }

    const redraw = () => {
      if (reducedMotion.matches) draw()
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })
    const themeObserver = new MutationObserver(() => draw())
    resizeObserver.observe(canvas)
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
    redrawRef.current = redraw
    resize()
    draw()
    if (!reducedMotion.matches) frame = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      redrawRef.current = null
    }
  }, [])

  const rollback = useCallback(() => {
    const previous = committedRef.current
    previewRef.current = Math.max(0, effortIndex(levels, previous))
    pointerActiveRef.current = false
    activePointerIdRef.current = null
    draggingRef.current = false
    setEffort(previous)
    setPreview(Math.max(0, effortIndex(levels, previous)))
    setDragging(false)
  }, [levels])

  const commit = useCallback(async (raw: number) => {
    if (committingRef.current) return
    committingRef.current = true
    const previous = committedRef.current

    setDragging(false)
    setCommitting(true)
    setLocalError(null)

    // Optimistic snap from the rendered levels keeps the thumb responsive
    // while the directory round-trip revalidates against fresh data below.
    const optimisticIndex = clampIndex(raw, levels.length)
    const optimistic = levels[optimisticIndex]?.id
    if (optimistic !== undefined) {
      previewRef.current = optimisticIndex
      setPreview(optimisticIndex)
      setEffort(optimistic)
    }

    try {
      const models = await directory.load()
      const fresh: ModelDirectoryState = {
        current: models.current,
        routable: models.routable,
        groups: models.groups,
        failures: models.failures,
        status: 'ready',
        error: null,
      }
      const freshLevels = sliderLevels(fresh)
      const index = clampIndex(raw, freshLevels.length)
      const next = freshLevels[index]?.id
      if (next === undefined) throw new Error('当前模型未提供推理强度档位')

      previewRef.current = index
      setPreview(index)
      setEffort(next)

      await directory.select({
        provider: models.current.provider,
        model: models.current.model,
        reasoningEffort: next,
      })

      const snapshot = directory.store.getSnapshot()
      const accepted = effortIndex(freshLevels, snapshot.current?.reasoningEffort)
      const settled = accepted >= 0 ? accepted : index
      const settledId = freshLevels[settled]?.id ?? next
      committedRef.current = settledId
      previewRef.current = settled
      setEffort(settledId)
      setPreview(settled)
    } catch (cause) {
      const restore = Math.max(0, effortIndex(levels, previous))
      committedRef.current = previous
      previewRef.current = restore
      setEffort(previous)
      setPreview(restore)
      setLocalError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      committingRef.current = false
      setCommitting(false)
    }
  }, [directory, levels])

  const rawFromPointer = (input: HTMLInputElement, clientX: number) => {
    const bounds = input.getBoundingClientRect()
    if (bounds.width <= 0 || levels.length < 2) return previewRef.current
    // The input spans `slots` positions (real levels + the reserved 梁神 slot).
    // The thumb stops at the last real level so 梁神 can never be selected.
    return Math.max(
      0,
      Math.min(levels.length - 1, (clientX - bounds.left) / bounds.width * (slots - 1)),
    )
  }

  const showPointerPreview = (raw: number) => {
    // The input spans `slots` positions; keep the preview inside the real
    // selectable levels so the reserved 梁神 slot never becomes active.
    const limited = Math.max(0, Math.min(levels.length - 1, raw))
    previewRef.current = limited
    setPreview(limited)
    setEffort(levels[clampIndex(limited, levels.length)]?.id ?? '')
  }

  const beginDragging = (input: HTMLInputElement, pointerId: number, clientX: number) => {
    pointerActiveRef.current = true
    activePointerIdRef.current = pointerId
    draggingRef.current = true
    setDragging(true)
    showPointerPreview(rawFromPointer(input, clientX))
    try {
      if (!input.hasPointerCapture(pointerId)) input.setPointerCapture(pointerId)
    } catch {
      // The window-level pointer listeners below remain the reliable fallback.
    }
  }

  const moveDragging = (input: HTMLInputElement, pointerId: number, clientX: number) => {
    if (!pointerActiveRef.current || activePointerIdRef.current !== pointerId) return
    showPointerPreview(rawFromPointer(input, clientX))
  }

  const stopDragging = (input: HTMLInputElement, pointerId?: number, clientX?: number) => {
    if (!pointerActiveRef.current) return
    if (pointerId !== undefined && activePointerIdRef.current !== pointerId) return
    const raw = clientX === undefined ? previewRef.current : rawFromPointer(input, clientX)
    pointerActiveRef.current = false
    activePointerIdRef.current = null
    draggingRef.current = false
    if (pointerId !== undefined && input.hasPointerCapture(pointerId)) {
      input.releasePointerCapture(pointerId)
    }
    showPointerPreview(raw)
    void commit(raw)
  }

  globalPointerMoveRef.current = (event) => {
    const input = inputRef.current
    if (input !== null) moveDragging(input, event.pointerId, event.clientX)
  }
  globalPointerEndRef.current = (event) => {
    const input = inputRef.current
    if (input !== null) stopDragging(input, event.pointerId, event.clientX)
  }
  globalPointerCancelRef.current = (event) => {
    if (activePointerIdRef.current !== event.pointerId) return
    rollback()
  }

  useEffect(() => {
    const move = (event: PointerEvent) => globalPointerMoveRef.current?.(event)
    const end = (event: PointerEvent) => globalPointerEndRef.current?.(event)
    const cancel = (event: PointerEvent) => globalPointerCancelRef.current?.(event)
    window.addEventListener('pointermove', move, true)
    window.addEventListener('pointerup', end, true)
    window.addEventListener('pointercancel', cancel, true)
    return () => {
      window.removeEventListener('pointermove', move, true)
      window.removeEventListener('pointerup', end, true)
      window.removeEventListener('pointercancel', cancel, true)
    }
  }, [])

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const current = clampIndex(Number(event.currentTarget.value), levels.length)
    let target: number | undefined
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown' || event.key === 'PageDown') {
      target = Math.max(0, current - 1)
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'PageUp') {
      target = Math.min(levels.length - 1, current + 1)
    } else if (event.key === 'Home') {
      target = 0
    } else if (event.key === 'End') {
      target = levels.length - 1
    }
    if (target === undefined) return
    event.preventDefault()
    void commit(target)
  }

  if (!available) return null

  const count = levels.length
  const slots = count + 1
  const effortName = levels[effortIndex(levels, effort)]?.name ?? effort
  const isTop = effortIndex(levels, effort) === count - 1
  const progress = preview / (slots - 1) * 100
  const style = { '--re-progress': `${progress}%` } as CSSProperties
  const title = error === null ? `推理强度 · ${effortName}` : `推理强度设置失败：${error}`

  const LIANG_LEVELS = [
    { name: '小难梁', sub: 'Off', effort: 0 },
    { name: '梁子', sub: 'Low', effort: 1 },
    { name: '梁文锋', sub: 'High', effort: 2 },
    { name: '梁圣', sub: 'Max', effort: 3 },
    { name: '梁神', sub: '无法选中', effort: null },
  ] as const

  return (
    <div
      className={`re-effort${chibiThumb ? ' is-chibi' : ''}${dragging ? ' is-dragging' : ''}${busy ? ' is-busy' : ''}${error === null ? '' : ' is-error'}`}
      title={title}
    >
      <div className="re-effort-inner">
        <div className="re-effort-slider-zone">
          <div
            className="re-effort-slider"
            data-top={isTop ? 'true' : undefined}
            style={style}
          >
            <div className="re-effort-track" aria-hidden="true" />
            <div className="re-effort-fx" aria-hidden="true">
              <canvas ref={canvasRef} className="re-effort-canvas" />
              <span className="re-effort-flare" />
            </div>
            <input
              ref={inputRef}
              className="re-effort-input"
              type="range"
              min="0"
              max={slots - 1}
              step="0.01"
              value={preview}
              disabled={busy}
              aria-label="推理强度"
              aria-valuetext={effortName}
              onChange={(event) => {
                const raw = Number(event.currentTarget.value)
                showPointerPreview(raw)
              }}
              onPointerDown={(event) => {
                event.preventDefault()
                event.currentTarget.focus()
                beginDragging(event.currentTarget, event.pointerId, event.clientX)
              }}
              onPointerMove={(event) => moveDragging(event.currentTarget, event.pointerId, event.clientX)}
              onPointerUp={(event) => stopDragging(event.currentTarget, event.pointerId, event.clientX)}
              onPointerCancel={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId)
                }
                rollback()
              }}
              onBlur={(event) => {
                stopDragging(event.currentTarget)
              }}
              onKeyDown={onKeyDown}
            />
            <span className="re-effort-knob" aria-hidden="true" />
          </div>
          <div className="re-effort-labels" aria-hidden="true">
            {LIANG_LEVELS.map((lvl) => {
              const pos = lvl.effort === null ? 100 : (lvl.effort / (slots - 1)) * 100
              const active = lvl.effort !== null && lvl.effort === Math.round(preview)
              return (
                <div
                  key={lvl.name}
                  className={`re-effort-label${active ? ' is-active' : ''}`}
                  style={{ left: `${pos}%` }}
                >
                  <span className="re-effort-label-text">{lvl.name}</span>
                  {lvl.sub === null ? null : <span className="re-effort-label-sub">{lvl.sub}</span>}
                  <span className={`re-effort-label-dot${lvl.effort === null ? ' is-placeholder' : ''}`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {error === null ? null : <span className="re-effort-sr" role="status">{error}</span>}
    </div>
  )
}

function AdvancedModelSelect({
  locked,
  available,
  controller,
  directory,
  load,
  select,
  connection,
}: ModelSeatProps) {
  const state = useSyncExternalStore(
    (notify) => directory.subscribe(notify),
    () => directory.getSnapshot(),
  )
  const [open, setOpen] = useState(false)
  const [paneMode, setPaneMode] = useState<'main' | 'settings'>('main')
  const [now, setNow] = useState(Date.now())
  const [editing, setEditing] = useState<string | null>(null)
  const [aliasDraft, setAliasDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const aliasMap = useSyncExternalStore(aliasStore.subscribe, aliasStore.getSnapshot)
  const sliderEnabled = useSyncExternalStore(sliderStore.subscribe, sliderStore.getSnapshot)
  const choice = currentModel(state)
  const levels = sliderLevels(state)
  const effortName = levels[effectiveEffortIndex(levels, state)]?.name ?? '默认'
  const currentKey = state.current === null ? '' : aliasKeyOf(state.current.provider, state.current.model)
  const modelLabel = (currentKey !== '' && aliasMap[currentKey]) || choice?.name || state.current?.model || '选择模型'
  const busy = state.status === 'loading' || state.status === 'selecting'
  const peak = phase(now)
  const peakStateName = peak.peak ? '梁文锋' : '梁文谷'
  const peakStateDesc = peak.peak ? '梁文锋（高峰时段）· 全价' : '梁文谷（空闲时段）· 半价'
  // 规则：高峰=黄色，空闲=绿色
  const peakAccent = peak.peak ? '#f6b93b' : '#3ddc84'
  const peakTargetName = peak.peak ? '梁文谷' : '梁文锋'
  const peakTargetDesc = peak.peak ? '空闲时段' : '高峰时段'
  // 规则：倒计时颜色 = 目标状态的颜色（高峰→空闲 绿色；空闲→高峰 黄色）
  const peakTargetAccent = peak.peak ? '#3ddc84' : '#f6b93b'

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!available) return
    load()
  }, [available, load])

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOutside)
    return () => document.removeEventListener('mousedown', closeOutside)
  }, [open])

  if (!available) return null

  const close = (restoreFocus = false) => {
    setOpen(false)
    setEditing(null)
    setPaneMode('main')
    if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus())
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || !open) return
    event.preventDefault()
    if (editing !== null) {
      setEditing(null)
      return
    }
    close(true)
  }

  const chooseModel = async (provider: string, model: string, defaultEffort?: string) => {
    if (state.current?.provider === provider && state.current.model === model) return
    await select({
      provider,
      model,
      ...(defaultEffort === undefined ? {} : { reasoningEffort: defaultEffort }),
    })
  }

  const startEdit = (provider: string, model: string) => {
    const key = aliasKeyOf(provider, model)
    setAliasDraft(aliasMap[key] ?? '')
    setEditing(key)
  }

  const commitAlias = () => {
    if (editing === null) return
    const [provider, model] = editing.split('/')
    aliasStore.set(provider, model, aliasDraft)
    setEditing(null)
  }

  return (
    <div ref={rootRef} className="re-model-root" onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className="re-model-trigger"
        aria-label={`模型 ${modelLabel}，推理强度 ${effortName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`${modelLabel} · ${effortName} · ${peakStateDesc}`}
        disabled={locked}
        onClick={() => {
          if (open) close()
          else {
            setOpen(true)
            load()
          }
        }}
      >
        <span className="re-peak-dot" style={{ background: peakAccent }} aria-hidden="true" />
        <span className="re-model-name">{modelLabel}</span>
        <span className="re-model-effort">{effortName}</span>
        <span className="re-model-chevron" aria-hidden="true" />
      </button>

      {open ? (
        <div className="re-model-menu" role={paneMode === 'settings' ? 'dialog' : 'menu'} aria-label={paneMode === 'settings' ? '插件设置' : '模型与推理强度'} aria-busy={busy}>
          <div className="re-model-pane">
            {paneMode === 'settings' ? (
              <SettingsPane onBack={() => setPaneMode('main')} />
            ) : (
              <>
                <div className="re-peak-panel">
                  <div className="re-peak-row">
                    <span className="re-peak-dot" style={{ background: peakAccent }} aria-hidden="true" />
                    <span className="re-peak-state" style={{ color: peakAccent }}>{peakStateName}</span>
                    <span className="re-peak-desc">{peak.peak ? '高峰时段 · 全价' : '空闲时段 · 半价'}</span>
                    <button
                      type="button"
                      className="re-pane-gear"
                      title="设置"
                      aria-label="插件设置"
                      onClick={() => setPaneMode('settings')}
                    >
                      ⚙
                    </button>
                  </div>
                  <div className="re-peak-countdown">
                    距 {peakTargetName}（{peakTargetDesc}）还有：
                    <span className="re-peak-time" style={{ color: peakTargetAccent }}>
                      {formatDur(peak.secondsToTarget)}
                    </span>
                  </div>
                </div>
                <div className="re-peak-sep" />
                <TokenStats connection={connection} groups={state.groups} />
                <div className="re-peak-sep" />
                {state.status === 'loading' && state.groups.length === 0 ? (
                  <div className="re-model-status">正在加载模型…</div>
                ) : null}
                {state.groups.map((group) => (
                  <section key={group.id}>
                    <div className="re-model-group-title">{group.name}</div>
                    {group.models.map((model) => {
                      const selected = state.current?.provider === group.id && state.current.model === model.id
                      const key = aliasKeyOf(group.id, model.id)
                      const displayName = aliasMap[key] || model.name
                      const isEditing = editing === key
                      return (
                        <div key={model.id} className="re-model-item">
                          <button
                            type="button"
                            role="menuitemradio"
                            aria-checked={selected}
                            className="re-model-option"
                            disabled={busy}
                            onClick={() => void chooseModel(group.id, model.id, model.reasoning?.defaultEffort)}
                          >
                            <span className="re-model-option-copy">
                              <span className="re-model-option-name">{displayName}</span>
                              {isEditing ? (
                                <span className="re-model-option-desc">全称：{model.name}</span>
                              ) : model.description === undefined ? null : (
                                <span className="re-model-option-desc">{model.description}</span>
                              )}
                            </span>
                            <span className="re-model-option-actions">
                              <button
                                type="button"
                                className="re-model-edit-btn"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  startEdit(group.id, model.id)
                                }}
                              >
                                编辑
                              </button>
                              <span className="re-model-check" aria-hidden="true">{selected ? '✓' : ''}</span>
                            </span>
                          </button>
                          {isEditing ? (
                            <div className="re-model-editor">
                              <div className="re-model-editor-full">全称：{model.name}</div>
                              <div className="re-model-editor-row">
                            <input
                              className="re-model-editor-input"
                              value={aliasDraft}
                              placeholder="输入简称"
                              autoFocus
                              onChange={(event) => setAliasDraft(event.currentTarget.value)}
                              onKeyDown={(event) => {
                                event.stopPropagation()
                                if (event.key === 'Enter') commitAlias()
                                if (event.key === 'Escape') setEditing(null)
                              }}
                            />
                            <button type="button" className="re-model-editor-save" onClick={commitAlias}>保存</button>
                            <button type="button" className="re-model-editor-cancel" onClick={() => setEditing(null)}>取消</button>
                          </div>
                        </div>
                      ) : null}
                      {selected && levels.length >= 2 && sliderEnabled ? (
                        <div className="re-advanced">
                          <EffortSlider directory={controller} />
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </section>
            ))}
            {state.status === 'ready' && state.groups.every((group) => group.models.length === 0) ? (
              <div className="re-model-status">没有可用模型</div>
            ) : null}
            {state.error === null ? null : <div className="re-model-error">{state.error}</div>}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ReasoningEffortSetting() {
  const enabled = useSyncExternalStore(enabledStore.subscribe, enabledStore.getSnapshot)

  return (
    <div className="re-setting-row">
      <div className="re-setting-copy">
        <div className="re-setting-title">推理强度滑块</div>
        <div className="re-setting-description">在模型菜单中显示推理强度滑块和动态辐射特效，档位随当前模型自动适配</div>
      </div>
      <div className="re-setting-control">
        <span className="re-setting-state">{enabled ? '启用' : '停用'}</span>
        <button
          type="button"
          role="switch"
          aria-label="启用推理强度滑块"
          aria-checked={enabled}
          className={`re-setting-switch${enabled ? ' is-on' : ''}`}
          onClick={() => enabledStore.set(!enabled)}
        >
          <span className="re-setting-switch-knob" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 隐藏功能：大肥鱼滑块（蓝色大肥鱼替换滑块按钮）。
// 说明：此功能【不在设置页展示入口】——组件与本地存储开关保留，通过
// localStorage key `dsh-model-selector.chibi-thumb`（=true 启用）控制；
// 旧 key（dsh-better-model-selector.chibi-thumb /
// dsh-reasoning-effort.chibi-thumb）自动迁移。如需再次暴露设置入口，
// 恢复 apply() 中 settings.general.item 的注册即可。
// ---------------------------------------------------------------------------
function ChibiThumbSetting() {
  const sliderEnabled = useSyncExternalStore(enabledStore.subscribe, enabledStore.getSnapshot)
  const enabled = useSyncExternalStore(chibiThumbStore.subscribe, chibiThumbStore.getSnapshot)

  return (
    <div className="re-setting-row">
      <div className="re-setting-copy">
        <div className="re-setting-title">大肥鱼滑块</div>
        <div className="re-setting-description">用大肥鱼替换滑块按钮</div>
      </div>
      <div className="re-setting-control">
        <span className="re-setting-state">{enabled ? '启用' : '停用'}</span>
        <button
          type="button"
          role="switch"
          aria-label="启用大肥鱼滑块"
          aria-checked={enabled}
          disabled={!sliderEnabled}
          className={`re-setting-switch${enabled ? ' is-on' : ''}`}
          onClick={() => chibiThumbStore.set(!enabled)}
        >
          <span className="re-setting-switch-knob" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Keep-awake switch. The host half owns the Windows execution state; this
// browser half writes one boolean into the `dsh-model-selector` settings
// namespace through the settingsScope service, whose mirror folds host-side
// changes and reloads back in.
// ---------------------------------------------------------------------------
interface KeepAwakeSettingsScope {
  bind(spec: { namespace: string; decode?: (value: unknown) => unknown }): KeepAwakeSettingsHandle
}

interface KeepAwakeSettingsHandle {
  getSnapshot(): { status?: string; value?: Record<string, unknown> }
  subscribe(listener: () => void): () => void
  set(field: string, value: boolean): Promise<void>
}

let keepAwakeScope: KeepAwakeSettingsHandle | null = null
const EMPTY_SETTINGS_SNAPSHOT = { value: undefined }

function KeepAwakeSetting() {
  const snap = useSyncExternalStore(
    (notify) => keepAwakeScope?.subscribe(notify) ?? (() => undefined),
    () => keepAwakeScope?.getSnapshot() ?? EMPTY_SETTINGS_SNAPSHOT,
  )
  const enabled = snap.value?.keepAwake === true

  return (
    <div className="re-setting-row">
      <div className="re-setting-copy">
        <div className="re-setting-title">保持唤醒</div>
        <div className="re-setting-description">DSH 运行期间阻止计算机睡眠/休眠，用于低谷时段定时任务</div>
      </div>
      <div className="re-setting-control">
        <span className="re-setting-state">{enabled ? '启用' : '停用'}</span>
        <button
          type="button"
          role="switch"
          aria-label="启用保持唤醒"
          aria-checked={enabled}
          disabled={keepAwakeScope === null}
          className={`re-setting-switch${enabled ? ' is-on' : ''}`}
          onClick={() => {
            void keepAwakeScope?.set('keepAwake', !enabled)
          }}
        >
          <span className="re-setting-switch-knob" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Popover settings pane: opened via the gear at the top right of the model
// popover. Configures the plugin's own toggles (token stats visibility and
// keep-awake) without touching the shipped settings page.
// ---------------------------------------------------------------------------
function SettingsPane({ onBack }: { onBack: () => void }) {
  const statsEnabled = useSyncExternalStore(tokenStatsStore.subscribe, tokenStatsStore.getSnapshot)
  const sliderEnabled = useSyncExternalStore(sliderStore.subscribe, sliderStore.getSnapshot)
  const keepSnap = useSyncExternalStore(
    (notify) => keepAwakeScope?.subscribe(notify) ?? (() => undefined),
    () => keepAwakeScope?.getSnapshot() ?? EMPTY_SETTINGS_SNAPSHOT,
  )
  const keepEnabled = keepSnap.value?.keepAwake === true

  return (
    <div className="re-pane-settings">
      <div className="re-pane-settings-head">
        <button type="button" className="re-pane-back" title="返回" aria-label="返回" onClick={onBack}>
          ←
        </button>
        <span className="re-pane-settings-title">插件设置</span>
      </div>
      <div className="re-pane-setting">
        <div className="re-pane-setting-copy">
          <div className="re-pane-setting-title">显示 Token 统计</div>
          <div className="re-pane-setting-desc">在浮窗中显示今日 Token 用量统计</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="显示 Token 统计"
          aria-checked={statsEnabled}
          className={`re-setting-switch${statsEnabled ? ' is-on' : ''}`}
          onClick={() => tokenStatsStore.set(!statsEnabled)}
        >
          <span className="re-setting-switch-knob" aria-hidden="true" />
        </button>
      </div>
      <div className="re-pane-setting">
        <div className="re-pane-setting-copy">
          <div className="re-pane-setting-title">推理强度滑块</div>
          <div className="re-pane-setting-desc">在模型菜单中显示推理强度滑块和动态辐射特效，档位随当前模型自动适配</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="启用推理强度滑块"
          aria-checked={sliderEnabled}
          className={`re-setting-switch${sliderEnabled ? ' is-on' : ''}`}
          onClick={() => sliderStore.set(!sliderEnabled)}
        >
          <span className="re-setting-switch-knob" aria-hidden="true" />
        </button>
      </div>
      <div className="re-pane-setting">
        <div className="re-pane-setting-copy">
          <div className="re-pane-setting-title">保持唤醒</div>
          <div className="re-pane-setting-desc">DSH 运行期间阻止计算机睡眠/休眠，用于低谷时段定时任务</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="启用保持唤醒"
          aria-checked={keepEnabled}
          disabled={keepAwakeScope === null}
          className={`re-setting-switch${keepEnabled ? ' is-on' : ''}`}
          onClick={() => {
            void keepAwakeScope?.set('keepAwake', !keepEnabled)
          }}
        >
          <span className="re-setting-switch-knob" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// "设置 → 插件"里的本插件专属配置页（注册为 settings.plugins.tab 的
// 第二个标签页）。顶部展示基础信息（中文名 / 小字简介 / 英文名），点击
// 展开后可开启/关闭整个插件并配置各项选项。该标签页永远注册，因此插件
// 总开关关闭后仍可回到这里重新开启。
// （注：settings.plugin.item 卡需要 host settings 命名空间才被分发，
// 本插件是纯客户端包，故采用 tab 页形态。）
// ---------------------------------------------------------------------------
function PluginConfigCard() {
  const [open, setOpen] = useState(false)
  const pluginOn = useSyncExternalStore(pluginStore.subscribe, pluginStore.getSnapshot)
  const sliderOn = useSyncExternalStore(sliderStore.subscribe, sliderStore.getSnapshot)
  const statsOn = useSyncExternalStore(tokenStatsStore.subscribe, tokenStatsStore.getSnapshot)
  const keepSnap = useSyncExternalStore(
    (notify) => keepAwakeScope?.subscribe(notify) ?? (() => undefined),
    () => keepAwakeScope?.getSnapshot() ?? EMPTY_SETTINGS_SNAPSHOT,
  )
  const keepOn = keepSnap.value?.keepAwake === true

  return (
    <div className={`re-plugin-card${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="re-plugin-header"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="re-plugin-headtext">
          <span className="re-plugin-name">模型选择器增强</span>
          <span className="re-plugin-desc">模型/思考档位/峰谷计价/定时发送 一站式增强 · dsh-model-selector</span>
        </span>
        <span className={`re-plugin-chevron${open ? ' is-open' : ''}`} aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="re-plugin-body">
          <div className="re-plugin-row">
            <div className="re-plugin-row-copy">
              <div className="re-plugin-row-title">启用插件</div>
              <div className="re-plugin-row-desc">关闭后恢复 DSH 原生模型选择器，并隐藏定时发送/统计等全部增强界面</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="启用插件"
              aria-checked={pluginOn}
              className={`re-setting-switch${pluginOn ? ' is-on' : ''}`}
              onClick={() => pluginStore.set(!pluginOn)}
            >
              <span className="re-setting-switch-knob" aria-hidden="true" />
            </button>
          </div>
          <div className="re-plugin-row">
            <div className="re-plugin-row-copy">
              <div className="re-plugin-row-title">推理强度滑块</div>
              <div className="re-plugin-row-desc">在模型菜单中显示推理强度滑块和动态辐射特效，档位随当前模型自动适配</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="启用推理强度滑块"
              aria-checked={sliderOn}
              disabled={!pluginOn}
              className={`re-setting-switch${sliderOn ? ' is-on' : ''}`}
              onClick={() => sliderStore.set(!sliderOn)}
            >
              <span className="re-setting-switch-knob" aria-hidden="true" />
            </button>
          </div>
          <div className="re-plugin-row">
            <div className="re-plugin-row-copy">
              <div className="re-plugin-row-title">显示 Token 统计</div>
              <div className="re-plugin-row-desc">在浮窗中显示今日 Token 用量统计</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="显示 Token 统计"
              aria-checked={statsOn}
              disabled={!pluginOn}
              className={`re-setting-switch${statsOn ? ' is-on' : ''}`}
              onClick={() => tokenStatsStore.set(!statsOn)}
            >
              <span className="re-setting-switch-knob" aria-hidden="true" />
            </button>
          </div>
          <div className="re-plugin-row">
            <div className="re-plugin-row-copy">
              <div className="re-plugin-row-title">保持唤醒</div>
              <div className="re-plugin-row-desc">DSH 运行期间阻止计算机睡眠/休眠，用于低谷时段定时任务</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="启用保持唤醒"
              aria-checked={keepOn}
              disabled={keepAwakeScope === null || !pluginOn}
              className={`re-setting-switch${keepOn ? ' is-on' : ''}`}
              onClick={() => {
                void keepAwakeScope?.set('keepAwake', !keepOn)
              }}
            >
              <span className="re-setting-switch-knob" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Peak / off-peak hint pill for the composer input's left rail.
// Beijing-time windows (Mon-Fri 9:00-12:00, 14:00-18:00) are "peak"
// (梁文锋), everything else is "off-peak" (梁文谷). Shows a countdown to the
// next phase change in a small popover.
// ---------------------------------------------------------------------------
const BJ_OFFSET = 8 * 3600000
const PEAK_WINDOWS: Array<[number, number]> = [[9 * 3600, 12 * 3600], [14 * 3600, 18 * 3600]]

function beijingParts(ms: number): { day: number; sec: number } {
  const d = new Date(ms + BJ_OFFSET)
  return { day: d.getUTCDay(), sec: d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds() }
}

function phase(ms: number): { peak: boolean; secondsToTarget: number } {
  const { day, sec } = beijingParts(ms)
  const weekday = day >= 1 && day <= 5
  const peak = weekday && PEAK_WINDOWS.some(([s, e]) => sec >= s && sec < e)
  if (peak) {
    const end = sec < 12 * 3600 ? 12 * 3600 : 18 * 3600
    return { peak: true, secondsToTarget: end - sec }
  }
  const shifted = ms + BJ_OFFSET
  const startOfShiftedDay = shifted - sec * 1000
  if (weekday && sec < 9 * 3600) {
    return { peak: false, secondsToTarget: (startOfShiftedDay + 9 * 3600 * 1000 - shifted) / 1000 }
  }
  if (weekday && sec >= 12 * 3600 && sec < 14 * 3600) {
    return { peak: false, secondsToTarget: (startOfShiftedDay + 14 * 3600 * 1000 - shifted) / 1000 }
  }
  for (let i = 1; i <= 7; i++) {
    const nd = (day + i) % 7
    if (nd >= 1 && nd <= 5) {
      return { peak: false, secondsToTarget: (startOfShiftedDay + i * 86400000 + 9 * 3600 * 1000 - shifted) / 1000 }
    }
  }
  return { peak: false, secondsToTarget: 0 }
}

function formatDur(sec: number): string {
  sec = Math.max(0, Math.floor(sec))
  const pad = (n: number) => String(n).padStart(2, '0')
  const days = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const hms = pad(h) + ':' + pad(m) + ':' + pad(s)
  return days > 0 ? days + '天 ' + hms : hms
}

// ---------------------------------------------------------------------------
// Timed send queue: the composer's "定时发送" button (right end of the tool
// row) parks the current draft into this plugin's own deferral list
// (localStorage-backed) and clears the textarea. Two item types: "空闲发送"
// fires 30s after the next idle window begins (Beijing time); "自定义时间"
// fires every day at the chosen HH:MM. Entries render grouped by type — the
// idle group shares one sequence, custom entries sequence per HH:MM group —
// collapsed by default, with per-item countdowns, type switches, immediate
// send, and removal available at any time.
// ---------------------------------------------------------------------------
const DEFER_STORAGE_KEY = 'dsh-model-selector.deferred-queue'
const DEFER_DELAY_MS = 30000

type DeferMode = 'idle' | 'custom'

/** Custom-time target: send every day at Beijing HH:MM. */
interface DeferAt {
  hour: number
  minute: number
}

interface DeferredItem {
  id: string
  seq: number
  sessionId: string
  text: string
  createdAt: number
  mode: DeferMode
  at?: DeferAt
  error?: string
}

/** Sequence group of one item: all idle items share "idle"; custom items group by their HH:MM. */
function deferGroupKey(item: DeferredItem): string {
  if (item.mode === 'idle') return 'idle'
  const at = item.at ?? { hour: 9, minute: 0 }
  return `${String(at.hour).padStart(2, '0')}:${String(at.minute).padStart(2, '0')}`
}

function deferTimeLabel(item: DeferredItem): string {
  if (item.mode === 'idle') return '空闲发送'
  const at = item.at ?? { hour: 9, minute: 0 }
  return `${String(at.hour).padStart(2, '0')}:${String(at.minute).padStart(2, '0')}`
}

let deferredItems: DeferredItem[] = readDeferred()
const deferListeners = new Set<() => void>()
/** Captured by apply(); the dock/button components read it for sends. */
let DEFERRED_CONNECTION: StatsConnection | undefined

function readDeferred(): DeferredItem[] {
  try {
    const raw = window.localStorage.getItem(DEFER_STORAGE_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter((entry: unknown) => entry !== null && typeof entry === 'object')
        .map((entry) => entry as DeferredItem)
        .filter((entry) => entry.id !== undefined && typeof entry.text === 'string')
        .map((entry) => (entry.mode === 'custom' ? entry : { ...entry, mode: 'idle' as const }))
    }
    return []
  } catch {
    return []
  }
}

function persistDeferred(): void {
  try {
    window.localStorage.setItem(DEFER_STORAGE_KEY, JSON.stringify(deferredItems))
  } catch {
    // The live list still keeps working for this page session.
  }
}

const deferStore = {
  getSnapshot: () => deferredItems,
  subscribe: (listener: () => void) => {
    deferListeners.add(listener)
    return () => deferListeners.delete(listener)
  },
  enqueue: (sessionId: string, text: string, mode: DeferMode, at?: DeferAt) => {
    const base: DeferredItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      seq: 0,
      sessionId,
      text,
      createdAt: Date.now(),
      mode,
      ...(mode === 'custom' ? { at: at ?? { hour: 9, minute: 0 } } : {}),
    }
    const group = deferGroupKey(base)
    const seq = deferredItems
      .filter((item) => deferGroupKey(item) === group)
      .reduce((max, item) => Math.max(max, item.seq), 0) + 1
    deferredItems = [...deferredItems, { ...base, seq }]
    persistDeferred()
    deferListeners.forEach((listener) => listener())
  },
  remove: (id: string) => {
    if (!deferredItems.some((item) => item.id === id)) return
    deferredItems = deferredItems.filter((item) => item.id !== id)
    persistDeferred()
    deferListeners.forEach((listener) => listener())
  },
  retarget: (id: string, mode: DeferMode, at?: DeferAt) => {
    const current = deferredItems.find((item) => item.id === id)
    if (current === undefined) return
    const next: DeferredItem = {
      ...current,
      mode,
      error: undefined,
      ...(mode === 'custom' ? { at: at ?? current.at ?? { hour: 9, minute: 0 } } : {}),
    }
    const group = deferGroupKey(next)
    const seq = deferredItems
      .filter((item) => item.id !== id && deferGroupKey(item) === group)
      .reduce((max, item) => Math.max(max, item.seq), 0) + 1
    deferredItems = deferredItems.map((item) => (item.id === id ? { ...next, seq } : item))
    persistDeferred()
    deferListeners.forEach((listener) => listener())
  },
  setError: (id: string, error: string) => {
    if (!deferredItems.some((item) => item.id === id)) return
    deferredItems = deferredItems.map((item) => (item.id === id ? { ...item, error } : item))
    persistDeferred()
    deferListeners.forEach((listener) => listener())
  },
}

/** Start (epoch ms) of the next idle window after `now`; null when already idle. */
function nextIdleStartMs(ms: number): number | null {
  const { day, sec } = beijingParts(ms)
  if (day < 1 || day > 5) return null
  const shifted = new Date(ms + BJ_OFFSET)
  const dayStartMs = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - BJ_OFFSET
  if (sec >= 9 * 3600 && sec < 12 * 3600) return dayStartMs + 12 * 3600 * 1000
  if (sec >= 14 * 3600 && sec < 18 * 3600) return dayStartMs + 18 * 3600 * 1000
  return null
}

/** When an idle-mode item fires: idle now → 30s from now; peak → idle start + 30s. */
function idleSendAt(ms: number): number {
  return (nextIdleStartMs(ms) ?? ms) + DEFER_DELAY_MS
}

/** Next Beijing-day occurrence of a custom HH:MM after `ms` (today if still ahead, else tomorrow). */
function customNextAt(at: DeferAt, ms: number): number {
  const shifted = new Date(ms + BJ_OFFSET)
  const dayStartMs = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - BJ_OFFSET
  const today = dayStartMs + at.hour * 3600000 + at.minute * 60000
  return today > ms ? today : today + 86400000
}

/** The exact fire time of one item: idle → idle window + 30s; custom → next HH:MM. */
function sendAtOf(item: DeferredItem, ms: number): number {
  if (item.mode === 'idle') return idleSendAt(ms)
  return customNextAt(item.at ?? { hour: 9, minute: 0 }, ms)
}

async function sendDeferredItem(
  connection: StatsConnection | undefined,
  item: DeferredItem,
): Promise<boolean> {  if (connection === undefined) return false
  try {
    const response = await connection.api.sessions.prompt({
      sessionId: item.sessionId,
      mode: 'queue',
      content: [{ type: 'text', text: item.text }],
      clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    const result = response?.result
    if (result === undefined || !result.ok) {
      console.error('[dsh-model-selector] deferred send failed', item.id, result?.error)
      deferStore.setError(item.id, `${result?.error.code ?? 'unknown'}: ${result?.error.message ?? '发送失败'}`)
      return false
    }
    deferStore.remove(item.id)
    return true
  } catch (cause) {
    console.error('[dsh-model-selector] deferred send threw', item.id, cause)
    deferStore.setError(item.id, cause instanceof Error ? cause.message : String(cause))
    return false
  }
}

function fmtCountdown(ms: number): string {
  const sec = Math.max(0, Math.ceil(ms / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  const days = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const hms = pad(h) + ':' + pad(m) + ':' + pad(s)
  return days > 0 ? `${days}天 ${hms}` : hms
}

interface InputZoneLike {
  readonly session?: { readonly queue?: readonly unknown[] }
  readonly input?: { readonly draft: string }
  readonly sessionId?: string
  readonly useInput?: () => { readonly draft: string }
  readonly inputActions?: { readonly setDraft: (text: string) => void }
}

function TimerSendButton({ input, sessionId, inputActions }: InputZoneLike) {
  const draft = input?.draft ?? ''
  const canQueue = draft.trim() !== '' && inputActions !== undefined && sessionId !== undefined
  const [menuOpen, setMenuOpen] = useState(false)
  const [picking, setPicking] = useState(false)
  const [timeDraft, setTimeDraft] = useState('09:00')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', closeOutside)
    return () => document.removeEventListener('mousedown', closeOutside)
  }, [menuOpen])

  if (!canQueue) return null

  const close = () => {
    setMenuOpen(false)
    setPicking(false)
  }

  const commit = (mode: DeferMode, at?: DeferAt) => {
    if (!canQueue) return
    inputActions?.setDraft('')
    deferStore.enqueue(sessionId!, draft, mode, at)
    close()
  }

  const submitCustom = () => {
    const parts = timeDraft.split(':')
    const hour = Number(parts[0])
    const minute = Number(parts[1] ?? 0)
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return
    commit('custom', { hour: Math.max(0, Math.min(23, hour)), minute: Math.max(0, Math.min(59, minute)) })
  }

  return (
    <div ref={rootRef} className="re-timer-root">
      <button
        type="button"
        className="re-timer-btn"
        title="定时发送"
        aria-label="定时发送"
        aria-expanded={menuOpen}
        onClick={() => {
          setMenuOpen(!menuOpen)
          setPicking(false)
        }}
      >
        <span className="re-timer-btn-icon" aria-hidden="true" />
        <span className="re-timer-btn-text">定时发送</span>
      </button>
      {menuOpen ? (
        <div className="re-timer-menu">
          {!picking ? (
            <>
              <button
                type="button"
                className="re-timer-option"
                onClick={() => commit('idle')}
              >
                <span className="re-timer-option-name">空闲发送</span>
                <span className="re-timer-option-desc">等到下一个空闲时间自动发送</span>
              </button>
              <button
                type="button"
                className="re-timer-option"
                onClick={() => setPicking(true)}
              >
                <span className="re-timer-option-name">自定义时间发送</span>
                <span className="re-timer-option-desc">输入一个时间，每天到点发送</span>
              </button>
            </>
          ) : (
            <div className="re-timer-picker">
              <div className="re-timer-picker-row">
                <input
                  type="time"
                  className="re-timer-time"
                  value={timeDraft}
                  onChange={(event) => setTimeDraft(event.currentTarget.value)}
                  autoFocus
                />
                <button type="button" className="re-timer-picker-ok" onClick={submitCustom}>确定</button>
                <button type="button" className="re-timer-picker-cancel" onClick={() => setPicking(false)}>返回</button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function DeferredPanel({ sessionId }: InputZoneLike) {
  const items = useSyncExternalStore(deferStore.subscribe, deferStore.getSnapshot)
  const [now, setNow] = useState(Date.now())
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [editing, setEditing] = useState<Record<string, string>>({})

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (DEFERRED_CONNECTION === undefined) return
    for (const item of items) {
      if (sendAtOf(item, now) > now) continue
      void sendDeferredItem(DEFERRED_CONNECTION, item)
    }
  }, [now, items])

  const own = items.filter((item) => item.sessionId === sessionId).sort((a, b) => a.createdAt - b.createdAt)
  const idleRows = own.filter((item) => item.mode === 'idle').sort((a, b) => a.seq - b.seq)
  const customRows = own.filter((item) => item.mode === 'custom').sort((a, b) => a.seq - b.seq)
  const customGroups: DeferredItem[][] = []
  for (const row of customRows.sort((a, b) => deferGroupKey(a).localeCompare(deferGroupKey(b)))) {
    const group = customGroups.find((entries) => deferGroupKey(entries[0]) === deferGroupKey(row))
    if (group === undefined) customGroups.push([row])
    else group.push(row)
  }
  if (own.length === 0 || DEFERRED_CONNECTION === undefined) return null

  const toggle = (id: string) => {
    setExpanded((current) => ({ ...current, [id]: !current[id] }))
  }
  const nextIdle = nextIdleStartMs(now)
  const idleGroupLabel = nextIdle === null ? '当前空闲时段' : `距空闲 ${fmtCountdown(nextIdle - now)}`

  const renderRow = (item: DeferredItem) => {
    const isIdle = item.mode === 'idle'
    const sendAt = sendAtOf(item, now)
    const open = expanded[item.id] === true
    const editingDraft = editing[item.id]
    const isEditing = editingDraft !== undefined
    const label = deferTimeLabel(item)
    return (
      <div key={item.id} className={`re-defer-row${open ? ' is-open' : ''}`}>
        <button
          type="button"
          className="re-defer-toggle"
          onClick={() => toggle(item.id)}
          aria-expanded={open}
          title={open ? '折叠内容' : '展开内容'}
        >
          <span className="re-defer-chevron" aria-hidden="true" />
          <span className="re-defer-seq">#{item.seq}</span>
          <span className={`re-defer-mode${isIdle ? ' is-idle' : ' is-custom'}`}>{label}</span>
          <span className="re-defer-summary">{open ? '' : item.text}</span>
        </button>
        {open ? <div className="re-defer-full">{item.text}</div> : null}
        <span className="re-defer-actions">
          {isIdle ? (
            <>
              <span className="re-defer-countdown" title={`预计 ${new Date(sendAt).toLocaleTimeString()} 发送`}>
                {fmtCountdown(sendAt - now)}
              </span>
              <button
                type="button"
                className="re-defer-toidle"
                title="改为自定义时间发送"
                onClick={() => {
                  setEditing((current) => ({ ...current, [item.id]: '09:00' }))
                }}
              >
                转自定义
              </button>
            </>
          ) : (
            <>
              <span className="re-defer-countdown" title={`预计 ${new Date(sendAt).toLocaleTimeString()} 发送`}>
                {fmtCountdown(sendAt - now)}
              </span>
              <button
                type="button"
                className="re-defer-cancel"
                title="改为空闲发送"
                onClick={() => deferStore.retarget(item.id, 'idle')}
              >
                转空闲
              </button>
              <button
                type="button"
                className="re-defer-toidle"
                title="修改发送时间"
                onClick={() => {
                  const at = item.at ?? { hour: 9, minute: 0 }
                  setEditing((current) => ({ ...current, [item.id]: `${String(at.hour).padStart(2, '0')}:${String(at.minute).padStart(2, '0')}` }))
                }}
              >
                改时间
              </button>
            </>
          )}
          <button
            type="button"
            className="re-defer-send"
            onClick={() => void sendDeferredItem(DEFERRED_CONNECTION, item)}
          >
            立即发送
          </button>
          <button type="button" className="re-defer-remove" title="删除" onClick={() => deferStore.remove(item.id)}>
            ✕
          </button>
        </span>
        {isEditing ? (
          <span className="re-defer-edit">
            <input
              type="time"
              className="re-defer-time"
              value={editingDraft}
              onChange={(event) => setEditing((current) => ({ ...current, [item.id]: event.currentTarget.value }))}
              autoFocus
            />
            <button
              type="button"
              className="re-defer-edit-ok"
              onClick={() => {
                const parts = editingDraft.split(':')
                const hour = Number(parts[0])
                const minute = Number(parts[1] ?? 0)
                if (Number.isFinite(hour) && Number.isFinite(minute)) {
                  deferStore.retarget(item.id, 'custom', {
                    hour: Math.max(0, Math.min(23, hour)),
                    minute: Math.max(0, Math.min(59, minute)),
                  })
                }
                setEditing((current) => {
                  const next = { ...current }
                  delete next[item.id]
                  return next
                })
              }}
            >
              确定
            </button>
            <button
              type="button"
              className="re-defer-edit-cancel"
              onClick={() => {
                setEditing((current) => {
                  const next = { ...current }
                  delete next[item.id]
                  return next
                })
              }}
            >
              取消
            </button>
          </span>
        ) : null}
        {item.error === undefined ? null : <div className="re-defer-error">{item.error}</div>}
      </div>
    )
  }

  return (
    <div className="re-defer-dock">
      <div className="re-defer-panel">
        <div className="re-defer-head">
          <span className="re-defer-lead" aria-hidden="true">⏳</span>
          <span className="re-defer-title">定时发送 · {own.length} 条</span>
          <span className="re-defer-hint">空闲发送 = 北京时间空闲时段（开始 30 秒后自动发）；自定义 = 每天到点发送；请保持页面打开</span>
        </div>
        <div className="re-defer-list">
        {idleRows.length > 0 ? (
          <div className="re-defer-group">
            <div className="re-defer-group-head">
              <span className="re-defer-group-dot is-idle" aria-hidden="true" />
              <span className="re-defer-group-title">空闲发送 · {idleRows.length} 条</span>
              <span className="re-defer-group-count">{idleGroupLabel}</span>
            </div>
            {idleRows.map(renderRow)}
          </div>
        ) : null}
        {customRows.length > 0 ? (
          <div className="re-defer-group">
            <div className="re-defer-group-head">
              <span className="re-defer-group-dot is-custom" aria-hidden="true" />
              <span className="re-defer-group-title">自定义时间 · {customRows.length} 条</span>
            </div>
            {customGroups.map((group) => (
              <div key={deferGroupKey(group[0])} className="re-defer-subgroup">
                <div className="re-defer-subhead">{deferGroupKey(group[0])} · {group.length} 条</div>
                {group.map(renderRow)}
              </div>
            ))}
          </div>
        ) : null}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Today's token usage summary (region 2 of the model popover).
//
// Reads provider-reported usage from the durable session logs through the
// browser's ordinary sessions API (no Host-side plugin needed):
//   - `sessions.list()` → sessions active today;
//   - `sessions.history()` → raw events; each `assistant/message` carries the
//     step's `usage` (uncached input + cache reads/writes + output) and its own
//     `time`; the model comes from the latest preceding `request/header`.
// Peak/off-peak buckets reuse `phase()` (Beijing windows). The snapshot is
// cached in localStorage so the popover opens instantly and refreshes on a
// light interval while it stays open.
// ---------------------------------------------------------------------------
const STATS_CACHE_KEY = 'dsh-model-selector.token-stats'
const STATS_REFRESH_MS = 180000
const STATS_MAX_PAGES = 3
const STATS_PAGE_MESSAGES = 100

const TOKEN_STATS_ENABLED_KEY = 'dsh-model-selector.token-stats-enabled'

function readTokenStatsEnabled(): boolean {
  try {
    return window.localStorage.getItem(TOKEN_STATS_ENABLED_KEY) !== 'false'
  } catch {
    return true
  }
}

let tokenStatsEnabled = readTokenStatsEnabled()
const tokenStatsListeners = new Set<() => void>()

const tokenStatsStore = {
  getSnapshot: () => tokenStatsEnabled,
  subscribe: (listener: () => void) => {
    tokenStatsListeners.add(listener)
    return () => tokenStatsListeners.delete(listener)
  },
  set: (enabled: boolean, persist = true) => {
    if (tokenStatsEnabled === enabled) return
    tokenStatsEnabled = enabled
    if (persist) {
      try {
        window.localStorage.setItem(TOKEN_STATS_ENABLED_KEY, String(enabled))
      } catch {
        // The current page still follows the choice when storage is unavailable.
      }
    }
    tokenStatsListeners.forEach((listener) => listener())
  },
}

/** One token total bucket: peak-time, idle-time (Beijing), and the sum. */
interface TokenBucket {
  peak: number
  idle: number
  total: number
}

/** Today's totals keyed by `${provider}/${model}` ("(未知)" when unrecorded). */
interface DayStats {
  date: string
  fetchedAt: number
  models: Record<string, TokenBucket>
  /** Previous Beijing calendar day; carried so a fresh midnight does not read as "no data". */
  prev: Record<string, TokenBucket>
}

function beijingDayStart(ms: number): number {
  const shifted = new Date(ms + BJ_OFFSET)
  const start = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - BJ_OFFSET
  return start
}

function beijingDateKey(ms: number): string {
  const shifted = new Date(ms + BJ_OFFSET)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
}

/**
 * Adaptive Chinese-unit token formatter: 千 / 万 / 十万 / 百万 / 千万 / 亿.
 * Below one thousand the integer is printed as-is. At 亿 scale the decimal
 * part only appears when it is at least 0.01亿 (100万), per spec.
 */
function fmtTokens(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  if (n < 1000) return String(Math.round(n))
  const units: ReadonlyArray<{ value: number; name: string; decimals: number }> = [
    { value: 1e8, name: '亿', decimals: 2 },
    { value: 1e7, name: '千万', decimals: 1 },
    { value: 1e6, name: '百万', decimals: 1 },
    { value: 1e5, name: '十万', decimals: 1 },
    { value: 1e4, name: '万', decimals: 1 },
    { value: 1e3, name: '千', decimals: 1 },
  ]
  let unit = units[units.length - 1]
  for (const candidate of units) {
    if (n >= candidate.value) {
      unit = candidate
      break
    }
  }
  const raw = n / unit.value
  let text: string
  if (unit.name === '亿' && raw % 1 > 0 && raw % 1 < 0.01) {
    text = String(Math.floor(raw))
  } else {
    text = raw.toFixed(unit.decimals).replace(/\.?0+$/, '')
  }
  return `${text}${unit.name}`
}

function emptyBucket(): TokenBucket {
  return { peak: 0, idle: 0, total: 0 }
}

function bucketOf(models: Record<string, TokenBucket>, key: string): TokenBucket {
  return models[key] ?? (models[key] = emptyBucket())
}

function usageTokensOf(usage: Record<string, unknown>): number {
  const pick = (key: string) => {
    const value = usage[key]
    return typeof value === 'number' && value > 0 ? value : 0
  }
  return pick('inputTokens') + pick('cacheReadTokens') + pick('cacheWriteTokens') + pick('outputTokens')
}

/** Header state shared across one session's history pages (headers are sparse). */
interface EventWalk {
  header: { provider: string; model: string } | undefined
  /** Whether the inherited fork/resume seed region (events before session/end-seed) has passed. */
  seedPassed: boolean
}

function aggregateEvents(
  events: readonly StatsHistoryEntry[],
  models: Record<string, TokenBucket>,
  prev: Record<string, TokenBucket>,
  dayStart: number,
  prevDayStart: number,
  walk: EventWalk,
): void {
  for (const entry of events) {
    const event = entry.event
    // Forked/resumed sessions carry a copied seed region whose events belong to
    // the parent session — counting them here would double-count usage.
    if (!walk.seedPassed) {
      if (event.type === 'session/end-seed') walk.seedPassed = true
      continue
    }
    const data = event.data as Record<string, unknown> | null
    if (event.type === 'request/header' && data !== null && data.header !== undefined) {
      const headerData = data.header as { config?: Record<string, unknown> }
      const config = headerData.config
      if (config !== undefined && typeof config.provider === 'string' && typeof config.model === 'string') {
        walk.header = { provider: config.provider, model: config.model }
      }
    } else if (event.type === 'assistant/message' && data !== null && data.usage !== undefined) {
      if (event.time < prevDayStart) continue
      const tokens = usageTokensOf(data.usage as Record<string, unknown>)
      if (tokens <= 0) continue
      // The assistant message itself carries the exact model route, so
      // attribution works even when the header event sits outside the pages
      // we walked (huge logs) or on an earlier page.
      const message = data.message as { source?: { provider?: unknown; model?: unknown } } | undefined
      const source = message?.source
      const provider = typeof source?.provider === 'string' ? source.provider : undefined
      const model = typeof source?.model === 'string' ? source.model : undefined
      const key = provider !== undefined && model !== undefined
        ? `${provider}/${model}`
        : walk.header !== undefined
          ? `${walk.header.provider}/${walk.header.model}`
          : '(未知)'
      const into = event.time >= dayStart ? models : prev
      const bucket = bucketOf(into, key)
      if (phase(event.time).peak) bucket.peak += tokens
      else bucket.idle += tokens
      bucket.total += tokens
    }
  }
}

async function collectSessionStats(
  connection: StatsConnection,
  sessionId: string,
  dayStart: number,
  prevDayStart: number,
  models: Record<string, TokenBucket>,
  prev: Record<string, TokenBucket>,
): Promise<void> {
  const walk: EventWalk = { header: undefined, seedPassed: false }
  let beforeSeq: number | undefined
  for (let page = 0; page < STATS_MAX_PAGES; page += 1) {
    const response = await connection.api.sessions.history({
      sessionId,
      maxMessages: STATS_PAGE_MESSAGES,
      ...(beforeSeq === undefined ? {} : { beforeSeq }),
    })
    const result = response?.result
    if (result === undefined || !result.ok) return
    const events = result.value.events
    if (events.length === 0) return
    aggregateEvents(events, models, prev, dayStart, prevDayStart, walk)
    let minTime = Infinity
    let minSeq = Infinity
    for (const entry of events) {
      if (entry.event.time < minTime) minTime = entry.event.time
      if (entry.event.seq < minSeq) minSeq = entry.event.seq
    }
    if (minTime < prevDayStart || !result.value.hasMore) return
    beforeSeq = minSeq
  }
}

interface StatsProgress {
  models: Record<string, TokenBucket>
  prev: Record<string, TokenBucket>
  scanned: number
  failed: number
}

async function fetchTodayStats(
  connection: StatsConnection | undefined,
): Promise<StatsProgress | null> {
  if (connection === undefined) return null
  const now = Date.now()
  const dayStart = beijingDayStart(now)
  const prevDayStart = dayStart - 86400000
  const models: Record<string, TokenBucket> = {}
  const prev: Record<string, TokenBucket> = {}
  let scanned = 0
  let failed = 0
  const response = await connection.api.sessions.list({})
  const result = response?.result
  if (result === undefined || !result.ok) return null
  for (const item of result.value.items) {
    if (item.updatedAt < prevDayStart) continue
    scanned += 1
    try {
      await collectSessionStats(connection, item.sessionId, dayStart, prevDayStart, models, prev)
    } catch (cause) {
      failed += 1
      console.error('[dsh-model-selector] token stats: session read failed', item.sessionId, cause)
    }
  }
  return { models, prev, scanned, failed }
}

function readCachedStats(): DayStats | null {
  try {
    const raw = window.localStorage.getItem(STATS_CACHE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object') return null
    const stats = parsed as DayStats
    if (stats.date !== beijingDateKey(Date.now()) || stats.models === undefined) return null
    if (stats.prev === undefined) stats.prev = {}
    return stats
  } catch {
    return null
  }
}

function writeCachedStats(stats: DayStats): void {
  try {
    window.localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats))
  } catch {
    // Cache is optional; the live fetch still feeds the UI this run.
  }
}

function TokenStats({ connection, groups }: { connection?: StatsConnection; groups: ReadonlyArray<{ id: string; models: ReadonlyArray<{ id: string; name: string }> }> }) {
  const [expanded, setExpanded] = useState(false)
  const [stats, setStats] = useState<DayStats | null>(readCachedStats)
  const [updating, setUpdating] = useState(false)
  const [result, setResult] = useState<StatsProgress | null>(null)
  const [fatal, setFatal] = useState<string | null>(null)
  const aliasMap = useSyncExternalStore(aliasStore.subscribe, aliasStore.getSnapshot)
  const statsVisible = useSyncExternalStore(tokenStatsStore.subscribe, tokenStatsStore.getSnapshot)

  useEffect(() => {
    if (connection === undefined || !statsVisible) return
    let disposed = false
    const refresh = async () => {
      setUpdating(true)
      setFatal(null)
      try {
        const outcome = await fetchTodayStats(connection)
        if (disposed) return
        if (outcome === null) {
          setFatal('统计数据加载失败')
          return
        }
        setResult(outcome)
        const next: DayStats = { date: beijingDateKey(Date.now()), fetchedAt: Date.now(), models: outcome.models, prev: outcome.prev }
        setStats(next)
        writeCachedStats(next)
      } catch (cause) {
        if (disposed) return
        console.error('[dsh-model-selector] token stats: refresh failed', cause)
        setFatal(cause instanceof Error ? cause.message : String(cause))
      } finally {
        if (!disposed) setUpdating(false)
      }
    }
    void refresh()
    const id = window.setInterval(() => void refresh(), STATS_REFRESH_MS)
    return () => {
      disposed = true
      window.clearInterval(id)
    }
  }, [connection, statsVisible])

  if (connection === undefined) return null
  if (!statsVisible) return null

  const models = stats?.models ?? {}
  const prev = stats?.prev ?? {}
  const keys = Object.keys(models).sort((a, b) => models[b].total - models[a].total)
  let peakTotal = 0
  let idleTotal = 0
  let totalTotal = 0
  let prevTotal = 0
  for (const key of keys) {
    peakTotal += models[key].peak
    idleTotal += models[key].idle
    totalTotal += models[key].total
  }
  for (const key of Object.keys(prev)) prevTotal += prev[key].total
  const modelLabelOf = (key: string) => {
    const aliased = aliasMap[key]
    if (aliased !== undefined) return aliased
    const [provider, model] = key.split('/')
    const group = groups.find((candidate) => candidate.id === provider)
    const entry = group?.models.find((candidate) => candidate.id === model)
    return entry?.name ?? model ?? key
  }

  return (
    <div className="re-stats">
      <button
        type="button"
        className="re-stats-row"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="re-stats-title">今日 Token 总用量</span>
        <span className={`re-stats-status${updating ? ' is-updating' : ''}`}>
          {updating ? '更新中…' : fatal !== null ? '加载失败' : '已更新'}
        </span>
        <span className="re-stats-value">{fmtTokens(totalTotal)}</span>
        <span className={`re-stats-chevron${expanded ? ' is-open' : ''}`} aria-hidden="true" />
      </button>
      {expanded ? (
        <div className="re-stats-body">
          {fatal !== null ? (
            <div className="re-stats-empty">统计数据加载失败</div>
          ) : keys.length === 0 ? (
            <div className="re-stats-empty">
              今日暂无消耗
              {prevTotal > 0 ? `（昨日全天 ${fmtTokens(prevTotal)}）` : ''}
            </div>
          ) : (
            <div className="re-stats-detail">
              <table className="re-stats-table">
                <thead>
                  <tr>
                    <th className="re-stats-th-model">模型</th>
                    <th className="re-stats-th-peak">高峰</th>
                    <th className="re-stats-th-idle">低谷</th>
                    <th className="re-stats-th-total">合计</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key) => (
                    <tr key={key}>
                      <td className="re-stats-td-model" title={key}>{modelLabelOf(key)}</td>
                      <td className="re-stats-td-num">{fmtTokens(models[key].peak)}</td>
                      <td className="re-stats-td-num">{fmtTokens(models[key].idle)}</td>
                      <td className="re-stats-td-num is-total">{fmtTokens(models[key].total)}</td>
                    </tr>
                  ))}
                  <tr className="re-stats-row-total">
                    <td className="re-stats-td-model">合计</td>
                    <td className="re-stats-td-num">{fmtTokens(peakTotal)}</td>
                    <td className="re-stats-td-num">{fmtTokens(idleTotal)}</td>
                    <td className="re-stats-td-num is-total">{fmtTokens(totalTotal)}</td>
                  </tr>
                </tbody>
              </table>
              {result !== null && result.failed > 0 ? (
                <div className="re-stats-note">部分会话读取失败（{result.failed}/{result.scanned}），详情见浏览器控制台</div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export function apply(ctx: ClientContext) {
  const modelDirectories = ctx.get('modelDirectories') as ModelDirectoryResolver | undefined
  if (modelDirectories === undefined) return
  const connection = ctx.get('connection') as StatsConnection | undefined
  DEFERRED_CONNECTION = connection

  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-model-selector'
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, 'reasoning-effort: styles')

  ctx.effect(() => {
    const syncStorage = (event: StorageEvent) => {
      if (event.key === PLUGIN_ENABLED_STORAGE_KEY) {
        pluginStore.set(event.newValue !== 'false', false)
      } else if (event.key === SLIDER_ENABLED_STORAGE_KEY) {
        sliderStore.set(event.newValue !== 'false', false)
      } else if (event.key === ENABLED_STORAGE_KEY) {
        enabledStore.set(event.newValue !== 'false', false)
      } else if (event.key === CHIBI_THUMB_STORAGE_KEY) {
        chibiThumbStore.set(event.newValue === 'true', false)
      }
    }
    window.addEventListener('storage', syncStorage)
    return () => window.removeEventListener('storage', syncStorage)
  }, 'reasoning-effort: preference sync')

  // 插件设置已迁移到"设置 → 插件"的插件卡（PluginConfigCard）与模型浮窗
  // 齿轮设置页（SettingsPane），不再占用 DSH"设置 → 通用"分区。

  const settingsScope = ctx.get('settingsScope') as KeepAwakeSettingsScope | undefined
  if (settingsScope !== undefined) {
    keepAwakeScope = settingsScope.bind({
      namespace: 'dsh-model-selector',
      decode: (value: unknown) => (value !== null && typeof value === 'object' && !Array.isArray(value) ? value : undefined),
    })
  }

  // 功能 UI seat 随插件总开关注册/注销；设置 → 插件 的插件卡永远注册，
  // 因此总开关关闭也不会失去配置入口。
  let disposeTimerSeat: (() => void) | undefined
  let disposeDockSeat: (() => void) | undefined
  let disposeModelSeat: (() => void) | undefined
  const syncFeatureSeats = () => {
    if (!pluginStore.getSnapshot()) {
      disposeTimerSeat?.()
      disposeTimerSeat = undefined
      disposeDockSeat?.()
      disposeDockSeat = undefined
      disposeModelSeat?.()
      disposeModelSeat = undefined
      return
    }
    if (disposeModelSeat !== undefined) return
    disposeTimerSeat = ctx.slots.register(
      { name: 'conversation.input.right', id: 'dsh-model-selector-idle-send', order: 30 },
      TimerSendButton,
    )
    disposeDockSeat = ctx.slots.register(
      { name: 'conversation.input.dock', id: 'dsh-model-selector-deferred', order: 21 },
      DeferredPanel,
    )
    disposeModelSeat = ctx.slots.register(
      {
        name: SLOT,
        priority: -100,
        inject: (sessionId: SessionId) => {
          const controller = modelDirectories.directoryFor(sessionId)
          return {
            available: true,
            controller,
            directory: controller.store,
            load: () => controller.load().then(() => undefined, () => undefined),
            select: (selection: ModelSelection) => controller.select(selection).then(() => true, () => false),
            connection,
          }
        },
      },
      AdvancedModelSelect,
    )
  }
  const unsubscribePlugin = pluginStore.subscribe(syncFeatureSeats)
  syncFeatureSeats()

  // 设置 → 插件：本插件专属配置标签页（基础信息 + 展开配置区）。
  ctx.slots.inject('settings.plugins.tab', () =>
    ctx.slots.register(
      { name: 'settings.plugins.tab', id: 'dsh-model-selector', order: 10, label: '模型选择器增强' },
      PluginConfigCard,
    ),
  )

  return () => {
    unsubscribePlugin()
    disposeTimerSeat?.()
    disposeDockSeat?.()
    disposeModelSeat?.()
  }
}
