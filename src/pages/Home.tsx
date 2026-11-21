import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  Bell,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Avatar, TelebirrLogo, EthioTelecomLogo } from "../components/primitives";
import PromoCarousel from "../components/PromoCarousel";
import { greetingKey, useClock } from "../lib/useClock";
import TxRow from "../components/TxRow";
import { NOTIFS } from "../data/mock";
import { useApp } from "../store/AppContext";
import {
  AaTrafficLogo,
  AatmaLogo,
  AirtimeGlyph,
  AwashLogo,
  BankGlyph,
  CBELogo,
  CashInOutGlyph,
  DashenLogo,
  MerchantGlyph,
  MoreGlyph,
  SendMoneyGlyph,
  SiinqeeLogo,
  TeleDeviceLogo,
  TeleEvLogo,
  ToloLogo,
  ZemenLogo,
} from "../components/telebirrIcons";

const WAVE_RADII = Array.from({ length: 44 }, (_, i) => 20 + i * 7.5);
const WAVE_RADII_RIGHT = Array.from({ length: 40 }, (_, i) => 14 + i * 7.5);

function HeroWaves() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 390 250"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.9">
        {WAVE_RADII.map((r) => (
          <circle key={`l-${r}`} cx="-6" cy="70" r={r} />
        ))}
        {WAVE_RADII_RIGHT.map((r) => (
          <circle key={`r-${r}`} cx="398" cy="150" r={r} />
        ))}
      </g>
    </svg>
  );
}

interface Tile {
  key: string;
  label: string;
  icon: ReactNode;
  badge?: string;
  onClick: () => void;
}

const NOTIF_ICON: Record<string, LucideIcon> = { brand: ArrowDownLeft, warn: ShieldCheck, info: Sparkles };
const NOTIF_TONE: Record<string, string> = { brand: "#7fb832", warn: "#D98A00", info: "#0C91CA" };

