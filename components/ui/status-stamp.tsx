import * as React from "react"
import { cn } from "@/lib/utils"

type StampTone = "success" | "danger" | "warning" | "neutral"

const toneMap: Record<StampTone, string> = {
  success: "bg-[var(--status-success)]/15 text-[var(--status-success)]",
  danger: "bg-[var(--status-danger)]/15 text-[var(--status-danger)]",
  warning: "bg-[var(--status-warning)]/15 text-[var(--status-warning)]",
  neutral: "bg-[var(--ink-surface-raised)] text-[var(--text-muted)]",
}

const dotToneMap: Record<StampTone, string> = {
  success: "bg-[var(--status-success)]",
  danger: "bg-[var(--status-danger)]",
  warning: "bg-[var(--status-warning)]",
  neutral: "bg-[var(--text-muted)]",
}

interface StatusStampProps extends React.ComponentProps<"span"> {
  tone?: StampTone
  icon?: React.ReactNode
}

function StatusStamp({ tone = "neutral", icon, className, children, ...props }: StatusStampProps) {
  return (
    <span
      className={cn(
        "self-start inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium -rotate-1",
        toneMap[tone],
        className
      )}
      style={{ fontFamily: "var(--font-display)" }}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotToneMap[tone])} />
      {icon}
      {children}
    </span>
  )
}

export { StatusStamp }
export type { StampTone }
