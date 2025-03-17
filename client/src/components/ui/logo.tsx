export function Logo({ className }: { className?: string }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 48 48"
        className={`w-8 h-8 text-white ${className}`}
      >
        <g stroke="currentColor" strokeWidth="0.75" fill="none">
          {/* Center to top branches */}
          <line x1="24" y1="24" x2="24" y2="8" />
          <line x1="24" y1="8" x2="20" y2="4" />
          <line x1="24" y1="8" x2="28" y2="4" />

          {/* Center to bottom branches */}
          <line x1="24" y1="24" x2="24" y2="40" />
          <line x1="24" y1="40" x2="20" y2="44" />
          <line x1="24" y1="40" x2="28" y2="44" />

          {/* Center to left branches */}
          <line x1="24" y1="24" x2="8" y2="24" />
          <line x1="8" y1="24" x2="4" y2="20" />
          <line x1="8" y1="24" x2="4" y2="28" />

          {/* Center to right branches */}
          <line x1="24" y1="24" x2="40" y2="24" />
          <line x1="40" y1="24" x2="44" y2="20" />
          <line x1="40" y1="24" x2="44" y2="28" />

          {/* Diagonal branches top-left */}
          <line x1="24" y1="24" x2="16" y2="16" />
          <line x1="16" y1="16" x2="12" y2="16" />
          <line x1="16" y1="16" x2="16" y2="12" />

          {/* Diagonal branches top-right */}
          <line x1="24" y1="24" x2="32" y2="16" />
          <line x1="32" y1="16" x2="32" y2="12" />
          <line x1="32" y1="16" x2="36" y2="16" />

          {/* Diagonal branches bottom-left */}
          <line x1="24" y1="24" x2="16" y2="32" />
          <line x1="16" y1="32" x2="16" y2="36" />
          <line x1="16" y1="32" x2="12" y2="32" />

          {/* Diagonal branches bottom-right */}
          <line x1="24" y1="24" x2="32" y2="32" />
          <line x1="32" y1="32" x2="32" y2="36" />
          <line x1="32" y1="32" x2="36" y2="32" />

          {/* Connection dots */}
          <circle cx="24" cy="24" r="1" fill="currentColor" />

          {/* Main branch points */}
          <circle cx="24" cy="8" r="0.75" fill="currentColor" />
          <circle cx="24" cy="40" r="0.75" fill="currentColor" />
          <circle cx="8" cy="24" r="0.75" fill="currentColor" />
          <circle cx="40" cy="24" r="0.75" fill="currentColor" />
          <circle cx="16" cy="16" r="0.75" fill="currentColor" />
          <circle cx="32" cy="16" r="0.75" fill="currentColor" />
          <circle cx="16" cy="32" r="0.75" fill="currentColor" />
          <circle cx="32" cy="32" r="0.75" fill="currentColor" />

          {/* End points */}
          <circle cx="20" cy="4" r="0.5" fill="currentColor" />
          <circle cx="28" cy="4" r="0.5" fill="currentColor" />
          <circle cx="20" cy="44" r="0.5" fill="currentColor" />
          <circle cx="28" cy="44" r="0.5" fill="currentColor" />
          <circle cx="4" cy="20" r="0.5" fill="currentColor" />
          <circle cx="4" cy="28" r="0.5" fill="currentColor" />
          <circle cx="44" cy="20" r="0.5" fill="currentColor" />
          <circle cx="44" cy="28" r="0.5" fill="currentColor" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          <circle cx="16" cy="12" r="0.5" fill="currentColor" />
          <circle cx="32" cy="12" r="0.5" fill="currentColor" />
          <circle cx="36" cy="16" r="0.5" fill="currentColor" />
          <circle cx="12" cy="32" r="0.5" fill="currentColor" />
          <circle cx="16" cy="36" r="0.5" fill="currentColor" />
          <circle cx="32" cy="36" r="0.5" fill="currentColor" />
          <circle cx="36" cy="32" r="0.5" fill="currentColor" />
        </g>
      </svg>
      <div className="absolute -inset-1 blur-sm bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}