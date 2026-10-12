import styles from "./FinalCTA.module.css";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className={styles.finalCtaSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <div className={styles.meshBg}></div>
          <div className={styles.ctaContent}>
            <h2 className={styles.title}>Let’s Build a Stronger Workforce Together</h2>
            <p className={styles.description}>
              Whether you need Recruitment &amp; Talent Acquisition, HR Consulting, Payroll Management, Statutory Compliance, HR Outsourcing, Workforce Management, or end-to-end HR support, Staffspectrum partners with your organisation to deliver practical HR solutions that improve people, processes, and long-term business performance.
            </p>

            <div className={styles.ctaGroup}>
              <Link href="/contact-us" className={styles.primaryCta}>
                <span>Talk to Our HR Experts</span>
                <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
