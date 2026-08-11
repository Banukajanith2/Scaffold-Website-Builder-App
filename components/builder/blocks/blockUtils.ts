import type { CSSProperties } from 'react'

/** Block props are Record<string, unknown>, so coerce for rendering. */
export function str(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value === '' ? fallback : value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return fallback
}

export function num(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''))
  return Number.isFinite(n) ? n : fallback
}

export function selectionStyle(isSelected: boolean): CSSProperties {
  return isSelected ? { outline: '2px solid #f97316', outlineOffset: '-2px' } : {}
}
