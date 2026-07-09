import * as React from "react"
import { cn } from "@/lib/utils"

function IconBadge({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-[var(--foil-gold)]/60 text-[var(--foil-gold)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { IconBadge }
