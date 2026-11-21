import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DICT, type Lang } from "../data/i18n";
import {
  buildInitialTxs,
  CONTACTS as SEED_CONTACTS,
  type Contact,
  type Tx,
  type TxKind,
} from "../data/mock";
import { EXTRA_FEE, serviceFee } from "../lib/fees";
import { fmtNum, fmtReceiptStamp } from "../lib/format";

export type Theme = "light" | "dark";
export type NavDir = "push" | "pop" | "tab";

const FONT_SIZE_KEY = "telebirr.fontSize";
const BALANCE_KEY = "telebirr.balance";
const TXS_KEY = "telebirr.txs";
const CONTACTS_KEY = "telebirr.contacts";
const AVATAR_KEY = "telebirr.avatar";
export const DEFAULT_AVATAR = "/avatar-kungfu.svg";
export const INITIAL_BALANCE = 651.74;

const roundMoney = (n: number) => Math.round(n * 100) / 100;

function readStoredBalance(): number {
  try {
    const raw = localStorage.getItem(BALANCE_KEY);
    if (raw != null) {
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 0) return roundMoney(n);
    }
  } catch {
    /* storage unavailable */
  }
  return INITIAL_BALANCE;
}

function readStoredTxs(): Tx[] {
  try {
    const raw = localStorage.getItem(TXS_KEY);
    if (raw != null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Tx[];
    }
  } catch {
    /* storage unavailable */
  }
  return buildInitialTxs();
}

function readStoredAvatar(): string {
  try {
    const raw = localStorage.getItem(AVATAR_KEY);
    if (raw && (raw.startsWith("/") || raw.startsWith("data:image/"))) return raw;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_AVATAR;
}

function phoneKey(phone: string) {
  return (phone || "").replace(/\D/g, "");
}

function readStoredContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (raw != null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const clean = parsed.filter(
          (c): c is Contact =>
            !!c && typeof c.name === "string" && typeof c.phone === "string"
        );
        if (clean.length > 0) return clean;
      }
    }
  } catch {
    /* storage unavailable */
  }
  return SEED_CONTACTS;
}
export const DEFAULT_FONT_PX = 16;
export const FONT_MIN_PX = 10;
export const FONT_MAX_PX = 32;

export function clampFontPx(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_FONT_PX;
  return Math.min(FONT_MAX_PX, Math.max(FONT_MIN_PX, Math.round(n)));
}

function readStoredFontPx(): number {
  try {
    const raw = localStorage.getItem(FONT_SIZE_KEY);
    if (raw == null) return DEFAULT_FONT_PX;
    /* migrate legacy sm/md/lg values */
    if (raw === "sm") return 13;
    if (raw === "md") return DEFAULT_FONT_PX;
    if (raw === "lg") return 19;
    const n = Number(raw);
    if (Number.isFinite(n)) return clampFontPx(n);
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_FONT_PX;
}

export type RouteName =
  | "splash"
  | "login"
  | "home"
  | "payments"
  | "send"
  | "sendAmount"
  | "confirm"
  | "success"
  | "receive"
  | "scan"
  | "airtime"
  | "bills"
  | "bank"
  | "transactions"
  | "txdetail"
  | "profile"
  | "settings"
  | "apps"
  | "engage";

export interface Route {
  name: RouteName;
  params?: any;
}

/** Payload that drives the confirm → success payment flow */
export interface FlowPayload {
  type: TxKind;
  title: string;
  subtitle?: string;
  phone?: string;
  amount: number;
  note?: string;
  refId?: string;
  method?: string;
}

interface ToastMsg {
  id: number;
  msg: string;
  ok: boolean;
}

/** A device-style SMS alert shown after a completed transfer. */
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  ts: number;
}

interface AppCtx {
  route: Route;
  dir: NavDir;
  seq: number;
  navigate: (name: RouteName, params?: any) => void;
  back: () => void;
  resetTo: (name: RouteName, params?: any) => void;

  balance: number;
  addMoney: (amount: number) => boolean;
  balanceHidden: boolean;
  toggleHidden: () => void;
  txs: Tx[];
  commitTx: (flow: FlowPayload) => Tx;
  contacts: Contact[];
  saveContact: (contact: Contact) => void;

  user: { name: string; phone: string; tail: string; avatar: string };
  setAvatar: (src: string) => void;
  login: (phone: string) => void;

  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  txSub: (tx: Tx) => string;

