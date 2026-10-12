"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./job-detail.module.css";

export default function JobDetailClient({ job }) {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [note, setNote] = useState("");
  const [cvFile, setCvFile] = useState(null);

  // Validation / Touch States
  const [touchedName, setTouchedName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [touchedCv, setTouchedCv] = useState(false);
  const [cvError, setCvError] = useState("");

  // Drag and Drop State
  const [isDragOver, setIsDragOver] = useState(false);

  // Submit States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  // Validation Helpers
  const isEmailValid = (val) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  const isPhoneValid = (val) => {
    if (!val) return false;
    const digits = val.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };

  // Phone input handling
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const clean = raw.replace(/[^\d+\- ]/g, "");
    const digits = clean.replace(/\D/g, "");
    if (digits.length > 15) return;
    setPhone(clean);
  };

  const handlePhoneBlur = () => {
    setTouchedPhone(true);
    const digits = phone.replace(/\D/g, "");
    if (!phone.startsWith("+") && digits.length === 10) {
      setPhone(`${digits.slice(0, 5)} ${digits.slice(5)}`);
    } else if (phone.startsWith("+91") && digits.length === 12) {
      const rest = digits.slice(2);
      setPhone(`+91 ${rest.slice(0, 5)} ${rest.slice(5)}`);
    }
  };

  // Email input handling
  const handleEmailChange = (e) => {
    const clean = e.target.value.toLowerCase().replace(/\s/g, "");
    setEmail(clean);
  };

  // Check whether all required application fields are filled
  const isFormFilled = Boolean(
    name.trim().length >= 2 &&
    isEmailValid(email) &&
    isPhoneValid(phone) &&
    cvFile
  );

  // File Upload Handling
  const validateAndSetFile = (file) => {
    setCvError("");
    setTouchedCv(true);

    if (!file) return;

    // Allowed extensions: PDF only
    const allowedTypes = ["application/pdf"];
    const allowedExtensions = [".pdf"];
    const fileExt = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExt);

    if (!isValidType) {
      setCvError("Only PDF files are allowed");
      setCvFile(null);
      return;
    }

    // Size limit: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setCvError("File size exceeds 10MB limit");
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setCvFile(null);
    setCvError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedPhone(true);
    setTouchedCv(true);

    if (name.trim().length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (!isEmailValid(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!isPhoneValid(phone)) {
      setErrorMessage("Please enter a valid contact number (10 to 15 digits).");
      return;
    }
    if (!cvFile) {
      setCvError("Please upload your CV before submitting");
      setErrorMessage("Please upload your CV (PDF document up to 10 MB).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      if (location) formData.append("location", location.trim());
      if (experience) formData.append("experience", experience.trim());
      if (portfolio) formData.append("portfolio", portfolio.trim());
      if (note) formData.append("note", note.trim());
      formData.append("cv", cvFile);

      const response = await fetch(`/api/jobs/${job.linkSlug}/apply`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            (result.details
              ? Object.values(result.details).flat().join(" ")
              : "Failed to submit application. Please try again.")
        );
      }

      setIsSubmitted(true);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    const formElement = document.getElementById("apply-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumbNav}>
          <Link href="/careers" className={styles.backLink}>
            <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to all open roles</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <header className={styles.headerCard}>
          <div className={styles.headerMain}>
            <h1 className={styles.jobTitle}>{job.title}</h1>

            {/* Sorted Badges: Department, Experience, Qualification, Work Type, Location */}
            <div className={styles.jobTags}>
              <span className={styles.jobTag}>
                <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {job.department}
              </span>
              {job.experienceLevel && (
                <span className={styles.jobTag}>
                  <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.experienceLevel}
                </span>
              )}
              {job.qualification && (
                <span className={styles.jobTag}>
                  <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  {job.qualification}
                </span>
              )}
              {job.employmentType && (
                <span className={styles.jobTag}>
                  <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.employmentType}
                </span>
              )}
              <span className={styles.jobTag}>
                <svg className={styles.tagIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {job.location}
              </span>
            </div>
          </div>

          <a href="#apply-form" onClick={scrollToForm} className={styles.quickApplyBtn}>
            Apply for this Position &darr;
          </a>
        </header>

        {/* Job Description & Specifications Section (Single Unified Box) */}
        <div className={styles.detailsContainer}>
          <div className={styles.unifiedCard}>
            {/* Overview Section */}
            <article className={styles.specSection}>
              <h2 className={styles.sectionHeading}>Role Overview</h2>
              <p className={styles.bodyText}>
                {job.overview || job.desc}
              </p>
            </article>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <>
                <div className={styles.specDivider} />
                <article className={styles.specSection}>
                  <h2 className={styles.sectionHeading}>Key Responsibilities</h2>
                  <ul className={styles.bulletList}>
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        <svg className={styles.bulletCheck} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </>
            )}

            {/* Requirements & Qualifications */}
            {job.requirements && job.requirements.length > 0 && (
              <>
                <div className={styles.specDivider} />
                <article className={styles.specSection}>
                  <h2 className={styles.sectionHeading}>Requirements & Qualifications</h2>
                  <ul className={styles.bulletList}>
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        <svg className={styles.bulletCheck} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </>
            )}

            {/* Benefits & Culture */}
            {job.benefits && job.benefits.length > 0 && (
              <>
                <div className={styles.specDivider} />
                <article className={styles.specSection}>
                  <h2 className={styles.sectionHeading}>What We Offer</h2>
                  <ul className={styles.bulletList}>
                    {job.benefits.map((benefit, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        <svg className={styles.bulletCheck} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </>
            )}
          </div>
        </div>

        {/* Application Form at the Last of the Page */}
        <section className={styles.applySection} id="apply-form">
          <div className={styles.formCard}>
            {!isSubmitted ? (
              <>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Apply for this Role</h2>
                  <p className={styles.formSubtitle}>
                    Fill in your contact details and attach your CV. Our talent team will review your application.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.appForm} noValidate suppressHydrationWarning>
                  {/* Full Name & Email */}
                  <div className={styles.row2}>
                    <div className={styles.fieldGroup}>
                      <div className={`${styles.fieldContainer} ${touchedName && name.trim().length < 2 ? styles.errorBorder : ""}`}>
                        <label className={styles.fieldLabel}>
                          Full Name <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.textInput}
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => setTouchedName(true)}
                          required
                          suppressHydrationWarning
                        />
                      </div>
                      {touchedName && name.trim().length < 2 && (
                        <span className={styles.errorText}>Please enter your full name</span>
                      )}
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={`${styles.fieldContainer} ${touchedEmail && !isEmailValid(email) ? styles.errorBorder : ""}`}>
                        <label className={styles.fieldLabel}>
                          Email Address <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                          type="email"
                          className={styles.textInput}
                          placeholder="Enter your email address"
                          value={email}
                          onChange={handleEmailChange}
                          onBlur={() => setTouchedEmail(true)}
                          required
                          suppressHydrationWarning
                        />
                      </div>
                      {touchedEmail && !isEmailValid(email) && (
                        <span className={styles.errorText}>Please enter a valid email</span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Current Location */}
                  <div className={styles.row2}>
                    <div className={styles.fieldGroup}>
                      <div className={`${styles.fieldContainer} ${touchedPhone && !isPhoneValid(phone) ? styles.errorBorder : ""}`}>
                        <label className={styles.fieldLabel}>
                          Contact Number <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                          type="tel"
                          className={styles.textInput}
                          placeholder="Enter your contact number"
                          value={phone}
                          onChange={handlePhoneChange}
                          onBlur={handlePhoneBlur}
                          required
                          suppressHydrationWarning
                        />
                      </div>
                      {touchedPhone && !isPhoneValid(phone) && (
                        <span className={styles.errorText}>
                          {!phone ? "Contact number is required" : "Please enter a valid contact number (10 to 15 digits)"}
                        </span>
                      )}
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldContainer}>
                        <label className={styles.fieldLabel}>Current Location</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          placeholder="Enter your current location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          suppressHydrationWarning
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Experience & Portfolio */}
                  <div className={styles.row2}>
                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldContainer}>
                        <label className={styles.fieldLabel}>Total Experience</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          placeholder="Enter your total experience (e.g. 3 Years)"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          suppressHydrationWarning
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldContainer}>
                        <label className={styles.fieldLabel}>LinkedIn / Portfolio URL (Optional)</label>
                        <input
                          type="url"
                          className={styles.textInput}
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          suppressHydrationWarning
                        />
                      </div>
                    </div>
                  </div>

                    {/* CV Upload Portion */}
                    <div className={styles.uploadSection}>
                      <label className={styles.fieldLabel}>
                        Upload your CV <span className={styles.requiredStar}>*</span>
                      </label>

                      {!cvFile ? (
                        <div
                          className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ""} ${
                            (touchedCv && !cvFile) || cvError ? styles.errorDropzone : ""
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className={styles.hiddenFileInput}
                            accept=".pdf,application/pdf"
                            onChange={handleFileInputChange}
                          />
                          <div className={styles.uploadIconWrap}>
                            <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div className={styles.dropzoneTitle}>
                            Upload your CV
                          </div>
                          <div className={styles.dropzoneHint}>
                            Supports PDF (Max size: 10MB)
                          </div>
                        </div>
                      ) : (
                        <div className={styles.fileCard}>
                          <div className={styles.fileCardLeft}>
                            <div className={styles.fileTypeIcon}>
                              <svg className={styles.fileDocIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className={styles.fileDetails}>
                              <span className={styles.fileName} title={cvFile.name}>
                                {cvFile.name}
                              </span>
                              <span className={styles.fileMeta}>
                                {formatFileSize(cvFile.size)} &bull;{" "}
                                <span className={styles.fileCheck}>
                                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Attached
                                </span>
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={styles.removeFileBtn}
                            onClick={handleRemoveFile}
                            title="Remove file"
                          >
                            <svg className={styles.removeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {cvError && <span className={styles.errorText}>{cvError}</span>}
                      {touchedCv && !cvFile && !cvError && (
                        <span className={styles.errorText}>Please attach your CV</span>
                      )}
                    </div>

                    {/* Short Cover Note */}
                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldContainer}>
                        <label className={styles.fieldLabel}>Brief Note / Cover Letter (Optional)</label>
                        <textarea
                          className={styles.textareaInput}
                          placeholder="Tell us briefly why you are interested in this position..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows="3"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>

                    {/* Error Banner */}
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`${styles.submitBtn} ${
                        isFormFilled ? styles.submitBtnDark : styles.submitBtnLight
                      }`}
                      disabled={isSubmitting}
                      id="submit-job-application"
                      suppressHydrationWarning
                    >
                      {isSubmitting ? (
                        <>
                          <div className={styles.spinner} />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Success Confirmation State */
                <div className={styles.successContainer}>
                  <div className={styles.successIconWrap}>
                    <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={styles.successTitle}>Application Submitted!</h3>
                  <p className={styles.successDesc}>
                    Thank you, <strong>{name}</strong>. Your CV has been successfully forwarded to our recruitment team for the <strong>{job.title}</strong> role.
                  </p>

                  <div className={styles.successApplicantBox}>
                    <div><strong>Applicant:</strong> {name}</div>
                    <div><strong>Email:</strong> {email}</div>
                    <div><strong>Contact:</strong> {phone}</div>
                    <div><strong>CV Attached:</strong> {cvFile ? cvFile.name : "Resume Uploaded"}</div>
                  </div>

                  <p className={styles.dropzoneHint}>
                    Our talent acquisition specialist will review your credentials and contact you within 2-3 business days.
                  </p>

                  <Link href="/careers" className={styles.backToCareersBtn}>
                    &larr; View Other Openings
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
  );
}
