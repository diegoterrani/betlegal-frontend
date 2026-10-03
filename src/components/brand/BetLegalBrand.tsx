// Componentes de marca do Bet Legal (bet-legal-brand-kit v1 — Direção 1 "Tesoura barrada").
import logoDark from "../../assets/brand/bet-legal-logo-dark.svg";
import logoLight from "../../assets/brand/bet-legal-logo-light.svg";
import logoDarkCompact from "../../assets/brand/bet-legal-logo-dark-compact.svg";
import logoLightCompact from "../../assets/brand/bet-legal-logo-light-compact.svg";
import symbolDark from "../../assets/brand/bet-legal-symbol-dark.svg";
import symbolLight from "../../assets/brand/bet-legal-symbol-light.svg";
import { SkullBan, BanIcon } from "./SkullBan";

type Theme = "dark" | "light";

/** full = com descritor (hero) · compact = sem descritor (header) · symbol = só o símbolo */
export function BetLegalLogo({ theme = "dark", variant = "full", className = "h-24 w-auto" }:
  { theme?: Theme; variant?: "full" | "compact" | "symbol"; className?: string }) {
  const src = {
    full: theme === "dark" ? logoDark : logoLight,
    compact: theme === "dark" ? logoDarkCompact : logoLightCompact,
    symbol: theme === "dark" ? symbolDark : symbolLight,
  }[variant];
  return <img src={src} alt="Bet Legal — observatório contra o mercado ilegal de apostas" className={className} />;
}

/** Marca d'água discreta para gráficos e cards de dados (símbolo em baixa opacidade). */
export function BrandWatermark({ theme = "dark", className = "h-5 w-auto opacity-[0.12]" }: { theme?: Theme; className?: string }) {
  const src = theme === "dark" ? symbolDark : symbolLight;
  return <img src={src} alt="" aria-hidden="true" className={className} />;
}

/** Badge para domínios não autorizados no Radar */
export function PirateBadge({ domain }: { domain: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-1 pr-2.5 font-mono text-xs"
      style={{ borderColor: 'color-mix(in srgb, var(--status-bloqueada) 50%, transparent)', backgroundColor: 'color-mix(in srgb, var(--status-bloqueada) 10%, transparent)', color: 'var(--status-bloqueada)' }}
    >
      <SkullBan size={18} /> {domain} · pirata
    </span>
  );
}

/** Status de site derrubado (hoje: "ficou fora do ar") */
export function TakedownBadge({ label = "Derrubado" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>
      <BanIcon size={14} filled /> {label}
    </span>
  );
}

/** CTA fixo — substitui "Reporte o site" */
export function ReportPirateButton({ href = "/contestar" }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-bold transition-colors"
      style={{ backgroundColor: 'var(--status-nao-autorizada)', color: '#FFFFFF' }}
    >
      <BanIcon size={16} /> Denunciar site pirata
    </a>
  );
}
