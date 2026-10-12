"use client";

import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Link from "next/link";
import styles from "./careers.module.css";
import { jobsList } from "./jobs-data";

export default function CareersContent({ initialJobs = jobsList }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    const list = initialJobs && initialJobs.length > 0 ? initialJobs : jobsList;
    return list.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        job.title.toLowerCase().includes(q) ||
        job.desc.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, initialJobs]);

  return (
    <>
      <Navbar />
      <main className={styles.careersPage}>
        {/* Dark Premium Hero Section */}
        <section className={styles.heroSection} id="careers-hero">
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>
              <span>CAREERS</span>
            </h1>
          </div>
        </section>

        {/* Overview Section (Content Part) */}
        <section className={`container ${styles.overviewSection}`} id="careers-overview">
          <div className={styles.overviewCard}>
            <h2 className={styles.overviewTitle}>
              Join Our Team &amp; Grow Together
            </h2>
            <div className={styles.overviewContent}>
              <p className={styles.overviewText}>
                Maintaining a strong candidate-centric recruitment strategy, Staff Spectrum has always been a deluge of opportunities. Let's work and grow together!
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className={`container ${styles.filterSection}`} id="careers-filters">
          <div className={styles.filterContainer}>
            {/* Search Input Bar */}
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search jobs by title, description, department, or location..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Dynamic Jobs Stack Section */}
        <section className={`container ${styles.jobsSection}`} id="careers-jobs">
          {filteredJobs.length > 0 ? (
            <div className={styles.jobsStack}>
              {filteredJobs.map((job, index) => (
                <div 
                  key={index} 
                  className={styles.jobCard}
                  id={`job-${job.linkSlug}`}
                >
                  <div className={styles.jobMeta}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <p className={styles.jobDesc}>{job.desc}</p>
                    
                    {/* Sorted Tags: Department, Experience, Qualification, Work Type, Location */}
                    <div className={styles.jobTags}>
                      <span className={styles.jobTag}>
                        <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        {job.department}
                      </span>
                      {job.experienceLevel && (
                        <span className={styles.jobTag}>
                          <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.experienceLevel}
                        </span>
                      )}
                      {job.qualification && (
                        <span className={styles.jobTag}>
                          <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                          {job.qualification}
                        </span>
                      )}
                      {job.employmentType && (
                        <span className={styles.jobTag}>
                          <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.employmentType}
                        </span>
                      )}
                      <span className={styles.jobTag}>
                        <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Apply Navigation Link */}
                  <Link href={`/careers/${job.linkSlug}`} className={styles.applyBtn} id={`apply-btn-${job.linkSlug}`}>
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noJobs}>
              <h3 className={styles.noJobsTitle}>No openings matched your filters</h3>
              <p>Try searching for a different keyword or adjusting the selected department.</p>
            </div>
          )}
        </section>


        {/* Premium CTA Contact Bar */}
        <section className={`container ${styles.contactBarSection}`} id="careers-contact-cta">
          <div className={styles.contactBar}>
            <div className={styles.contactBarLabel}>JOIN OUR TALENT DATABASE</div>
            <h2 className={styles.contactBarTitle}>Don't see your profile listed?</h2>
            <p className={styles.contactBarDesc}>
              We are constantly seeking outstanding, passionate individuals to join our talent database. Drop us your resume directly or give us a call, and let's explore opportunities together!
            </p>
            <div className={styles.buttonGrid}>
              <a href="mailto:info@staff-spectrum.com" className={styles.contactBtn}>
                <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Mail Us
              </a>
              <a href="tel:+918594000720" className={styles.contactBtn}>
                <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Call Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
