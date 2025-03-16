import { GitBranchPlus } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        className={`w-8 h-8 text-white ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <line
          x1="12"
          y1="4"
          x2="12"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="12"
          y1="8"
          x2="6"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="12"
          y1="16"
          x2="18"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="4" r="2" fill="currentColor" />
        <circle cx="12" cy="8" r="2" fill="currentColor" />
        <circle cx="12" cy="16" r="2" fill="currentColor" />
        <circle cx="12" cy="20" r="2" fill="currentColor" />
        <circle cx="6" cy="12" r="2" fill="currentColor" />
        <circle cx="18" cy="12" r="2" fill="currentColor" />
      </svg>
      <div className="absolute -inset-1 blur-sm bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}