import styles from "./AboutSection.module.css";
import Link from "next/link";

const focusAreas = [
  {
    title: "Smarter Hiring",
    desc: "Finding skilled professionals through targeted sourcing and structured recruitment.",
    num: "01"
  },
  {
    title: "Stronger HR Systems",
    desc: "Creating organised HR processes that improve operational efficiency and compliance.",
    num: "02"
  },
  {
    title: "Better Workforce Performance",
    desc: "Supporting employee development, engagement, and continuous performance improvement.",
    num: "03"
  }
];

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topRow}>
          <div className={styles.headerContent}>
            <div className={styles.label}>ABOUT STAFFSPECTRUM</div>
            <h2 className={styles.title}>Building Stronger Teams With Smarter HR Strategies</h2>
            <h3 className={styles.subtitle}>People are the foundation of every successful organisation.</h3>
          </div>
          <div className={styles.headerText}>
            <p className={styles.description}>
              Staffspectrum combines practical recruitment expertise, structured HR systems, and 
              strategic workforce solutions to help businesses strengthen people, improve operations, 
              and achieve sustainable growth.
            </p>
            <Link href="/about-us" className={styles.learnMoreBtn}>
              <span>Learn More About Us</span>
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>

        <div className={styles.focusGrid}>
          {focusAreas.map((area, index) => (
            <div key={index} className={styles.focusCard}>
              <span className={styles.cardNumber}>{area.num}</span>
              <h3 className={styles.cardTitle}>{area.title}</h3>
              <p className={styles.cardDesc}>{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
