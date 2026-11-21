import { motion } from "framer-motion";

/**
 * The video's white rounded square stays still while only the green dotted
 * “O” mark inside it rotates. No black background.
 */
export default function LoadingLogo() {
  return (
    <div className="pointer-events-auto fixed inset-0 z-[95] flex items-center justify-center">
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-[26px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.14)] ring-1 ring-black/5">
        <motion.img
          src="/loading-o.png"
          alt="telebirr"
          className="h-[46px] w-[46px] object-contain"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
        />
      </div>
    </div>
  );
}
