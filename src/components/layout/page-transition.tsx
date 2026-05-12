"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}