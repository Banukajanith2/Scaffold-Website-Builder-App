export default function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-builder-bg">
      <div
        role="status"
        aria-label="Loading"
        className="h-10 w-10 animate-spin rounded-full border-2 border-builder-border border-t-builder-accent"
      />
    </div>
  )
}
