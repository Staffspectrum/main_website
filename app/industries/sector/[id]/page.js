import Navbar from "../../../../components/Navbar/Navbar";
import Footer from "../../../../components/Footer/Footer";
import { industriesList } from "../../industriesData";
import Link from "next/link";
import styles from "./sector.module.css";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return industriesList.map((ind) => ({ id: String(ind.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const ind = industriesList.find((i) => i.id === parseInt(id, 10));
  if (!ind) return {};
  return {
    title: `${ind.title} | Industries We Serve | Staff Spectrum`,
    description: ind.about,
  };
}

export default async function SectorPage({ params }) {
  const { id } = await params;
  const industry = industriesList.find((i) => i.id === parseInt(id, 10));
  if (!industry) notFound();

  const currentIndex = industriesList.findIndex((i) => i.id === industry.id);
  const prevIndustry = currentIndex > 0 ? industriesList[currentIndex - 1] : null;
  const nextIndustry = currentIndex < industriesList.length - 1 ? industriesList[currentIndex + 1] : null;

  const idStr = String(industry.id).padStart(2, "0");

  return (
    <>
      <Navbar />
      <main className={styles.wrapper}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <Link href="/industries#catalog-section" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Industries
            </Link>
            <div className={styles.heroNumber}>{idStr}</div>
            <h1 className={styles.heroTitle}>{industry.title}</h1>
            <p className={styles.heroSubtitle}>Industry-Focused Recruitment &amp; HR Solutions</p>
          </div>
        </section>

        {/* Content */}
        <div className={`container ${styles.contentWrapper}`}>

          {/* About */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>About the Industry</div>
            <p className={styles.aboutText}>{industry.about}</p>
          </section>

          {/* Challenges */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Industry Workforce Challenges</div>
            <ul className={styles.challengesList}>
              {industry.challenges.map((c, i) => (
                <li key={i} className={styles.challengeItem}>
                  <span className={styles.bullet}></span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            {industry.challengesText && (
              <p className={styles.challengesNote}>{industry.challengesText}</p>
            )}
          </section>

          {/* How Staffspectrum Supports */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>How Staffspectrum Supports</div>
            <div className={styles.supportGrid}>
              <div className={styles.supportCard}>
                <h3 className={styles.supportTitle}>Recruitment &amp; Talent Acquisition</h3>
                <p className={styles.supportText}>{industry.recruitmentSupport}</p>
              </div>
              {industry.hrSupport && (
                <div className={styles.supportCard}>
                  <h3 className={styles.supportTitle}>HR Solutions</h3>
                  <p className={styles.supportText}>{industry.hrSupport}</p>
                </div>
              )}
            </div>
          </section>

          {/* Previous / Next Navigation */}
          <div className={styles.navRow}>
            {prevIndustry ? (
              <Link href={`/industries/sector/${prevIndustry.id}`} className={styles.navBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>{prevIndustry.title}</span>
              </Link>
            ) : <div />}

            {nextIndustry ? (
              <Link href={`/industries/sector/${nextIndustry.id}`} className={`${styles.navBtn} ${styles.navBtnNext}`}>
                <span>{nextIndustry.title}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ) : <div />}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
