import { Check } from "lucide-react";

/* ── Hand-drawn service marks used across the home screen ────────── */

const LIME = "#8CC63F";

export function SendMoneyGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 2.8v9.4M12.4 6.3 16 2.7l3.6 3.6"
        stroke={LIME}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.6 13.2v9.2a3 3 0 0 0 3 3h14.8a3 3 0 0 0 3-3v-9.2a3 3 0 0 0-3-3H8.6a3 3 0 0 0-3 3Z"
        stroke={LIME}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M24 16.5h3.4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H24a2.5 2.5 0 0 1 0-5Z" stroke={LIME} strokeWidth="2" />
    </svg>
  );
}

export function CashInOutGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M6 13.5v8.9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8.9a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3Z"
        stroke={LIME}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M23.5 16.8H26a1 1 0 0 1 1 1v2.7a1 1 0 0 1-1 1h-2.5a2.35 2.35 0 0 1 0-4.7Z" stroke={LIME} strokeWidth="2" />
      <circle cx="22.5" cy="8" r="4.6" fill="#fff" stroke={LIME} strokeWidth="1.8" />
      <path d="M22.5 5.8v4.4M20.3 8h4.4" stroke={LIME} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function AirtimeGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5.5 13h21v12.2a2.3 2.3 0 0 1-2.3 2.3H7.8a2.3 2.3 0 0 1-2.3-2.3V13Z" stroke={LIME} strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 9.2h24V13H4z" stroke={LIME} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 9.2v18.3" stroke={LIME} strokeWidth="2" />
      <path d="M16 9.2c-1.2-5.6-7.6-5.4-7.6-1.3 0 2.2 3.4 1.3 7.6 1.3Z" stroke={LIME} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 9.2c1.2-5.6 7.6-5.4 7.6-1.3 0 2.2-3.4 1.3-7.6 1.3Z" stroke={LIME} strokeWidth="2" strokeLinejoin="round" />
      <path d="M8.4 5.2v-2M12 3.9 11.2 2M22.3 4.2 23.1 2.4M26 6.1l1.9-1" stroke={LIME} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ZemenLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19.4" fill="#073D2E" />
      <g stroke="#CBE36B" strokeWidth="1.1" strokeLinecap="round">
        <path d="M20 5.4v2.2M24.6 6.6l-.8 2M28.3 9.5l-1.6 1.5M30.3 13.9l-2 .8M29.8 18.7l-2.2-.2M27.5 22.9l-1.7-1.3" />
      </g>
      <text x="20" y="24.4" textAnchor="middle" fontSize="8.6" fontWeight="800" fill="#fff" fontStyle="italic" fontFamily="Arial, sans-serif">
        Zemen
      </text>
      <text x="20" y="29.4" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#F3C84B" letterSpacing="0.5" fontFamily="Arial, sans-serif">
        GEBEYA
      </text>
      <text x="30.8" y="11.4" textAnchor="middle" fontSize="4.4" fontWeight="700" fill="#F3C84B" fontFamily="Arial, sans-serif">
        4001
      </text>
    </svg>
  );
}

export function DashenLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="3" width="38" height="34" rx="4" fill="#173A7C" />
      <path d="M10 20.5 20 13l10 7.5V29H10V20.5Z" fill="#fff" opacity=".95" />
      <path d="M13.5 29v-6.5M18 29v-6.5M22 29v-6.5M26.5 29v-6.5" stroke="#173A7C" strokeWidth="1.5" />
      <text x="20" y="34" textAnchor="middle" fontSize="3.4" fontWeight="700" fill="#F8D45C" fontFamily="Arial, sans-serif">
        Dashen Bank
      </text>
    </svg>
  );
}

