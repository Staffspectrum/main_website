"use client";

import { useEffect, useRef } from "react";
import styles from "./IndustriesSection.module.css";
import Link from "next/link";

const industries = [
  {
    id: 1,
    name: "Technology & IT",
    desc: "Supporting technology companies with specialised recruitment, HR operations, workforce planning, and scalable HR solutions.",
    bg: "#dce8ff",
    iconColor: "#007CC4",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="16" width="64" height="44" rx="6" fill="currentColor" opacity="0.15" />
        <rect x="14" y="22" width="52" height="32" rx="3" fill="currentColor" opacity="0.3" />
        <polyline points="28 42 20 34 28 26" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="52 26 60 34 52 42" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="38" y1="22" x2="42" y2="46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="24" y="60" width="32" height="5" rx="2.5" fill="currentColor" opacity="0.4" />
        <rect x="32" y="55" width="16" height="6" rx="2" fill="currentColor" opacity="0.25" />
      </svg>
    )
  },
  {
    id: 2,
    name: "Retail & FMCG",
    desc: "Helping retail and FMCG businesses build productive teams through recruitment, payroll, HR operations, and workforce management.",
    bg: "#ffeedd",
    iconColor: "#007CC4",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 28 L12 20 H68 L64 28 V68 a4 4 0 0 1-4 4 H20 a4 4 0 0 1-4-4 Z" fill="currentColor" opacity="0.15" />
        <path d="M12 20 H68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 28 L12 20 H68 L64 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 36 a12 12 0 0 0 24 0" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <rect x="26" y="52" width="28" height="16" rx="3" fill="currentColor" opacity="0.3" />
        <line x1="40" y1="52" x2="40" y2="68" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 3,
    name: "Hospitality",
    desc: "Providing end-to-end HR solutions for hotels, restaurants, cafés, resorts, and hospitality businesses.",
    bg: "#d6f5ec",
    iconColor: "#00a878",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 32 H60 V60 a8 8 0 0 1-8 8 H28 a8 8 0 0 1-8-8 Z" fill="currentColor" opacity="0.15" />
        <path d="M60 32 H68 a8 8 0 0 1 0 16 H60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 32 H60 V60 a8 8 0 0 1-8 8 H28 a8 8 0 0 1-8-8 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <line x1="30" y1="20" x2="30" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="16" x2="40" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="20" x2="50" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="32" y="48" width="16" height="20" rx="2" fill="currentColor" opacity="0.35" />
      </svg>
    )
  },
  {
    id: 4,
    name: "Healthcare & Life Sciences",
    desc: "Supporting healthcare organisations with specialised recruitment, HR operations, compliance, and workforce management.",
    bg: "#fde0e8",
    iconColor: "#e0174b",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" fill="currentColor" opacity="0.12" />
        <path d="M10 40 H24 L32 18 L48 62 L56 40 H70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.35" />
      </svg>
    )
  },
  {
    id: 5,
    name: "Construction & Infrastructure",
    desc: "Delivering project recruitment, workforce management, compliance, and HR support for construction and infrastructure companies.",
    bg: "#ede9fe",
    iconColor: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="28" width="36" height="44" rx="3" fill="currentColor" opacity="0.15" />
        <rect x="12" y="28" width="36" height="44" rx="3" stroke="currentColor" strokeWidth="3" />
        <rect x="48" y="40" width="22" height="32" rx="3" fill="currentColor" opacity="0.12" />
        <rect x="48" y="40" width="22" height="32" rx="3" stroke="currentColor" strokeWidth="3" />
        <rect x="20" y="40" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.4" />
        <rect x="34" y="40" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.4" />
        <rect x="20" y="54" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.4" />
        <rect x="34" y="54" width="10" height="18" rx="1.5" fill="currentColor" opacity="0.3" />
        <path d="M16 28 L30 14 L44 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 6,
    name: "Manufacturing",
    desc: "Building productive manufacturing teams through recruitment, HR systems, compliance, and workforce optimisation.",
    bg: "#fef3c7",
    iconColor: "#d97706",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="14" fill="currentColor" opacity="0.2" />
        <circle cx="40" cy="40" r="7" fill="currentColor" opacity="0.4" />
        <path d="M40 12 L40 20 M40 60 L40 68 M12 40 L20 40 M60 40 L68 40 M18.7 18.7 L24.4 24.4 M55.6 55.6 L61.3 61.3 M61.3 18.7 L55.6 24.4 M24.4 55.6 L18.7 61.3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="2.5" opacity="0.2" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: 7,
    name: "Automobile",
    desc: "Supporting automotive businesses with specialised recruitment, HR operations, and workforce management solutions.",
    bg: "#cffafe",
    iconColor: "#0891b2",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 38 L22 24 H48 L58 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="6" y="38" width="52" height="18" rx="4" fill="currentColor" opacity="0.15" />
        <rect x="6" y="38" width="52" height="18" rx="4" stroke="currentColor" strokeWidth="3" />
        <circle cx="20" cy="62" r="8" fill="currentColor" opacity="0.3" />
        <circle cx="20" cy="62" r="4" fill="currentColor" opacity="0.6" />
        <circle cx="50" cy="62" r="8" fill="currentColor" opacity="0.3" />
        <circle cx="50" cy="62" r="4" fill="currentColor" opacity="0.6" />
        <rect x="56" y="32" width="16" height="18" rx="3" fill="currentColor" opacity="0.2" />
        <path d="M58 36 H70 L72 44 H58 Z" fill="currentColor" opacity="0.25" />
      </svg>
    )
  },
  {
    id: 8,
    name: "Logistics & Supply Chain",
    desc: "Providing recruitment, workforce planning, and HR solutions for logistics, warehousing, and supply chain operations.",
    bg: "#dcfce7",
    iconColor: "#16a34a",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="22" width="68" height="36" rx="5" fill="currentColor" opacity="0.12" />
        <rect x="6" y="22" width="68" height="36" rx="5" stroke="currentColor" strokeWidth="3" />
        <line x1="24" y1="22" x2="24" y2="58" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="56" y1="22" x2="56" y2="58" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <path d="M40 58 L40 64 M32 64 L48 64" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="66" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="60" cy="66" r="6" fill="currentColor" opacity="0.3" />
        <path d="M18 36 L30 30 L42 36 L54 30 L62 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 9,
    name: "Banking, Financial Services & Insurance (BFSI)",
    desc: "Helping financial organisations build high-performing teams through specialised recruitment and strategic HR solutions.",
    bg: "#dbeafe",
    iconColor: "#1d4ed8",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,8 72,28 72,32 8,32 8,28" fill="currentColor" opacity="0.2" />
        <polygon points="40,8 72,28 72,32 8,32 8,28" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="8" y="32" width="64" height="5" fill="currentColor" opacity="0.15" />
        <rect x="10" y="37" width="6" height="24" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="22" y="37" width="6" height="24" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="34" y="37" width="6" height="24" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="46" y="37" width="6" height="24" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="58" y="37" width="6" height="24" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="8" y="61" width="64" height="5" rx="2" fill="currentColor" opacity="0.3" />
        <rect x="4" y="66" width="72" height="5" rx="2" fill="currentColor" opacity="0.2" />
      </svg>
    )
  },
  {
    id: 10,
    name: "Sales & Customer Service",
    desc: "Supporting businesses with customer-facing talent, workforce management, and people-focused HR solutions.",
    bg: "#fce7f3",
    iconColor: "#db2777",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 14 C14 14 10 38 20 52 C30 66 54 70 68 68 L68 54 C68 54 56 50 52 46 L46 52 C46 52 32 44 28 34 L34 28 C34 28 30 16 26 14 Z" fill="currentColor" opacity="0.15" />
        <path d="M14 14 C14 14 10 38 20 52 C30 66 54 70 68 68 L68 54 C68 54 56 50 52 46 L46 52 C46 52 32 44 28 34 L34 28 C34 28 30 16 26 14 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M48 8 C56 8 64 16 64 24 C64 32 56 36 48 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <path d="M48 14 C52 14 58 18 58 24 C58 30 52 30 48 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </svg>
    )
  },
  {
    id: 11,
    name: "Media & Creative",
    desc: "Helping creative businesses build exceptional teams through specialised recruitment and talent management solutions.",
    bg: "#f3e8ff",
    iconColor: "#7c3aed",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="20" width="52" height="40" rx="5" fill="currentColor" opacity="0.15" />
        <rect x="6" y="20" width="52" height="40" rx="5" stroke="currentColor" strokeWidth="3" />
        <polygon points="58,28 74,20 74,60 58,52" fill="currentColor" opacity="0.25" />
        <polygon points="58,28 74,20 74,60 58,52" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="36" r="7" fill="currentColor" opacity="0.3" />
        <path d="M6 52 L20 38 L30 48 L40 36 L58 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 12,
    name: "Education & EdTech",
    desc: "Supporting educational institutions and EdTech companies with recruitment, HR operations, and workforce development solutions.",
    bg: "#d1fae5",
    iconColor: "#059669",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14 H56 a6 6 0 0 1 6 6 V64 a6 6 0 0 1-6 6 H12 a6 6 0 0 1-6-6 V20 a6 6 0 0 1 6-6 Z" fill="currentColor" opacity="0.12" />
        <path d="M12 14 H56 a6 6 0 0 1 6 6 V64 a6 6 0 0 1-6 6 H12 a6 6 0 0 1-6-6 V20 a6 6 0 0 1 6-6 Z" stroke="currentColor" strokeWidth="3" />
        <path d="M6 66 H62 a6 6 0 0 0 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="28" x2="50" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="18" y1="38" x2="50" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="18" y1="48" x2="38" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <rect x="64" y="8" width="10" height="56" rx="3" fill="currentColor" opacity="0.2" />
        <rect x="64" y="8" width="10" height="56" rx="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
];

