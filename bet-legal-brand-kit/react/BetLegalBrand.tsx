// Componentes de marca do Bet Legal (React + Tailwind).
// Ajuste os caminhos de import para onde os SVGs forem colocados no projeto.
import logoDark from "../logo/bet-legal-logo-dark.svg";
import logoLight from "../logo/bet-legal-logo-light.svg";
import logoDarkCompact from "../logo/bet-legal-logo-dark-compact.svg";
import logoLightCompact from "../logo/bet-legal-logo-light-compact.svg";
import symbolDark from "../logo/bet-legal-symbol-dark.svg";
import symbolLight from "../logo/bet-legal-symbol-light.svg";
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

/** Badge para domínios não autorizados no Radar */
export function PirateBadge({ domain }: { domain: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 py-0.5 pl-1 pr-2.5 font-mono text-xs text-amber-500">
      <SkullBan size={18} /> {domain} · pirata
    </span>
  );
}

/** Status de site derrubado (hoje: "ficou fora do ar") */
export function TakedownBadge({ label = "Derrubado" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-red-400">
      <BanIcon size={14} filled /> {label}
    </span>
  );
}

/** CTA fixo — substitui "Reporte o site" */
export function ReportPirateButton({ href = "/contestar" }: { href?: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-[10px] bg-red-400 px-4 py-2.5 text-sm font-bold text-[#0c0c0d] hover:bg-red-300 transition-colors">
      <BanIcon size={16} /> Denunciar site pirata
    </a>
  );
}
