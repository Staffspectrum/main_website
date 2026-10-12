import styles from "./Featured.module.css";
import Link from "next/link";

const benefits = [
  "Corporate-Level Practical Training",
  "Live Recruitment Exposure",
  "Practical HR Operations",
  "Industry Mentorship",
  "Real Client Case Studies",
  "Placement Assistance"
];

export default function Featured() {
  return (
    <section className={styles.featuredSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <div className={styles.leftCol}>
            <div className={styles.label}>FEATURED PROGRAMME</div>
            <h2 className={styles.title}>Build Your Career in Human Resources</h2>
            <h3 className={styles.subtitle}>Certified Human Resource Management Professional (CHRMP)</h3>

            <p className={styles.experienceText}>
              Learn HR inside a professional HR Solutions company—not inside a traditional classroom.
            </p>
            <p className={styles.description}>
              Our CHRMP programme provides corporate-level practical training where participants experience how HR professionals work inside real organisations through live recruitment projects, HR operations, payroll processes, statutory compliance, employee management, and real client case studies.
            </p>
            <p className={styles.description}>
              Designed for graduates, aspiring HR professionals, career switchers, and working professionals who want practical corporate HR experience.
            </p>

            <Link href="/chrmp" className={styles.exploreBtn}>
              <span>Explore CHRMP</span>
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <div className={styles.rightCol}>
            <ul className={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <li key={index} className={styles.benefitItem}>
                  <span className={styles.bulletDot} />
                  <span className={styles.benefitText}>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