export function CBELogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id="cbe-gold" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#FFF2B0" />
          <stop offset="48%" stopColor="#E8B848" />
          <stop offset="100%" stopColor="#B97B16" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18.6" fill="url(#cbe-gold)" />
      <circle cx="20" cy="20" r="14.8" fill="none" stroke="#FFF8D8" strokeWidth="1.1" opacity=".85" />
      <g fill="#7B4A04">
        <text x="20" y="21.4" textAnchor="middle" fontSize="7.2" fontWeight="800" fontFamily="Arial, sans-serif">
          CBE
        </text>
        <text x="20" y="26.3" textAnchor="middle" fontSize="2.7" fontWeight="700" letterSpacing=".3" fontFamily="Arial, sans-serif">
          COMMERCIAL BANK
        </text>
        <text x="20" y="13.2" textAnchor="middle" fontSize="3" fontWeight="700" fontFamily="Arial, sans-serif">
          ኢትዮጵያ
        </text>
      </g>
      <path d="M9 15c2-3 5-5 9-5.7" stroke="#FFF8D8" strokeWidth="1.2" fill="none" opacity=".8" />
    </svg>
  );
}

export function SiinqeeLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <text x="20" y="19" textAnchor="middle" fontSize="10" fontWeight="800" fill="#83B33D" fontStyle="italic" fontFamily="Arial, sans-serif">
        Siinqee
      </text>
      <path d="M6 24.5c8.5 4.2 19 4 28-1.2" stroke="#83B33D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <text x="20" y="30.4" textAnchor="middle" fontSize="3.1" fontWeight="700" fill="#83B33D" letterSpacing=".4" fontFamily="Arial, sans-serif">
        WOMEN&apos;S BANK
      </text>
    </svg>
  );
}

export function BankGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M3.5 12.2 16 3.8l12.5 8.4v2.4H3.5v-2.4Z" fill={LIME} />
      <path d="M6.3 16.2h4v8h-4zM13.4 16.2h4v8h-4zM20.6 16.2h4v8h-4z" fill={LIME} />
      <path d="M4.2 26.4h23.6v3.1H4.2z" fill={LIME} />
    </svg>
  );
}

export function AwashLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18.6" fill="#fff" stroke="#E8E8E8" strokeWidth=".8" />
      <path d="M3.8 21.3c4.6-8.4 14-11.6 22.2-8.6 3.2 1.2 5.8 3.2 7.6 5.8-5.2 3.5-10.1 3.7-15 1.2-5.3-2.7-10-2.5-14.8 1.6Z" fill="#F2A61B" />
      <path d="M3.8 21.3c4.5-2 8.5-2.2 12.3-.6 5.2 2.2 10 1.7 14.4-1.5 1 4-1 8-4.6 10.3-5.6 3.6-13 2.6-17.4-2.2-2.1-2.3-3.3-4.3-4.7-6Z" fill="#1E62A6" />
      <path d="M12.4 9.2c4.4-2.4 9.4-2.3 13.6-.3" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".9" />
      <path d="M6.4 24.2c3.4 6.6 11 9.5 17.7 6.6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".85" />
    </svg>
  );
}

export function MerchantGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5.5 13.5v10a2.6 2.6 0 0 0 2.6 2.6h15.8a2.6 2.6 0 0 0 2.6-2.6v-10" stroke={LIME} strokeWidth="2" />
      <path d="M3.8 13.3 6.2 6.5A2 2 0 0 1 8.1 5h15.8a2 2 0 0 1 1.9 1.5l2.4 6.8" stroke={LIME} strokeWidth="2" strokeLinejoin="round" />
      <path d="M3.8 13.3c0 2 1.6 3.6 3.6 3.6s3.6-1.6 3.6-3.6c0 2 1.6 3.6 3.6 3.6s3.6-1.6 3.6-3.6c0 2 1.6 3.6 3.6 3.6s3.6-1.6 3.6-3.6c0 2 1.6 3.6 3.6 3.6" stroke={LIME} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 16.8v9.3" stroke={LIME} strokeWidth="2" />
    </svg>
  );
}

