export function Logo({ className }: { className?: string }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 48 48"
        className={`w-8 h-8 text-white ${className}`}
      >
        {/* Central vertical paths */}
        <path
          d="M24 4 L24 44"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />

        {/* Upper symmetric branches */}
        <path
          d="M24 16 C24 16, 32 12, 40 16 M24 16 C24 16, 16 12, 8 16"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />

        {/* Middle symmetric branches */}
        <path
          d="M24 24 C24 24, 32 28, 40 24 M24 24 C24 24, 16 28, 8 24"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />

        {/* Lower symmetric branches */}
        <path
          d="M24 32 C24 32, 32 36, 40 32 M24 32 C24 32, 16 36, 8 32"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <div className="absolute -inset-1 blur-sm bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}