export default function IndustriesSection() {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const trackContainerRef = useRef(null);

  // Auto-scroll slowly on mobile view
  useEffect(() => {
    const container = trackContainerRef.current;
    if (!container) return;

    let isPaused = false;
    let resumeTimeout;
    let rafId;

    const onTouchStart = () => {
      isPaused = true;
      clearTimeout(resumeTimeout);
    };

    const onTouchEnd = () => {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isPaused = false;
      }, 1200);
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });

    let lastTime = performance.now();

    const autoScroll = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (window.innerWidth <= 767 && !isPaused && container) {
        // Smooth gentle speed (~38px per second, device-refresh-rate independent)
        const step = Math.min(delta * 0.038, 2.5);
        container.scrollLeft += step;

        const halfScroll = container.scrollWidth / 2;
        if (halfScroll > 0 && container.scrollLeft >= halfScroll) {
          container.scrollLeft -= halfScroll;
        }
      }

      rafId = requestAnimationFrame(autoScroll);
    };

    rafId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resumeTimeout);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 767) {
        if (trackRef.current) {
          trackRef.current.style.transform = "";
        }
        return;
      }

      if (!wrapperRef.current || !trackRef.current) return;

      const wrapper = wrapperRef.current;
      const track = trackRef.current;

      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = rect.height;
      const scrollableRange = wrapperHeight - window.innerHeight;

      if (scrollableRange <= 0) return;

      const startThreshold = 180;
      const currentScroll = Math.max(0, (75 - rect.top) - startThreshold);
      let pct = currentScroll / (scrollableRange * 0.76);
      pct = Math.max(0, Math.min(1, pct));

      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;

      const maxScroll = Math.max(0, trackWidth - viewportWidth);

      track.style.transform = `translate3d(-${pct * maxScroll}px, 0, 0)`;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section ref={wrapperRef} className={styles.scrollSectionWrapper}>
      <div className={styles.stickyContainer}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div className={styles.label}>INDUSTRIES WE SUPPORT</div>
            <h2 className={styles.title}>
              Industry-Focused Recruitment <br />
              &amp; HR Solutions
            </h2>
            <p className={styles.description}>
              Every industry faces unique workforce challenges. Staffspectrum delivers specialised
              Recruitment &amp; Talent Acquisition and HR solutions tailored to the needs of diverse industries.
            </p>
          </div>

          {/* Horizontal Track Container */}
          <div ref={trackContainerRef} className={styles.horizontalTrackContainer}>
            <div ref={trackRef} className={styles.horizontalTrack}>
              {industries.map((ind) => (
                <Link
                  key={ind.id}
                  href={`/industries/sector/${ind.id}`}
                  className={styles.card}
                  style={{ "--card-bg": ind.bg, "--card-icon": ind.iconColor }}
                >
                  {/* Overflowing decorative icon */}
                  <div className={styles.iconBlob} style={{ color: ind.iconColor }}>
                    {ind.icon}
                  </div>

                  {/* Text */}
                  <h3 className={styles.cardName}>{ind.name}</h3>
                  <p className={styles.cardDesc}>{ind.desc}</p>

                  {/* CTA */}
                  <div className={styles.cta}>
                    <span className={styles.ctaText}>Explore roles</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              ))}

              {/* Duplicate cards for mobile continuous slow loop */}
              {industries.map((ind) => (
                <Link
                  key={`loop-${ind.id}`}
                  href={`/industries/sector/${ind.id}`}
                  className={`${styles.card} ${styles.mobileOnlyCard}`}
                  style={{ "--card-bg": ind.bg, "--card-icon": ind.iconColor }}
                >
                  <div className={styles.iconBlob} style={{ color: ind.iconColor }}>
                    {ind.icon}
                  </div>
                  <h3 className={styles.cardName}>{ind.name}</h3>
                  <p className={styles.cardDesc}>{ind.desc}</p>
                  <div className={styles.cta}>
                    <span className={styles.ctaText}>Explore roles</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.actionRow}>
            <Link href="/industries" className={styles.exploreBtn}>
              <span>Explore Industries</span>
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
