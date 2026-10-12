"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TextEffect } from "@/components/ui/text-effect";
import styles from "./Hero.module.css";

const slowSubtitleVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
};

const slowDescriptionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.035,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 8, filter: "blur(3px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
};

export default function Hero() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Fixed background image layer for mobile (prevents jumping during scroll) */}
      <div className={styles.heroBgFixed} />
      <div className={styles.heroGradientOverlay} />

      <div className={styles.heroContainer}>
        {/* Upper Zone: Headline, Subtitle & Key Stats on Left */}
        <div className={styles.heroTopRow}>
          <div className={styles.heroMainContent}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Sliding Headline Carousel */}
              <div className={styles.headlineSliderArea}>
                <div className={styles.headlineWrapper}>
                  <AnimatePresence mode="wait">
                    {slideIndex === 0 ? (
                      <motion.h1
                        key="slide-kerala"
                        initial={{ opacity: 0, x: -35, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: 35, filter: "blur(4px)" }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        className={styles.heroHeading}
                      >
                        Best HR
                        <br className={styles.mobileBreak} />
                        <span className={styles.desktopOnlySpace}> </span>
                        Solution
                        <br className={styles.desktopBreak} />
                        <span className={styles.mobileOnlySpace}> </span>
                        in{" "}
                        <br className={styles.mobileBreak} />
                        <span className={styles.highlightText}>
                          Kerala
                        </span>
                      </motion.h1>
                    ) : (
                      <motion.h1
                        key="slide-growing"
                        initial={{ opacity: 0, x: -35, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: 35, filter: "blur(4px)" }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        className={styles.heroHeading}
                      >
                        Complete HR
                        <br className={styles.mobileBreak} />
                        <span className={styles.desktopOnlySpace}> </span>
                        Solutions
                        <br className={styles.desktopBreak} />
                        <span className={styles.mobileOnlySpace}> </span>
                        for{" "}
                        <br className={styles.mobileBreak} />
                        <span className={styles.highlightText}>
                          Growing Businesses
                        </span>
                      </motion.h1>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subtle Indicator Dots */}
                <div className={styles.sliderIndicators} aria-label="Headline Navigation">
                  <button
                    type="button"
                    onClick={() => setSlideIndex(0)}
                    className={`${styles.sliderDot} ${slideIndex === 0 ? styles.sliderDotActive : ""}`}
                    aria-label="Best HR Solution in Kerala"
                  />
                  <button
                    type="button"
                    onClick={() => setSlideIndex(1)}
                    className={`${styles.sliderDot} ${slideIndex === 1 ? styles.sliderDotActive : ""}`}
                    aria-label="Complete HR Solutions for Growing Businesses"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <TextEffect
                per="word"
                variants={slowSubtitleVariants}
                delay={0.25}
                as="p"
                className={styles.heroSubtitle}
              >
                Hire Smarter. Build Stronger Teams.
              </TextEffect>

              {/* Metrics / Key Stats Row */}
              <div className={styles.statsRow}>
                {/* Stat 1: 99% */}
                <div className={styles.statCol}>
                  <div className={styles.statNumber}>99%</div>
                  <div className={styles.statLabel}>Client Satisfaction</div>
                  <div className={styles.avatarStack}>
                    <div className={styles.avatarItem}>
                      <Image
                        src="/executive-portrait.jpg"
                        alt="Executive"
                        width={28}
                        height={28}
                        className={styles.avatarImg}
                        priority
                      />
                    </div>
                    <div className={`${styles.avatarItem} ${styles.avatarOverlap}`}>
                      <Image
                        src="/bento-consultant-female.jpg"
                        alt="Consultant"
                        width={28}
                        height={28}
                        className={styles.avatarImg}
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Vertical Divider 1 */}
                <div className={styles.statDivider} aria-hidden="true" />

                {/* Stat 2: 95+ */}
                <div className={styles.statCol}>
                  <div className={styles.statNumber}>95+</div>
                  <div className={styles.statLabelCaps}>HAPPY CLIENTS</div>
                </div>

                {/* Vertical Divider 2 */}
                <div className={styles.statDivider} aria-hidden="true" />

                {/* Stat 3: 10+ */}
                <div className={styles.statCol}>
                  <div className={styles.statNumber}>10+</div>
                  <div className={styles.statLabelCaps}>INDUSTRIES SERVED</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lower Zone: Right Paragraph Copy & Action CTAs */}
        <div className={styles.heroBottomRow}>
          <div className={styles.heroRightContent}>
            <TextEffect
              per="word"
              variants={slowDescriptionVariants}
              delay={0.55}
              as="p"
              className={styles.heroDescription}
            >
              Staffspectrum is a professional HR solutions company helping organisations build stronger teams, efficient HR systems, and high-performing workplaces through practical, business-focused people solutions.
            </TextEffect>

            <div className={styles.heroButtonRow}>
              <Link href="/contact-us" className={styles.btnPrimary}>
                <span className={styles.btnTextDesktop}>CONNECT WITH OUR HR EXPERTS</span>
                <span className={styles.btnTextMobile}>CONNECT WITH OUR<br />HR EXPERTS</span>
                <span className={styles.btnArrow}>&rarr;</span>
              </Link>

              <Link href="/services" className={styles.btnSecondary}>
                <span className={styles.btnTextDesktop}>EXPLORE OUR SERVICES</span>
                <span className={styles.btnTextMobile}>EXPLORE OUR<br />SERVICES</span>
                <span className={styles.btnArrow}>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
