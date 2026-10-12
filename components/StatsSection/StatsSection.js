import React from "react";
import styles from "./StatsSection.module.css";

const stats = [
  { value: "89+", label: "Happy Clients" },
  { value: "10+", label: "Industries Served" },
  { value: "Across India", label: "Recruitment Support" },
  { value: "99%", label: "Client Satisfaction" }
];

export default function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.label}>STAFFSPECTRUM BY THE NUMBERS</div>
          <h2 className={styles.title}>Trusted by Businesses Since 2016</h2>
        </div>

        <div className={styles.statsRow}>
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className={styles.statItem}>
                <span className={styles.value}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
              {index < stats.length - 1 && <div className={styles.verticalDivider} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
