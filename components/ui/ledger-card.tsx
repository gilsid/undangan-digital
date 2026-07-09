import * as React from "react"
import { cn } from "@/lib/utils"

function LedgerCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("ledger-card", className)} {...props}>
      {children}
    </div>
  )
}

export { LedgerCard }
