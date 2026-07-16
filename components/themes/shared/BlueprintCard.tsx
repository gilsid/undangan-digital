import type { ReactNode } from "react";
import { BlueprintCorner, BlueprintCornerOpposite } from "./BlueprintCorner";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function BlueprintCard({ className = "", children }: Props) {
  return (
    <div
      className={`relative bg-[#1a1e27] border border-[rgba(216,185,120,0.18)] rounded-lg p-6 ${className}`}
    >
      <BlueprintCorner />
      <BlueprintCornerOpposite />
      {children}
    </div>
  );
}
