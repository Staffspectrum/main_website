"use client";

import Link from "next/link";
import styles from "./industries.module.css";
import { industriesList } from "./industriesData";

const industrySolutionsList = [
  "Recruitment & Talent Acquisition",
  "Executive Search & Leadership Hiring",
  "HR Operations Management",
  "Payroll & Compliance Support",
  "Performance Management Systems",
  "Employee Engagement & Retention Solutions",
  "HR Consulting & Workforce Planning"
];

const whyBusinessesChoose = [
  "Industry-Specific HR Experience",
  "Structured and Transparent Process",
  "Quality-Focused Talent Selection",
  "Practical HR Implementation Support",
  "Experienced HR Professionals",
  "Scalable Solutions for Growing Businesses",
  "Long-Term Partnership Approach"
];

export default function IndustriesClient() {
  return (
    <div className={styles.industriesWrapper}>
      {/* 1. HERO SECTION (Black Background) */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>
            INDUSTRIES <br />
            WE SERVE
          </h1>
        </div>
      </section>

      {/* 2. OVERVIEW SECTION (White Background Content Part) */}
      <section className={`container ${styles.introSection}`}>
        <div className={styles.overviewCard}>
          <h2 className={styles.overviewTitle}>
            Specialised Recruitment &amp; HR Solutions Across Industries
          </h2>
          <div className={styles.overviewContent}>
            <p className={styles.overviewText}>
              Every industry operates differently. Each sector has unique workforce requirements, hiring challenges, compliance needs, and employee management expectations.
            </p>
            <p className={styles.overviewText}>
              Staffspectrum provides customised recruitment and HR solutions that help businesses find the right talent, create stronger HR systems, and build sustainable teams.
            </p>
            <p className={styles.overviewText}>
              With experience across multiple industries, we understand business challenges and deliver practical people solutions that support long-term growth.
            </p>
            <div className={styles.overviewCta}>
              <Link href="/contact-us?interest=industries" className={styles.overviewBtn}>
                <span>Connect With Our HR Experts</span>
                <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Grid Section */}
      <section className={`container ${styles.checklistSection}`}>
        <div className={styles.checklistCard}>
          <h3 className={styles.checklistCardTitle}>Our Industry Solutions Include</h3>
          <div className={styles.checklistGrid}>
            {industrySolutionsList.map((sol, index) => (
              <div className={styles.checkItem} key={index}>
                <span className={styles.bullet}></span>
                <span>{sol}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section id="catalog-section" className={`container ${styles.catalogSection}`}>
        <div className={styles.sectorsWrapper}>
          <h3 className={styles.sectorsTitle}>Sectors</h3>
          <div className={styles.tabsMenu}>
            {industriesList.map((ind) => (
              <Link
                key={ind.id}
                href={`/industries/sector/${ind.id}`}
                className={styles.tabBtn}
                style={{
                  backgroundColor: ind.bg,
                  borderColor: ind.borderColor,
                  "--tab-bg": ind.bg,
                  "--tab-border": ind.borderColor
                }}
              >
                <span className={styles.tabLabel}>{ind.title}</span>
                <span className={styles.plusIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyChooseSection}>
        <div className="container">
          <div className={styles.centerHeader}>
            <div className={styles.sectionLabel}>OUR STANDARDS</div>
            <h2 className={styles.centerTitle}>Why Businesses Choose Staffspectrum</h2>
            <p className={styles.centerSubtitle}>
              Businesses choose Staffspectrum because we focus on practical HR solutions that improve workforce quality, reduce operational challenges, and support long-term growth.
            </p>
          </div>

          <div className={styles.whyGrid}>
            {whyBusinessesChoose.map((strength, idx) => (
              <div key={idx} className={styles.whyCard}>
                <svg className={styles.whyCheckIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.whyCardText}>{strength}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`container ${styles.ctaSection}`}>
        <div className={styles.ctaCard}>
          <span className={styles.ctaLabel}>PARTNER WITH US</span>
          <h2 className={styles.ctaTitle}>Build the Right Team for Your Industry</h2>
          <p className={styles.ctaText}>
            Every business needs the right people and the right HR systems to grow. Staffspectrum provides recruitment, HR operations, compliance support, and workforce solutions designed around your industry needs. Staffspectrum — Your Complete HR Solution.
          </p>
          <Link href="/contact-us?interest=industries" className={styles.ctaBtn}>
            Connect With Our HR Experts
          </Link>
        </div>
      </section>
    </div>
  );
}
