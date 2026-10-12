"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Link from "next/link";
import styles from "./contact.module.css";

const PERSONAS = [
  {
    id: "employer",
    title: "Employer / Business",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    options: [
      "Recruitment & Talent Acquisition",
      "Workforce Management",
      "HR Solutions",
      "HR Outsourcing",
      "HR Consulting",
      "General HR Enquiry",
      "Payroll & Compliance",
      "HR Operations"
    ]
  },
  {
    id: "jobseeker",
    title: "Job Seeker",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    options: [
      "Job Opportunities",
      "Career Enquiry"
    ]
  },
  {
    id: "student",
    title: "Student / HR Professional",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    options: [
      "CHRMP Training",
      "HR Internship",
      "HR Career Enquiry"
    ]
  }
];

function ContactFormInner() {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("job");
  const interestParam = searchParams.get("interest");

  // Form states
  const [selectedPersona, setSelectedPersona] = useState("employer");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedName, setTouchedName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedMobile, setTouchedMobile] = useState(false);
  const [touchedMessage, setTouchedMessage] = useState(false);

  useEffect(() => {
    if (jobTitle) {
      setSelectedPersona("jobseeker");
      setSelectedInterests(["Job Opportunities"]);
      setMessage(
        `Hi! I would like to apply for the "${decodeURIComponent(jobTitle)}" position at Staffspectrum.`
      );
    } else if (interestParam === "chrmp") {
      setSelectedPersona("student");
      setSelectedInterests(["CHRMP Training"]);
    } else if (interestParam === "consultancy") {
      setSelectedPersona("employer");
      setSelectedInterests(["HR Consulting"]);
    }
  }, [jobTitle, interestParam]);

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  // Genuine email validation (RFC format requiring username, @, valid domain, and 2+ char extension)
  const isEmailValid = (val) => {
    if (!val) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(val.trim());
  };

  // Genuine phone validation (requires 10 to 15 digits according to standard formats)
  const isPhoneValid = (val) => {
    if (!val) return false;
    const digits = val.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };

  const getPhoneError = () => {
    if (!touchedMobile) return "";
    if (!mobile || !mobile.trim()) return "Mobile number is required.";
    const digits = mobile.replace(/\D/g, "");
    if (digits.length < 10) return "Please enter a valid mobile number (at least 10 digits).";
    if (digits.length > 15) return "Phone number cannot exceed 15 digits.";
    return "";
  };

  // Genuine phone typing: rejects letters and symbols, allows digits, spaces, hyphens, and leading +
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    let clean = val.replace(/[^\d+\- ]/g, "");
    
    // Allow single '+' only at the start
    if (clean.includes("+")) {
      clean = "+" + clean.replace(/\+/g, "");
    }
    
    // Max 15 digits
    const digitsOnly = clean.replace(/\D/g, "");
    if (digitsOnly.length > 15) return;

    setMobile(clean);
  };

  // Clean Indian / international phone spacing on blur
  const handlePhoneBlur = () => {
    setTouchedMobile(true);
    const digits = mobile.replace(/\D/g, "");
    if (!mobile.startsWith("+") && digits.length === 10) {
      setMobile(`${digits.slice(0, 5)} ${digits.slice(5)}`);
    } else if (mobile.startsWith("+91") && digits.length === 12) {
      const rest = digits.slice(2);
      setMobile(`+91 ${rest.slice(0, 5)} ${rest.slice(5)}`);
    }
  };

  // Genuine email typing: auto-lowercase and strip spaces
  const handleEmailChange = (e) => {
    const clean = e.target.value.toLowerCase().replace(/\s/g, "");
    setEmail(clean);
  };

  const isFormFilled = Boolean(
    name.trim().length >= 2 &&
    isPhoneValid(mobile) &&
    isEmailValid(email) &&
    message.trim().length >= 3
  );

  const handlePersonaChange = (id) => {
    setSelectedPersona(id);
    setSelectedInterests([]);
  };

  const toggleInterest = (option) => {
    setSelectedInterests((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedMobile(true);
    setTouchedMessage(true);

    if (!name || name.trim().length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (!mobile || !isPhoneValid(mobile)) {
      setErrorMessage("Please enter a valid mobile number with at least 10 digits.");
      return;
    }
    if (!email || !isEmailValid(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!message || message.trim().length < 3) {
      setErrorMessage("Please enter your message (minimum 3 characters).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          persona: selectedPersona,
          interests: selectedInterests,
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            (result.details
              ? Object.values(result.details).flat().join(" ")
              : "Failed to submit enquiry. Please try again.")
        );
      }

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMobile("");
      setMessage("");
      setSelectedInterests([]);
      setTouchedEmail(false);
      setTouchedMobile(false);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successIconWrapper}>
          <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Inquiry Submitted!</h3>
        <p className={styles.successText}>
          Thank you for connecting with Staffspectrum. An HR consultant will review your message and reach out within 2 hours.
        </p>
        <button
          className={styles.successBtn}
          onClick={() => {
            setIsSubmitted(false);
            setErrorMessage("");
          }}
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.formHeader}>
        <span className={styles.formBadge}>FEEDBACK &amp; INQUIRIES</span>
        <h3 className={styles.formTitle}>Start a Conversation</h3>
        <div className={styles.formTitleAccent} />
        <p className={styles.formDesc}>
          Tell us what you need, and we'll direct your enquiry to the right team.
        </p>
      </div>

      <form className={styles.contactForm} onSubmit={handleSubmit} suppressHydrationWarning>
        {/* Persona Selector Tabs */}
        <div className={styles.interestSection}>
          <label className={styles.interestHeading}>I Am Interested In</label>
          <div className={styles.personaGrid}>
            {PERSONAS.map((persona) => {
              const isSelected = selectedPersona === persona.id;
              return (
                <button
                  type="button"
                  key={persona.id}
                  className={`${styles.personaCard} ${isSelected ? styles.personaCardActive : ""}`}
                  onClick={() => handlePersonaChange(persona.id)}
                  suppressHydrationWarning
                >
                  <div className={styles.personaIcon}>{persona.icon}</div>
                  <span className={styles.personaTitle}>{persona.title}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-options checkboxes box */}
          <div className={styles.optionsBox}>
            <div className={styles.checkboxGrid}>
              {currentPersona.options.map((option) => {
                const checked = selectedInterests.includes(option);
                return (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.hiddenCheckbox}
                      checked={checked}
                      onChange={() => toggleInterest(option)}
                      suppressHydrationWarning
                    />
                    <span className={`${styles.customCheckbox} ${checked ? styles.checkboxChecked : ""}`}>
                      {checked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className={styles.optionText}>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Input Fields (Embedded Card Design matching reference image) */}
        <div className={styles.formRow}>
          <div className={`${styles.embeddedField} ${touchedName && (!name || name.trim().length < 2) ? styles.fieldInvalid : ""}`}>
            <label htmlFor="contact-name" className={styles.embeddedLabel}>
              Full Name <span className={styles.reqAsterisk}>*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              className={styles.embeddedInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouchedName(true)}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              suppressHydrationWarning
            />
            {touchedName && (!name || name.trim().length < 2) && (
              <span className={styles.validationHint}>
                {!name.trim() ? "Full name is required" : "Please enter at least 2 characters"}
              </span>
            )}
          </div>

          <div className={`${styles.embeddedField} ${touchedMobile && getPhoneError() ? styles.fieldInvalid : ""}`}>
            <label htmlFor="contact-mobile" className={styles.embeddedLabel}>
              Mobile Number <span className={styles.reqAsterisk}>*</span>
            </label>
            <input
              id="contact-mobile"
              type="tel"
              className={styles.embeddedInput}
              value={mobile}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              placeholder="Enter your mobile number"
              required
              autoComplete="tel"
              inputMode="tel"
              suppressHydrationWarning
            />
            {touchedMobile && getPhoneError() && (
              <span className={styles.validationHint}>{getPhoneError()}</span>
            )}
          </div>
        </div>

        <div className={`${styles.embeddedField} ${touchedEmail && (!email || !isEmailValid(email)) ? styles.fieldInvalid : ""}`}>
          <label htmlFor="contact-email" className={styles.embeddedLabel}>
            Email Address <span className={styles.reqAsterisk}>*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className={styles.embeddedInput}
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setTouchedEmail(true)}
            placeholder="Enter your email address"
            required
            autoComplete="email"
            inputMode="email"
            suppressHydrationWarning
          />
          {touchedEmail && (!email || !isEmailValid(email)) && (
            <span className={styles.validationHint}>
              {!email ? "Email address is required" : "Please enter a valid email address (e.g. name@example.com)"}
            </span>
          )}
        </div>

        <div className={`${styles.embeddedField} ${touchedMessage && (!message || message.trim().length < 3) ? styles.fieldInvalid : ""}`}>
          <label htmlFor="contact-message" className={styles.embeddedLabel}>
            Message <span className={styles.reqAsterisk}>*</span>
          </label>
          <textarea
            id="contact-message"
            className={styles.embeddedTextarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => setTouchedMessage(true)}
            placeholder="Tell us how we can help you..."
            required
            suppressHydrationWarning
          ></textarea>
          {touchedMessage && (!message || message.trim().length < 3) && (
            <span className={styles.validationHint}>
              {!message ? "Message is required" : "Please enter at least 3 characters"}
            </span>
          )}
        </div>

        {errorMessage && (
          <div className={styles.errorBanner} role="alert">
            <svg
              className={styles.errorIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          className={`${styles.submitBtn} ${isFormFilled ? styles.submitBtnDark : styles.submitBtnLight}`}
          disabled={isSubmitting}
          suppressHydrationWarning
        >
          {isSubmitting ? "Submitting Enquiry..." : "Submit Enquiry"}
        </button>
      </form>
    </>
  );
}

export default function ContactContent() {
  return (
    <>
      <Navbar />
      <main className={styles.contactPage}>
        {/* Dark Premium Hero Section */}
        <section className={styles.heroSection} id="contact-hero">
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>
              <span>Let's Connect</span>
            </h1>
          </div>
        </section>

        {/* Split Screen Contact Container (Matching Hirico Layout Design) */}
        <section className={`container ${styles.splitContainer}`} id="contact-details">
          <div className={styles.splitBox}>
            {/* Left Panel: Ambient Slate Box with Photo & Headline */}
            <div className={styles.splitLeftPanel}>
              <div className={styles.leftContent}>
                <span className={styles.leftBrandTag}>STAFFSPECTRUM</span>
                <h2 className={styles.leftHeadline}>
                  We’re Here to Help
                </h2>
                <p className={styles.leftSubtext}>
                  Whether you need the right talent, professional HR support, career opportunities, or practical HR training, our team is ready to help.
                </p>

                <div className={styles.leftPhotoFrame}>
                  <div className={styles.cleanPhotoWrapper}>
                    <Image
                      src="/contact-support-agent.png"
                      alt="Staffspectrum Support Agent"
                      width={600}
                      height={400}
                      className={styles.leftPhotoImg}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Crisp White Panel with Contact Details */}
            <div className={styles.splitRightPanel}>
              <div className={styles.rightHeader}>
                <h2 className={styles.rightTitle}>Contact Info</h2>
                <p className={styles.rightSubtitle}>
                  Reach out to our team directly via phone, email, or visit our office.
                </p>
              </div>

              <div className={styles.contactFieldsList}>
                {/* Phone Number */}
                <a
                  href="tel:+918594000720"
                  className={styles.pillCard}
                  id="info-phone"
                  aria-label="Phone Number: +91 8594 000 720"
                >
                  <svg
                    className={styles.pillIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5l1.5-2.5 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                  <span className={styles.pillValue}>+91 8594 000 720</span>
                </a>

                {/* Email Address */}
                <a
                  href="mailto:info@staff-spectrum.com"
                  className={styles.pillCard}
                  id="info-email"
                  aria-label="Email Address: info@staff-spectrum.com"
                >
                  <svg
                    className={styles.pillIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="1.5" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                  <span className={styles.pillValue}>info@staff-spectrum.com</span>
                </a>

                {/* Working Hours */}
                <div
                  className={styles.pillCard}
                  id="info-hours"
                  aria-label="Working Hours: Monday - Friday: 09:00 AM - 05:00 PM"
                >
                  <svg
                    className={styles.pillIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className={styles.pillValue}>Monday - Friday: 09:00 AM - 05:00 PM</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className={styles.socialFollowWrap}>
                <span className={styles.socialFollowLabel}>Follow Us</span>
                <div className={styles.socialLinksRow}>
                  <a
                    href="https://wa.me/918594000720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    aria-label="Staffspectrum on WhatsApp"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.35.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.786-1.675-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.502.101-.201.05-.376-.025-.527-.075-.15-.677-1.632-.927-2.235-.244-.588-.493-.508-.677-.517-.175-.01-.376-.01-.577-.01s-.527.075-.802.376c-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.229 3.11.15.201 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.9.12.58-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.126-.275-.201-.576-.352zM12.04 2C6.54 2 2.08 6.46 2.08 11.96c0 1.97.57 3.81 1.57 5.37L2 22l4.82-1.57c1.5 1 3.29 1.57 5.22 1.57 5.5 0 9.96-4.46 9.96-9.96 0-5.5-4.46-9.96-9.96-9.96zm0 18.23c-1.68 0-3.25-.49-4.59-1.34l-.33-.21-3.39 1.1 1.13-3.31-.23-.36c-.95-1.4-1.46-3.05-1.46-4.75 0-4.56 3.71-8.27 8.27-8.27 4.56 0 8.27 3.71 8.27 8.27 0 4.56-3.71 8.27-8.27 8.27z"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/staffspectrum/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    aria-label="Staffspectrum on Instagram"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/staffspectrumservices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    aria-label="Staffspectrum on LinkedIn"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.5 21.5h-5v-13h5v13zM4 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM22.5 21.5h-5v-7c0-1.8-0.7-3-2.3-3-1.2 0-2 0.8-2.3 1.6-0.1 0.3-0.1 0.7-0.1 1.1v7.3h-5s0.1-11.8 0-13h5v1.8c0.7-1 1.9-2.5 4.5-2.5 3.3 0 5.8 2.2 5.8 6.8v6.9z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/Staffspectrum/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    aria-label="Staffspectrum on Facebook"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/StaffSpectrum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    aria-label="Staffspectrum on X (Twitter)"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Map & Inquiry Form Section */}
        <section className={`container ${styles.formSection}`}>
          <div className={styles.contactGrid}>
            {/* Map Frame */}
            <div className={styles.mapContainer}>
              <div className={styles.mapHeader}>
                <div className={styles.mapPinIcon}>📍</div>
                <div>
                  <h4 className={styles.mapTitle}>Kakkanchery HQ Location</h4>
                  <p className={styles.mapSub}>Kinfra Techno Park, Neospace II</p>
                </div>
              </div>
              <div className={styles.mapFrameWrapper}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d74469.03619978791!2d75.81421550543308!3d11.20267986113089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6502f41ef4e8b%3A0xf4c653a7548cccd!2sKinfra%20Techno%20Industrial%20Park!5e0!3m2!1sen!2sin!4v1659531327794!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Staffspectrum Kakkanchery HQ Location Map"
                />
              </div>
            </div>

            {/* Right Column: Contact & Inquiry Form */}
            <div className={styles.formCol}>
              <Suspense fallback={<div className={styles.loadingForm}>Loading form options...</div>}>
                <ContactFormInner />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
