import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import FinalCTA from "../../components/FinalCTA/FinalCTA";
import MissionVision from "../../components/MissionVision/MissionVision";
import Link from "next/link";
import Image from "next/image";
import styles from "./about.module.css";
import WhyPartnerGrid from "../../components/WhyPartnerGrid/WhyPartnerGrid";
import CoreStrengths from "../../components/CoreStrengths/CoreStrengths";

export const metadata = {
  title: "About Us | Staffspectrum - HR Solutions & Talent Acquisition",
  description: "Since 2016, Staffspectrum has been helping organisations build stronger teams through professional Recruitment & Talent Acquisition, HR Solutions, Workforce Management, and practical people strategies across India.",
};

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main className={styles.aboutSection}>
        {/* 1. HERO SECTION (Main Heading on Black Background) */}
        <section className={styles.heroSection} id="about-hero">
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>
              ABOUT <br />
              <span className={styles.heroHighlight}>STAFFSPECTRUM</span>
            </h1>
          </div>
        </section>

        {/* 2. OVERVIEW SECTION (Contents Part) */}
        <section className={`container ${styles.overviewSection}`} id="about-overview">
          <div className={styles.overviewCard}>
            <h2 className={styles.overviewTitle}>
              Building Stronger Businesses Through Better People Solutions.
            </h2>
            <div className={styles.overviewContent}>
              <p className={styles.overviewText}>
                Since 2016, Staffspectrum has been helping organisations build stronger teams through professional Recruitment &amp; Talent Acquisition, HR Solutions, Workforce Management, and practical people strategies.
              </p>
              <p className={styles.overviewText}>
                As a trusted HR Solutions Company headquartered in Kerala and serving businesses across India, we partner with organisations to simplify hiring, strengthen HR systems, improve workforce performance, and support sustainable business growth.
              </p>
            </div>
            <div className={styles.overviewAction}>
              <Link href="/contact-us" className={styles.overviewBtn}>
                <span>Contact Us</span>
                <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. WHO WE ARE */}
        <section className={`container ${styles.whoSection}`} id="who-we-are">
          <div className={styles.introGrid}>
            <div>
              <div className={styles.introLabel}>WHO WE ARE</div>
              <h2 className={styles.introTitle}>Your Trusted HR Growth Partner</h2>
              <div className={styles.partnerImageWrapper}>
                <Image
                  src="/hr-growth-partner.png"
                  alt="Your Trusted HR Growth Partner"
                  width={500}
                  height={380}
                  className={styles.partnerImage}
                  priority
                />
              </div>
            </div>
            <div className={styles.introContent}>
              <p className={`${styles.introParagraph} ${styles.introParagraphHighlighted}`}>
                Staffspectrum is a professional HR Solutions company committed to helping businesses build capable teams, efficient HR systems, and sustainable workplaces.
              </p>
              <p className={styles.introParagraph}>
                We believe people are the foundation of every successful organisation, and our role is to help businesses attract, manage, develop, and retain the right talent while creating structured HR practices that support long-term success.
              </p>
              <p className={styles.introParagraph}>
                Since our establishment in 2016, we have partnered with organisations across multiple industries, delivering Recruitment &amp; Talent Acquisition, HR Consulting, HR Operations, Payroll Management, Statutory Compliance, Workforce Management, HR Outsourcing, and employee development solutions.
              </p>
              <p className={styles.introParagraph}>
                Today, businesses trust Staffspectrum not only for hiring but also for building structured HR systems that improve operational efficiency, strengthen workplace culture, and support sustainable business growth.
              </p>
              <p className={styles.introParagraph}>
                We don't believe HR should only solve today's hiring challenges. We believe HR should build stronger organisations for the future through better people, better processes, and smarter workforce strategies.
              </p>
            </div>
          </div>
        </section>

        {/* 3. OUR JOURNEY */}
        <section className={`container ${styles.journeySection}`} id="our-journey">
          <div className={styles.introGrid}>
            <div>
              <div className={styles.introLabel}>OUR JOURNEY</div>
              <h2 className={styles.introTitle}>Growing With Businesses Since 2016</h2>
              <div className={styles.partnerImageWrapper}>
                <Image
                  src="/growing-since-2016.png"
                  alt="Growing With Businesses Since 2016"
                  width={500}
                  height={380}
                  className={styles.partnerImage}
                />
              </div>
            </div>
            <div className={styles.introContent}>
              <p className={`${styles.introParagraph} ${styles.introParagraphHighlighted}`}>
                Our journey began with a simple vision—to provide businesses with reliable recruitment solutions backed by professional HR expertise.
              </p>
              <p className={styles.introParagraph}>
                As organisations evolved, so did their workforce challenges. Staffspectrum expanded beyond recruitment to deliver complete HR solutions that support businesses throughout the entire employee lifecycle.
              </p>
              <p className={styles.introParagraph}>
                Today, we proudly partner with startups, SMEs, and established organisations, helping them hire smarter, strengthen HR systems, improve workforce performance, and build sustainable businesses through practical HR solutions.
              </p>
            </div>
          </div>
        </section>

        {/* 4. OUR MISSION & VISION */}
        <MissionVision />

        {/* 5. OUR APPROACH */}
        <section className={`container ${styles.approachSection}`} id="our-approach">
          <div className={styles.introGrid}>
            <div>
              <div className={styles.introLabel}>OUR APPROACH</div>
              <h2 className={styles.introTitle}>Practical HR Solutions That Deliver Real Business Value</h2>
              <div className={styles.partnerImageWrapper}>
                <Image
                  src="/practical-hr-solutions.png"
                  alt="Practical HR Solutions That Deliver Real Business Value"
                  width={500}
                  height={380}
                  className={styles.partnerImage}
                />
              </div>
            </div>
            <div className={styles.introContent}>
              <p className={`${styles.introParagraph} ${styles.introParagraphHighlighted}`}>
                Every organisation has different workforce challenges.
              </p>
              <p className={styles.introParagraph}>
                At Staffspectrum, we begin by understanding your business, industry, growth plans, operational requirements, and workforce objectives before recommending the right HR solution.
              </p>
              <p className={styles.introParagraph}>
                Rather than applying standard HR practices, we develop practical people strategies that align with your business goals, organisational culture, and long-term vision.
              </p>
              <p className={styles.introParagraph}>
                Our focus is not simply to fill vacancies or manage HR tasks. We work as a strategic HR partner, helping businesses build stronger teams, efficient HR systems, and sustainable workforce practices that contribute to long-term success.
              </p>
            </div>
          </div>
        </section>

        {/* 6. OUR PRESENCE */}
        <section className={`container ${styles.presenceSection}`} id="our-presence">
          <div className={styles.introGrid}>
            <div>
              <div className={styles.introLabel}>OUR PRESENCE</div>
              <h2 className={styles.introTitle}>Supporting Businesses Across India</h2>
              <div className={styles.partnerImageWrapper}>
                <Image
                  src="/supporting-businesses-india.png"
                  alt="Supporting Businesses Across India"
                  width={500}
                  height={380}
                  className={styles.partnerImage}
                />
              </div>
            </div>
            <div className={styles.introContent}>
              <p className={`${styles.introParagraph} ${styles.introParagraphHighlighted}`}>
                Headquartered in Kerala, Staffspectrum proudly supports organisations across India with professional Recruitment &amp; Talent Acquisition services.
              </p>
              <p className={styles.introParagraph}>
                Our nationwide talent network enables us to source skilled professionals across multiple industries and locations, helping organisations hire faster without compromising quality.
              </p>
              <p className={styles.introParagraph}>
                For HR Consulting, HR Operations, Payroll Management, Statutory Compliance, Workforce Management, and HR Outsourcing, we primarily provide hands-on support across Kerala while also assisting organisations across India based on specific business requirements.
              </p>
              <p className={styles.introParagraph}>
                Whether you need a single critical hire, large-scale recruitment, or complete HR support, Staffspectrum is committed to delivering practical HR solutions that create measurable business value.
              </p>
            </div>
          </div>
        </section>

        {/* 7. WHY ORGANISATIONS PARTNER WITH STAFFSPECTRUM */}
        <section className={`container ${styles.whySection}`} id="why-partner">
          <div className={styles.sectionHeader}>
            <div className={styles.introLabel}>WHY ORGANISATIONS PARTNER WITH STAFFSPECTRUM</div>
            <h2 className={styles.sectionTitle}>Designed Around Your Business—Not Generic HR Processes</h2>
            <p className={styles.sectionDesc}>
              Every business has unique workforce challenges, growth objectives, and operational requirements. Staffspectrum delivers practical HR solutions designed around your business.
            </p>
          </div>

          <WhyPartnerGrid />
        </section>

        {/* 8. OUR CORE STRENGTHS */}
        <section className={`container ${styles.strengthsSection}`} id="core-strengths">
          <div className={styles.sectionHeader}>
            <div className={styles.introLabel}>OUR CORE STRENGTHS</div>
            <h2 className={styles.sectionTitle}>What Makes Us Stronger</h2>
          </div>

          <CoreStrengths />
        </section>

        {/* 9. OUR COMMITMENT */}
        <section className={`container ${styles.commitmentSection}`} id="our-commitment">
          <div className={styles.philosophyCard}>
            <div className={styles.philosophyGrid}>
              <div>
                <div className={styles.philosophyLabel}>OUR COMMITMENT</div>
                <h2 className={styles.philosophyTitle}>Committed to Your Long-Term Success</h2>
              </div>
              <div className={styles.philosophyRight}>
                <p className={styles.philosophyText}>
                  We believe successful business relationships are built on trust, professionalism, transparency, and measurable results.
                </p>
                <p className={styles.philosophyText}>
                  Whether supporting a startup with its first employee or helping an established organisation strengthen its HR systems, our commitment remains the same—to deliver practical HR solutions that create lasting business value.
                </p>
                <p className={styles.philosophyText}>
                  As your organisation grows, Staffspectrum grows with you by providing reliable HR support, continuous guidance, and people-focused solutions that strengthen your workforce at every stage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. OUR VALUES */}
        <section className={styles.valuesSection} id="our-values">
          <div className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.introLabel}>OUR VALUES</div>
              <h2 className={styles.sectionTitle}>The Values That Guide Everything We Do</h2>
            </div>
          </div>

          <div className={styles.valuesSliderContainer}>
            <div className={styles.valuesTrack}>
              {[
                {
                  title: "Integrity",
                  desc: "Building lasting relationships through honesty, transparency, and ethical HR practices."
                },
                {
                  title: "Excellence",
                  desc: "Delivering quality in every recruitment process, HR solution, and client engagement."
                },
                {
                  title: "People First",
                  desc: "Believing every successful organisation begins with the right people."
                },
                {
                  title: "Partnership",
                  desc: "Working as an extension of our clients' organisations to achieve long-term success."
                },
                {
                  title: "Innovation",
                  desc: "Combining practical HR expertise with modern technology to deliver smarter workforce solutions."
                },
                {
                  title: "Integrity",
                  desc: "Building lasting relationships through honesty, transparency, and ethical HR practices."
                },
                {
                  title: "Excellence",
                  desc: "Delivering quality in every recruitment process, HR solution, and client engagement."
                },
                {
                  title: "People First",
                  desc: "Believing every successful organisation begins with the right people."
                },
                {
                  title: "Partnership",
                  desc: "Working as an extension of our clients' organisations to achieve long-term success."
                },
                {
                  title: "Innovation",
                  desc: "Combining practical HR expertise with modern technology to deliver smarter workforce solutions."
                }
              ].map((val, index) => (
                <div key={index} className={styles.valueCard}>
                  <h3 className={styles.valueTitle}>{val.title}</h3>
                  <p className={styles.valueDesc}>{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. FREQUENTLY ASKED QUESTIONS */}
        <section className={`container ${styles.faqSection}`} id="about-faq">
          <div className={styles.sectionHeader} style={{ textAlign: "left", marginBottom: "2.5rem" }}>
            <div className={styles.introLabel}>QUESTIONS &amp; ANSWERS</div>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {[
              {
                q: "What HR services does Staffspectrum provide?",
                a: "Staffspectrum provides complete HR Solutions, including Recruitment & Talent Acquisition, HR Consulting, HR Operations Management, Payroll Management, Statutory & Labour Law Compliance, Workforce Management, HR Outsourcing, Employee Engagement, Performance Management, Employer Branding, Training & Development, and HR Technology & Digital HR Solutions."
              },
              {
                q: "Do you provide recruitment services across India?",
                a: "Yes. Staffspectrum provides Recruitment & Talent Acquisition services for organisations across India. Whether you're hiring in Bengaluru, Chennai, Hyderabad, Pune, Mumbai, Delhi NCR, Kochi, or any other city, our recruitment team helps you find the right talent for your organisation."
              },
              {
                q: "Do you offer complete HR Outsourcing services?",
                a: "Yes. Our HR Outsourcing & Dedicated HR Support solutions are designed for businesses that require professional HR expertise without maintaining a full in-house HR department. We manage recruitment, HR operations, payroll coordination, compliance support, employee documentation, and ongoing HR advisory."
              },
              {
                q: "Can Staffspectrum help with Payroll and Statutory Compliance?",
                a: "Absolutely. We support organisations with Payroll Management, PF, ESI, statutory documentation, labour law compliance, HR records, and compliance-related processes to help businesses maintain accurate and compliant HR operations."
              },
              {
                q: "Which industries do you serve?",
                a: "We provide HR Solutions for Technology & IT, Retail & FMCG, Hospitality, Healthcare, Construction & Infrastructure, Manufacturing, Automobile, Logistics & Supply Chain, BFSI, Education & EdTech, Media & Creative, Sales & Customer Service, and many other industries."
              },
              {
                q: "Do you support startups and small businesses?",
                a: "Yes. We work with startups, SMEs, and established organisations. Our HR Solutions are customised to suit each organisation's size, industry, and business objectives."
              },
              {
                q: "Can you customise HR solutions for our organisation?",
                a: "Yes. Every organisation has unique workforce requirements. We assess your business needs and develop HR Solutions that align with your workforce, industry, operational challenges, and long-term business goals."
              },
              {
                q: "Do you provide HR Technology and Digital HR Solutions?",
                a: "Yes. We help businesses implement HRMS, attendance systems, payroll integration, HR automation, employee self-service solutions, and workforce reporting to improve efficiency and support digital HR transformation."
              },
              {
                q: "Do you provide Corporate Training and Employee Development programmes?",
                a: "Yes. Staffspectrum provides Corporate Training, Leadership Development, HR Training, Compliance Training, Employee Skill Development, Soft Skills Training, and Learning & Development programmes designed to strengthen workforce capability and business performance."
              },
              {
                q: "What is the Certified Human Resource Management Professional (CHRMP) programme?",
                a: "The Certified Human Resource Management Professional (CHRMP) programme is Staffspectrum's practical HR training course designed for graduates, aspiring HR professionals, career changers, and working professionals. The programme focuses on real corporate HR practices, including Recruitment, HR Operations, Payroll, Compliance, HR Documentation, and practical workplace experience to prepare participants for successful HR careers."
              },
              {
                q: "Who can join the CHRMP programme?",
                a: "The CHRMP programme is suitable for fresh graduates, MBA HR students, aspiring HR professionals, career changers, and working professionals who want to build practical HR skills and gain real corporate exposure."
              },
              {
                q: "Why should businesses choose Staffspectrum?",
                a: "Businesses choose Staffspectrum because we provide complete HR Solutions under one trusted partner. From Recruitment & Talent Acquisition to HR Consulting, Payroll, Compliance, Workforce Management, HR Outsourcing, Training & Development, Employer Branding, and HR Technology Solutions, we help organisations build stronger teams, improve operational efficiency, and achieve sustainable business growth."
              }
            ].map((faq, idx) => (
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

        {/* 12. FINAL CALL TO ACTION */}
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
