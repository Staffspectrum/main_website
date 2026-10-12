"use client";

import { useEffect, useState } from "react";
import styles from "./WhyTrust.module.css";

const pillars = [
  {
    title: "Business-Aligned HR Solutions",
    desc: "Solutions designed around your business objectives.",
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    title: "Pan-India Recruitment Capability",
    desc: "Supporting organisations across India with structured Recruitment & Talent Acquisition solutions.",
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    )
  },
  {
    title: "Industry-Specific Expertise",
    desc: "Understanding workforce challenges across multiple industries.",
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    title: "Experienced HR Professionals",
    desc: "Delivering practical HR solutions backed by experience.",
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  {
    title: "Quality & Compliance",
    desc: "Reliable HR systems built around accuracy and professional standards.",
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
  {
    title: "Long-Term Partnership",
    desc: "Supporting businesses beyond hiring through complete HR solutions.",
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
];

export default function WhyTrust() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const radius = 215; // Radius in pixels for the circular perimeter

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pillars.length);
    }, 2400); // Auto-rotation every 2.4 seconds (sped up for smoother flow)
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className={styles.whyTrustSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.headerColumn}>
            <div className={styles.label}>WHY BUSINESSES TRUST STAFFSPECTRUM</div>
            <h2 className={styles.title}>
              <span className={styles.titleLine}>More Than Recruitment.</span>
              <span className={styles.titleLine}>A Complete HR Partner.</span>
            </h2>
            <p className={styles.desc}>
              Successful organisations need more than talented employees—they need structured HR systems, efficient people processes, and a trusted partner who understands workforce challenges and business growth.
            </p>
            <p className={styles.subdesc}>
              Staffspectrum delivers integrated HR solutions that combine Recruitment & Talent Acquisition, HR Consulting, Payroll, Compliance, Workforce Management, and HR Outsourcing into one seamless partnership. We help organisations strengthen their workforce, improve operational efficiency, reduce compliance risks, and build sustainable, high-performing workplaces.
            </p>
          </div>

          {/* Desktop Circular Layout Wrapper */}
          <div
            className={styles.desktopCircleWrapper}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Stable central hub */}
            <div className={styles.circleHub}>
              <div className={styles.hubContent}>
                <span className={styles.hubPillarNum}>0{activeIndex + 1}</span>
                <h3 className={styles.hubTitle}>{pillars[activeIndex].title}</h3>
                <p className={styles.hubDesc}>{pillars[activeIndex].desc}</p>
              </div>
            </div>

            {/* Orbiting container */}
            <div className={styles.desktopCircleContainer}>
              {/* Background Dotted Orbit Track */}
              <div className={styles.orbitTrack} />

              {/* Circular orbiting nodes */}
              {pillars.map((pillar, index) => {
                const angle = (index * (360 / pillars.length) - 90) * (Math.PI / 180);
                const x = Math.round(Math.cos(angle) * radius);
                const y = Math.round(Math.sin(angle) * radius);
                const active = index === activeIndex;

                return (
                  <div
                    key={index}
                    className={`${styles.circleNode} ${active ? styles.activeNode : ""}`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className={styles.nodeIcon}>
                      {pillar.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Circular Layout */}
          <div
            className={styles.mobileCircleLayout}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Description Card at Top */}
            <div className={styles.mobileDescCard}>
              <h3 className={styles.mobileDescTitle}>{pillars[activeIndex].title}</h3>
              <p className={styles.mobileDescText}>{pillars[activeIndex].desc}</p>
            </div>

            {/* Circular Orbit Area */}
            <div className={styles.mobileCircleWrapper}>
              {/* Vertical connector line from center hub to top description */}
              <div className={styles.mobileConnectorLine} />
              <div className={styles.mobileConnectorDot} />

              {/* Dotted Orbit Track */}
              <div className={styles.mobileOrbitTrack} />

              {/* Center Hub with the Active Number */}
              <div className={styles.mobileCenterHub}>
                <span className={styles.mobileCenterNum}>0{activeIndex + 1}</span>
              </div>

              {/* 6 Circular Nodes around perimeter */}
              {pillars.map((pillar, index) => {
                // Symmetrical placement leaving 12 o'clock open for vertical line to top
                const angle = ((index * 60 - 60) * Math.PI) / 180;
                const mobRadius = 105;
                const x = Math.round(Math.cos(angle) * mobRadius);
                const y = Math.round(Math.sin(angle) * mobRadius);
                const active = index === activeIndex;

                return (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.mobileCircleNode} ${active ? styles.mobileActiveNode : ""}`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) ${active ? "scale(1.15)" : "scale(1)"}`
                    }}
                    onClick={() => setActiveIndex(index)}
                    aria-label={pillar.title}
                  >
                    <div className={styles.mobileNodeIcon}>
                      {pillar.icon}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pagination / step indicator dots */}
            <div className={styles.mobilePagination}>
              {pillars.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.pageDot} ${idx === activeIndex ? styles.activePageDot : ""}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to pillar ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
