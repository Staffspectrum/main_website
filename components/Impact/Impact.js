"use client";

import { useState } from "react";
import styles from "./Impact.module.css";
import Image from "next/image";

const steps = [
  {
    title: "Faster placements",
    desc: "To stay ahead of the game, reducing time in hiring should be your priority. We value your time, and our digital platform guarantees faster placements.",
    icon: (
      <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  {
    title: "Stay unique",
    desc: "We position each client uniquely to bring insight to their recruitment needs. Get personalized search and upgrade in a regular, timely manner.",
    icon: (
      <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    title: "Market intelligence",
    desc: "Well-grounded market intelligence, dynamic strategy and outstanding support for our clients have always made them stay ahead of their competitors.",
    icon: (
      <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    title: "Maintenance & Consulting",
    desc: "Our team of experts makes sure to provide personalised service for each client. Our lucrative consulting services helps us advise on the best approach.",
    icon: (
      <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  }
];

export default function Impact() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className={styles.impactSection}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.label}>IMPACT</div>
          <h2 className={styles.title}>How we create impact</h2>
          <p className={styles.description}>
            The core of everything Staff Spectrum does is to deliver powerful insights in a simple and compelling manner, creating a common language for understanding and improving your communication agility.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`${styles.step} ${activeStep === index ? styles.active : ""}`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className={styles.stepHeader}>
                  {step.icon}
                  {step.title}
                </div>
                <div className={styles.stepBody}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.images}>
            <div className={styles.imageCol}>
              <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Team meeting" fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className={styles.imageCol}>
              <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Office collaboration" fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className={styles.imageCol}>
              <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Strategic planning" fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
