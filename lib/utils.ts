/** "just now" / "5 minutes ago" / "3 hours ago" / "2 days ago" / a date. */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (!Number.isFinite(diff) || diff < 0) return 'just now'

  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`

  return new Date(timestamp).toLocaleDateString()
}
