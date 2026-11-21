import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { validETPhone } from "../components/fields";
import LoadingLogo from "../components/LoadingLogo";
import { Btn, EthioTelecomLogo, TelebirrLogo } from "../components/primitives";
import { useApp } from "../store/AppContext";

export const DEMO_PIN = "797970";

export function PinScreen({
  pin,
  onChange,
  onClose,
  onSubmit,
  forgot,
}: {
  pin: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (value?: string) => void;
  forgot: () => void;
}) {
  const press = (value: string) => {
    if (pin.length < 6) {
      const next = `${pin}${value}`;
      onChange(next);
      if (next.length === 6) window.setTimeout(() => onSubmit(next), 120);
    }
  };

  return (
    <div className="h-[var(--vh)] min-h-full overflow-y-auto bg-[#f2f2f2] text-[#3b3b3b] flex flex-col relative">
      <button
        onClick={onClose}
        className="absolute left-7 top-10 flex h-9 w-9 items-center justify-center text-[#626262]"
        aria-label="Close"
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      <div className="pt-[clamp(108px,16.5vh,146px)] text-center px-4">
        <h1 className="text-[22px] font-normal leading-7 tracking-tight text-[#3f3f3f]">Enter PIN</h1>
        <div className="mt-3 flex justify-center gap-[17px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className={`h-[14px] w-[14px] rounded-full border ${
                index < pin.length ? "border-[#8CC63F] bg-[#8CC63F]" : "border-[#d7dbd5]"
              }`}
            />
          ))}
        </div>
        <button onClick={forgot} className="mt-6 text-[13px] font-semibold text-[#3f3f3f]">
          Forgot PIN
        </button>
      </div>

      <div className="mt-auto px-1 pb-[42px] xs:pb-[72px]">
        <div className="grid grid-cols-3 gap-y-8 xs:gap-y-[52px] text-center">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((value) => (
            <button key={value} onClick={() => press(value)} className="text-[27px] xs:text-[30px] font-medium h-10">
              {value}
            </button>
          ))}
          <span />
          <button onClick={() => press("0")} className="text-[27px] xs:text-[30px] font-medium h-10">0</button>
          <button
            onClick={() => onChange(pin.slice(0, -1))}
            className="h-10 flex items-center justify-center text-[#3b3b3b]"
            aria-label="Delete PIN digit"
          >
            <ArrowLeft size={32} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={pin.length !== 6}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

function LoginWatermark() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M-50 590C30 455 185 400 285 470c95 66 75 190-16 226-94 37-183-27-170-105 12-70 110-102 178-60 55 34 64 104 25 144"
        stroke="#CBE6B4"
        strokeWidth="26"
        strokeLinecap="round"
        opacity=".16"
      />
      <path
        d="M-40 660c80-60 160-65 220-20"
        stroke="#DDEFCF"
        strokeWidth="14"
        strokeLinecap="round"
        opacity=".34"
      />
      <g stroke="#D6EAC4" strokeWidth="1" opacity=".16">
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={`a-${i}`} cx="-12" cy="235" r={24 + i * 20} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={`b-${i}`} cx="402" cy="760" r={30 + i * 26} />
        ))}
      </g>
      <circle cx="338" cy="104" r="64" stroke="#DDEFCF" strokeWidth="12" opacity=".2" />
    </svg>
  );
}

export default function Login() {
  const { login, t, lang, setLang } = useApp();
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [langOpen, setLangOpen] = useState(false);
  const [phone, setPhone] = useState("956797970");
  const [pin, setPin] = useState("");
  const [errPhone, setErrPhone] = useState<string | null>(null);
  const [errPin, setErrPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const phoneValid = validETPhone(phone);

  const next = () => {
    if (!phoneValid) {
      setErrPhone(t("err.phone"));
      return;
    }
    setStep("pin");
  };

  const submitPin = (value = pin) => {
    if (value.length !== 6) {
      setErrPin(t("err.pin"));
      return;
    }
    if (value !== DEMO_PIN) {
      setErrPin(t("err.pinWrong"));
      setPin("");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      login(`+251 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`);
    }, 1500);
  };

  if (step === "pin") {
    return (
      <>
        <PinScreen
          pin={pin}
          onChange={(value) => { setPin(value); setErrPin(null); }}
          onClose={() => { setPin(""); setStep("phone"); }}
          onSubmit={submitPin}
          forgot={() => undefined}
        />
        {loading && <LoadingLogo />}
      </>
    );
  }

  return (
    <div className="login-watermark relative flex min-h-[var(--vh)] flex-col overflow-y-auto bg-[#F5FBEF]">
      <LoginWatermark />

      <div className="relative flex h-[56px] shrink-0 items-center justify-between overflow-hidden bg-white px-4">
        <EthioTelecomLogo scale={1} />
        <TelebirrLogo scale={1} />
      </div>

      <div className="relative mx-auto flex w-full max-w-[440px] flex-1 flex-col px-8">
        {/* language selector */}
        <div className="flex items-center justify-end pt-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 text-[14px] font-medium text-[#111]"
            >
              {lang === "en" ? "English" : "አማርኛ"}
              <ChevronDown size={15} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  className="absolute right-0 top-7 z-10 w-32 overflow-hidden rounded-lg border border-line bg-white shadow-pop"
                >
                  {(["en", "am"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full px-3.5 py-2.5 text-left text-[13px] font-medium hover:bg-soft ${
                        lang === l ? "font-semibold text-brand-600" : "text-ink"
                      }`}
                    >
                      {l === "en" ? "English" : "አማርኛ"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* headline block */}
        <div className="mt-[96px] text-center xs:mt-[110px]">
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div key="h1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="text-[23px] font-bold leading-snug tracking-tight text-[#0C91CA]">
                  {t("login.step1Title1")}
                </p>
                <p className="mt-2 text-[20px] font-bold text-[#0C91CA]">{t("login.step1Title2")}</p>
                <p className="mt-1.5 text-[27px] font-bold text-[#111]">{t("login.step1Title3")}</p>
                <span className="mx-auto mt-2 block h-[3px] w-11 rounded-full bg-[#8CC63F]" />
              </motion.div>
            ) : (
              <motion.div key="h2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="text-[22px] font-extrabold text-ink">{t("login.enterPin")}</p>
                <p className="mt-1.5 text-[13.5px] text-sub">
                  {t("login.pinSub")} +251 {phone.slice(0, 3)} {phone.slice(3, 6)} {phone.slice(6)}
                </p>
                <span className="mx-auto mt-2 block h-[2.5px] w-10 rounded-full bg-[#8CC63F]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* form */}
        <div className="mt-7">
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div key="phone" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
                <p className="mb-2 text-[15.5px] font-normal text-[#6f6f6f]">{t("login.mobileNumber")}</p>
                <div
                  className={`flex h-[46px] items-center gap-2.5 rounded-[7px] border bg-[#FBFDF8] px-4 ${
                    errPhone ? "border-danger" : "border-[#E3E9DD]"
                  }`}
                >
                  <span className="shrink-0 text-[16px] font-normal text-[#222]">+251</span>
                  <span className="h-6 w-px shrink-0 bg-[#E3E9DD]" />
                  <input
                    value={phone.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErrPhone(null); }}
                    inputMode="tel"
                    placeholder="9XX XXX XXX"
                    className="min-w-0 flex-1 bg-transparent text-[16px] tracking-wide outline-none placeholder:text-[#b9b9b9]"
                  />
                </div>
                {errPhone && <p className="mt-2 text-[12.5px] font-medium text-danger">{errPhone}</p>}

                <div className="mt-6">
                  <Btn onClick={next} className="!h-[46px] !text-[17px]">
                    {loading ? t("common.loading") : t("login.next")}
                  </Btn>
                </div>

                <p className="mt-5 text-center text-[13.5px] text-[#6f6f6f]">
                  {t("login.noAccount")}{" "}
                  <button className="font-semibold text-[#6FA82C]">{t("login.createNew")}</button>
                </p>

                <div className="mt-5 flex items-center justify-center gap-10">
                  <button className="text-[14px] font-semibold text-[#6FA82C]">{t("login.hub")}</button>
                  <button className="text-[14px] font-semibold text-[#6FA82C]">{t("login.help")}</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex-1" />

        <div className="pb-7 pt-8 text-center">
          <button className="text-[13px] font-medium text-[#6FA82C]">{t("login.terms")}</button>
          <p className="mt-4 text-[11.5px] text-[#b7b7b7]">{t("login.copyright")}</p>
          <p className="mt-1 text-[11.5px] text-[#c7c7c7]">{t("login.version")}</p>
        </div>
      </div>
    </div>
  );
}
