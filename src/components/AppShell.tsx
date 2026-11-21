import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, type ComponentType } from "react";
import { useApp, type NavDir, type RouteName } from "../store/AppContext";
import { ToastInner, cn } from "./primitives";
import TransactionNotification from "./TransactionNotification";
import {
  AccountNavGlyph,
  AppsNavGlyph,
  EngageNavGlyph,
  HomeNavGlyph,
  LocationPinGlyph,
  PaymentNavGlyph,
  ScanQrGlyph,
} from "./telebirrIcons";

import Splash from "../pages/Splash";
import Login from "../pages/Login";
import HomePage from "../pages/Home";
import Payments from "../pages/Payments";
import SendMoney from "../pages/SendMoney";
import SendAmount from "../pages/SendAmount";
import { ConfirmScreen } from "../pages/PayFlow";
import Success from "../pages/Success";
import Receive from "../pages/Receive";
import Scan from "../pages/Scan";
import { Airtime, Bills, Bank } from "../pages/Services";
import Transactions from "../pages/Transactions";
import TxDetail from "../pages/TxDetail";
import Profile from "../pages/Profile";
import SettingsPage from "../pages/Settings";
import Apps from "../pages/Apps";
import Engage from "../pages/Engage";

const SCREENS: Record<RouteName, ComponentType> = {
  splash: Splash,
  login: Login,
  home: HomePage,
  payments: Payments,
  send: SendMoney,
  sendAmount: SendAmount,
  confirm: ConfirmScreen,
  success: Success,
  receive: Receive,
  scan: Scan,
  airtime: Airtime,
  bills: Bills,
  bank: Bank,
  transactions: Transactions,
  txdetail: TxDetail,
  profile: Profile,
  settings: SettingsPage,
  apps: Apps,
  engage: Engage,
};

const IMMERSIVE: RouteName[] = ["splash", "login"];
/* full-screen flows: keypad / form / confirmation / receipt own the whole viewport */
const HIDENAV: RouteName[] = ["scan", "send", "sendAmount", "confirm", "success"];

/** which tab should glow for a given route */
const TAB_OF: Partial<Record<RouteName, RouteName>> = {
  send: "payments",
  receive: "payments",
  confirm: "payments",
  success: "payments",
  scan: "payments",
  airtime: "payments",
  bills: "payments",
  bank: "payments",
  txdetail: "transactions",
  settings: "profile",
};

const TABS: { route: RouteName; key: string }[] = [
  { route: "home", key: "nav.home" },
  { route: "payments", key: "nav.payments" },
  { route: "apps", key: "nav.apps" },
  { route: "engage", key: "nav.engage" },
  { route: "profile", key: "nav.account" },
];

function TabGlyph({ route }: { route: RouteName }) {
  if (route === "home") return <HomeNavGlyph size={25} />;
  if (route === "payments") return <PaymentNavGlyph size={25} />;
  if (route === "apps") return <AppsNavGlyph size={24} />;
  if (route === "engage") return <EngageNavGlyph size={25} />;
  return <AccountNavGlyph size={24} />;
}

const variants: Variants = {
  enter: (dir: NavDir) =>
    dir === "push" ? { x: 72, opacity: 0 } : dir === "pop" ? { x: -72, opacity: 0 } : { opacity: 0, scale: 0.99 },
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: NavDir) =>
    dir === "push" ? { x: -72, opacity: 0 } : dir === "pop" ? { x: 72, opacity: 0 } : { opacity: 0, scale: 0.99 },
};

