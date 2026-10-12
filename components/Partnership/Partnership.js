import styles from "./Partnership.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Partnership() {
  return (
    <section className={styles.partnershipSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Partner with us to scale your brand across your organization</h2>
          <p className={styles.description}>
            We build scalable websites and growth systems that improve performance, increase visibility, and drive consistent business results.
          </p>
        </div>

        <div className={styles.contentBlock}>
          <div className={styles.imageContainer}>
            <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Partnership" fill sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className={styles.textContent}>
            <h3 className={styles.blockTitle}>All agency partnership programs come with:</h3>
            <ul className={styles.checklist}>
              <li className={styles.checklistItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Access to our network of top-tier talent and industry experts.
              </li>
              <li className={styles.checklistItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Custom-built strategy for talent acquisition and growth.
              </li>
              <li className={styles.checklistItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Dedicated account manager and consultation to ensure success.
              </li>
            </ul>
            <Link href="/services" className={styles.learnMore}>Learn More <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
          </div>
        </div>

        <div className={styles.contentBlock}>
          <div className={styles.imageContainer}>
            <Image src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Certification" fill sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className={styles.textContent}>
            <h3 className={styles.blockTitle}>Executive recruitment certification includes all of the above plus:</h3>
            <ul className={styles.checklist}>
              <li className={styles.checklistItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Extensive market research and competitive analysis.
              </li>
              <li className={styles.checklistItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Confidential search processes for high-level placements.
              </li>
              <li className={styles.checklistItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Long-term success tracking and onboarding support.
              </li>
            </ul>
            <Link href="/industries" className={styles.learnMore}>Learn More <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
          </div>
        </div>

      </div>
    </section>
  );
}
