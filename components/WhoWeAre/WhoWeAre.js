import styles from "./WhoWeAre.module.css";
import Link from "next/link";
import IndiaMap from "./IndiaMap";

export default function WhoWeAre() {
  return (
    <section className={styles.whoWeAreSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <div className={styles.label}>WHO WE ARE</div>
            <h2 className={styles.title}>Professional HR Solutions for Growing Businesses</h2>

            <p className={styles.paragraph}>
              Staffspectrum is a professional HR Solutions company helping organisations build stronger teams, efficient HR systems, and sustainable workplaces through practical, business-focused people solutions.
            </p>
            <p className={styles.paragraph}>
              Since 2016, we have partnered with startups, SMEs, and established organisations across industries to strengthen hiring, streamline HR operations, improve compliance, and build workforce strategies that support long-term business growth.
            </p>
            <p className={styles.paragraph}>
              From Recruitment & Talent Acquisition to HR Consulting, Payroll, Compliance, Workforce Management, and HR Outsourcing, we deliver integrated HR solutions tailored to the unique needs of every organisation.
            </p>

            <Link href="/about-us" className={styles.aboutBtn}>
              <span>ABOUT STAFFSPECTRUM</span>
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <div className={styles.mapColumn}>
            <IndiaMap />
          </div>
        </div>
      </div>
    </section>
  );
}
