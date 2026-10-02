// Selo "site pirata": caveira barrada. Usa currentColor para a caveira.
type Props = { size?: number; className?: string; banColor?: string; title?: string };
export function SkullBan({ size = 20, className, banColor = "var(--status-nao-autorizada, #f87171)", title = "Site pirata" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label={title}>
      <g transform="translate(32 32) scale(.68) translate(-32 -30)">
        <g stroke="currentColor" strokeWidth={6.5} strokeLinecap="round">
          <line x1="12" y1="42" x2="52" y2="62" /><line x1="12" y1="62" x2="52" y2="42" />
        </g>
        <path fill="currentColor" fillRule="evenodd"
          d="M32 6 C19 6 12 16 12 26 C12 33 16 38 21 40 V47 H43 V40 C48 38 52 33 52 26 C52 16 45 6 32 6 Z M17.5 27 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0 Z M33.5 27 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0 Z M32 33 L29 40 H35 Z" />
      </g>
      <circle cx="32" cy="32" r="27" fill="none" stroke={banColor} strokeWidth={5} />
      <line x1="13" y1="13" x2="51" y2="51" stroke={banColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

// Sinal de proibição. filled=true para sites derrubados (takedown).
export function BanIcon({ size = 16, filled = false, className }: { size?: number; filled?: boolean; className?: string }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="currentColor" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="var(--color-bg, #0c0c0d)" strokeWidth={6} />
      <line x1="18.6" y1="18.6" x2="45.4" y2="45.4" stroke="var(--color-bg, #0c0c0d)" strokeWidth={6} strokeLinecap="round" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth={6} />
      <line x1="13.6" y1="13.6" x2="50.4" y2="50.4" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
}
