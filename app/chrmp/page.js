import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Link from "next/link";
import styles from "./chrmp.module.css";

export const metadata = {
  title: "Certified Human Resource Management Professional (CHRMP) | Staffspectrum",
  description: "Experience Real HR. Build Real Skills. Launch Your HR Career. Corporate-level practical HR training program designed to prepare aspiring HR professionals through real workplace experience.",
};

export default function ChrmpPage() {
  const syllabus = [
    {
      title: "Recruitment & Talent Acquisition",
      items: [
        "Understanding manpower requirements",
        "Preparing job descriptions",
        "Job posting across recruitment platforms",
        "Candidate sourcing",
        "Resume screening",
        "Interview coordination",
        "Candidate evaluation",
        "Salary negotiation basics",
        "Offer management",
        "Joining process"
      ]
    },
    {
      title: "HR Operations Management",
      items: [
        "Employee onboarding",
        "Employee file management",
        "Attendance management",
        "Leave management",
        "HR letters & documentation",
        "Employee database management",
        "HR reporting",
        "Exit documentation"
      ]
    },
    {
      title: "Payroll & Statutory Compliance",
      items: [
        "Salary structure understanding",
        "Payroll processing fundamentals",
        "PF & ESI overview",
        "Statutory compliance basics",
        "Compliance documentation",
        "Employee records management"
      ]
    },
    {
      title: "Employee Relations & Workplace Management",
      items: [
        "Employee communication",
        "Employee engagement",
        "Conflict handling basics",
        "Workplace discipline",
        "Professional HR behaviour",
        "HR coordination"
      ]
    },
    {
      title: "HR Technology & Digital Tools",
      items: [
        "HRMS Software",
        "Applicant Tracking System (ATS)",
        "Recruitment Platforms",
        "Microsoft Excel for HR",
        "Google Workspace",
        "AI Tools for HR Professionals",
        "Professional Email Communication"
      ]
    }
  ];

  const practicalDocuments = [
    "Job Descriptions & Manpower Requisition Forms",
    "Recruitment Trackers",
    "Candidate Evaluation & Interview Assessment Forms",
    "Offer & Appointment Letters",
    "Employee Personal Files & Joining Documentation",
    "Attendance & Leave Registers",
    "Payroll Sheets & Payslips",
    "HR Policies & Employee Handbooks",
    "Warning & Disciplinary Letters",
    "Performance Appraisal Forms",
    "Employee Onboarding & Exit Checklists",
    "Resignation & Full and Final Settlement Documents",
    "Experience & Relieving Letters",
    "HR Reports & MIS",
    "Employee Feedback & Engagement Forms",
    "Training & Development Records"
  ];

  const hrTools = [
    "HRMS Software",
    "Applicant Tracking System (ATS)",
    "Microsoft Excel",
    "Google Workspace",
    "AI Tools for HR",
    "Job Portals",
    "LinkedIn Recruitment",
    "Professional Email Systems"
  ];

  const faqs = [
    {
      q: "Do I need previous HR experience?",
      a: "No. CHRMP is designed for beginners as well as professionals who want to build or advance their HR careers."
    },
    {
      q: "Is this a practical training program?",
      a: "Yes. CHRMP focuses on real corporate HR practices with hands-on workplace exposure rather than only classroom theory."
    },
    {
      q: "Will I receive a certificate?",
      a: "Yes. Participants who successfully complete the program will receive the Certified Human Resource Management Professional (CHRMP) certification from Staffspectrum."
    },
    {
      q: "Will I get placement assistance?",
      a: "Yes. We provide resume preparation, interview training, career guidance, and placement assistance through our recruitment network."
    },
    {
      q: "Can working professionals join?",
      a: "Absolutely. The program is suitable for both fresh graduates and working professionals looking to enhance their HR expertise."
    }
  ];

  return (
    <>
      <Navbar />
      <main className={styles.chrmpPage}>
        {/* 1. HERO SECTION */}
        <section className={styles.heroSection} id="chrmp-hero">
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>
              Certified Human Resource<br />
              Management Professional<br />
              (CHRMP)
            </h1>
          </div>
        </section>

        {/* 2. PROGRAM OVERVIEW & INTRO */}
        <section className={`container ${styles.overviewSection}`} id="chrmp-overview">
          <div className={styles.overviewCard}>
            <h2 className={styles.overviewTitle}>
              Experience Real HR. Build Real Skills. Launch Your HR Career.
            </h2>
            <div className={styles.overviewContent}>
              <p className={styles.overviewText}>
                CHRMP by Staffspectrum is a corporate-level practical HR training program designed to prepare aspiring HR professionals through real workplace experience.
              </p>
              <p className={styles.overviewText}>
                Unlike traditional classroom-based HR courses that focus mainly on theory, CHRMP provides hands-on exposure inside a professional HR consulting and recruitment company. Participants learn how Human Resource departments actually function by working on live recruitment, HR operations, documentation, payroll fundamentals, compliance, employee management, and corporate HR processes.
              </p>
              <div className={styles.heroHighlightBox}>
                At Staffspectrum, you don't just learn HR—you experience it.
              </div>

              <div className={styles.heroChecks}>
                <div className={styles.heroCheckItem}>
                  <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Practical Corporate HR Training</span>
                </div>
                <div className={styles.heroCheckItem}>
                  <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Live Recruitment Exposure</span>
                </div>
                <div className={styles.heroCheckItem}>
                  <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>HR Operations Experience</span>
                </div>
                <div className={styles.heroCheckItem}>
                  <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>HRMS &amp; ATS Software Exposure</span>
                </div>
                <div className={styles.heroCheckItem}>
                  <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Industry-Recognized Certification</span>
                </div>
                <div className={styles.heroCheckItem}>
                  <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Placement Assistance</span>
                </div>
              </div>

              <div className={styles.heroCta} style={{ marginTop: "1rem" }}>
                <Link href="/contact-us?interest=chrmp" className={styles.primaryBtn}>
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHY CHOOSE CHRMP */}
        <section className={`container ${styles.overviewSection}`} id="why-choose">
          <div className={styles.overviewGrid}>
            <div className={styles.overviewIntro}>
              <div className={styles.sectionLabel}>WHY CHOOSE CHRMP AT STAFFSPECTRUM?</div>
              <h2 className={styles.sectionTitle}>Beyond Theory. Real Corporate HR Experience.</h2>
              <p className={styles.overviewTextHighlighted}>
                Most HR courses teach concepts. CHRMP prepares you through practical workplace learning.
              </p>
              <p className={styles.overviewText}>
                As a professional HR consulting and recruitment company serving businesses across India, Staffspectrum gives you the opportunity to learn from real HR professionals handling actual business requirements every day.
              </p>
              <p className={styles.overviewText}>
                Participants are trained in a professional office environment and gain experience by performing HR responsibilities under expert guidance.
              </p>
            </div>

            <div className={styles.overviewWhyCard}>
              <h3 className={styles.whyCardTitle}>You Will Experience</h3>
              <ul className={styles.checkList}>
                <li>Real HR workflows</li>
                <li>Live recruitment activities</li>
                <li>Practical HR documentation</li>
                <li>HR operations management</li>
                <li>Corporate communication</li>
                <li>Workplace challenges</li>
                <li>Professional problem-solving</li>
              </ul>
              <div className={styles.whyFocus}>
                <strong>Our mission is simple:</strong>
                <p>Prepare you for your HR career before you step into your first HR role.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROGRAM OPTIONS */}
        <section className={styles.optionsSection} id="program-options">
          <div className="container">
            <div className={styles.centerHeader}>
              <div className={styles.sectionLabel}>PROGRAM OPTIONS</div>
              <h2 className={styles.centerTitle}>Choose Your Career Pathway</h2>
            </div>

            <div className={styles.optionsGrid}>
              {/* Fast Track */}
              <div className={styles.optionCard}>
                <div className={styles.optionHeader}>
                  <h3 className={styles.optionName}>CHRMP Fast Track Program</h3>
                  <div className={styles.optionDuration}>Duration: 3 Months</div>
                </div>
                <div className={styles.optionBody}>
                  <div className={styles.listSection}>
                    <h4 className={styles.listTitle}>Best For:</h4>
                    <ul className={styles.optionList}>
                      <li>MBA HR Students</li>
                      <li>HR Graduates</li>
                      <li>Working Professionals</li>
                      <li>HR Career Upgrade Candidates</li>
                    </ul>
                  </div>
                  <div className={styles.listSection}>
                    <h4 className={styles.listTitle}>Program Focus:</h4>
                    <ul className={styles.checkList}>
                      <li>Practical HR Operations</li>
                      <li>Recruitment Process</li>
                      <li>Employee Documentation</li>
                      <li>Payroll Fundamentals</li>
                      <li>HR Software Exposure</li>
                      <li>Corporate HR Practices</li>
                      <li>Certification</li>
                      <li>Placement Assistance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Advanced Professional */}
              <div className={styles.optionCard}>
                <div className={styles.optionHeader}>
                  <h3 className={styles.optionName}>CHRMP Advanced Professional Program</h3>
                  <div className={styles.optionDuration}>Duration: 6 Months</div>
                </div>
                <div className={styles.optionBody}>
                  <div className={styles.listSection}>
                    <h4 className={styles.listTitle}>Best For:</h4>
                    <ul className={styles.optionList}>
                      <li>Fresh Graduates</li>
                      <li>Career Beginners</li>
                      <li>Candidates from Non-HR Backgrounds</li>
                      <li>Career Switchers</li>
                    </ul>
                  </div>
                  <div className={styles.listSection}>
                    <h4 className={styles.listTitle}>Program Focus:</h4>
                    <ul className={styles.checkList}>
                      <li>Complete HR Department Exposure</li>
                      <li>Live Recruitment Handling</li>
                      <li>Real Client Requirements</li>
                      <li>Employee Lifecycle Management</li>
                      <li>HR Administration</li>
                      <li>Payroll &amp; Compliance Training</li>
                      <li>HR Policy Preparation</li>
                      <li>Performance Management Fundamentals</li>
                      <li>Corporate Communication Skills</li>
                      <li>Interview Preparation</li>
                      <li>Placement Assistance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CURRICULUM SYLLABUS SECTION */}
        <section className={styles.syllabusSection} id="curriculum">
          <div className="container">
            <div className={styles.centerHeader}>
              <div className={styles.sectionLabel}>CURRICULUM</div>
              <h2 className={styles.centerTitle}>What You Will Learn</h2>
            </div>

            <div className={styles.syllabusGrid}>
              {syllabus.map((category, idx) => (
                <div key={idx} className={styles.syllabusCard}>
                  <div className={styles.syllabusHeader}>
                    <div className={styles.syllabusNumberWrap}>
                      <span className={styles.syllabusNumber}>0{idx + 1}</span>
                    </div>
                    <h3 className={styles.syllabusCardTitle}>{category.title}</h3>
                  </div>
                  <ul className={styles.syllabusList}>
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <span className={styles.syllabusCheck}></span>
                        <span className={styles.syllabusItemText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRACTICAL HR DOCUMENTATION */}
        <section className={`container ${styles.documentsSection}`} id="hr-documents">
          <div className={styles.leftHeader}>
            <div className={styles.sectionLabel}>PRACTICAL HR DOCUMENTATION</div>
            <h2 className={styles.leftTitle}>HR Documents You&apos;ll Work On</h2>
            <p className={styles.leftSubtitle}>
              Gain hands-on experience preparing and managing professional HR documents used in everyday corporate HR operations.
            </p>
          </div>

          <div className={styles.documentsBulletGrid}>
            {practicalDocuments.map((doc, idx) => (
              <div key={idx} className={styles.documentBulletItem}>
                <span className={styles.documentBulletDot}></span>
                <span className={styles.documentBulletText}>{doc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 11. HR TOOLS YOU'LL LEARN */}
        <section className={`container ${styles.toolsSection}`} id="hr-tools">
          <div className={styles.leftHeader}>
            <div className={styles.sectionLabel}>SOFTWARE &amp; PLATFORMS</div>
            <h2 className={styles.leftTitle}>HR Tools You'll Learn</h2>
            <p className={styles.leftSubtitle}>
              Participants receive practical exposure to industry-relevant tools such as:
            </p>
          </div>

          <div className={styles.toolsGrid}>
            {hrTools.map((tool, idx) => (
              <div key={idx} className={styles.toolCard}>
                <div className={styles.toolIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3 className={styles.toolName}>{tool}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 12 & 14. AUDIENCE & CAREER OPPORTUNITIES */}
        <section className={`container ${styles.audienceSection}`} id="who-can-join">
          <div className={styles.audienceContainer}>
            <div className={styles.audienceBlock}>
              <h3 className={styles.audienceTitle}>Who Can Join?</h3>
              <p className={styles.audienceSubtitle}>CHRMP is suitable for:</p>
              <ul className={styles.bulletListGrid}>
                <li>Fresh Graduates</li>
                <li>MBA Students</li>
                <li>Any Degree Holders</li>
                <li>HR Beginners</li>
                <li>Working Professionals</li>
                <li>Career Change Candidates</li>
                <li>Professionals looking to upgrade HR skills</li>
              </ul>
              <div className={styles.noExpTag}>
                No previous HR experience is required. If you're passionate about building a successful career in Human Resources, this program is designed for you.
              </div>
            </div>

            <div className={styles.audienceBlock}>
              <h3 className={styles.audienceTitle}>Career Opportunities</h3>
              <p className={styles.audienceSubtitle}>Prepared for opportunities such as:</p>
              <ul className={styles.bulletListGrid}>
                <li>HR Executive</li>
                <li>HR Recruiter</li>
                <li>Talent Acquisition Executive</li>
                <li>HR Generalist</li>
                <li>HR Operations Executive</li>
                <li>Payroll Executive</li>
                <li>HR Coordinator</li>
                <li>Recruitment Consultant</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 13 & 15. CERTIFICATION & PLACEMENT SUPPORT */}
        <section className={`container ${styles.supportSection}`} id="certification-support">
          <div className={styles.supportGrid}>
            <div className={styles.supportCard}>
              <h3 className={styles.supportCardTitle}>Certification</h3>
              <p className={styles.supportCardText}>
                Upon successful completion, participants will receive the:
              </p>
              <p className={styles.overviewTextHighlighted} style={{ margin: "1rem 0", color: "#000000", fontWeight: "700" }}>
                Certified Human Resource Management Professional (CHRMP)
              </p>
              <p className={styles.supportCardText}>
                Issued by Staffspectrum, recognizing practical corporate HR training and workplace experience.
              </p>
            </div>

            <div className={styles.supportCard}>
              <h3 className={styles.supportCardTitle}>Placement &amp; Career Support</h3>
              <p className={styles.supportCardText}>
                Our career support includes:
              </p>
              <ul className={styles.checkList}>
                <li>Professional Resume Preparation</li>
                <li>LinkedIn Profile Guidance</li>
                <li>Interview Skills Training</li>
                <li>Mock Interviews</li>
                <li>Career Counselling</li>
                <li>Job Opportunities through Staffspectrum Network</li>
                <li>Placement Assistance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 16. FREQUENTLY ASKED QUESTIONS */}
        <section className={`container ${styles.faqSection}`} id="chrmp-faq">
          <div className={styles.leftHeader}>
            <div className={styles.sectionLabel}>QUESTIONS &amp; ANSWERS</div>
            <h2 className={styles.leftTitle}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <div className={styles.faqQuestionRow}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <span className={styles.faqChevron}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 17. FINAL CTA */}
        <section className={`container ${styles.ctaSection}`} id="chrmp-cta">
          <div className={styles.ctaContainer}>
            <span className={styles.ctaLabel}>READY TO START YOUR HR CAREER?</span>
            <h2 className={styles.ctaTitle}>Ready to Start Your HR Career?</h2>
            <p className={styles.ctaText}>
              Don't just study Human Resources. Experience how HR works inside a professional organisation. Build practical skills. Gain corporate confidence. Become job-ready.
            </p>
            <p className={styles.ctaHighlight}>
              Learn Like a Professional. Work Like a Professional. Become an HR Professional.
            </p>
            <Link href="/contact-us?interest=chrmp" className={styles.ctaBtn}>
              Apply Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
