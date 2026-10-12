"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Process.module.css";

const steps = [
  {
    num: "01",
    title: "Understand Your Business",
    desc: "We take the time to understand your organisation, workforce requirements, operational challenges, company culture, and long-term business objectives."
  },
  {
    num: "02",
    title: "Develop the Right HR Strategy",
    desc: "Based on your requirements, we design the most effective solution—whether it's Recruitment & Talent Acquisition, HR Consulting, Payroll Management, Statutory Compliance, Workforce Management, HR Outsourcing, or a combination of services."
  },
  {
    num: "03",
    title: "Execute with Precision",
    desc: "Our HR specialists implement the solution through structured processes, transparent communication, and professional execution, ensuring quality, compliance, and measurable business outcomes."
  },
  {
    num: "04",
    title: "Support & Grow Together",
    desc: "Our partnership continues beyond implementation. We provide ongoing HR support, workforce guidance, process improvement, and strategic recommendations that help your organisation adapt, grow, and succeed with confidence."
  }
];

export default function Process() {
  const [activeSteps, setActiveSteps] = useState(Array(steps.length).fill(false));
  const timelineRef = useRef(null);
  const lineTrackRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    let rafId;

    const updateScroll = () => {
      if (!timelineRef.current) return;

      const trackEl = timelineRef.current;
      const stepEls = trackEl.querySelectorAll(`.${styles.step}`);
      if (stepEls.length < 2) return;

      const firstStep = stepEls[0];
      const lastStep = stepEls[stepEls.length - 1];

      // Calculate circle center offsets dynamically
      const isMobile = window.innerWidth <= 767;
      const circleOffset = isMobile ? 25 : 30;

      const firstCenterRel = firstStep.offsetTop + circleOffset;
      const lastCenterRel = lastStep.offsetTop + circleOffset;
      const totalTrackHeight = Math.max(0, lastCenterRel - firstCenterRel);

      if (lineTrackRef.current) {
        lineTrackRef.current.style.top = `${firstCenterRel}px`;
        lineTrackRef.current.style.height = `${totalTrackHeight}px`;
      }

      const rect = trackEl.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const triggerPoint = viewHeight * 0.55;

      const firstCenterAbs = rect.top + firstCenterRel;
      const distanceScrolled = triggerPoint - firstCenterAbs;
      let pct = 0;
      if (totalTrackHeight > 0) {
        pct = Math.min(Math.max(distanceScrolled / totalTrackHeight, 0), 1);
      }

      if (progressLineRef.current) {
        progressLineRef.current.style.transform = `scaleY(${pct})`;
      }

      const newActive = Array.from(stepEls).map((stepEl) => {
        const stepRect = stepEl.getBoundingClientRect();
        return (stepRect.top + circleOffset) <= triggerPoint + 15;
      });

      setActiveSteps(newActive);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className={styles.processSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.label}>OUR PROCESS</div>
          <h2 className={styles.title}>Simple. Structured. Reliable.</h2>
          <p className={styles.headerDesc}>
            Every organisation has unique workforce needs. Our structured approach ensures the right HR solutions are delivered efficiently, professionally, and aligned with your business goals.
          </p>
        </div>

        <div ref={timelineRef} className={styles.timeline}>
          {/* Scroll progress vertical line: starts at Step 01 center and terminates at Step 04 center */}
          <div ref={lineTrackRef} className={styles.timelineLine}>
            <div
              ref={progressLineRef}
              className={styles.timelineProgressLine}
              style={{ transform: `scaleY(0)` }}
            />
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.step} ${activeSteps[index] ? styles.active : ""}`}
            >
              <div className={styles.numberContainer}>
                <div className={styles.numberWrapper}>
                  <span className={styles.number}>{step.num}</span>
                </div>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
