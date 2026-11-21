import { motion } from "framer-motion";
import { useEffect } from "react";
import { useApp } from "../store/AppContext";

export default function Splash() {
  const { resetTo } = useApp();

  useEffect(() => {
    const id = window.setTimeout(() => resetTo("login"), 1900);
    return () => window.clearTimeout(id);
  }, [resetTo]);

  return (
    <div className="flex h-full min-h-full items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex h-[104px] w-[104px] items-center justify-center rounded-[18px] bg-white shadow-[0_10px_30px_rgb(0_0_0/0.35)]"
      >
        <img src="/telebirr-symbol.png" alt="telebirr" className="h-[76px] w-[76px] object-contain" />
      </motion.div>
    </div>
  );
}
