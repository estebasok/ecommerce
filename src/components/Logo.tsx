export function MoonMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="var(--color-tomato)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <circle cx="27" cy="14" r="12" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <circle cx="11" cy="27" r="2" fill="var(--color-ink)" />
      <circle cx="17" cy="31" r="1.3" fill="var(--color-ink)" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <MoonMark className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[-25deg]" />
      <span className="font-display text-2xl font-extrabold leading-none tracking-tight">
        moonsoda<span className="text-tomato">.</span>
      </span>
    </span>
  )
}
