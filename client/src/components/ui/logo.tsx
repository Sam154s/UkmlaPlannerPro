export function Logo({ className }: { className?: string }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 48 48"
        className={`w-8 h-8 text-white ${className}`}
      >
        {/* Central point to all paths */}
        <g stroke="currentColor" strokeWidth="1" fill="none">
          {/* Level 1 - Primary branches */}
          <line x1="24" y1="24" x2="8" y2="14" />
          <line x1="24" y1="24" x2="40" y2="14" />
          <line x1="24" y1="24" x2="8" y2="34" />
          <line x1="24" y1="24" x2="40" y2="34" />

          {/* Level 2 - Secondary branches (top) */}
          <line x1="8" y1="14" x2="4" y2="8" />
          <line x1="8" y1="14" x2="12" y2="8" />
          <line x1="40" y1="14" x2="36" y2="8" />
          <line x1="40" y1="14" x2="44" y2="8" />

          {/* Level 2 - Secondary branches (bottom) */}
          <line x1="8" y1="34" x2="4" y2="40" />
          <line x1="8" y1="34" x2="12" y2="40" />
          <line x1="40" y1="34" x2="36" y2="40" />
          <line x1="40" y1="34" x2="44" y2="40" />
        </g>
      </svg>
      <div className="absolute -inset-1 blur-sm bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}