import { GitBranchPlus } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className="relative">
      <GitBranchPlus 
        className={`w-8 h-8 text-white animate-pulse ${className}`}
        strokeWidth={1.5}
      />
      <div className="absolute -inset-1 blur-sm bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}
