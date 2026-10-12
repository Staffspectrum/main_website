"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./services.module.css";

const servicesList = [
  {
    id: 1,
    title: "Recruitment & Talent Acquisition",
    about: "Hiring the right people is one of the most important investments an organisation can make. Staffspectrum's Recruitment & Talent Acquisition solutions help businesses identify, attract, assess, and hire professionals who not only possess the right skills but also align with the organisation's culture, values, and long-term business objectives.\n\nWhether you are hiring for a single critical position or building an entire workforce, we deliver structured recruitment solutions that reduce hiring time, improve candidate quality, and support sustainable business growth.",
    challenges: [
      "Difficulty attracting qualified candidates",
      "Long and inefficient hiring processes",
      "High employee turnover",
      "Limited access to quality talent",
      "Poor candidate-job fit",
      "High recruitment costs",
      "Delays in business growth due to vacant positions",
      "Lack of structured recruitment processes"
    ],
    challengesText: "Finding and retaining the right talent can be challenging in today's competitive job market.",
    howSupports: "We deliver structured recruitment solutions that reduce hiring time, improve candidate quality, and support sustainable business growth across various industries.",
    supportIncludes: [
      { name: "Permanent Recruitment", desc: "Identifying and hiring qualified professionals for permanent roles across various industries and business functions." },
      { name: "Executive Search & Leadership Hiring", desc: "Finding experienced managers, senior executives, and leadership professionals for strategic business positions." },
      { name: "Bulk & Mass Hiring", desc: "Managing high-volume recruitment projects through structured sourcing, screening, interview coordination, and onboarding support." },
      { name: "Technical & Non-Technical Recruitment", desc: "Hiring skilled professionals across IT, Engineering, Finance, HR, Sales, Marketing, Operations, Manufacturing, Healthcare, Retail, Hospitality, Construction, Logistics, and other industries." },
      { name: "Candidate Sourcing & Talent Mapping", desc: "Building talent pipelines through multiple sourcing channels to identify qualified professionals for current and future hiring needs." },
      { name: "Candidate Screening & Assessment", desc: "Evaluating candidates through structured resume screening, skill assessments, experience verification, and role suitability analysis." },
      { name: "Interview Coordination", desc: "Managing interview scheduling, communication, feedback collection, and coordination between employers and candidates for a seamless hiring experience." },
      { name: "Offer Management & Onboarding Support", desc: "Supporting offer rollout, salary negotiations, joining coordination, documentation, and onboarding to ensure a smooth transition for new employees." }
    ],
    benefits: [
      "Reduce time-to-hire through efficient recruitment processes.",
      "Access a wider network of qualified and industry-specific talent.",
      "Improve hiring quality with structured screening and assessment.",
      "Lower recruitment costs by streamlining the hiring process.",
      "Reduce employee turnover through better candidate-job alignment.",
      "Build stronger teams that contribute to long-term business success."
    ]
  },
  {
    id: 2,
    title: "HR Operations Management",
    about: "Efficient HR operations are the foundation of a well-managed organisation. Staffspectrum helps businesses establish structured HR systems that streamline day-to-day people management, improve operational efficiency, and create a consistent employee experience.\n\nFrom employee onboarding to exit management, we design and manage HR processes that ensure accuracy, compliance, and operational excellence. Our HR Operations solutions enable businesses to reduce administrative complexity while building a strong foundation for long-term workforce success.",
    challenges: [
      "Unstructured HR processes and workflows",
      "Incomplete or inconsistent employee documentation",
      "Attendance and leave management issues",
      "Time-consuming administrative tasks",
      "Lack of standard HR policies and procedures",
      "Inefficient employee lifecycle management",
      "Poor record management and reporting",
      "Difficulty maintaining operational consistency"
    ],
    challengesText: "Managing HR operations without structured systems can lead to inefficiencies, compliance risks, and inconsistent employee experiences.",
    howSupports: "We design and manage HR processes that ensure accuracy, compliance, and operational excellence to build a strong foundation for long-term workforce success.",
    supportIncludes: [
      { name: "Employee Documentation & HR Records", desc: "Preparing and maintaining appointment letters, employment contracts, employee files, confirmation letters, promotion records, transfer documents, and other essential HR documentation." },
      { name: "Employee Onboarding & Offboarding", desc: "Managing structured onboarding and exit processes to ensure a smooth employee experience while maintaining proper documentation and compliance." },
      { name: "Attendance & Leave Management", desc: "Implementing organised attendance tracking and leave management systems that improve workforce visibility and operational discipline." },
      { name: "HR Policies & SOP Development", desc: "Developing employee handbooks, HR policies, Standard Operating Procedures (SOPs), and workplace guidelines tailored to your organisation." },
      { name: "Employee Lifecycle Management", desc: "Managing every stage of the employee journey—from onboarding and probation to confirmation, promotion, transfer, and separation." },
      { name: "HR Information System (HRIS) Support", desc: "Supporting the implementation and management of HR systems that simplify employee records, reporting, and day-to-day HR administration." },
      { name: "HR Administration & Documentation", desc: "Handling routine HR administration, employee correspondence, documentation updates, and maintaining organised HR records." },
      { name: "HR Process Improvement", desc: "Reviewing existing HR workflows and implementing practical improvements that enhance efficiency, consistency, and employee experience." }
    ],
    benefits: [
      "Build structured and efficient HR processes.",
      "Improve employee experience through organised HR administration.",
      "Reduce administrative workload for management.",
      "Maintain accurate employee records and documentation.",
      "Standardise HR practices across the organisation.",
      "Improve operational efficiency and workforce coordination.",
      "Support compliance through organised documentation.",
      "Create scalable HR systems that grow with your business."
    ]
  },
  {
    id: 3,
    title: "HR & Management Consulting",
    about: "Strong businesses are built on effective people strategies, structured HR systems, and informed management decisions. Staffspectrum's HR & Management Consulting services help organisations align their workforce, HR practices, and business objectives to improve operational efficiency and achieve sustainable growth.\n\nWhether you're establishing HR processes for a growing business, restructuring your organisation, or improving workforce performance, our consultants provide practical, business-focused solutions tailored to your organisation's unique needs.",
    challenges: [
      "Lack of a clear HR strategy",
      "Inefficient organisational structures",
      "Unstructured HR policies and procedures",
      "Workforce planning and resource allocation issues",
      "Low employee productivity and engagement",
      "Leadership and people management challenges",
      "Difficulty managing organisational growth and change",
      "Inconsistent HR practices across departments"
    ],
    challengesText: "As businesses grow, managing people becomes increasingly complex.",
    howSupports: "Our consultants provide practical, business-focused solutions tailored to align your workforce, HR practices, and business objectives.",
    supportIncludes: [
      { name: "HR Strategy Development", desc: "Designing HR strategies that align workforce planning, talent management, and people practices with your business goals." },
      { name: "Organisation Structure & Workforce Planning", desc: "Helping businesses build effective organisational structures, define reporting lines, optimise workforce allocation, and plan future staffing requirements." },
      { name: "HR Policies & Process Development", desc: "Creating practical HR policies, employee handbooks, Standard Operating Procedures (SOPs), and workplace guidelines that ensure consistency and compliance." },
      { name: "HR Audit & Process Evaluation", desc: "Reviewing existing HR practices, identifying improvement opportunities, and recommending practical solutions to enhance efficiency and compliance." },
      { name: "Performance & Productivity Improvement", desc: "Developing performance management frameworks, KPIs, and employee evaluation systems that improve accountability and organisational performance." },
      { name: "Change Management & HR Transformation", desc: "Supporting businesses through organisational changes, business expansion, restructuring, and HR transformation initiatives with structured planning and implementation." },
      { name: "Leadership & People Management Advisory", desc: "Providing guidance to business leaders and managers on effective leadership practices, employee management, and workforce development." },
      { name: "Business HR Advisory", desc: "Acting as a trusted HR partner by offering ongoing strategic advice on people management, compliance, workforce planning, and organisational development." }
    ],
    benefits: [
      "Align HR strategies with business objectives.",
      "Improve organisational structure and operational efficiency.",
      "Strengthen workforce planning and resource utilisation.",
      "Enhance employee performance and accountability.",
      "Build consistent HR systems and policies.",
      "Improve leadership effectiveness and people management.",
      "Support business expansion with scalable HR practices.",
      "Create a stronger foundation for sustainable business growth."
    ]
  },
  {
    id: 4,
    title: "Statutory & Labour Law Compliance",
    about: "Statutory compliance is essential for protecting your business, maintaining legal compliance, and creating a responsible workplace. Staffspectrum helps organisations navigate complex labour laws and statutory requirements through structured compliance management, accurate documentation, and ongoing professional support.\n\nOur Statutory & Labour Law Compliance solutions ensure your organisation meets regulatory obligations while reducing legal risks, improving operational confidence, and allowing your management team to focus on business growth.",
    challenges: [
      "Difficulty understanding labour laws and statutory regulations",
      "Risk of penalties due to non-compliance",
      "Incomplete statutory documentation and records",
      "Delays in statutory filings and reporting",
      "Challenges managing PF, ESI, and other statutory obligations",
      "Lack of internal compliance expertise",
      "Time-consuming compliance administration",
      "Difficulty staying updated with changing labour regulations"
    ],
    challengesText: "Managing statutory compliance can be complex, especially as regulations continue to evolve.",
    howSupports: "We help organisations navigate complex labour laws and statutory requirements through structured compliance management and accurate documentation.",
    supportIncludes: [
      { name: "Statutory Compliance Management", desc: "Managing statutory obligations through structured processes that help businesses remain compliant with applicable labour laws and employment regulations." },
      { name: "Labour Law Compliance", desc: "Providing professional guidance on labour legislation, workplace regulations, employment practices, and employer responsibilities." },
      { name: "PF & ESI Compliance", desc: "Supporting employee registration, monthly contributions, statutory filings, documentation, and ongoing compliance related to Provident Fund (PF) and Employees' State Insurance (ESI)." },
      { name: "Payroll Compliance Support", desc: "Ensuring payroll processes align with statutory requirements, deductions, and applicable labour regulations." },
      { name: "Compliance Documentation & Record Management", desc: "Preparing, organising, and maintaining statutory registers, employee records, compliance documents, and supporting documentation required by regulatory authorities." },
      { name: "Statutory Audit Support", desc: "Reviewing compliance status, identifying potential gaps, and assisting organisations in preparing for internal and external compliance audits." },
      { name: "Government Filing & Regulatory Support", desc: "Assisting businesses with statutory filings, government submissions, and maintaining accurate compliance records within required timelines." },
      { name: "Compliance Advisory", desc: "Providing ongoing professional advice to help organisations understand regulatory updates, minimise legal risks, and maintain continuous compliance." }
    ],
    benefits: [
      "Reduce legal and financial risks.",
      "Maintain compliance with labour laws and statutory regulations.",
      "Improve documentation accuracy and record management.",
      "Avoid penalties arising from non-compliance.",
      "Ensure timely statutory filings and reporting.",
      "Build confidence during inspections and audits.",
      "Allow management to focus on business growth while compliance is professionally managed.",
      "Create a responsible and legally compliant workplace."
    ]
  },
  {
    id: 5,
    title: "Employee Engagement & Retention",
    about: "Attracting talented employees is only the beginning—keeping them engaged, motivated, and committed is what drives long-term business success. Staffspectrum's Employee Engagement & Retention solutions help organisations create positive workplace experiences that improve employee satisfaction, strengthen organisational culture, and reduce unwanted turnover.\n\nWe work with businesses to build people-first workplaces through structured engagement initiatives, effective communication, recognition programs, and retention strategies that support both employee well-being and business performance.",
    challenges: [
      "High employee turnover",
      "Low employee engagement and motivation",
      "Poor workplace communication",
      "Declining productivity and morale",
      "Difficulty retaining skilled employees",
      "Weak organisational culture",
      "Limited employee recognition and development",
      "Reduced workforce commitment and loyalty"
    ],
    challengesText: "A disengaged workforce can impact productivity, customer experience, and business growth.",
    howSupports: "We help organisations create positive workplace experiences that improve satisfaction, strengthen culture, and reduce unwanted turnover.",
    supportIncludes: [
      { name: "Employee Engagement Programs", desc: "Designing structured engagement initiatives that improve employee participation, motivation, collaboration, and overall workplace satisfaction." },
      { name: "Employee Feedback & Surveys", desc: "Conducting employee surveys, feedback sessions, and engagement assessments to understand workforce expectations and identify opportunities for improvement." },
      { name: "Recognition & Reward Programs", desc: "Developing employee recognition programs that celebrate achievements, improve motivation, and encourage high performance across the organisation." },
      { name: "Workplace Culture Development", desc: "Helping organisations build positive, inclusive, and collaborative workplace cultures that strengthen employee relationships and organisational values." },
      { name: "Employee Retention Strategies", desc: "Developing practical retention strategies that address workforce challenges, reduce employee turnover, and improve long-term workforce stability." },
      { name: "Employee Communication Initiatives", desc: "Improving internal communication through structured HR practices that encourage transparency, trust, and stronger employee engagement." },
      { name: "Employee Experience Enhancement", desc: "Supporting organisations in creating a positive employee journey—from onboarding through career development—to improve satisfaction and retention." },
      { name: "HR Support for Employee Well-being", desc: "Advising businesses on HR initiatives that promote employee well-being, work-life balance, and a healthier workplace environment." }
    ],
    benefits: [
      "Improve employee satisfaction and workplace morale.",
      "Reduce employee turnover and replacement costs.",
      "Strengthen organisational culture and teamwork.",
      "Increase employee productivity and performance.",
      "Enhance communication between employees and management.",
      "Build stronger employee loyalty and long-term commitment.",
      "Create a positive workplace that attracts and retains top talent.",
      "Support sustainable business growth through an engaged workforce."
    ]
  },
  {
    id: 6,
    title: "Performance Management",
    about: "A high-performing organisation is built on clear expectations, continuous feedback, measurable goals, and employee development. Staffspectrum's Performance Management solutions help businesses establish structured performance systems that improve accountability, enhance productivity, and align individual performance with organisational objectives.\n\nWe work with organisations to create practical performance frameworks that support employee growth, strengthen leadership decisions, and drive long-term business success.",
    challenges: [
      "Unclear employee roles and expectations",
      "Inconsistent performance evaluations",
      "Low employee productivity",
      "Limited employee accountability",
      "Lack of measurable performance goals",
      "Poor feedback and communication",
      "Difficulty identifying high-performing employees",
      "Limited opportunities for employee growth and development"
    ],
    challengesText: "Without a structured performance management system, organisations often face reduced clarity, lower accountability, and stagnant productivity.",
    howSupports: "We build practical performance frameworks that measure progress, encourage continuous feedback, and align team output with business targets.",
    supportIncludes: [
      { name: "Performance Management Framework Development", desc: "Designing structured performance management systems that align employee performance with business goals and organisational objectives." },
      { name: "Goal Setting & KPI Development", desc: "Developing Key Performance Indicators (KPIs), Key Result Areas (KRAs), and measurable performance goals for individuals, teams, and departments." },
      { name: "Performance Appraisal System", desc: "Creating fair, transparent, and objective appraisal processes that support performance evaluation, employee development, and business growth." },
      { name: "Performance Review & Feedback Process", desc: "Establishing structured review cycles and continuous feedback mechanisms that encourage improvement, communication, and accountability." },
      { name: "Employee Development Planning", desc: "Identifying employee strengths, skill gaps, and career development opportunities through structured performance discussions." },
      { name: "Performance Improvement Plans (PIP)", desc: "Supporting employees who require additional guidance through structured improvement plans, coaching, and measurable performance objectives." },
      { name: "Manager & Leadership Support", desc: "Helping managers conduct effective performance discussions, provide constructive feedback, and make informed people management decisions." },
      { name: "Performance Analytics & Reporting", desc: "Providing performance insights and reporting that support workforce planning, leadership decisions, and organisational improvement." }
    ],
    benefits: [
      "Improve employee productivity and accountability.",
      "Align individual performance with business objectives.",
      "Create a transparent and fair performance evaluation process.",
      "Support employee growth and career development.",
      "Strengthen leadership through structured performance discussions.",
      "Identify and develop high-potential employees.",
      "Improve employee motivation and workplace performance.",
      "Build a high-performance culture that supports sustainable business growth."
    ]
  },
  {
    id: 7,
    title: "HR Outsourcing & Dedicated HR Support",
    about: "Managing Human Resources requires time, expertise, and continuous attention. For many growing businesses, maintaining a full in-house HR department can be both challenging and costly. Staffspectrum's HR Outsourcing & Dedicated HR Support solutions provide organisations with professional HR expertise without the overhead of building and managing an internal HR team.\n\nWhether you need complete HR management or support for specific HR functions, we work as an extension of your organisation, delivering structured HR processes, professional guidance, and ongoing workforce support that enables your business to operate efficiently and grow with confidence.",
    challenges: [
      "Limited in-house HR expertise",
      "High costs of maintaining a dedicated HR department",
      "Inconsistent HR processes and documentation",
      "Difficulty managing employee relations and HR operations",
      "Time-consuming administrative responsibilities",
      "Compliance and policy management challenges",
      "Growing workforce without scalable HR systems",
      "Lack of strategic HR support for business expansion"
    ],
    challengesText: "Many organisations struggle to manage HR effectively due to limited resources and increasing workforce demands.",
    howSupports: "We act as an extended HR department, managing daily operations, compliance, employee relations, and talent acquisition.",
    supportIncludes: [
      { name: "Dedicated HR Partner", desc: "Providing an experienced HR professional who works closely with your organisation to manage daily HR activities and support business growth." },
      { name: "End-to-End HR Management", desc: "Managing the complete employee lifecycle—from recruitment and onboarding to performance management, employee engagement, and separation." },
      { name: "HR Operations Management", desc: "Handling day-to-day HR administration, employee documentation, attendance, leave management, HR policies, and organisational processes." },
      { name: "Recruitment & Talent Acquisition Support", desc: "Managing hiring requirements through structured recruitment processes, candidate screening, interview coordination, and onboarding support." },
      { name: "Payroll & HR Coordination", desc: "Supporting payroll administration, employee records, leave data, and HR documentation to ensure smooth workforce management." },
      { name: "Statutory & Compliance Support", desc: "Assisting organisations in maintaining labour law compliance, statutory documentation, and HR regulatory requirements." },
      { name: "Employee Relations & HR Advisory", desc: "Providing professional guidance on employee concerns, workplace policies, disciplinary matters, conflict resolution, and HR best practices." },
      { name: "HR Process Development & Continuous Improvement", desc: "Reviewing existing HR systems, identifying improvement opportunities, and implementing structured HR practices that support long-term business success." }
    ],
    benefits: [
      "Access experienced HR professionals without maintaining a full in-house HR department.",
      "Reduce operational costs while improving HR efficiency.",
      "Establish structured HR systems and standardised processes.",
      "Improve employee management and workplace consistency.",
      "Ensure better compliance with employment regulations and HR policies.",
      "Allow leadership teams to focus on core business activities.",
      "Scale HR support as your business grows.",
      "Build a reliable long-term HR partnership that supports organisational success."
    ]
  },
  {
    id: 8,
    title: "Training & Development",
    about: "Continuous learning is essential for building skilled employees, effective leaders, and high-performing organisations. Staffspectrum's Training & Development solutions help businesses strengthen workforce capabilities through practical learning, professional development, and industry-focused training programmes.\n\nFrom employee onboarding and leadership development to specialised HR training and corporate learning initiatives, we design programmes that enhance knowledge, improve performance, and support long-term organisational success.",
    challenges: [
      "Skill gaps within the workforce",
      "Limited employee development opportunities",
      "Inconsistent onboarding and training processes",
      "Leadership capability gaps",
      "Low employee confidence and productivity",
      "Difficulty adapting to changing business requirements",
      "Lack of structured learning programmes",
      "Poor employee retention due to limited career growth"
    ],
    challengesText: "Organisations often face workforce development challenges that impact productivity and business growth.",
    howSupports: "We design programmes that enhance knowledge, improve performance, and support long-term organizational success through structured corporate learning.",
    supportIncludes: [
      { name: "Corporate Training Programmes", desc: "Designing customised training programmes that improve employee knowledge, workplace productivity, and overall organisational performance." },
      { name: "Employee Skill Development", desc: "Helping employees strengthen technical, operational, communication, and professional skills required for their roles and future career growth." },
      { name: "Leadership Development", desc: "Preparing supervisors, managers, and future leaders with practical leadership, decision-making, communication, and people management skills." },
      { name: "HR & Compliance Training", desc: "Providing practical HR, workplace policy, labour law awareness, and compliance training to support responsible workforce management." },
      { name: "Soft Skills Development", desc: "Enhancing communication, teamwork, problem-solving, customer service, time management, and interpersonal skills that contribute to workplace success." },
      { name: "Induction & Onboarding Training", desc: "Creating structured onboarding programmes that help new employees integrate quickly, understand company expectations, and become productive from the beginning." },
      { name: "Learning & Development Consulting", desc: "Assessing organisational training needs and developing structured learning strategies aligned with business objectives and workforce development goals." },
      { name: "Certified Human Resource Management Professional (CHRMP)", desc: "Delivering practical HR training designed for graduates, aspiring HR professionals, career changers, and working professionals seeking real corporate HR experience and career advancement." }
    ],
    benefits: [
      "Build a skilled, capable, and future-ready workforce.",
      "Improve employee productivity and workplace performance.",
      "Strengthen leadership and managerial capabilities.",
      "Reduce skill gaps through continuous learning.",
      "Improve employee confidence, engagement, and retention.",
      "Support organisational growth through workforce development.",
      "Create a culture of learning and continuous improvement.",
      "Prepare employees to adapt to changing business and industry requirements."
    ]
  },
  {
    id: 9,
    title: "Employer Branding & Recruitment Marketing",
    about: "The best talent is attracted to organisations with a strong employer brand. Staffspectrum's Employer Branding & Recruitment Marketing solutions help businesses strengthen their reputation as an employer, improve candidate experience, and attract high-quality professionals through strategic employer branding and recruitment communication.\n\nWe work with organisations to build a compelling employer identity that reflects their culture, values, and opportunities, making it easier to attract, engage, and retain the right talent in today's competitive job market.",
    challenges: [
      "Difficulty attracting qualified candidates",
      "Weak employer brand and market visibility",
      "High recruitment costs",
      "Low response to job advertisements",
      "Poor candidate experience",
      "Inconsistent employer messaging",
      "Increased competition for skilled professionals",
      "Limited recruitment marketing strategies"
    ],
    challengesText: "Many organisations struggle to attract and retain top talent due to limited employer visibility and inconsistent recruitment communication.",
    howSupports: "We build a compelling employer identity that reflects your culture and values, strengthening recruitment outreach and talent attraction.",
    supportIncludes: [
      { name: "Employer Branding Strategy", desc: "Developing a strong employer brand that communicates your organisation's culture, values, vision, and employee value proposition (EVP)." },
      { name: "Recruitment Marketing Campaigns", desc: "Designing targeted recruitment campaigns that increase visibility, generate quality applications, and attract the right talent." },
      { name: "Career Page Development", desc: "Creating professional and engaging career pages that showcase your organisation, workplace culture, and career opportunities." },
      { name: "Job Advertisement Design & Content", desc: "Developing compelling job advertisements and recruitment content that improve candidate engagement and application quality." },
      { name: "Social Media Recruitment", desc: "Leveraging digital platforms and social media to strengthen employer visibility, promote career opportunities, and connect with potential candidates." },
      { name: "Employee Value Proposition (EVP) Development", desc: "Helping organisations define and communicate what makes them a preferred employer, strengthening both talent attraction and employee retention." },
      { name: "Candidate Experience Improvement", desc: "Optimising the recruitment journey through clear communication, professional interactions, and structured hiring processes that leave a positive impression." },
      { name: "Recruitment Communication & Brand Support", desc: "Creating consistent recruitment messaging, employer branding materials, and communication strategies that reinforce your organisation's professional image." }
    ],
    benefits: [
      "Attract higher-quality candidates.",
      "Strengthen your reputation as an employer of choice.",
      "Increase visibility among skilled professionals.",
      "Improve candidate engagement and application quality.",
      "Enhance the overall candidate experience.",
      "Reduce recruitment costs through stronger employer positioning.",
      "Support long-term talent attraction and retention.",
      "Build a consistent and professional employer brand."
    ]
  },
  {
    id: 10,
    title: "HR Technology & Digital HR Solutions",
    about: "Technology is transforming the way organisations manage their workforce. Staffspectrum's HR Technology & Digital HR Solutions help businesses modernise HR processes through digital systems, automation, and smart workforce management tools that improve efficiency, accuracy, and employee experience.\n\nWhether you're implementing your first HR system or upgrading existing HR processes, we help you leverage technology to simplify people management, improve decision-making, and build a future-ready workplace.",
    challenges: [
      "Manual HR administration and paperwork",
      "Difficulty managing employee data and records",
      "Time-consuming attendance and leave tracking",
      "Payroll processing inefficiencies",
      "Limited workforce visibility and reporting",
      "Lack of HR automation",
      "Poor employee self-service capabilities",
      "Difficulty adapting to digital HR transformation"
    ],
    challengesText: "Many organisations struggle to manage HR efficiently due to outdated systems and manual processes.",
    howSupports: "We help businesses modernise HR processes through digital systems, automation, and smart workforce management tools.",
    supportIncludes: [
      { name: "HRMS & HRIS Implementation", desc: "Helping organisations select, implement, and optimise Human Resource Management Systems (HRMS) and Human Resource Information Systems (HRIS) that streamline HR operations." },
      { name: "Attendance & Leave Management Systems", desc: "Implementing digital attendance, shift scheduling, leave management, and time-tracking solutions that improve workforce visibility and operational efficiency." },
      { name: "Payroll System Integration", desc: "Supporting payroll automation, salary processing, statutory deductions, and payroll reporting through integrated digital solutions." },
      { name: "Employee Self-Service (ESS) Solutions", desc: "Enabling employees to access payslips, apply for leave, update personal information, submit requests, and manage HR-related activities through secure self-service portals." },
      { name: "HR Process Automation", desc: "Automating routine HR tasks such as onboarding, approvals, document workflows, notifications, and employee lifecycle management to improve productivity and reduce manual effort." },
      { name: "HR Analytics & Workforce Reporting", desc: "Providing dashboards, reports, and workforce analytics that help management make informed, data-driven HR decisions." },
      { name: "Digital HR Documentation", desc: "Digitising employee records, HR documents, policies, contracts, and compliance records for improved accessibility, security, and operational efficiency." },
      { name: "HR Technology Consulting", desc: "Advising organisations on selecting, implementing, and optimising HR technology solutions that align with business goals and workforce requirements." }
    ],
    benefits: [
      "Reduce manual HR administration and paperwork.",
      "Improve accuracy through automated HR processes.",
      "Enhance employee experience with digital HR services.",
      "Strengthen workforce visibility through real-time reporting.",
      "Support faster and more informed management decisions.",
      "Improve operational efficiency and productivity.",
      "Scale HR operations as your organisation grows.",
      "Build a future-ready, technology-enabled HR function."
    ]
  }
];

