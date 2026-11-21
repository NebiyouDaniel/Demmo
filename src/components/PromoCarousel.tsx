import { useEffect, useRef, useState } from "react";

const PROMOS = [
  { src: "/promo-fayda.png", alt: "Link your telebirr with Fayda" },
  { src: "/promo-zemen.png", alt: "Zemen Gebeya digital shopping" },
];

function Dots({ active, onPick, small }: { active: number; onPick?: (i: number) => void; small?: boolean }) {
  return (
    <div className={`flex justify-center ${small ? "gap-1.5" : "gap-2"} mt-1.5`}>
      {PROMOS.map((_, d) => (
        <button
          key={d}
          onClick={() => onPick?.(d)}
          aria-label={`Promo ${d + 1}`}
          className={`rounded-full transition-all ${
            d === active
              ? "border-[1.5px] border-[#d8eeb6] bg-[#8CC63F]"
              : "border border-[#cfe6ac] bg-white"
          } ${small ? "h-2 w-2" : "h-[9px] w-[9px]"}`}
        />
      ))}
    </div>
  );
}

export default function PromoCarousel({
  compact,
  dotsBelow,
}: {
  /** full-width, slightly shorter promo used inside the send flow */
  compact?: boolean;
  /** contained card + dots, used on the receipt */
  dotsBelow?: boolean;
}) {
  const [i, setI] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (paused.current) return;
      setI((v) => (v + 1) % PROMOS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (compact || dotsBelow) return;
    const el = scroller.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const gap = 12;
    el.scrollTo({ left: i * (first.clientWidth + gap), behavior: "smooth" });
  }, [i, compact, dotsBelow]);

  if (compact || dotsBelow) {
    return (
      <div className="w-full">
        <div className={`relative w-full overflow-hidden rounded-[9px] ${compact ? "aspect-[3.3/1]" : "aspect-[3.4/1]"}`}>
          {PROMOS.map((p, idx) => (
            <img
              key={p.src}
              src={p.src}
              alt={p.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                idx === i % PROMOS.length ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <Dots active={i % PROMOS.length} onPick={setI} small={compact} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={scroller}
        onPointerDown={() => { paused.current = true; }}
        onPointerUp={() => { window.setTimeout(() => { paused.current = false; }, 2500); }}
        onTouchStart={() => { paused.current = true; }}
        onTouchEnd={() => { window.setTimeout(() => { paused.current = false; }, 2500); }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const first = el.children[0] as HTMLElement | undefined;
          if (!first) return;
          const step = first.clientWidth + 12;
          const best = Math.round(el.scrollLeft / step);
          if (best !== i && best >= 0 && best < PROMOS.length) setI(best);
        }}
        className="no-scrollbar flex w-[calc(100%+16px)] snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain"
      >
        {PROMOS.map((p) => (
          <div
            key={p.src}
            className="relative aspect-[3.31/1] w-[calc(100%-50px)] shrink-0 snap-start overflow-hidden rounded-[9px]"
          >
            <img src={p.src} alt={p.alt} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <Dots active={i % PROMOS.length} onPick={setI} />
    </div>
  );
}
