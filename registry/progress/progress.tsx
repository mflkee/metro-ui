/**
 * The fleet progress bar: a track and a fill on the theme's accent, with the label
 * on the same line as the value.
 *
 * It is deliberately a plain element pair rather than a shadcn primitive: the fleet
 * draws its own controls, and the bar is the same shape everywhere (the folder-rescan
 * dock in metroLog paints it the same way).
 */
export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  className,
}: {
  value: number
  max?: number
  label?: string
  /** Render the percentage on the right of the track. */
  showValue?: boolean
  className?: string
}) {
  const safeMax = max > 0 ? max : 100
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100))

  return (
    <div className={["space-y-1.5", className ?? ""].join(" ").trim()}>
      {label || showValue ? (
        <div className="flex justify-between text-xs text-steel">
          <span>{label ?? ""}</span>
          {showValue ? <span>{Math.round(percent)}%</span> : null}
        </div>
      ) : null}
      <div
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={value}
        className="h-2 overflow-hidden rounded-full bg-[var(--accent-soft)]"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
