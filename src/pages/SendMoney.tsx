import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import Header from "../components/Header";
import { formatETPhone, validETPhone } from "../components/fields";
import { Btn, SquareAvatar } from "../components/primitives";
import PromoCarousel from "../components/PromoCarousel";
import { ContactBookGlyph, ScanFrameGlyph } from "../components/telebirrIcons";
import type { Contact } from "../data/mock";
import { useApp } from "../store/AppContext";

export default function SendMoney() {
  const { t, navigate, route, toast, contacts } = useApp();
  const prefill = route.params?.prefill as { name: string; phone: string } | undefined;

  const [phone, setPhone] = useState(prefill ? prefill.phone.replace(/\D/g, "").slice(-9) : "");
  const [cleared, setCleared] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const valid = validETPhone(phone);

  const recent = useMemo(() => (cleared ? [] : contacts.slice(0, 4)), [cleared, contacts]);

  /** A number that already belongs to a saved recipient is recognised instantly. */
  const match = useMemo(() => {
    if (!valid) return undefined;
    return contacts.find((c) => c.phone.replace(/\D/g, "").endsWith(phone));
  }, [contacts, phone, valid]);

  const goToAmount = (contact: Contact) => {
    navigate("sendAmount", { contact });
  };

  const onNext = () => {
    if (!valid) return;
    if (match) {
      goToAmount(match);
      return;
    }
    setPendingPhone(`+251 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`);
    setNewName("");
    setNameOpen(true);
  };

  const submitName = () => {
    const name = newName.trim();
    if (!name) return;
    setNameOpen(false);
    goToAmount({ name, phone: pendingPhone });
  };

  return (
    <div className="min-h-full bg-[#f2f2f2] pb-6">
      <Header title={t("send.toIndividual")} gray />

      <div className="px-4 pt-3">
        <PromoCarousel compact />
      </div>

      <div className="mx-4 mt-5 bg-white px-4 pb-5 pt-4">
        <p className="text-[15px] font-normal text-[#222]">{t("send.enterMobile")}</p>

        <div className="mt-3 flex h-[48px] items-center rounded-[8px] border-2 border-[#8CC63F] px-4">
          <span className="shrink-0 text-[15px] font-medium text-[#222]">+251</span>
          <input
            value={formatETPhone(phone)}
            autoFocus
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
            onKeyDown={(e) => e.key === "Enter" && onNext()}
            inputMode="tel"
            enterKeyHint="next"
            className="ml-2 min-w-0 flex-1 bg-transparent text-[15px] font-normal tracking-wide text-[#222] outline-none"
            aria-label="Mobile number"
          />
          <button
            onClick={() => toast(t("demo.feature"), false)}
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center"
            aria-label="Scan number"
          >
            <ScanFrameGlyph size={22} />
          </button>
          <button
            onClick={() => toast(t("demo.feature"), false)}
            className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center"
            aria-label="Choose from contacts"
          >
            <ContactBookGlyph size={22} />
          </button>
        </div>

        {match && (
          <p className="mt-2.5 flex items-center gap-1.5 text-[13px] font-medium text-[#168A45]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8CC63F] text-[10px] font-bold text-white">
              ✓
            </span>
            Sending to {match.name}
          </p>
        )}

        <div className="mt-4">
          <Btn disabled={!valid} onClick={onNext} className="!h-[46px] !text-[17px]">
            {t("send.next")}
          </Btn>
        </div>
      </div>

      <div className="mx-4 mt-10 flex items-center justify-between">
        <p className="text-[16.5px] font-normal text-[#222]">{t("send.recent")}</p>
        {recent.length > 0 && (
          <button
            onClick={() => setCleared(true)}
            className="flex h-8 w-8 items-center justify-center text-[#9a9a9a]"
            aria-label="Clear recent"
          >
            <Trash2 size={20} strokeWidth={1.7} />
          </button>
        )}
      </div>

      <div className="mx-4 mt-2 overflow-hidden rounded-[2px] bg-white">
        {recent.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-sub">{t("tx.empty")}</p>
        ) : (
          recent.map((c, idx) => (
            <motion.button
              key={c.phone}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => goToAmount(c)}
              className={`flex w-full items-center gap-3 px-3 py-3 text-left ${
                idx < recent.length - 1 ? "border-b border-[#f2f2f2]" : ""
              }`}
            >
              {c.avatar ? (
                <img src={c.avatar} alt={c.name} className="h-[52px] w-[52px] shrink-0 rounded-[3px] object-cover" />
              ) : (
                <SquareAvatar size={52} tone="#F2A61B" />
              )}
              <span className="min-w-0 flex-1 truncate text-[17px] font-normal text-[#222]">{c.name}</span>
              <ChevronRight size={19} strokeWidth={2} className="shrink-0 text-[#c9c9c9]" />
            </motion.button>
          ))
        )}
      </div>

      {/* New recipient name prompt — shown only for numbers not saved yet. */}
      <AnimatePresence>
        {nameOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex flex-col justify-end"
          >
            <div
              className="absolute inset-0 bg-black/45"
              onClick={() => setNameOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="relative mx-auto w-full max-w-[480px] rounded-t-[20px] bg-white px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[18px] font-semibold text-[#222]">New recipient</p>
                  <p className="mt-1 text-[14px] text-[#8c8c8c]">{pendingPhone}</p>
                </div>
                <button
                  onClick={() => setNameOpen(false)}
                  className="-mr-1 flex h-9 w-9 items-center justify-center text-[#666]"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>

              <label className="mt-5 block text-[14px] font-medium text-[#222]">
                What is their name?
              </label>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitName()}
                placeholder="e.g. Abebe Kebede"
                maxLength={40}
                className="mt-2 h-[48px] w-full rounded-[8px] border border-[#d9d9d9] px-4 text-[16px] text-[#222] outline-none placeholder:text-[#b5b5b5] focus:border-[#8CC63F]"
              />
              <p className="mt-2 text-[12px] text-[#9a9a9a]">
                We'll save this name to your recent recipients.
              </p>

              <button
                onClick={submitName}
                disabled={!newName.trim()}
                className={`mt-5 h-[48px] w-full rounded-[10px] text-[16px] font-semibold text-white transition-colors ${
                  newName.trim() ? "bg-[#8CC63F] active:bg-[#7ab234]" : "bg-[#D8E8C4]"
                }`}
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
