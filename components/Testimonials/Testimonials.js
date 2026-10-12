"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    category: "01 — Recruitment & Talent Acquisition",
    role: "HR Manager",
    org: "Client Organisation",
    text: "Staffspectrum has been a reliable recruitment partner for our organisation. Their team understood our requirements quickly, provided relevant candidates, and maintained clear communication throughout the hiring process. Their structured approach helped us fill critical positions efficiently."
  },
  {
    category: "02 — HR Solutions & Consulting",
    role: "Managing Director",
    org: "Client Organisation",
    text: "What we appreciate about Staffspectrum is that they look beyond recruitment. Their team understands our HR requirements and provides practical solutions that actually work for our organisation. Their professional approach and responsiveness have made them a valuable HR partner for us."
  },
  {
    category: "03 — HR Operations & Workforce Management",
    role: "Business Head",
    org: "Client Organisation",
    text: "Staffspectrum helped us bring more structure to our HR processes and workforce management. Their practical approach made our day-to-day HR operations more organised and efficient. The team has been supportive, professional, and easy to work with."
  },
  {
    category: "04 — Complete HR Support",
    role: "Director / Founder",
    org: "Client Organisation",
    text: "Working with Staffspectrum has given us access to professional HR expertise without adding unnecessary complexity to our operations. From people management to HR support, their team has been responsive and solution-oriented. We see them as a long-term partner rather than just a service provider."
  },
  {
    category: "05 — Long-Term Partnership",
    role: "HR / Operations Head",
    org: "Client Organisation",
    text: "We have had a positive experience working with Staffspectrum. Their understanding of our business, commitment to quality, and consistent communication have made a real difference. They have supported us with the right people and practical HR solutions as our organisation continues to grow."
  },
  {
    category: "06 — Recruitment & Talent Acquisition",
    role: "HR / Talent Acquisition Manager",
    org: "Client Organisation",
    text: "Staffspectrum has consistently supported us with quality candidates for our recruitment requirements. Their team takes the time to understand the role, company requirements, and candidate expectations before presenting profiles. The overall recruitment process has been professional, organised, and reliable."
  },
  {
    category: "07 — Complete HR Support",
    role: "Managing Director",
    org: "Client Organisation",
    text: "Staffspectrum has been more than a service provider for us. Their team has supported different aspects of our HR requirements with a practical understanding of our business. Having a reliable HR partner who can support us as our requirements evolve has been extremely valuable."
  },
  {
    category: "08 — HR Operations & Workforce Management",
    role: "Operations Head",
    org: "Client Organisation",
    text: "As our workforce grew, managing HR operations became increasingly challenging. Staffspectrum helped us bring better structure to our HR processes and workforce management. Their team has been responsive, professional, and focused on finding practical solutions to our day-to-day HR requirements."
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setVisibleCount(1);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  // Auto slide cards automatically every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [maxIndex, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  return (
    <section className={styles.testimonialsSection} id="testimonials">
      <svg className={styles.globeBg} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="45" />
        <ellipse cx="50" cy="50" rx="20" ry="45" />
        <line x1="5" y1="50" x2="95" y2="50" />
        <line x1="15" y1="25" x2="85" y2="25" />
        <line x1="15" y1="75" x2="85" y2="75" />
      </svg>

      <div className={`container ${styles.container}`}>
        <div className={styles.label}>CLIENT TESTIMONIALS</div>
        <h2 className={styles.title}>Trusted by Businesses Across Industries</h2>

        {/* Slider Carousel Container */}
        <div 
          className={styles.sliderWrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
            }}
          >
            {testimonials.map((t, index) => (
              <div 
                key={index} 
                className={styles.slideItem}
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
              >
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>{t.category}</div>
                      <div className={styles.authorRole}>— {t.role}, {t.org}</div>
                    </div>
                  </div>
                  <p className={styles.quote}>&ldquo;{t.text}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Controls */}
        <div className={styles.navControls}>
          <button 
            type="button" 
            className={styles.navBtn} 
            onClick={handlePrev}
            aria-label="Previous testimonials"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className={styles.dotsGroup}>
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                type="button"
                key={idx}
                className={`${styles.dot} ${currentIndex === idx ? styles.dotActive : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            type="button" 
            className={styles.navBtn} 
            onClick={handleNext}
            aria-label="Next testimonials"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
