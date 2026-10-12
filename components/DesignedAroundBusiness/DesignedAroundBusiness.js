"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./DesignedAroundBusiness.module.css";

const businessPillars = [
  {
    num: "01",
    title: "Business-Aligned HR Solutions",
    desc: "HR strategies developed around your business goals, workforce structure, and long-term growth plans.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    num: "02",
    title: "Practical HR Expertise",
    desc: "Professional HR solutions that improve operational efficiency, employee management, and organisational performance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  {
    num: "03",
    title: "Pan-India Recruitment Capability",
    desc: "Reliable Recruitment & Talent Acquisition support across India through structured sourcing, screening, and industry-focused hiring.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    num: "04",
    title: "Industry-Specific Experience",
    desc: "Practical workforce solutions backed by experience across diverse industries and business environments.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    num: "05",
    title: "Long-Term HR Partnership",
    desc: "Supporting organisations beyond hiring through complete HR solutions that contribute to sustainable business growth.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
];

export default function DesignedAroundBusiness() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isCooldown = useRef(false);
  const sectionRef = useRef(null);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, businessPillars.length - 1));
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (isCooldown.current) return;

      if (e.deltaY > 0) {
        // Scroll Down
        if (activeIndex < businessPillars.length - 1) {
          e.preventDefault();
          isCooldown.current = true;
          setActiveIndex((prev) => prev + 1);
          setTimeout(() => {
            isCooldown.current = false;
          }, 600);
        }
      } else if (e.deltaY < 0) {
        // Scroll Up
        if (activeIndex > 0) {
          e.preventDefault();
          isCooldown.current = true;
          setActiveIndex((prev) => prev - 1);
          setTimeout(() => {
            isCooldown.current = false;
          }, 600);
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className={styles.sectionContainer} id="why-partner">
      <div className="container">
        <div className={styles.centerContainer}>
          {/* Header Section */}
          <div className={styles.sectionHeader}>
            <div className={styles.introLabel}>WHY ORGANISATIONS PARTNER WITH STAFFSPECTRUM</div>
            <h2 className={styles.sectionTitle}>Designed Around Your Business—Not Generic HR Processes</h2>
            <p className={styles.sectionDesc}>
              Every business has unique workforce challenges, growth objectives, and operational requirements. Staffspectrum delivers practical HR solutions designed around your business.
            </p>
          </div>

          {/* Single Position Display Container */}
          <div className={styles.singlePositionBox}>
            {businessPillars.map((pillar, index) => {
              const isCurrent = index === activeIndex;
              const isPassed = index < activeIndex;

              return (
                <div
                  key={index}
                  className={`${styles.whyCard} ${
                    isCurrent
                      ? styles.cardActive
                      : isPassed
                      ? styles.cardPassed
                      : styles.cardUpcoming
                  }`}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.iconContainer}>{pillar.icon}</div>
                    <span className={styles.cardNumber}>{pillar.num}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{pillar.title}</h3>
                  <p className={styles.cardDesc}>{pillar.desc}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.counterBadge}>
                      Card {index + 1} of {businessPillars.length}
                    </span>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${((index + 1) / businessPillars.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Controls & Dots */}
          <div className={styles.controlsRow}>
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={styles.navBtn}
              aria-label="Previous card"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.dotsList}>
              {businessPillars.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`${styles.dotItem} ${idx === activeIndex ? styles.activeDot : ""}`}
                  aria-label={`Go to card ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={activeIndex === businessPillars.length - 1}
              className={styles.navBtn}
              aria-label="Next card"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