export function TeleEvLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <text x="16" y="25" textAnchor="middle" fontSize="21" fontWeight="800" fill="#6FA82C" fontStyle="italic" fontFamily="Arial, sans-serif">
        th
      </text>
      <path d="M29 8 24.5 17h3.6l-2 6 6.4-9h-3.9L31 8h-2Z" fill="#8CC63F" />
      <text x="22" y="33" textAnchor="middle" fontSize="4.3" fontWeight="700" fill="#6FA82C" letterSpacing=".5" fontFamily="Arial, sans-serif">
        teleEV
      </text>
    </svg>
  );
}

export function ToloLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <text x="20" y="19.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#F2A61B" fontFamily="Arial, sans-serif">
        TOLO
      </text>
      <text x="20" y="25" textAnchor="middle" fontSize="7" fontWeight="900" fill="#2A6DB0" fontFamily="Arial, sans-serif">
        TOLO
      </text>
      <text x="20" y="30.5" textAnchor="middle" fontSize="3.2" fontWeight="700" fill="#6C7A89" letterSpacing=".8" fontFamily="Arial, sans-serif">
        PAYMENT
      </text>
    </svg>
  );
}

export function AaTrafficLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#fff" stroke="#2A6DB0" strokeWidth="1.6" />
      <text x="20" y="24" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2A6DB0" fontStyle="italic" fontFamily="Georgia, serif">
        AA
      </text>
      <path d="M8 14c7-4 17-4 24 0" stroke="#2A6DB0" strokeWidth="1" fill="none" opacity=".45" />
      <text x="20" y="32" textAnchor="middle" fontSize="2.6" fontWeight="700" fill="#2A6DB0" fontFamily="Arial, sans-serif">
        TRAFFIC
      </text>
    </svg>
  );
}

export function AatmaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#fff" stroke="#2A6DB0" strokeWidth="1.6" />
      <text x="20" y="21.5" textAnchor="middle" fontSize="7" fontWeight="800" fill="#2A6DB0" fontFamily="Arial, sans-serif">
        AATMA
      </text>
      <path d="M10 25.5h20" stroke="#2A6DB0" strokeWidth="1" />
      <text x="20" y="30.2" textAnchor="middle" fontSize="3" fontWeight="700" fill="#2A6DB0" letterSpacing=".4" fontFamily="Arial, sans-serif">
        PARKING
      </text>
      <path d="M8 13.5c8-3.8 16-3.8 24 0" stroke="#2A6DB0" strokeWidth="1" fill="none" opacity=".45" />
    </svg>
  );
}

export function TeleDeviceLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <text x="15" y="25" textAnchor="middle" fontSize="20" fontWeight="800" fill="#6FA82C" fontStyle="italic" fontFamily="Arial, sans-serif">
        th
      </text>
      <rect x="25" y="10" width="9" height="16" rx="2.2" fill="#fff" stroke="#8CC63F" strokeWidth="1.8" />
      <path d="M28.4 23.4h2.2" stroke="#8CC63F" strokeWidth="1.4" strokeLinecap="round" />
      <text x="20" y="33" textAnchor="middle" fontSize="4" fontWeight="700" fill="#6FA82C" letterSpacing=".3" fontFamily="Arial, sans-serif">
        teleDevice
      </text>
    </svg>
  );
}

export function MoreGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12.6" stroke={LIME} strokeWidth="2" />
      <path d="M16 10.2v11.6M10.2 16h11.6" stroke={LIME} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Bottom-nav marks ────────────────────────────────────────────── */

export function PaymentNavGlyph({ size = 25, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="2.6" y="7" width="19" height="13.4" rx="2.3" stroke={color} strokeWidth="1.7" />
      <path d="M2.6 11.2h19" stroke={color} strokeWidth="1.7" />
      <circle cx="20.9" cy="19.4" r="5.2" fill={LIME} stroke={color} strokeWidth="1.7" />
      <path d="m18.7 19.4 1.6 1.6 2.7-3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AppsNavGlyph({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {[
        [3.1, 3.1],
        [13.1, 3.1],
        [3.1, 13.1],
        [13.1, 13.1],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="7.8" height="7.8" rx="1.3" stroke={color} strokeWidth="1.7" />
      ))}
    </svg>
  );
}

