import React from "react";
import styles from "./MissionVision.module.css";

export default function MissionVision({
  title = "Our Mission & Vision",
  subtitle = null,
  items = [
    {
      title: "Our Mission",
      text: "To empower organisations with practical Recruitment, HR Solutions, and Workforce Management services that improve hiring quality, strengthen people management, ensure compliance, and support long-term business growth.",
      subtext: "We are committed to delivering reliable, technology-enabled, and people-focused HR solutions that simplify workforce management and create lasting value for businesses and professionals."
    },
    {
      title: "Our Vision",
      text: "To become one of India's most trusted HR Solutions companies by helping organisations build stronger teams, smarter HR systems, and sustainable workplaces through innovation, integrity, and practical HR expertise.",
      subtext: "We aspire to be the preferred long-term HR partner for businesses seeking professional Recruitment, HR Consulting, Workforce Management, and people development solutions."
    }
  ]
}) {
  return (
    <section className={`container ${styles.sectionWrapper}`} id="mission-vision">
      <div className={styles.cardContainer}>
        {/* Content & Mission/Vision Details */}
        <div className={styles.contentCol}>
          {subtitle && <div className={styles.introLabel}>{subtitle}</div>}
          <h2 className={styles.mainTitle}>{title}</h2>

          <div className={styles.itemsGrid}>
            {items.map((item, idx) => (
              <div className={styles.missionItem} key={idx}>
                <div className={styles.itemHeader}>
                  <svg
                    className={styles.plusIcon}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#007CC4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                  </svg>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </div>
                <div className={styles.itemBody}>
                  <p className={styles.itemText}>{item.text}</p>
                  {item.subtext && <p className={styles.itemSubtext}>{item.subtext}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
