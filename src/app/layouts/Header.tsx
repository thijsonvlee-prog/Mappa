export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground font-bold text-lg" style={{ fontFamily: 'var(--font-serif)' }}>
          M
        </div>
        <span className="text-base font-semibold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>Mappa</span>
      </div>
    </header>
  );
}
