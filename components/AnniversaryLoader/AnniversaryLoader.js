"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import styles from "./AnniversaryLoader.module.css";

const DISPLAY_DURATION_MS = 10000;
// Expiry cutoff: November 11, 2026 at 23:59:59 IST (After this date, the banner will not show)
const BANNER_EXPIRY_TIME = new Date("2026-11-11T23:59:59+05:30").getTime();

export default function AnniversaryLoader() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    // Automatically stop displaying after November 11, 2026
    if (Date.now() > BANNER_EXPIRY_TIME) {
      return;
    }

    setMounted(true);
    setIsOpen(true);

    const autoCloseTimer = setTimeout(() => {
      setIsOpen(false);
    }, DISPLAY_DURATION_MS);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(autoCloseTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock body scroll while popup is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Staffspectrum 10th Anniversary Announcement"
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 320,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close celebration banner"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            {/* Banner Media */}
            <div className={styles.bannerWrapper}>
              <Image
                src="/Staffspectrum_ A Decade of Possibilities.jpg.jpeg"
                alt="Staffspectrum - A Decade of Possibilities"
                width={2048}
                height={768}
                priority
                className={styles.bannerImage}
                sizes="(max-width: 768px) 95vw, 1060px"
              />
            </div>

            {/* 10-Second Progress Bar */}
            <div className={styles.progressContainer}>
              <motion.div
                className={styles.progressBar}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: DISPLAY_DURATION_MS / 1000,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