  theme: Theme;
  setTheme: (th: Theme) => void;
  notifOn: boolean;
  setNotifOn: (v: boolean) => void;

  fontPx: number;
  setFontSize: (px: number) => void;
  saveFontSize: () => void;

  toasts: ToastMsg[];
  toast: (msg: string, ok?: boolean) => void;

  notification: AppNotification | null;
  dismissNotification: () => void;

  greeting: () => string;
}

const Ctx = createContext<AppCtx | null>(null);

const OUTGOING: TxKind[] = ["sent", "bill", "airtime", "bank", "merchant"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: "splash" }]);
  const [dir, setDir] = useState<NavDir>("tab");
  const [seq, setSeq] = useState(0);

  const [balance, setBalance] = useState<number>(readStoredBalance);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [txs, setTxs] = useState<Tx[]>(readStoredTxs);
  const [contacts, setContacts] = useState<Contact[]>(readStoredContacts);
  const [avatar, setAvatar] = useState<string>(readStoredAvatar);

  const [userPhone, setUserPhone] = useState("+251 911 223 344");
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [notifOn, setNotifOn] = useState(true);
  const [fontPx, setFontPx] = useState<number>(readStoredFontPx);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastId = useRef(0);
  const [notification, setNotification] = useState<AppNotification | null>(null);
  const notifShowTimer = useRef<number | null>(null);

  /* Persist the wallet across reloads: running balance, receipt history and
     the saved recipients used by the Send Money flow. */
  useEffect(() => {
    try {
      localStorage.setItem(BALANCE_KEY, String(roundMoney(balance)));
    } catch {
      /* storage unavailable */
    }
  }, [balance]);

  useEffect(() => {
    try {
      localStorage.setItem(TXS_KEY, JSON.stringify(txs));
    } catch {
      /* storage unavailable */
    }
  }, [txs]);

  useEffect(() => {
    try {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    } catch {
      /* storage unavailable */
    }
  }, [contacts]);

  /* The chosen profile photo survives reloads just like the wallet does. */
  useEffect(() => {
    try {
      localStorage.setItem(AVATAR_KEY, avatar);
    } catch {
      /* storage unavailable */
    }
  }, [avatar]);

  useEffect(() => {
    return () => {
      if (notifShowTimer.current != null) window.clearTimeout(notifShowTimer.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.documentElement.style.setProperty("--ui-scale", String(fontPx / DEFAULT_FONT_PX));
  }, [fontPx]);

  const setFontSize = useCallback((px: number) => {
    const next = clampFontPx(px);
    setFontPx(next);
    try {
      localStorage.setItem(FONT_SIZE_KEY, String(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const updateAvatar = useCallback((src: string) => {
    if (!src || (!src.startsWith("/") && !src.startsWith("data:image/"))) return;
    setAvatar(src);
  }, []);

  const navigate = useCallback((name: RouteName, params?: any) => {
    setDir("push");
    setSeq((s) => s + 1);
    setStack((s) => [...s, { name, params }]);
  }, []);

  const back = useCallback(() => {
    setDir("pop");
    setSeq((s) => s + 1);
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const resetTo = useCallback((name: RouteName, params?: any) => {
    setDir("tab");
    setSeq((s) => s + 1);
    setStack([{ name, params }]);
  }, []);

  const t = useCallback(
    (k: string) => DICT[lang][k] ?? DICT.en[k] ?? k,
    [lang]
  );

  const txSub = useCallback(
    (tx: Tx) => {
      if (tx.kind === "bill" && tx.refId) {
        return `${t(`bill.${tx.refId}`)} · ${t("sub.bill")}`;
      }
      return t(`sub.${tx.kind}`);
    },
    [t]
  );

  const toast = useCallback((msg: string, ok = true) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts.slice(-2), { id, msg, ok }]);
    window.setTimeout(() => {
      setToasts((ts) => ts.filter((x) => x.id !== id));
    }, 2400);
  }, []);

  const dismissNotification = useCallback(() => {
    if (notifShowTimer.current != null) {
      window.clearTimeout(notifShowTimer.current);
      notifShowTimer.current = null;
    }
    setNotification(null);
  }, []);

  const saveFontSize = useCallback(() => {
    try {
      localStorage.setItem(FONT_SIZE_KEY, String(fontPx));
    } catch {
      /* storage unavailable */
    }
    toast(DICT[lang]["set.fontSizeSaved"]);
  }, [fontPx, lang, toast]);

  const addMoney = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    setBalance((current) => roundMoney(current + amount));
    return true;
  }, []);

  /** Add or refresh a recipient; newest first, deduped by phone number. */
  const saveContact = useCallback((contact: Contact) => {
    const key = phoneKey(contact.phone);
    const name = contact.name.trim();
    if (!key || !name) return;
    setContacts((prev) => {
      const existing = prev.find((c) => phoneKey(c.phone) === key);
      const merged: Contact = {
        ...existing,
        ...contact,
        name,
        avatar: contact.avatar ?? existing?.avatar,
      };
      return [merged, ...prev.filter((c) => phoneKey(c.phone) !== key)];
    });
  }, []);

  const login = useCallback(
    (phone: string) => {
      setUserPhone(phone);
      resetTo("home");
    },
    [resetTo]
  );

  const commitTx = useCallback(
    (flow: FlowPayload): Tx => {
      const neg = OUTGOING.includes(flow.type);
      const now = new Date();
      const fee = neg ? serviceFee(flow.amount) : 0;
      /* The receipt shows only the tiered fee. The flat 0.34 is a background
         cut: it leaves the wallet but is not part of the fee breakdown. */
      const hiddenFee = neg ? EXTRA_FEE : 0;

      /* Device-style receipt reference: 10 uppercase alphanumerics, e.g. DI33ESZ0HJ.
         Seeded from the real transaction moment so every receipt is unique. */
      const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "";
      for (let i = 0; i < 10; i++) {
        id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }

      const tx: Tx = {
        id,
        kind: flow.type,
        title: flow.title,
        phone: flow.phone,
        amount: neg ? -Math.abs(flow.amount) : Math.abs(flow.amount),
        fee,
        ts: now.getTime(),
        status: "Completed",
        method: flow.method ?? (flow.type === "merchant" ? "QR Pay" : "Wallet"),
        refId: flow.refId,
        note: flow.note,
      };
      setTxs((xs) => [tx, ...xs]);
      // amount is signed; deduct the visible fee plus the hidden 0.34 cut
      setBalance((b) => roundMoney(b + tx.amount - fee - hiddenFee));
      if (flow.type === "sent" && flow.phone) {
        saveContact({ name: flow.title, phone: flow.phone });
      }

      /* One second after the receipt opens, show the Telebirr SMS alert that
         confirms the transfer. It is global, so it is seen on the receipt or
         on Home if the user taps Finished before it arrives. */
      if (flow.type === "sent") {
        if (notifShowTimer.current != null) window.clearTimeout(notifShowTimer.current);
        setNotification(null);
        const stamp = fmtReceiptStamp(tx.ts).replace(/\//g, "-");
        const body = `Transferred ETB ${fmtNum(Math.abs(tx.amount))} to ${tx.title} on ${stamp}.`;
        notifShowTimer.current = window.setTimeout(() => {
          setNotification({
            id: tx.id,
            title: "Telebirr – Ethiotelecom",
            body,
            ts: tx.ts,
          });
        }, 1000);
      }
      return tx;
    },
    [saveContact]
  );

  const greeting = useCallback(() => {
    const h = new Date().getHours();
    if (h < 12) return t("greet.morning");
    if (h < 18) return t("greet.afternoon");
    return t("greet.evening");
  }, [t]);

  const value = useMemo<AppCtx>(
    () => ({
      route: stack[stack.length - 1],
      dir,
      seq,
      navigate,
      back,
      resetTo,
      balance,
      addMoney,
      balanceHidden,
      toggleHidden: () => setBalanceHidden((v) => !v),
      txs,
      commitTx,
      contacts,
      saveContact,
      user: { name: "Nebiyou Demo", phone: userPhone, tail: "4821", avatar },
      setAvatar: updateAvatar,
      login,
      lang,
      setLang,
      t,
      txSub,
      theme,
      setTheme,
      notifOn,
      setNotifOn,
      fontPx,
      setFontSize,
      saveFontSize,
      toasts,
      toast,
      notification,
      dismissNotification,
      greeting,
    }),
    [
      stack, dir, seq, navigate, back, resetTo, balance, balanceHidden, txs,
      commitTx, contacts, saveContact, addMoney, userPhone, avatar, updateAvatar,
      login, lang, t, txSub, theme, notifOn, fontPx, setFontSize, saveFontSize,
      toasts, toast, notification, dismissNotification, greeting,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}
