import { Delete, X } from "lucide-react";

/**
 * PIN entry shown when money is sent. The reference app presents this as a
 * floating card over the payment page, with the amount and a six-box PIN row,
 * plus a separate keypad panel docked to the bottom.
 */
export default function SendPinSheet({
  amount,
  pin,
  onChange,
  onClose,
  onSubmit,
}: {
  amount: number;
  pin: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (value?: string) => void;
}) {
  const press = (value: string) => {
    if (pin.length < 6) {
      const next = `${pin}${value}`;
      onChange(next);
      if (next.length === 6) window.setTimeout(() => onSubmit(next), 120);
    }
  };

  return (
    <div className="fixed inset-0 z-[85] flex flex-col">
      <button
        aria-label="Close PIN entry"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      {/* Floating PIN card */}
      <div className="relative mx-auto mt-[clamp(150px,28vh,240px)] w-[86%] max-w-[340px] rounded-[16px] bg-[#e9eeee] px-4 pb-5 pt-3 shadow-[0_18px_45px_rgb(0_0_0/0.28)]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center text-[#5f6b6a]"
        >
          <X size={20} strokeWidth={1.7} />
        </button>

        <div className="mt-6 text-center">
          <p className="text-[16px] font-semibold text-[#3f3f3f]">Enter PIN</p>
          <p className="mt-2 text-[28px] font-bold leading-none text-[#333]">
            {amount.toFixed(2)}{" "}
            <span className="text-[13px] font-semibold">ETB</span>
          </p>
        </div>

        <div className="mt-4 flex justify-center gap-[7px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="flex h-[42px] w-[40px] items-center justify-center rounded-[8px] bg-[#d9e0e2]"
            >
              {index < pin.length && (
                <span className="h-[8px] w-[8px] rounded-full bg-[#3f3f3f]" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Keypad dock */}
      <div className="relative mt-auto bg-[#e9eeee] pb-[max(env(safe-area-inset-bottom),10px)] pt-2 shadow-[0_-8px_24px_rgb(0_0_0/0.08)]">
        <div className="grid grid-cols-3 px-4 text-center">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((value) => (
            <button
              key={value}
              onClick={() => press(value)}
              className="flex h-[clamp(52px,7.8vh,66px)] items-center justify-center text-[30px] font-medium text-[#3b3b3b]"
            >
              {value}
            </button>
          ))}
          <span />
          <button
            onClick={() => press("0")}
            className="flex h-[clamp(52px,7.8vh,66px)] items-center justify-center text-[30px] font-medium text-[#3b3b3b]"
          >
            0
          </button>
          <button
            onClick={() => onChange(pin.slice(0, -1))}
            aria-label="Delete PIN digit"
            className="flex h-[clamp(52px,7.8vh,66px)] items-center justify-center text-[#3b3b3b]"
          >
            <Delete size={30} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
