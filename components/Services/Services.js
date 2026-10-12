"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Services.module.css";
import Link from "next/link";

const solutions = [
  "Recruitment & Talent Acquisition",
  "HR Operations Management",
  "HR & Management Consulting",
  "Payroll Management",
  "Statutory & Labour Compliance",
  "Workforce Management",
  "Employee Engagement & Retention",
  "Performance Management",
  "HR Outsourcing",
  "Employer Branding",
  "Training & Development"
];

export default function Services() {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          setActiveIndex(index);
        }
      });
    }, observerOptions);

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="services" className={styles.servicesSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.layoutGrid}>
          {/* Left Column: Fixed Sticky Header Content */}
          <div className={styles.leftCol}>
            <div className={styles.stickyHeader}>
              <div className={styles.label}>OUR HR SOLUTIONS</div>
              <h2 className={styles.title}>Complete HR Solutions for Every Stage of Business Growth</h2>
              <p className={styles.description}>
                Whether you're hiring your first employee or managing a growing workforce, Staffspectrum provides integrated HR solutions that help organisations attract the right talent, strengthen HR operations, ensure compliance, and build high-performing workplaces.
              </p>
              <div className={styles.actionRow}>
                <Link href="/services" className={styles.viewAllBtn}>
                  <span>View All Services</span>
                  <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Solutions List */}
          <div className={styles.rightCol}>
            <div className={styles.scrollList}>
              {solutions.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={index}
                    data-index={index}
                    ref={(el) => (itemRefs.current[index] = el)}
                    className={`${styles.textRow} ${isActive ? styles.activeRow : ""}`}
                  >
                    <span className={styles.itemNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={styles.itemText}>{item}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