export default function Home() {
  const { t, user, navigate, resetTo, txs, toast, lang, setLang, balance, balanceHidden, toggleHidden } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<"notifications" | "history">("notifications");
  const [langOpen, setLangOpen] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const [showEndekise, setShowEndekise] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [sendChooserOpen, setSendChooserOpen] = useState(false);
  const now = useClock(30000);

  const recent = useMemo(() => txs.slice(0, 5), [txs]);
  const firstName = user.name.split(" ")[0];
  const unread = NOTIFS.filter((n) => !read.includes(n.id)).length;

  const service = (key: string, label: string, icon: ReactNode, onClick: () => void, badge?: string): Tile => ({
    key,
    label,
    icon,
    badge,
    onClick,
  });

  const mainServices: Tile[] = [
    service("send", "Send Money", <SendMoneyGlyph size={26} />, () => setSendChooserOpen(true)),
    service("cash", "Cash In/\nOut", <CashInOutGlyph size={26} />, () => navigate("receive")),
    service("airtime", "Airtime/\nBuy Package", <AirtimeGlyph size={26} />, () => navigate("airtime"), "Up to 35%"),
    service("zemen", "Zemen GEBEYA", <ZemenLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("dashen", "Financial Service With Dashen", <DashenLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("cbe", "Financial Service With CBE", <CBELogo size={26} />, () => toast(t("demo.feature"), false)),
    service("siinqee", "Financial Service with Siinqee", <SiinqeeLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("bank", "Transfer to Bank", <BankGlyph size={26} />, () => navigate("bank")),
  ];

  const appServices: Tile[] = [
    service("awash", "Financial Service with Awash", <AwashLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("merchant", "Pay for Merchant", <MerchantGlyph size={26} />, () => navigate("scan")),
    service("teleev", "teleEV Charging", <TeleEvLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("tolo", "TOLO Payment", <ToloLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("aa-traffic", "AA Traffic Penalty Payment", <AaTrafficLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("aatma", "AATMA Parking Payment", <AatmaLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("tele-device", "tele Device Financing", <TeleDeviceLogo size={26} />, () => toast(t("demo.feature"), false)),
    service("more", "More", <MoreGlyph size={26} />, () => resetTo("apps")),
  ];

  return (
    <div className="relative min-h-full bg-[#f2f2f2]">
      {/* Sticky brand bar + wallet hero + promo ticker */}
      <div className="sticky top-0 z-20">
        <div className="flex h-[40px] items-center justify-between overflow-hidden border-b border-[#f0f0f0] bg-white px-4">
          <EthioTelecomLogo scale={1} />
          <TelebirrLogo scale={1} />
        </div>

        <div className="relative overflow-hidden bg-[#90D642] px-3 pb-10 pt-3 text-white">
          <HeroWaves />

          <div className="relative flex items-center gap-2.5">
            <button onClick={() => navigate("profile")} aria-label="Account" className="shrink-0">
              <Avatar name={user.name} src={user.avatar} size={42} className="h-[42px] w-[42px] ring-[1.5px] ring-white/45" />
            </button>
            <p className="min-w-0 flex-1 truncate text-[24px] font-normal leading-tight tracking-tight">
              {t(greetingKey(now))}, {firstName}
            </p>
            <button onClick={() => toast(t("demo.feature"), false)} className="flex h-7 w-7 items-center justify-center" aria-label="Search">
              <Search size={18} strokeWidth={1.9} />
            </button>
            <button onClick={() => setNotifOpen(true)} className="relative flex h-7 w-7 items-center justify-center" aria-label="Notifications">
              <Bell size={18} strokeWidth={1.9} />
              {unread > 0 && <span className="absolute right-0.5 top-0.5 h-[5px] w-[5px] rounded-full bg-[#F6A21B]" />}
            </button>
            <div className="relative">
              <button onClick={() => setLangOpen((v) => !v)} className="flex items-center gap-0.5 text-[14.5px] font-normal">
                <span className="max-w-[54px] truncate">{lang === "en" ? "English" : "አማርኛ"}</span>
                <ChevronDown size={13} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-7 z-30 w-28 overflow-hidden rounded-lg border border-line bg-white text-ink shadow-pop"
                  >
                    {(["en", "am"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className="w-full px-3 py-2 text-left text-[13px] font-medium hover:bg-soft"
                      >
                        {l === "en" ? "English" : "አማርኛ"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative mt-3 flex flex-col items-center">
            <button onClick={toggleHidden} className="flex items-center gap-2 text-[20px] font-medium tracking-tight">
              Balance (ETB)
              {balanceHidden ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <p className="mt-1.5 text-[43px] font-bold leading-none tracking-tight tabular-nums">
              {balanceHidden ? "*******" : balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="relative mt-7 grid grid-cols-2">
            <button onClick={() => setShowEndekise((v) => !v)} className="flex flex-col items-center">
              <span className="flex items-center gap-1.5 text-[19px] font-medium tracking-tight">
                Endekise (ETB)
                {showEndekise ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
              <span className="mt-2 text-[18px] font-semibold tracking-[0.14em]">
                {showEndekise ? "1,050.00" : "*******"}
              </span>
            </button>
            <button onClick={() => setShowReward((v) => !v)} className="flex flex-col items-center">
              <span className="flex items-center gap-1.5 text-[19px] font-medium tracking-tight">
                Reward (ETB)
                {showReward ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
              <span className="mt-2 text-[18px] font-semibold tracking-[0.14em]">
                {showReward ? "18.40" : "*******"}
              </span>
            </button>
          </div>
        </div>

        <div className="home-promo-strip flex h-[18px] items-center overflow-hidden bg-[#F5BC4B] px-3 text-[14px] font-bold tracking-wide text-white">
          <span className="home-promo-track" aria-label="ONE APP FOR ALL YOUR NEEDS!">
            <span>ONE APP FOR ALL YOUR NEEDS!</span>
            <span aria-hidden="true">ONE APP FOR ALL YOUR NEEDS!</span>
          </span>
        </div>
      </div>

      {/* scrolling body */}
      <div className="px-4 pb-6 pt-2">
        <ServiceGrid items={mainServices} />

        <div className="mt-3">
          <PromoCarousel />
        </div>

        <button
          onClick={() => resetTo("transactions")}
          className="mt-2 flex w-full items-center justify-end gap-1 py-1 text-[17px] font-semibold text-sky-500"
        >
          Transaction Details
          <ChevronRight size={21} strokeWidth={2.6} />
        </button>

        <div className="mt-3">
          <ServiceGrid items={appServices} />
        </div>
      </div>

      {/* send-money chooser */}
      <AnimatePresence>
        {sendChooserOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75]">
            <div className="absolute inset-0 bg-black/45" onClick={() => setSendChooserOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              style={{ left: "max(32px, calc(50% - 214px))" }}
              className="absolute top-[54%] w-[200px] overflow-hidden rounded-[12px] bg-white shadow-pop"
            >
              <button
                onClick={() => { setSendChooserOpen(false); navigate("send"); }}
                className="flex w-full items-center gap-3.5 px-5 py-[18px] text-left text-[16px] text-[#24352b]"
              >
                <Send size={21} strokeWidth={1.6} className="text-[#8CC63F]" />
                <span>To Individual</span>
              </button>
              <div className="h-px bg-[#edf0ec]" />
              <button
                onClick={() => { setSendChooserOpen(false); toast(t("demo.feature"), false); }}
                className="flex w-full items-center gap-3.5 px-5 py-[18px] text-left text-[16px] text-[#24352b]"
              >
                <UsersRound size={21} strokeWidth={1.6} className="text-[#8CC63F]" />
                <span>To Group</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* notifications sheet */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70]">
            <div className="absolute inset-0 bg-black/40" onClick={() => setNotifOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 overflow-y-auto rounded-t-2xl border border-line bg-white p-4 no-scrollbar"
              style={{ maxHeight: "calc(var(--vh) * 0.78)" }}
            >
              <div className="flex items-center justify-between px-1 py-1">
                <h3 className="text-[17px] font-bold">Notifications</h3>
                <button onClick={() => setNotifOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-sub hover:bg-soft">
                  <X size={17} />
                </button>
              </div>

              <div className="mt-3 flex gap-1 rounded-lg bg-soft p-1">
                <button
                  onClick={() => setNotifTab("notifications")}
                  className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-[13px] font-semibold transition-colors ${
                    notifTab === "notifications" ? "bg-white text-ink shadow-sm" : "text-sub"
                  }`}
                >
                  <Bell size={14} />
                  Notifications
                </button>
                <button
                  onClick={() => setNotifTab("history")}
                  className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-[13px] font-semibold transition-colors ${
                    notifTab === "history" ? "bg-white text-ink shadow-sm" : "text-sub"
                  }`}
                >
                  <Clock size={14} />
                  History
                </button>
              </div>

              {notifTab === "notifications" ? (
                <>
                  <div className="mt-3 space-y-1">
                    {NOTIFS.map((n) => {
                      const Icon = NOTIF_ICON[n.tone];
                      const tone = NOTIF_TONE[n.tone];
                      const isRead = read.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          onClick={() => setRead((r) => [...new Set([...r, n.id])])}
                          className="flex w-full gap-3 rounded-lg p-3 text-left transition-colors hover:bg-soft/70"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `${tone}14`, color: tone }}>
                            <Icon size={18} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="truncate text-[13.5px] font-semibold">{lang === "am" ? n.am.title : n.en.title}</span>
                              {!isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />}
                            </span>
                            <span className="mt-0.5 block text-[12px] leading-snug text-sub">{lang === "am" ? n.am.body : n.en.body}</span>
                          </span>
                          <span className="shrink-0 text-[11px] text-sub">{n.ago}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setRead(NOTIFS.map((n) => n.id))} className="mt-2 w-full rounded-lg py-2.5 text-[13px] font-semibold text-brand-600 hover:bg-soft">
                    Mark all read
                  </button>
                </>
              ) : (
                <div className="mt-3">
                  {txs.length === 0 ? (
                    <div className="flex flex-col items-center py-10 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-soft text-brand-500">
                        <Clock size={24} />
                      </div>
                      <p className="mt-3 text-[14px] font-semibold text-ink">No history yet</p>
                      <p className="mt-1 text-[12px] text-sub">Your payments will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {txs.map((tx) => (
                        <TxRow key={tx.id} tx={tx} onClick={() => { setNotifOpen(false); navigate("txdetail", { tx }); }} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceGrid({ items }: { items: Tile[] }) {
  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-4">
      {items.map((s) => (
        <button
          key={s.key}
          onClick={s.onClick}
          className="relative flex min-h-[118px] flex-col items-center rounded-[8px] bg-white px-0.5 pb-2.5 pt-2.5 text-center"
        >
          {s.badge && (
            <span className="absolute -top-2 right-1 z-10 whitespace-nowrap rounded-[8px] bg-[#F2A61B] px-1.5 py-[3px] text-[11px] font-bold leading-none text-white">
              {s.badge}
            </span>
          )}
          <span className="flex h-[28px] items-center justify-center">{s.icon}</span>
          <span className="mt-2 whitespace-pre-line text-[15px] leading-[1.15] text-[#242424]">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
