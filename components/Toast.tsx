"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
message: string;
type: ToastType;
}

interface Props {
toast: ToastData | null;
onClose: () => void;
duration?: number;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} style={{ color: "var(--status-success)" }} />,
  error: <XCircle size={18} style={{ color: "var(--status-danger)" }} />,
  warning: <AlertTriangle size={18} style={{ color: "var(--status-warning)" }} />,
  info: <Info size={18} style={{ color: "var(--foil-gold)" }} />,
};

const bgClasses: Record<ToastType, string> = {
  success: "border-[var(--status-success)]/30 bg-[var(--ink-surface-raised)]",
  error: "border-[var(--status-danger)]/30 bg-[var(--ink-surface-raised)]",
  warning: "border-[var(--status-warning)]/30 bg-[var(--ink-surface-raised)]",
  info: "border-[var(--foil-gold)]/30 bg-[var(--ink-surface-raised)]",
};

export default function Toast({ toast, onClose, duration = 4000 }: Props) {
useEffect(() => {
if (!toast) return;
const t = setTimeout(onClose, duration);
return () => clearTimeout(t);
  }, [toast, onClose, duration]);

return (
<AnimatePresence>
{toast && (
<motion.div
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
className="fixed top-4 right-4 z-50"
>
<div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg ${bgClasses[toast.type]}`}>
{icons[toast.type]}
<p className="text-sm text-[var(--text-primary)]">{toast.message}</p>
<button onClick={onClose} className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
<X size={16} />
</button>
</div>
</motion.div>
)}
</AnimatePresence>
);
}