const whyBusinessesChooseUs = [
  "Complete End-to-End HR Solutions",
  "Pan-India Recruitment Capability",
  "Experienced HR Professionals",
  "Industry-Specific Expertise",
  "Technology-Enabled HR Solutions",
  "Quality & Compliance Focus",
  "Flexible & Scalable HR Support",
  "Long-Term HR Partnership"
];

export default function ServicesClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeService = servicesList[activeIndex];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    const element = document.getElementById("catalog-section");
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.servicesWrapper}>
      {/* 1. HERO SECTION (Main Heading on Black Background) */}
      <section className={styles.heroSection} id="solutions-hero">
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>
            OUR <br />
            <span className={styles.heroHighlight}>HR SOLUTIONS</span>
          </h1>
        </div>
      </section>

      {/* 2. OVERVIEW SECTION (Contents Part) */}
      <section className={`container ${styles.overviewSection}`} id="solutions-overview">
        <div className={styles.overviewCard}>
          <h2 className={styles.overviewTitle}>
            Complete HR Solutions for Growing Businesses
          </h2>
          <div className={styles.overviewContent}>
            <p className={styles.overviewText}>
              Staffspectrum provides end-to-end HR Solutions that help organisations build stronger teams, streamline HR operations, ensure statutory compliance, and create high-performing workplaces.
            </p>
            <p className={styles.overviewText}>
              From Recruitment &amp; Talent Acquisition to HR Consulting, Payroll Management, Statutory &amp; Labour Compliance, Workforce Management, HR Outsourcing, Employer Branding, and Employee Development, we deliver practical, business-focused HR solutions that support every stage of the employee lifecycle.
            </p>
          </div>
          <div className={styles.overviewAction}>
            <Link href="/contact-us?interest=consultancy" className={styles.overviewBtn}>
              <span>Connect With Our HR Experts</span>
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className={`container ${styles.introSection}`} id="solutions-intro">
        <div className={styles.introContent}>
          <div>
            <div className={styles.sectionLabel}>INTRODUCTION</div>
            <h2 className={styles.introTitle}>Managing People Requires More Than Hiring Employees.</h2>
          </div>
          <div className={styles.introSubtext}>
            <p style={{ marginBottom: "1rem" }}>
              Every organisation has unique workforce challenges, operational requirements, and business goals. Staffspectrum delivers integrated HR Solutions that help businesses attract the right talent, strengthen HR operations, ensure compliance, improve employee performance, and build scalable people management systems.
            </p>
            <p>
              Our experienced HR professionals combine industry expertise, structured processes, and practical business strategies to deliver HR solutions that create long-term organisational success and sustainable business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Catalog Section */}
      <section className={`container ${styles.catalogSection}`} id="catalog-section">
        <div className={styles.catalogGrid}>
          {/* Left Menu Sidebar */}
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>HR Solutions</h3>
            <div className={styles.tabsMenu}>
              {servicesList.map((service, index) => (
                <button
                  key={service.id}
                  id={`service-tab-${service.id}`}
                  className={`${styles.tabBtn} ${activeIndex === index ? styles.tabBtnActive : ""}`}
                  onClick={() => handleTabClick(index)}
                >
                  <span className={styles.tabNumber}>{service.id < 10 ? `0${service.id}` : service.id}</span>
                  <span className={styles.tabLabel}>{service.title}</span>
                </button>
              ))}
            </div>

            {/* Mobile Dropdown View */}
            <div className={styles.mobileDropdownWrapper} ref={dropdownRef}>
              <button
                type="button"
                className={`${styles.mobileDropdownTrigger} ${isDropdownOpen ? styles.triggerOpen : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                <div className={styles.mobileTriggerContent}>
                  <span className={styles.mobileNumber}>
                    {activeService.id < 10 ? `0${activeService.id}` : activeService.id}
                  </span>
                  <span className={styles.mobileTriggerTitle}>{activeService.title}</span>
                </div>
                <svg
                  className={`${styles.mobileChevron} ${isDropdownOpen ? styles.chevronOpen : ""}`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className={styles.mobileDropdownMenu}>
                  {servicesList.map((service, index) => (
                    <button
                      key={service.id}
                      type="button"
                      className={`${styles.mobileDropdownItem} ${activeIndex === index ? styles.mobileDropdownItemActive : ""}`}
                      onClick={() => {
                        handleTabClick(index);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className={styles.mobileNumber}>
                        {service.id < 10 ? `0${service.id}` : service.id}
                      </span>
                      <span className={styles.mobileItemTitle}>{service.title}</span>
                      {activeIndex === index && (
                        <svg className={styles.mobileCheckIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Right Content Panel */}
          <div className={styles.contentPanel} key={activeIndex} id="content-panel">
            <div className={styles.panelHeader}>
              <span className={styles.panelNumber}>{activeService.id < 10 ? `0${activeService.id}` : activeService.id}</span>
              <h2 className={styles.panelTitle}>{activeService.title}</h2>
            </div>

            {/* About Block */}
            <div className={styles.panelBlock}>
              <h4 className={styles.blockLabel}>About the Service</h4>
              {activeService.about.split("\n\n").map((para, idx) => (
                <p key={idx} className={styles.aboutText}>{para}</p>
              ))}
            </div>

            {/* Challenges Block */}
            <div className={styles.panelBlock}>
              <h4 className={styles.blockLabel}>Business Challenges We Solve</h4>
              <p className={styles.challengesText}>{activeService.challengesText}</p>
              <ul className={styles.challengesList}>
                {activeService.challenges.map((challenge, idx) => (
                  <li key={idx} className={styles.challengeItem}>
                    <span className={styles.bulletPoint} />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Block */}
            <div className={styles.panelBlock}>
              <h4 className={styles.blockLabel}>How Staffspectrum Supports</h4>
              <p className={styles.supportIntro}>{activeService.howSupports}</p>
              <div className={styles.supportIncludesGrid}>
                <h5 className={styles.supportIncludesTitle}>Our Support Includes:</h5>
                <ul className={styles.includesList}>
                  {activeService.supportIncludes.map((item, idx) => (
                    <li key={idx} className={styles.includeItem}>
                      <span className={styles.includeName}>
                        <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item.name}
                      </span>
                      <span className={styles.includeDesc}>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Business Benefits Block */}
            {activeService.benefits && (
              <div className={styles.panelBlock}>
                <h4 className={styles.blockLabel}>Business Benefits</h4>
                <p className={styles.supportIntro}>
                  Partnering with Staffspectrum for {activeService.title} helps your organisation:
                </p>
                <ul className={styles.benefitsList}>
                  {activeService.benefits.map((benefit, idx) => (
                    <li key={idx} className={styles.benefitItem}>
                      <span className={styles.bulletPoint} style={{ backgroundColor: "#007CC4" }} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation Block (Prev/Next Arrows) */}
            <div className={styles.navigationRow}>
              <button
                className={styles.navBtn}
                onClick={() => {
                  const prevIdx = (activeIndex - 1 + servicesList.length) % servicesList.length;
                  handleTabClick(prevIdx);
                }}
                aria-label="Previous solution"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Previous Solution</span>
              </button>

              <button
                className={styles.navBtn}
                onClick={() => {
                  const nextIdx = (activeIndex + 1) % servicesList.length;
                  handleTabClick(nextIdx);
                }}
                aria-label="Next solution"
              >
                <span>Next Solution</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Businesses Choose Staffspectrum */}
      <section className={styles.whyChooseSection} id="why-choose-us">
        <div className="container">
          <div className={styles.centerHeader}>
            <div className={styles.sectionLabel}>WHY BUSINESSES CHOOSE STAFFSPECTRUM</div>
            <h2 className={styles.centerTitle}>More Than Recruitment. Your Complete HR Partner.</h2>
            <p className={styles.centerSubtitle}>
              Building a successful organisation requires more than hiring talented employees. It requires structured HR systems, experienced HR professionals, compliance expertise, workforce planning, and practical people strategies that support long-term business growth.
            </p>
            <p className={styles.centerSubtitle} style={{ marginTop: "0.75rem" }}>
              Staffspectrum brings every essential HR function together under one trusted partnership, helping organisations strengthen operations, improve employee performance, reduce business risks, and build sustainable workplaces.
            </p>
          </div>

          <div className={styles.whyGrid}>
            {whyBusinessesChooseUs.map((strength, idx) => (
              <div key={idx} className={styles.whyCard}>
                <svg className={styles.whyCheckIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.whyCardText}>{strength}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`container ${styles.ctaSection}`} id="solutions-cta">
        <div className={styles.ctaCard}>
          <span className={styles.ctaLabel}>COLLABORATE</span>
          <h2 className={styles.ctaTitle}>Let's Build a Stronger Workforce Together</h2>
          <p className={styles.ctaText}>
            Every successful business starts with the right people and the right HR partner.
          </p>
          <p className={styles.ctaText}>
            Whether you're expanding your team, improving HR operations, strengthening workforce management, or building a more efficient organisation, Staffspectrum is ready to deliver practical HR solutions tailored to your business goals.
          </p>
          <p className={styles.ctaText} style={{ fontWeight: 600, color: "#ffffff" }}>
            Let's work together to build stronger teams, smarter HR systems, and sustainable business growth.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/contact-us?interest=consultancy" className={styles.ctaBtn}>
              Talk to Our HR Experts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
