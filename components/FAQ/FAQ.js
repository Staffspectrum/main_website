"use client";

import { useState } from "react";
import styles from "./FAQ.module.css";

const faqs = [
  {
    q: "What does your agency do?",
    a: "We are a full-service recruitment and staffing agency, providing solutions for permanent staffing, contract hiring, executive search, and HR payroll management across various industries."
  },
  {
    q: "Who do you typically work with?",
    a: "We work with organizations of all sizes, from growing startups to established enterprises in sectors like Technology, Banking, Automobile, Life Science, and Retail."
  },
  {
    q: "How do we start a project with you?",
    a: "Simply reach out to us via our Contact page or give us a call. We'll set up a consultation to understand your specific hiring needs and formulate a strategy."
  },
  {
    q: "What types of services do you offer?",
    a: "Our core services include Market Intelligence, Executive Search, Permanent Staffing, Contract Hiring, HR Payroll, and Recruitment Outsourcing."
  },
  {
    q: "What does the engagement process look like?",
    a: "We start with an in-depth discovery phase, followed by targeted candidate sourcing, rigorous screening, interview coordination, and finally, offer negotiation and onboarding support."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.leftColumn}>
          <div className={styles.label}>FAQ</div>
          <h2 className={styles.title}>Frequently ask questions</h2>
        </div>

        <div className={styles.rightColumn}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ""}`}
              onClick={() => toggleFaq(index)}
            >
              <div className={styles.question}>
                {faq.q}
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={styles.answer}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
