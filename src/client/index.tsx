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
 * @module dsh-better-model-selector/client
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
}

const SLOT = 'conversation.input.model'
const SETTINGS_SLOT = 'settings.general.item'
const ENABLED_STORAGE_KEY = 'dsh-better-model-selector.enabled'
const LEGACY_ENABLED_STORAGE_KEY = '@dsh-external/dsh-reasoning-effort.enabled'
const OLD_ENABLED_STORAGE_KEY = 'dsh-reasoning-effort.enabled'
const CHIBI_THUMB_STORAGE_KEY = 'dsh-better-model-selector.chibi-thumb'
const OLD_CHIBI_THUMB_STORAGE_KEY = 'dsh-reasoning-effort.chibi-thumb'
export const inject = ['slots', 'modelDirectories']

function readEnabledPreference(): boolean {
  try {
    const current = window.localStorage.getItem(ENABLED_STORAGE_KEY)
    const stored = current ?? window.localStorage.getItem(OLD_ENABLED_STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_ENABLED_STORAGE_KEY)
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

function readChibiThumbPreference(): boolean {
  try {
    return (window.localStorage.getItem(CHIBI_THUMB_STORAGE_KEY) ?? window.localStorage.getItem(OLD_CHIBI_THUMB_STORAGE_KEY)) === 'true'
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
const ALIAS_STORAGE_KEY = 'dsh-better-model-selector.model-aliases'
const OLD_ALIAS_STORAGE_KEY = 'dsh-reasoning-effort.model-aliases'
type AliasMap = Record<string, string>

function readAliases(): AliasMap {
  try {
    const raw = window.localStorage.getItem(ALIAS_STORAGE_KEY) ?? window.localStorage.getItem(OLD_ALIAS_STORAGE_KEY)
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
}: ModelSeatProps) {
  const state = useSyncExternalStore(
    (notify) => directory.subscribe(notify),
    () => directory.getSnapshot(),
  )
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [editing, setEditing] = useState<string | null>(null)
  const [aliasDraft, setAliasDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const aliasMap = useSyncExternalStore(aliasStore.subscribe, aliasStore.getSnapshot)
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
        <div className="re-model-menu" role="menu" aria-label="模型与推理强度" aria-busy={busy}>
          <div className="re-model-pane">
            <div className="re-peak-panel">
              <div className="re-peak-row">
                <span className="re-peak-dot" style={{ background: peakAccent }} aria-hidden="true" />
                <span className="re-peak-state" style={{ color: peakAccent }}>{peakStateName}</span>
                <span className="re-peak-desc">{peak.peak ? '高峰时段 · 全价' : '空闲时段 · 半价'}</span>
              </div>
              <div className="re-peak-countdown">
                距 {peakTargetName}（{peakTargetDesc}）还有：
                <span className="re-peak-time" style={{ color: peakTargetAccent }}>
                  {formatDur(peak.secondsToTarget)}
                </span>
              </div>
            </div>
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
                      {selected && levels.length >= 2 ? (
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

export function apply(ctx: ClientContext) {
  const modelDirectories = ctx.get('modelDirectories') as ModelDirectoryResolver | undefined
  if (modelDirectories === undefined) return

  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-better-model-selector'
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, 'reasoning-effort: styles')

  ctx.effect(() => {
    const syncStorage = (event: StorageEvent) => {
      if (event.key === ENABLED_STORAGE_KEY) {
        enabledStore.set(event.newValue !== 'false', false)
      } else if (event.key === CHIBI_THUMB_STORAGE_KEY) {
        chibiThumbStore.set(event.newValue === 'true', false)
      }
    }
    window.addEventListener('storage', syncStorage)
    return () => window.removeEventListener('storage', syncStorage)
  }, 'reasoning-effort: preference sync')

  ctx.slots.inject(SETTINGS_SLOT, () =>
    ctx.slots.register(
      { name: SETTINGS_SLOT, id: 'better-model-selector-enabled', order: 15 },
      ReasoningEffortSetting,
    ),
  )

  ctx.slots.inject(SETTINGS_SLOT, () =>
    ctx.slots.register(
      { name: SETTINGS_SLOT, id: 'better-model-selector-chibi-thumb', order: 16 },
      ChibiThumbSetting,
    ),
  )

  ctx.slots.inject(SLOT, () => {
    let disposeModelSeat: (() => void) | undefined
    const syncModelSeat = () => {
      if (!enabledStore.getSnapshot()) {
        disposeModelSeat?.()
        disposeModelSeat = undefined
        return
      }
      if (disposeModelSeat !== undefined) return
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
            }
          },
        },
        AdvancedModelSelect,
      )
    }

    const unsubscribe = enabledStore.subscribe(syncModelSeat)
    syncModelSeat()
    return () => {
      unsubscribe()
      disposeModelSeat?.()
    }
  })
}
