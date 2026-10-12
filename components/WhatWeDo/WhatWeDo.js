import React from "react";
import styles from "./WhatWeDo.module.css";
import Link from "next/link";
import Image from "next/image";

export default function WhatWeDo() {
  return (
    <section className={styles.whatWeDoSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.gridContainer}>
          {/* Left Side: Photo */}
          <div className={styles.illustrationCol}>
            <div className={styles.imageWrapper}>
              <Image
                src="/what-we-do.webp"
                alt="Staffspectrum HR Management Solutions - What We Do"
                width={560}
                height={400}
                sizes="(max-width: 768px) 100vw, 560px"
                className={styles.illustrationImg}
              />
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className={styles.contentCol}>
            <div className={styles.label}>WHAT WE DO</div>
            <h2 className={styles.title}>Your Complete HR Partner</h2>

            <p className={styles.paragraph}>
              Managing people requires more than hiring the right employees. It requires structured HR systems, efficient processes, and practical workforce strategies that support long-term business growth.
            </p>
            <p className={styles.paragraph}>
              Staffspectrum partners with organisations to simplify people management through integrated HR solutions that improve hiring, strengthen HR operations, ensure compliance, and enhance workforce performance.
            </p>
            <p className={styles.paragraph}>
              Whether you need support for a critical hire or complete HR management, we deliver practical, business-focused solutions tailored to your organisation.
            </p>

            <Link href="/services" className={styles.servicesBtn}>
              <span>Explore Our Services</span>
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
