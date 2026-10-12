"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./WhyPartnerGrid.module.css";

const pillars = [
  {
    id: "business-aligned",
    num: "01",
    title: "Business-Aligned HR Solutions",
    desc: "HR strategies developed around your business goals, workforce structure, and long-term growth plans.",
    color: "#0284c7",
    textColor: "#0369a1",
    bgGradient: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    id: "practical-expertise",
    num: "02",
    title: "Practical HR Expertise",
    desc: "Professional HR solutions that improve operational efficiency, employee management, and organisational performance.",
    color: "#4f46e5",
    textColor: "#3730a3",
    bgGradient: "linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  {
    id: "pan-india",
    num: "03",
    title: "Pan-India Recruitment Capability",
    desc: "Reliable Recruitment & Talent Acquisition support across India through structured sourcing, screening, and industry-focused hiring.",
    color: "#059669",
    textColor: "#065f46",
    bgGradient: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    id: "industry-specific",
    num: "04",
    title: "Industry-Specific Experience",
    desc: "Practical workforce solutions backed by experience across diverse industries and business environments.",
    color: "#d97706",
    textColor: "#92400e",
    bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    id: "long-term",
    num: "05",
    title: "Long-Term HR Partnership",
    desc: "Supporting organisations beyond hiring through complete HR solutions that contribute to sustainable business growth.",
    color: "#e11d48",
    textColor: "#9f1239",
    bgGradient: "linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
];

export default function WhyPartnerGrid() {
  const [activeModalIndex, setActiveModalIndex] = useState(null);

  const openModal = (index) => {
    setActiveModalIndex(index);
  };

  const closeModal = useCallback(() => {
    setActiveModalIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveModalIndex((prev) => (prev === null ? 0 : (prev - 1 + pillars.length) % pillars.length));
  }, []);

  const handleNext = useCallback(() => {
    setActiveModalIndex((prev) => (prev === null ? 0 : (prev + 1) % pillars.length));
  }, []);

  // Lock body scroll and listen for Escape and Arrow keys
  useEffect(() => {
    if (activeModalIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalIndex, closeModal, handlePrev, handleNext]);

  const activePillar = activeModalIndex !== null ? pillars[activeModalIndex] : null;

  return (
    <>
      <div className={styles.whyGrid5}>
        {pillars.map((pillar, index) => (
          <button
            key={pillar.id}
            type="button"
            className={`${styles.whyCard} ${styles[`whyCard_${pillar.id}`]}`}
            onClick={() => openModal(index)}
            aria-haspopup="dialog"
            aria-label={`View details for ${pillar.title}`}
          >
            <div className={styles.iconContainer}>{pillar.icon}</div>
            <h3 className={styles.cardTitle}>{pillar.title}</h3>
            <p className={styles.cardDesc}>{pillar.desc}</p>
            <span className={styles.tapBadge}>Tap to view</span>
          </button>
        ))}
      </div>

      {/* Interactive Modal Popup */}
      <AnimatePresence>
        {activePillar && (
          <div className={styles.modalRoot} role="dialog" aria-modal="true" aria-labelledby="modal-pillar-title">
            {/* Backdrop */}
            <motion.div
              className={styles.modalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
            />

            {/* Modal Dialog Card */}
            <motion.div
              className={styles.modalWrapper}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={styles.modalCard}
                style={{
                  borderColor: activePillar.color,
                  boxShadow: `0 24px 60px -12px ${activePillar.color}35, 0 10px 30px rgba(0,0,0,0.12)`
                }}
              >
                {/* Top header strip with close button */}
                <div className={styles.modalHeader}>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={closeModal}
                    aria-label="Close dialog"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Themed Icon Badge */}
                <div className={styles.modalIconWrap}>
                  <div
                    className={styles.modalIcon}
                    style={{
                      backgroundColor: activePillar.color,
                      boxShadow: `0 8px 24px ${activePillar.color}40`
                    }}
                  >
                    {activePillar.icon}
                  </div>
                </div>

                {/* Title */}
                <h3
                  id="modal-pillar-title"
                  className={styles.modalTitle}
                  style={{ color: activePillar.textColor }}
                >
                  {activePillar.title}
                </h3>

                {/* Full Description */}
                <p className={styles.modalDesc}>{activePillar.desc}</p>

                {/* Modal Footer Controls */}
                <div className={styles.modalFooter}>
                  <div className={styles.modalNavGroup}>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={handlePrev}
                      aria-label="Previous pillar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <span className={styles.modalDots}>
                      {pillars.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          className={`${styles.modalDot} ${dotIdx === activeModalIndex ? styles.activeDot : ""}`}
                          style={{
                            backgroundColor: dotIdx === activeModalIndex ? activePillar.color : "#cbd5e1"
                          }}
                          onClick={() => setActiveModalIndex(dotIdx)}
                          aria-label={`Go to pillar ${dotIdx + 1}`}
                        />
                      ))}
                    </span>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={handleNext}
                      aria-label="Next pillar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.dismissBtn}
                    style={{
                      backgroundColor: activePillar.color,
                      boxShadow: `0 4px 16px ${activePillar.color}35`
                    }}
                    onClick={closeModal}
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
