/**
 * City landmark vector icons — one per destination city.
 * All SVGs are hand-crafted to be clean, minimal, and consistent
 * at any size. Accept standard SVG props + an optional `size` shorthand.
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Tokyo — Torii Gate */
export function ToriiGateIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Top horizontal beam */}
      <path d="M2 5h20" />
      {/* Under-beam */}
      <path d="M4 8h16" />
      {/* Left pillar */}
      <line x1="6" y1="8" x2="6" y2="22" />
      {/* Right pillar */}
      <line x1="18" y1="8" x2="18" y2="22" />
      {/* Top beam ends curve up */}
      <path d="M2 5 Q3 3 4 5" />
      <path d="M22 5 Q21 3 20 5" />
    </svg>
  );
}

/** Paris — Eiffel Tower */
export function EiffelTowerIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Spire */}
      <line x1="12" y1="2" x2="12" y2="6" />
      {/* Upper section */}
      <path d="M10 6 L12 2 L14 6" />
      {/* First platform */}
      <path d="M9 9h6" />
      {/* Mid section */}
      <path d="M9 6 L8 9 M15 6 L16 9" />
      {/* Second platform */}
      <path d="M7 14h10" />
      {/* Lower section */}
      <path d="M8 9 L6 14 M16 9 L18 14" />
      {/* Legs */}
      <path d="M6 14 L4 22 M18 14 L20 22" />
      {/* Base */}
      <path d="M4 22h16" />
      {/* Inner leg detail */}
      <path d="M6 14 L9 22 M18 14 L15 22" />
    </svg>
  );
}

/** New York — Statue of Liberty */
export function StatueOfLibertyIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Torch flame */}
      <path d="M15 3 Q16 1 15 4" />
      {/* Torch handle */}
      <line x1="15" y1="4" x2="15" y2="7" />
      {/* Raised arm */}
      <path d="M12 9 L15 7" />
      {/* Crown */}
      <path d="M9 8 L10 6 L11 8 L12 6 L13 8" />
      {/* Head */}
      <path d="M9 8 Q9 10 11 10 Q13 10 13 8" />
      {/* Body */}
      <path d="M10 10 L9 18 M12 10 L13 18" />
      {/* Robe folds */}
      <path d="M9 14 L13 14" />
      {/* Left arm (holding tablet) */}
      <path d="M10 12 L7 14 L7 16" />
      {/* Tablet */}
      <rect x="6" y="14" width="3" height="4" rx="0.5" />
      {/* Base/pedestal */}
      <path d="M7 18 L5 22 M13 18 L15 22" />
      <path d="M5 22h10" />
    </svg>
  );
}

/** Dubai — Burj Khalifa */
export function BurjKhalifaIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Spire */}
      <line x1="12" y1="2" x2="12" y2="7" />
      {/* Tier 1 — narrow top */}
      <path d="M11 7h2v3h-2z" />
      {/* Tier 2 — slightly wider */}
      <path d="M10 10h4v3h-4z" />
      {/* Tier 3 */}
      <path d="M9 13h6v3H9z" />
      {/* Tier 4 — base tower */}
      <path d="M8 16h8v4H8z" />
      {/* Ground level */}
      <path d="M6 22h12" />
      {/* Wings at base */}
      <path d="M6 20 L8 16 M18 20 L16 16" />
      {/* Setback steps */}
      <path d="M5 20h3 M16 20h3" />
    </svg>
  );
}

/** Bangkok — Wat Phra Kaew / Temple spire */
export function TempleSpireIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Central spire */}
      <path d="M12 2 L10 8 L14 8 Z" />
      {/* Spire stack rings */}
      <path d="M10.5 8h3" />
      <path d="M10 9.5h4" />
      <path d="M9.5 11h5" />
      {/* Main roof */}
      <path d="M7 14 L12 11 L17 14" />
      {/* Eave curl */}
      <path d="M7 14 Q5 14 5 15 M17 14 Q19 14 19 15" />
      {/* Second tier roof */}
      <path d="M5 15 L12 12.5 L19 15" />
      {/* Body */}
      <rect x="8" y="15" width="8" height="5" rx="0.5" />
      {/* Door */}
      <path d="M11 20 L11 17 Q12 16 13 17 L13 20" />
      {/* Base steps */}
      <path d="M6 20h12 M5 21h14 M4 22h16" />
    </svg>
  );
}

/** Rome — Colosseum */
export function ColosseumIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Outer arch top */}
      <path d="M3 12 Q3 4 12 4 Q21 4 21 12" />
      {/* Top tier wall */}
      <path d="M3 12h18" />
      {/* Mid tier wall */}
      <path d="M4 16h16" />
      {/* Bottom */}
      <path d="M3 20h18" />
      {/* Ground */}
      <path d="M2 22h20" />
      {/* Vertical pillars top section */}
      <line x1="7" y1="4" x2="7" y2="12" />
      <line x1="12" y1="4" x2="12" y2="12" />
      <line x1="17" y1="4" x2="17" y2="12" />
      {/* Arches middle section */}
      <path d="M4 16 L4 12 M8 16 Q8 13 10 13 Q12 13 12 16 M12 16 Q12 13 14 13 Q16 13 16 16 M20 16 L20 12" />
      {/* Bottom arches */}
      <path d="M3 20 L3 16 M21 20 L21 16" />
      <path d="M7 20 Q7 17 9 17 Q11 17 11 20" />
      <path d="M13 20 Q13 17 15 17 Q17 17 17 20" />
    </svg>
  );
}
