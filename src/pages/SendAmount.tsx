import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ConfirmSheet from "../components/ConfirmSheet";
import NumberPad from "../components/NumberPad";
import { SquareAvatar } from "../components/primitives";
import LoadingLogo from "../components/LoadingLogo";
import SendPinSheet from "../components/SendPinSheet";
import type { Contact } from "../data/mock";
import { debitTotal } from "../lib/fees";
import { DEMO_PIN } from "../pages/Login";
import { useApp } from "../store/AppContext";

export default function SendAmount() {
  const { t, navigate, back, balance, toast, commitTx } = useApp();
  const { route } = useApp();
  const contact = route.params?.contact as Contact | undefined;

  const [amount, setAmount] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [pin, setPin] = useState("");

  /* Only redirect if THIS screen is the active route. While a page transition
     is animating, the exiting copy still renders against the new route and
     must not hijack navigation. */
  useEffect(() => {
    if (!contact && route.name === "sendAmount") back();
  }, [contact, back, route.name]);

  if (!contact) return null;

  const digit = (d: string) => {
    setAmount((a) => {
      if (a === "0") return d;
      const next = a + d;
      return /^\d{0,7}(\.\d{0,2})?$/.test(next) ? next : a;
    });
  };
  const dot = () => setAmount((a) => (a.includes(".") || a === "" ? (a === "" ? "0." : a) : a + "."));
  const backspace = () => setAmount((a) => a.slice(0, -1));

  const amt = parseFloat(amount || "0") || 0;
  /* Balance check uses the real debit, including the hidden 0.34 cut. */
  const charge = debitTotal(amt);

  /** OK on the keypad opens the confirmation sheet */
  const submit = () => {
    if (!amt || amt <= 0) {
      toast(t("err.amount"), false);
      return;
    }
    if (charge > balance) {
      toast(t("err.balance"), false);
      return;
    }
    setSheetOpen(true);
  };

  /** "Send" asks for the PIN first — the wallet is not debited yet. */
  const doSend = () => {
    setSheetOpen(false);
    setPin("");
    setPinOpen(true);
  };

  /** Correct PIN → the video's processing overlay for 1.5s → receipt. */
  const submitPin = (value = pin) => {
    if (value !== DEMO_PIN) {
      toast(t("err.pinWrong"), false);
      setPin("");
      return;
    }
    setLoadingOpen(true);
    window.setTimeout(() => {
      const flow = {
        type: "sent" as const,
        title: contact.name,
        phone: contact.phone,
        amount: amt,
        note: note || undefined,
      };
      const tx = commitTx(flow);
      setLoadingOpen(false);
      setPinOpen(false);
      setPin("");
      navigate("success", { flow, tx });
    }, 1500);
  };

  return (
    <div className="flex min-h-[var(--vh)] flex-col bg-[#f2f2f2]">
      <Header title={t("send.title")} gray />

      <div className="flex items-center gap-3 bg-[#f2f2f2] px-4 py-5">
        {contact.avatar ? (
          <img src={contact.avatar} alt={contact.name} className="h-[46px] w-[46px] shrink-0 rounded-[4px] object-cover" />
        ) : (
          <SquareAvatar size={46} />
        )}
        <div className="min-w-0">
          <p className="truncate text-[20px] font-normal leading-tight text-[#222]">{contact.name}</p>
          <p className="mt-1.5 truncate text-[15px] font-normal text-[#a5a5a5]">{contact.phone.replace(/[+\s]/g, "")}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-white px-5 pb-2 pt-5">
        <p className="text-[15.5px] font-normal text-[#222]">{t("send.amount")}</p>

        <div className="mt-1.5 flex min-h-[56px] items-center">
          <span className="break-all text-[43px] font-bold leading-none tracking-tight text-[#111] tabular-nums">
            {amount}
          </span>
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.05, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            className="ml-0.5 h-[52px] w-[2.5px] shrink-0 bg-[#8CC63F]"
          />
          <span className="ml-auto self-end pb-1.5 text-[14px] text-[#b3b3b3]">(ETB)</span>
        </div>

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {noteOpen ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <input
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={() => setNoteOpen(false)}
                  placeholder={t("send.notePh")}
                  className="w-full border-b border-line bg-transparent pb-1.5 text-[15px] outline-none placeholder:text-[#b5b5b5] focus:border-[#8CC63F]"
                />
              </motion.div>
            ) : (
              <motion.button
                key="link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setNoteOpen(true)}
                className="text-left text-[15px] font-normal text-[#8c8c8c]"
              >
                {note || t("send.addNotes")}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1" />
      </div>

      <NumberPad
        onDigit={digit}
        onDot={dot}
        onBackspace={backspace}
        onSubmit={submit}
        submitLabel="OK"
        submitEnabled={parseFloat(amount || "0") > 0}
      />

      <ConfirmSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSend={doSend}
        name={contact.name}
        amount={amt}
      />

      {pinOpen && (
        <SendPinSheet
          amount={amt}
          pin={pin}
          onChange={(value) => setPin(value)}
          onClose={() => { setPin(""); setPinOpen(false); }}
          onSubmit={submitPin}
        />
      )}

      {/* Keep the PIN sheet visible underneath the dimmed processing overlay,
          exactly like the reference recording. */}
      {loadingOpen && (
        <div className="fixed inset-0 z-[100] bg-black/45">
          <LoadingLogo />
        </div>
      )}
    </div>
  );
}
