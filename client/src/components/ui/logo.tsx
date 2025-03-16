export function Logo({ className }: { className?: string }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        className={`w-8 h-8 text-white ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Vertical central line */}
        <line
          x1="12"
          y1="6"
          x2="12"
          y2="18"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* Left branch */}
        <line
          x1="12"
          y1="9"
          x2="6"
          y2="9"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* Right branch */}
        <line
          x1="12"
          y1="15"
          x2="18"
          y2="15"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* Connection points */}
        <circle cx="12" cy="6" r="2.5" fill="currentColor" />
        <circle cx="12" cy="9" r="2.5" fill="currentColor" />
        <circle cx="12" cy="15" r="2.5" fill="currentColor" />
        <circle cx="12" cy="18" r="2.5" fill="currentColor" />
        <circle cx="6" cy="9" r="2.5" fill="currentColor" />
        <circle cx="18" cy="15" r="2.5" fill="currentColor" />
      </svg>
      <div className="absolute -inset-1 blur-sm bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}