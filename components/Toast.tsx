"use client";

import { useEffect } from "react";
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
success: <CheckCircle2 size={18} className="text-green-500" />,
error: <XCircle size={18} className="text-red-500" />,
warning: <AlertTriangle size={18} className="text-yellow-500" />,
info: <Info size={18} className="text-blue-500" />,
};

const bgClasses: Record<ToastType, string> = {
success: "border-green-200 bg-green-50",
error: "border-red-200 bg-red-50",
warning: "border-yellow-200 bg-yellow-50",
info: "border-blue-200 bg-blue-50",
};

export default function Toast({ toast, onClose, duration = 4000 }: Props) {
useEffect(() => {
if (!toast) return;
const t = setTimeout(onClose, duration);
return () => clearTimeout(t);
}, [toast, onClose, duration]);

if (!toast) return null;

return (
<div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in">
<div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg ${bgClasses[toast.type]}`}>
{icons[toast.type]}
<p className="text-sm text-gray-800">{toast.message}</p>
<button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
<X size={16} />
</button>
</div>
</div>
);
}
