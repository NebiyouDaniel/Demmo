import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "../store/AppContext";

export default function Header({
  title,
  onBack,
  right,
  dark,
  plain,
  gray,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  dark?: boolean;
  /** when true, hide back arrow */
  plain?: boolean;
  /** match the light-gray flow background instead of a white app bar */
  gray?: boolean;
}) {
  const { back } = useApp();
  return (
    <div
      className={`sticky top-0 z-30 flex h-[50px] shrink-0 items-center gap-1 px-2 ${
        dark ? "bg-transparent text-white" : gray ? "bg-[#f2f2f2] text-ink" : "bg-white text-ink"
      }`}
    >
      <div className="flex h-11 w-10 shrink-0 items-center justify-center">
        {!plain && (
          <button
            onClick={onBack ?? back}
            aria-label="Back"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-soft"
            }`}
          >
            <ArrowLeft size={22} strokeWidth={2.1} />
          </button>
        )}
      </div>
      <h1 className="min-w-0 flex-1 truncate text-[18px] font-bold tracking-tight">
        {title}
      </h1>
      <div className="flex h-11 min-w-[40px] items-center justify-end pr-1">{right}</div>
    </div>
  );
}
