import { motion } from "framer-motion";
import {
  Bell,
  Download,
  Globe,
  HelpCircle,
  ImagePlus,
  Info,
  LogOut,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Type,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import Header from "../components/Header";
import { Avatar, Btn, Card, ListRow, Modal } from "../components/primitives";
import {
  DEFAULT_AVATAR,
  FONT_MAX_PX,
  FONT_MIN_PX,
  clampFontPx,
  useApp,
} from "../store/AppContext";

/** Center-crop an uploaded image into a compact square data URL for storage. */
function fileToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode"));
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas"));
          return;
        }
        const side = Math.min(img.width, img.height);
        ctx.drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size
        );
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { t, user, setAvatar, navigate, resetTo, toast, fontPx, setFontSize, saveFontSize } = useApp();
  const [confirmOut, setConfirmOut] = useState(false);
  const [fontDraft, setFontDraft] = useState(String(fontPx));
  const [photoOpen, setPhotoOpen] = useState(false);
  const [draftAvatar, setDraftAvatar] = useState(user.avatar);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const demo = () => toast(t("demo.feature"), false);

  const openPhoto = () => {
    setDraftAvatar(user.avatar);
    setPhotoOpen(true);
  };

  const pickPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast(t("prof.photoError"), false);
      return;
    }
    setPhotoBusy(true);
    try {
      setDraftAvatar(await fileToSquareDataUrl(file));
    } catch {
      toast(t("prof.photoError"), false);
    } finally {
      setPhotoBusy(false);
    }
  };

  const savePhoto = () => {
    setAvatar(draftAvatar);
    setPhotoOpen(false);
    toast(t("prof.photoSaved"), true);
  };

  const commitFont = (raw: string) => {
    const n = Number.parseInt(raw, 10);
    const next = Number.isFinite(n) ? clampFontPx(n) : clampFontPx(fontPx);
    setFontSize(next);
    setFontDraft(String(next));
  };

  const stepFont = (delta: number) => {
    const next = clampFontPx(fontPx + delta);
    setFontSize(next);
    setFontDraft(String(next));
  };

  return (
    <div className="min-h-full bg-bg">
      <Header title={t("nav.profile")} plain />
      <div className="px-4 lg:px-8 py-5 max-w-[640px] mx-auto space-y-5">
        {/* identity card */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="relative overflow-visible px-5 pt-7 pb-5 flex flex-col items-center text-center">
            <button onClick={openPhoto} className="relative" aria-label={t("prof.edit")}>
              <Avatar name={user.name} src={user.avatar} size={78} className="ring-4 ring-soft" />
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-500 text-white border-[3px] border-surface flex items-center justify-center shadow-card">
                <Pencil size={13} />
              </span>
            </button>
            <h2 className="mt-3.5 text-[17px] font-extrabold tracking-tight">{user.name}</h2>
            <p className="text-[12px] text-sub mt-0.5">{user.phone}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 bg-soft text-brand-700 dark:text-brand-300 text-[10.5px] font-bold px-3 py-1.5 rounded-full border border-brand-100">
              <ShieldCheck size={13} />
              {t("prof.tier")}
            </span>
          </Card>
        </motion.div>

        {/* menu */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          <Card className="divide-y divide-line/70 py-1">
            <ListRow icon={UserRound} title={t("prof.personal")} sub={`${user.name} · ${user.phone}`} onClick={demo} />
            <ListRow icon={ShieldCheck} tint="#D98A00" title={t("prof.security")} sub="PIN · OTP" onClick={demo} />
            <ListRow icon={Wallet} tint="#2B7CD3" title={t("prof.linked")} sub="CBE •**1130 · Awash •**8842" onClick={demo} />
            <ListRow icon={Users} tint="#7C5CE0" title={t("prof.beneficiaries")} onClick={() => navigate("payments")} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4 }}
        >
          <Card className="divide-y divide-line/70 py-1">
            <ListRow icon={Globe} tint="#0E9488" title={t("prof.language")} onClick={() => navigate("settings")} />
            <ListRow icon={Bell} tint="#C24E7E" title={t("prof.notifications")} onClick={() => navigate("settings")} />
            <ListRow icon={HelpCircle} tint="#66806F" title={t("prof.help")} onClick={demo} />
            <ListRow icon={Info} tint="#66806F" title={t("prof.about")} onClick={() => navigate("settings")} />
          </Card>
        </motion.div>

        {/* font size */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
        >
          <Card className="px-4 py-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: "#7C5CE014", color: "#7C5CE0" }}
              >
                <Type size={16} strokeWidth={2.1} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium">{t("prof.fontSize")}</p>
                <p className="text-[11px] text-sub mt-0.5">{t("prof.fontSizeSub")}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepFont(-1)}
                disabled={fontPx <= FONT_MIN_PX}
                aria-label="Decrease font size"
                className="w-11 h-11 rounded-xl bg-soft text-ink flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Minus size={16} strokeWidth={2.4} />
              </button>
              <label className="flex-1 h-11 rounded-xl bg-soft border border-line flex items-center justify-center gap-1.5">
                <input
                  type="number"
                  inputMode="numeric"
                  min={FONT_MIN_PX}
                  max={FONT_MAX_PX}
                  value={fontDraft}
                  onChange={(e) => {
                    setFontDraft(e.target.value);
                    const n = Number.parseInt(e.target.value, 10);
                    if (Number.isFinite(n) && n >= FONT_MIN_PX && n <= FONT_MAX_PX) setFontSize(n);
                  }}
                  onBlur={() => commitFont(fontDraft)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitFont(fontDraft);
                  }}
                  className="w-14 bg-transparent text-center text-[15px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[12px] font-bold text-sub pr-2">px</span>
              </label>
              <button
                type="button"
                onClick={() => stepFont(1)}
                disabled={fontPx >= FONT_MAX_PX}
                aria-label="Increase font size"
                className="w-11 h-11 rounded-xl bg-soft text-ink flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Plus size={16} strokeWidth={2.4} />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-sub">
              {FONT_MIN_PX}–{FONT_MAX_PX} px
            </p>

            <Btn variant="primary" icon={Save} className="mt-3" onClick={saveFontSize}>
              {t("common.save")}
            </Btn>
          </Card>
        </motion.div>

        {/* Download App */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="px-5 py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 flex items-center justify-center shadow-card">
                <img
                  src="https://images.sftcdn.net/images/t_app-icon-s/p/6ef58b81-d4cb-4309-b7d9-0228be98241e/2673368560/telebirr-logo"
                  alt="telebirr"
                  className="w-10 h-10 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold">{t("app.name")}</p>
                <p className="text-[12px] text-sub mt-0.5">v1.0.0 · Demo</p>
              </div>
            </div>
            <p className="text-[13px] text-sub mt-3 leading-relaxed">
              {t("download.desc")}
            </p>
            <Btn
              variant="primary"
              icon={Download}
              className="mt-4"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/telebirr-app.html';
                link.download = 'telebirr-app.html';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast(t("download.start"), true);
              }}
            >
              {t("download.btn")}
            </Btn>
            <p className="text-[11px] text-sub/60 mt-2.5 text-center">
              {t("download.note")}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Card className="py-1">
            <ListRow icon={LogOut} danger title={t("prof.signOut")} right={<span />} onClick={() => setConfirmOut(true)} />
          </Card>
        </motion.div>
      </div>

      <Modal open={photoOpen} onClose={() => setPhotoOpen(false)}>
        <div className="text-center">
          <h3 className="text-[17px] font-bold">{t("prof.photoTitle")}</h3>
          <p className="mt-1.5 text-[12.5px] text-sub">{t("prof.photoSub")}</p>
          <div className="mt-4 flex justify-center">
            <Avatar name={user.name} src={draftAvatar} size={96} className="ring-4 ring-soft" />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={pickPhoto}
            aria-label={t("prof.choosePhoto")}
          />
          <div className="mt-5 space-y-2.5">
            <Btn variant="primary" icon={ImagePlus} onClick={() => fileRef.current?.click()} disabled={photoBusy}>
              {t("prof.choosePhoto")}
            </Btn>
            <Btn variant="secondary" icon={RotateCcw} onClick={() => setDraftAvatar(DEFAULT_AVATAR)}>
              {t("prof.useDefault")}
            </Btn>
            <Btn variant="primary" icon={Save} onClick={savePhoto} disabled={photoBusy}>
              {t("common.save")}
            </Btn>
            <Btn variant="secondary" onClick={() => setPhotoOpen(false)}>
              {t("common.cancel")}
            </Btn>
          </div>
        </div>
      </Modal>

      <Modal open={confirmOut} onClose={() => setConfirmOut(false)}>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-danger/10 text-danger flex items-center justify-center">
            <LogOut size={24} />
          </div>
          <h3 className="mt-4 text-[17px] font-bold">{t("prof.signOutQ")}</h3>
          <p className="mt-1.5 text-[13px] text-sub">{t("prof.signOutSub")}</p>
          <div className="mt-5 space-y-2.5">
            <Btn variant="danger" onClick={() => { setConfirmOut(false); resetTo("login"); }}>
              {t("prof.signOut")}
            </Btn>
            <Btn variant="secondary" onClick={() => setConfirmOut(false)}>
              {t("common.cancel")}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