export function EngageNavGlyph({ size = 25, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M22.4 12.1c0 5-4.4 9-9.9 9-1.2 0-2.4-.2-3.5-.6l-4.8 1.5 1.6-4A8.6 8.6 0 0 1 2.6 12c0-5 4.4-9 9.9-9s9.9 4 9.9 9Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="8.3" cy="12.1" r="1.05" fill={color} />
      <circle cx="12.5" cy="12.1" r="1.05" fill={color} />
      <circle cx="16.7" cy="12.1" r="1.05" fill={color} />
    </svg>
  );
}

export function AccountNavGlyph({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.1" r="4" stroke={color} strokeWidth="1.7" />
      <path d="M4.2 20.3c.7-4 3.8-6.2 7.8-6.2s7.1 2.2 7.8 6.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function HomeNavGlyph({ size = 25, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.4 10.3 12 3.2l8.6 7.1V20a1 1 0 0 1-1 1h-5v-6.3H9.4V21h-5a1 1 0 0 1-1-1v-9.7Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

/** white viewfinder + QR pattern for the Scan QR action */
export function ScanQrGlyph({ size = 23, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.2 8.6V6.3a3.1 3.1 0 0 1 3.1-3.1h2.3M15.4 3.2h2.3a3.1 3.1 0 0 1 3.1 3.1v2.3M20.8 15.4v2.3a3.1 3.1 0 0 1-3.1 3.1h-2.3M8.6 20.8H6.3a3.1 3.1 0 0 1-3.1-3.1v-2.3"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <rect x="7.4" y="7.4" width="3" height="3" rx="0.5" fill={color} />
      <rect x="13.6" y="7.4" width="3" height="3" rx="0.5" fill={color} />
      <rect x="7.4" y="13.6" width="3" height="3" rx="0.5" fill={color} />
      <path d="M13.7 13.7h2.9v2.9h-2.9z" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

/** filled pin used by the floating Account badge */
export function LocationPinGlyph({ size = 23, color = LIME }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.4c-4.28 0-7.74 3.46-7.74 7.74 0 5.45 6.9 11.12 7.2 11.36a.86.86 0 0 0 1.08 0c.3-.24 7.2-5.91 7.2-11.36 0-4.28-3.46-7.74-7.74-7.74Z"
        fill={color}
      />
      <circle cx="12" cy="10" r="2.68" fill="#fff" />
    </svg>
  );
}

export function ContactBookGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke={LIME} strokeWidth="1.7" />
      <path d="M8.4 3v18M3.6 7.4H6M3.6 12H6M3.6 16.6H6" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12.8" cy="10" r="2.2" stroke={LIME} strokeWidth="1.5" />
      <path d="M9.8 16.5c.4-2 1.5-3 3-3s2.6 1 3 3" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ScanFrameGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.6 3.4H5.2A1.8 1.8 0 0 0 3.4 5.2v3.4M15.4 3.4h3.4a1.8 1.8 0 0 1 1.8 1.8v3.4M8.6 20.6H5.2a1.8 1.8 0 0 1-1.8-1.8v-3.4M15.4 20.6h3.4a1.8 1.8 0 0 0 1.8-1.8v-3.4" stroke={LIME} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7.6 9h3.1M7.6 12h2.1M7.6 15h3.1M13.3 9h3.1M13.3 12h3.1M13.3 15h3.1" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckTick({ size = 14, color = "#8CC63F" }: { size?: number; color?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full"
      style={{ width: size + 4, height: size + 4, background: color, color: "#fff" }}
    >
      <Check size={size} strokeWidth={3} />
    </span>
  );
}
