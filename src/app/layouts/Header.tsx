export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs" style={{ fontFamily: 'var(--font-display)' }}>
          M
        </div>
        <span className="text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Mappa</span>
      </div>
    </header>
  );
}
