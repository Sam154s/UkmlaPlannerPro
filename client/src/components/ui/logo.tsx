export function Logo({ className }: { className?: string }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 48 48"
        className={`w-8 h-8 text-white ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Main vertical trunk */}
        <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="1.5" />

        {/* Left branches */}
        <line x1="24" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="16" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="16" x2="8" y2="20" stroke="currentColor" strokeWidth="1.5" />

        {/* Right branches */}
        <line x1="24" y1="16" x2="36" y2="16" stroke="currentColor" strokeWidth="1.5" />
        <line x1="36" y1="16" x2="40" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="36" y1="16" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />

        {/* Left lower branches */}
        <line x1="24" y1="32" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="32" x2="8" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="32" x2="8" y2="36" stroke="currentColor" strokeWidth="1.5" />

        {/* Right lower branches */}
        <line x1="24" y1="32" x2="36" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="36" y1="32" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="36" y1="32" x2="40" y2="36" stroke="currentColor" strokeWidth="1.5" />

        {/* Central connection points */}
        <circle cx="24" cy="8" r="2" fill="currentColor" />
        <circle cx="24" cy="16" r="2" fill="currentColor" />
        <circle cx="24" cy="32" r="2" fill="currentColor" />
        <circle cx="24" cy="40" r="2" fill="currentColor" />

        {/* Left branch points */}
        <circle cx="12" cy="16" r="2" fill="currentColor" />
        <circle cx="12" cy="32" r="2" fill="currentColor" />

        {/* Right branch points */}
        <circle cx="36" cy="16" r="2" fill="currentColor" />
        <circle cx="36" cy="32" r="2" fill="currentColor" />

        {/* Left endpoints */}
        <circle cx="8" cy="12" r="2" fill="currentColor" />
        <circle cx="8" cy="20" r="2" fill="currentColor" />
        <circle cx="8" cy="28" r="2" fill="currentColor" />
        <circle cx="8" cy="36" r="2" fill="currentColor" />

        {/* Right endpoints */}
        <circle cx="40" cy="12" r="2" fill="currentColor" />
        <circle cx="40" cy="20" r="2" fill="currentColor" />
        <circle cx="40" cy="28" r="2" fill="currentColor" />
        <circle cx="40" cy="36" r="2" fill="currentColor" />
      </svg>
      <div className="absolute -inset-1 blur-sm bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}