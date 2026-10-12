import styles from "./TrustStrip.module.css";

const trustItems = [
  "Recruitment & Talent Acquisition",
  "HR Consulting",
  "HR Operations",
  "Payroll & Compliance",
  "Workforce Management",
  "CHRMP Professional Training"
];

export default function TrustStrip() {
  return (
    <section className={styles.trustStripSection}>
      <div className={styles.label}>CORE CAPABILITIES</div>
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {/* First group */}
          <div className={styles.marqueeGroup}>
            {trustItems.map((item, index) => (
              <div key={`group1-${index}`} className={styles.item}>
                <span className={styles.text}>{item}</span>
              </div>
            ))}
          </div>
          {/* Duplicated group for seamless looping */}
          <div className={styles.marqueeGroup} aria-hidden="true">
            {trustItems.map((item, index) => (
              <div key={`group2-${index}`} className={styles.item}>
                <span className={styles.text}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
