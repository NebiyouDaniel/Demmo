import { Building2, Sparkles, X } from "lucide-react";
import type { AppNotification } from "../store/AppContext";

/**
 * Device-style Telebirr SMS alert, matching the notification that arrives
 * after a transfer in the reference recording. It is intentionally global so
 * it can appear over the receipt and over Home.
 *
 * The type scale, weights and spacing follow the native notification in the
 * recording rather than the app's own UI type scale.
 */
export default function TransactionNotification({
  notification,
  onClose,
}: {
  notification: AppNotification;
  onClose: () => void;
}) {
  const time = new Date(notification.ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* Keep the "on <date> <time>." tail together, so a line never breaks in the
     middle of the date (e.g. "2026-" / "11-21"). */
  const messageMatch = notification.body.match(
    /^(.*?)(on \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.)$/
  );

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        fontFamily:
          '"Roboto", "Noto Sans Ethiopic", "Segoe UI", system-ui, -apple-system, sans-serif',
      }}
      className="pointer-events-auto w-full max-w-[480px] overflow-hidden rounded-[14px] bg-[#1468EA] text-white shadow-[0_14px_38px_rgb(0_0_0/0.32)]"
    >
      {/* App header */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3.5 py-1.5">
        <span className="min-w-0 truncate font-rounded text-[21px] font-extrabold lowercase leading-6 tracking-[-0.04em]">
          telebirr
        </span>
        <span className="shrink-0 text-[15px] font-normal leading-5 text-white/95">
          SMS · {time}
        </span>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center justify-self-end rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* Inset content panel, like the native Android notification */}
      <div className="mx-[5px] overflow-hidden rounded-[11px] bg-black">
        <div className="px-3 pb-3.5 pt-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#18274E] text-[#A9B5F0]">
              <Building2 size={15} strokeWidth={1.9} />
            </span>
            <p className="min-w-0 flex-1 text-[15.5px] font-medium leading-5 text-white">
              {notification.title}
            </p>
          </div>

          <p className="mt-2.5 text-[18px] font-bold leading-[21px] tracking-[-0.005em] text-white">
            {messageMatch ? (
              <>
                {messageMatch[1]}{" "}
                <span className="whitespace-nowrap">{messageMatch[2]}</span>
              </>
            ) : (
              notification.body
            )}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-[13px] leading-[17px] text-[#8D8D8D]">
            <Sparkles size={15} className="shrink-0 text-[#4D8DFF]" strokeWidth={2.1} />
            <span>AI summary</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#041630] py-[13px] text-[13px] font-normal leading-[18px] text-[#A3BCE8] transition-colors hover:bg-[#072040]"
        >
          Mark as read
        </button>
      </div>

      {/* Blue border below the inset panel */}
      <div className="h-[7px]" />
    </div>
  );
}