export default function AppShell() {
  const { route, dir, seq, t, resetTo, navigate, toasts, notification, dismissNotification } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const immersive = IMMERSIVE.includes(route.name);
  const activeTab: RouteName | null = IMMERSIVE.includes(route.name)
    ? null
    : (TABS.some((tb) => tb.route === route.name) ? route.name : TAB_OF[route.name] ?? null);
  const activeIndex = Math.max(0, TABS.findIndex((tb) => tb.route === activeTab));

  /* The scoop and bead share one percentage so they always stay concentric. */
  const notchPercent = useMotionValue(10);
  const notchMask = useMotionTemplate`radial-gradient(circle 17px at ${notchPercent}% -2px, transparent 16.5px, #000 17px)`;
  const notchLeft = useTransform(notchPercent, (pct) => `${pct}%`);

  useEffect(() => {
    const target = (activeIndex + 0.5) * 20;
    const controls = animate(notchPercent, target, {
      type: "spring",
      stiffness: 420,
      damping: 38,
      mass: 0.7,
    });
    return () => controls.stop();
  }, [activeIndex, notchPercent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [seq]);

  const Screen = SCREENS[route.name];

  return (
    <div className="h-[var(--vh)] w-full flex justify-center bg-[#e7ebe2] text-ink relative overflow-hidden">
      <div className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-white sm:shadow-[0_0_60px_rgb(33_45_27/0.18)]">
        {/* ── Scrollable screen ─────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-clip no-scrollbar bg-page"
        >
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={seq}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full mx-auto w-full"
            >
              <Screen />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Scan QR strip (home only) ─────────────────────────────── */}
        {route.name === "home" && (
          <div className="shrink-0 bg-white px-4 pb-4 pt-3">
            <motion.button
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate("scan")}
              className="mx-auto flex h-[54px] w-[80%] max-w-[340px] items-center justify-center gap-2.5 rounded-[12px] bg-[#0C91CA] font-rounded text-[18px] font-bold tracking-tight text-white transition-colors hover:bg-[#0A7FAE]"
            >
              <ScanQrGlyph size={23} />
              {t("home.scanQr")}
            </motion.button>
          </div>
        )}

        {/* ── Bottom nav ────────────────────────────────────────────── */}
        {!immersive && !HIDENAV.includes(route.name) && (
          <nav className="relative z-20 shrink-0 pb-[env(safe-area-inset-bottom)] text-white">
            {/* solid green bar with a genuine transparent notch */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#8CC63F]"
              style={{ maskImage: notchMask, WebkitMaskImage: notchMask }}
            />

            {/* the small green bead resting in the scoop */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute top-[-4.5px] z-20 h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-[#8CC63F]"
              style={{ left: notchLeft }}
            />

            <div className="relative z-10 grid h-[82px] grid-cols-5">
              {TABS.map(({ route: r, key }) => {
                const active = activeTab === r;
                return (
                  <button
                    key={r}
                    onClick={() => resetTo(r)}
                    className="flex h-full select-none flex-col items-center pt-[27px] transition-opacity active:opacity-75"
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="flex h-[25px] items-center justify-center">
                      <TabGlyph route={r} />
                    </span>
                    <span
                      className={cn(
                        "mt-[5px] whitespace-nowrap font-rounded text-[12px] leading-[14px] tracking-[0.005em] text-white",
                        active ? "font-bold" : "font-semibold"
                      )}
                    >
                      {t(key)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* floating location badge, tucked over the Account corner */}
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: activeIndex === 4 ? -18 : 0 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={() => resetTo("profile")}
              className="absolute -top-[28px] right-3 z-30 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgb(27_46_14/0.24)]"
              aria-label={t("nav.account")}
            >
              <LocationPinGlyph size={22} />
            </motion.button>
          </nav>
        )}
      </div>

      {/* ── Transaction SMS notification ──────────────────────────── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ y: -140, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -140, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex justify-center px-3 pt-[max(env(safe-area-inset-top),10px)]"
          >
            <TransactionNotification notification={notification} onClose={dismissNotification} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toasts ────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-[90] flex items-start justify-center px-6">
        <div className="mt-[53vh] flex w-full max-w-[480px] flex-col items-center gap-2">
          <AnimatePresence>
            {toasts.map((t0) => (
              <motion.div
                key={t0.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 480, damping: 34 }}
              >
                <ToastInner msg={t0.msg} ok={t0.ok} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
