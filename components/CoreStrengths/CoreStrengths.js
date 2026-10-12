"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CoreStrengths.module.css";

const strengths = [
  "Recruitment & Talent Acquisition Expertise",
  "Nationwide Talent Network",
  "Industry-Specific Hiring Experience",
  "HR Operations & Workforce Management",
  "Payroll & Statutory Compliance",
  "HR Consulting & Workforce Planning",
  "HR Outsourcing Solutions",
  "Practical Corporate HR Training (CHRMP)",
  "Technology-Driven Recruitment Process",
  "Dedicated Long-Term HR Partnership"
];

export default function CoreStrengths() {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Only run scroll highlight in mobile view (max-width: 767px)
      if (typeof window === "undefined" || window.innerWidth > 767) {
        if (activeIndex !== null) {
          setActiveIndex(null);
        }
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const containerRect = containerRef.current.getBoundingClientRect();
          const winH = window.innerHeight;

          // Only track when container is partially in view
          if (containerRect.bottom < 0 || containerRect.top > winH) {
            ticking = false;
            return;
          }

          // Trigger earlier when scrolling down (at 60% of viewport height)
          const targetY = winH * 0.60;
          let closestIndex = -1;
          let minDistance = Infinity;

          itemRefs.current.forEach((el, index) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height / 2;
            const dist = Math.abs(elCenter - targetY);

            if (dist < minDistance) {
              minDistance = dist;
              closestIndex = index;
            }
          });

          if (closestIndex !== -1) {
            setActiveIndex(closestIndex);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeIndex]);

  return (
    <div ref={containerRef} className={styles.strengthsPillsContainer}>
      {strengths.map((strength, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`${styles.strengthPill} ${isActive ? styles.activePill : ""}`}
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth <= 767) {
                setActiveIndex(index);
              }
            }}
          >
            {strength}
          </div>
        );
      })}
    </div>
  );
}
