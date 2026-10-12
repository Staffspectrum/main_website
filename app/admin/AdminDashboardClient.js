"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Users,
  Mail,
  Plus,
  LogOut,
  ExternalLink,
  ChevronRight,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  LayoutGrid,
  List,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  Download,
  AlertCircle
} from "lucide-react";
import styles from "./admin.module.css";

const INITIAL_JOB_FORM = {
  title: "",
  linkSlug: "",
  department: "",
  location: "Bangalore / Remote",
  employmentType: "Full-Time",
  experienceLevel: "Mid-level",
  qualification: "Bachelor's degree or equivalent",
  desc: "",
  overview: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  status: "PUBLISHED",
};

// Pastel colors for 2-letter initials
const BADGE_COLORS = [
  styles.badgeMint,
  styles.badgePeach,
  styles.badgeCyan,
  styles.badgeLavender,
  styles.badgePink,
  styles.badgeSlate,
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || "SS").toUpperCase();
}

function getBadgeColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % BADGE_COLORS.length;
  return BADGE_COLORS[idx];
}

export default function AdminDashboardClient({ currentUser }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("applications"); // 'applications' | 'jobs' | 'enquiries'
  const [viewMode, setViewMode] = useState("columns"); // 'columns' | 'table'
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Data states
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [jobStatusFilter, setJobStatusFilter] = useState("ALL");
  const [appJobFilter, setAppJobFilter] = useState("ALL");
  const [appStatusFilter, setAppStatusFilter] = useState("ALL");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("ALL");

  // Modal states
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState(INITIAL_JOB_FORM);
  const [submittingJob, setSubmittingJob] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 5000);
  };

  // Fetch Jobs
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch {
      showFeedback("error", "Failed to fetch jobs");
    }
  }, [router]);

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/applications");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch {
      showFeedback("error", "Failed to fetch applications");
    }
  }, [router]);

  // Fetch Enquiries
  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
      }
    } catch {
      showFeedback("error", "Failed to fetch enquiries");
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchApplications(), fetchEnquiries()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchJobs, fetchApplications, fetchEnquiries]);

  // Tab switch refresher
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    if (tab === "jobs") fetchJobs();
    if (tab === "applications") fetchApplications();
    if (tab === "enquiries") fetchEnquiries();
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  // -------------------------------------------------------------
  // JOB ACTIONS
  // -------------------------------------------------------------
  const openCreateJobModal = () => {
    setEditingJob(null);
    setJobFormData(INITIAL_JOB_FORM);
    setJobModalOpen(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title || "",
      linkSlug: job.linkSlug || "",
      department: job.department || "",
      location: job.location || "",
      employmentType: job.employmentType || "Full-Time",
      experienceLevel: job.experienceLevel || "Mid-level",
      qualification: job.qualification || "",
      desc: job.desc || "",
      overview: job.overview || "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
      benefits: Array.isArray(job.benefits) ? job.benefits.join("\n") : "",
      status: job.status === "DRAFT" ? "CLOSED" : (job.status || "PUBLISHED"),
    });
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSubmittingJob(true);

    const payload = {
      ...jobFormData,
      responsibilities: jobFormData.responsibilities
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      requirements: jobFormData.requirements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: jobFormData.benefits
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingJob ? `/api/admin/jobs/${editingJob.id}` : "/api/admin/jobs";
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save job");
      }

      showFeedback("success", editingJob ? "Job updated successfully" : "Job created successfully");
      setJobModalOpen(false);
      fetchJobs();
    } catch (err) {
      showFeedback("error", err.message);
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleJobStatusChange = async (jobId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update job status");
      }
      showFeedback("success", `Job status updated to ${newStatus}`);
      fetchJobs();
    } catch (err) {
      showFeedback("error", err.message);
    }
  };

  const handleDeleteJob = async (job) => {
    if (!confirm(`Are you sure you want to delete job "${job.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete job");
      }
      showFeedback("success", "Job deleted successfully");
      fetchJobs();
    } catch (err) {
      showFeedback("error", err.message);
    }
  };

  // -------------------------------------------------------------
  // APPLICATION ACTIONS
  // -------------------------------------------------------------
  const handleAppStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update application status");
      }
      showFeedback("success", `Application status updated to ${newStatus}`);
      fetchApplications();
    } catch (err) {
      showFeedback("error", err.message);
    }
  };

  // -------------------------------------------------------------
  // ENQUIRY ACTIONS
  // -------------------------------------------------------------
  const handleEnquiryStatusChange = async (enquiryId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update enquiry status");
      }
      showFeedback("success", `Enquiry status updated to ${newStatus}`);
      fetchEnquiries();
    } catch (err) {
      showFeedback("error", err.message);
    }
  };

  const handleDeleteEnquiry = async (enquiry) => {
    if (!confirm(`Are you sure you want to delete the enquiry from "${enquiry.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete enquiry");
      }
      showFeedback("success", "Enquiry deleted successfully");
      if (selectedEnquiry && selectedEnquiry.id === enquiry.id) {
        setSelectedEnquiry(null);
      }
      fetchEnquiries();
    } catch (err) {
      showFeedback("error", err.message);
    }
  };

  const handleDeleteApplication = async (application) => {
    if (
      !confirm(
        `Are you sure you want to delete the application from "${application.applicantName}"? This will permanently delete both the candidate record and their stored resume file from Cloudflare.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/applications/${application.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete application");
      }
      showFeedback("success", "Application and resume deleted successfully");
      if (selectedApplication && selectedApplication.id === application.id) {
        setSelectedApplication(null);
      }
      fetchApplications();
    } catch (err) {
      showFeedback("error", err.message);
    }
  };

  // Filtered lists
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      let matchStatus = true;
      if (jobStatusFilter === "PUBLISHED") {
        matchStatus = j.status === "PUBLISHED";
      } else if (jobStatusFilter === "CLOSED") {
        matchStatus = j.status === "CLOSED" || j.status === "DRAFT";
      }
      const matchSearch = !searchQuery || 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [jobs, jobStatusFilter, searchQuery]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchJob = appJobFilter === "ALL" || app.jobId === appJobFilter;
      const matchStatus = appStatusFilter === "ALL" || app.status === appStatusFilter;
      const matchSearch = !searchQuery ||
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.job?.title && app.job.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchJob && matchStatus && matchSearch;
    });
  }, [applications, appJobFilter, appStatusFilter, searchQuery]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      const matchStatus = enquiryStatusFilter === "ALL" || (enq.status || "NEW") === enquiryStatusFilter;
      const matchSearch = !searchQuery ||
        enq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enq.persona.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [enquiries, enquiryStatusFilter, searchQuery]);

  // Status counts for pipeline
  const appCounts = useMemo(() => {
    return {
      all: applications.length,
      new: applications.filter((a) => a.status === "NEW").length,
      reviewed: applications.filter((a) => a.status === "REVIEWED").length,
      shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
    };
  }, [applications]);

  const jobCounts = useMemo(() => {
    return {
      all: jobs.length,
      published: jobs.filter((j) => j.status === "PUBLISHED").length,
      closed: jobs.filter((j) => j.status === "CLOSED" || j.status === "DRAFT").length,
    };
  }, [jobs]);

  const enqCounts = useMemo(() => {
    return {
      all: enquiries.length,
      new: enquiries.filter((e) => (e.status || "NEW") === "NEW").length,
      read: enquiries.filter((e) => e.status === "READ").length,
      resolved: enquiries.filter((e) => e.status === "RESOLVED").length,
    };
  }, [enquiries]);

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardFrame}>
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Matching reference image) */}
        {/* ========================================================================= */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            {/* Brand Logo & Emblem */}
            <div className={styles.brandHeader}>
              <Link href="/admin" className={styles.brandBrandGroup}>
                <div className={styles.brandLogoWrapper}>
                  <Image
                    src="/logo.png"
                    alt="Staff Spectrum Logo"
                    width={34}
                    height={34}
                    className={styles.brandLogoImg}
                    priority
                  />
                </div>
                <span className={styles.brandTitleText}>
                  Staff<span className={styles.brandAccentText}>Spectrum</span>
                </span>
              </Link>
            </div>

            {/* Navigation: Main Menu */}
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Main menu</div>

              <button
                id="tab-applications-btn"
                className={`${styles.navItemBtn} ${activeTab === "applications" ? styles.navItemActive : ""}`}
                onClick={() => handleTabChange("applications")}
                suppressHydrationWarning
              >
                <div className={styles.navItemLeft}>
                  <Users size={18} />
                  <span>Applications</span>
                </div>
                <span
                  className={`${styles.navCountBadge} ${
                    appCounts.new > 0 ? styles.navCountBadgeDark : ""
                  }`}
                >
                  {applications.length}
                </span>
              </button>

              <button
                id="tab-jobs-btn"
                className={`${styles.navItemBtn} ${activeTab === "jobs" ? styles.navItemActive : ""}`}
                onClick={() => handleTabChange("jobs")}
                suppressHydrationWarning
              >
                <div className={styles.navItemLeft}>
                  <Briefcase size={18} />
                  <span>Jobs</span>
                </div>
                <span className={styles.navCountBadge}>{jobs.length}</span>
              </button>

              <button
                id="tab-enquiries-btn"
                className={`${styles.navItemBtn} ${activeTab === "enquiries" ? styles.navItemActive : ""}`}
                onClick={() => handleTabChange("enquiries")}
                suppressHydrationWarning
              >
                <div className={styles.navItemLeft}>
                  <Mail size={18} />
                  <span>Enquiries</span>
                </div>
                <span
                  className={`${styles.navCountBadge} ${
                    enqCounts.new > 0 ? styles.navCountBadgeDark : ""
                  }`}
                >
                  {enquiries.length}
                </span>
              </button>
            </div>

            {/* Navigation: Quick actions & external links */}
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Quick actions</div>

              <button
                className={styles.navItemBtn}
                onClick={openCreateJobModal}
                suppressHydrationWarning
              >
                <div className={styles.navItemLeft}>
                  <Plus size={18} />
                  <span>New Job Posting</span>
                </div>
              </button>

              <a
                href="/careers"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navItemBtn}
              >
                <div className={styles.navItemLeft}>
                  <ExternalLink size={18} />
                  <span>View Careers Site</span>
                </div>
              </a>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navItemBtn}
              >
                <div className={styles.navItemLeft}>
                  <ExternalLink size={18} />
                  <span>Public Website</span>
                </div>
              </a>
            </div>
          </div>

          {/* Account Profile Card at bottom of sidebar */}
          <div className={styles.accountCard}>
            <div className={styles.accountInfo}>
              <div className={styles.avatarBubble}>
                {getInitials(currentUser?.name || "Admin")}
              </div>
              <div className={styles.accountDetails}>
                <span className={styles.accountName}>
                  {currentUser?.name || "Administrator"}
                </span>
                <span className={styles.accountRole}>
                  {currentUser?.email || "Admin"}
                </span>
              </div>
            </div>
            <button
              id="admin-logout-btn"
              className={styles.logoutIconBtn}
              onClick={handleLogout}
              title="Sign Out"
              suppressHydrationWarning
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <main className={styles.mainContent}>
          {/* Top Breadcrumb & Utilities Bar */}
          <div className={styles.topBar}>
            <div className={styles.breadcrumbGroup}>
              <span>StaffSpectrum</span>
              <span>&gt;</span>
              <span className={styles.breadcrumbCurrent}>
                <Clock size={14} />
                {activeTab === "applications" && "Applications Management"}
                {activeTab === "jobs" && "Careers & Job Openings"}
                {activeTab === "enquiries" && "Client Enquiries"}
              </span>
            </div>

            <div className={styles.topBarActions}>
              <button
                className={styles.actionIconBtn}
                onClick={() => {
                  if (activeTab === "jobs") fetchJobs();
                  if (activeTab === "applications") fetchApplications();
                  if (activeTab === "enquiries") fetchEnquiries();
                  showFeedback("success", "Refreshed data");
                }}
                title="Refresh Data"
                suppressHydrationWarning
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback.message && (
            <div
              id="admin-feedback-banner"
              className={`${styles.feedbackBanner} ${
                feedback.type === "error" ? styles.feedbackError : styles.feedbackSuccess
              }`}
            >
              <span>{feedback.message}</span>
              <button
                onClick={() => setFeedback({ type: "", message: "" })}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
          )}

          {/* Page Title & Subtitle */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              {activeTab === "applications" && "Applications"}
              {activeTab === "jobs" && "Job Openings"}
              {activeTab === "enquiries" && "Enquiries"}
            </h1>
            <p className={styles.pageSubtitle}>
              {activeTab === "applications" &&
                "Track incoming candidate resumes, update review stages, and download CVs."}
              {activeTab === "jobs" &&
                "Manage published career opportunities, draft requisitions, and monitor applicant counts."}
              {activeTab === "enquiries" &&
                "Review client contact submissions, prospective employer requests, and resolved inquiries."}
            </p>
          </div>

          {/* Metric Cards Row (Matching Bottom-Left Stat Cards in Reference) */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLeft}>
                <div className={`${styles.metricIconCircle} ${styles.iconCircleEmerald}`}>
                  <CheckCircle2 size={20} />
                </div>
                <div className={styles.metricValues}>
                  <span className={styles.metricMainStat}>
                    {appCounts.new}/{appCounts.all}
                  </span>
                  <span className={styles.metricLabel}>New Applications</span>
                </div>
              </div>
              <div className={styles.miniBarChart}>
                <div className={`${styles.miniBar} ${styles.miniBarEmerald}`} style={{ height: "18px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarEmerald}`} style={{ height: "26px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarEmerald}`} style={{ height: "22px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarEmerald}`} style={{ height: "30px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarMuted}`} style={{ height: "12px" }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLeft}>
                <div className={`${styles.metricIconCircle} ${styles.iconCircleBlue}`}>
                  <Briefcase size={20} />
                </div>
                <div className={styles.metricValues}>
                  <span className={styles.metricMainStat}>
                    {jobCounts.published} Open
                  </span>
                  <span className={styles.metricLabel}>Published Roles</span>
                </div>
              </div>
              <div className={styles.miniBarChart}>
                <div className={`${styles.miniBar} ${styles.miniBarBlue}`} style={{ height: "24px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarBlue}`} style={{ height: "20px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarBlue}`} style={{ height: "28px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarBlue}`} style={{ height: "16px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarMuted}`} style={{ height: "8px" }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLeft}>
                <div className={`${styles.metricIconCircle} ${styles.iconCirclePurple}`}>
                  <Mail size={20} />
                </div>
                <div className={styles.metricValues}>
                  <span className={styles.metricMainStat}>
                    {enqCounts.new} Pending
                  </span>
                  <span className={styles.metricLabel}>Client Enquiries</span>
                </div>
              </div>
              <div className={styles.miniBarChart}>
                <div className={`${styles.miniBar} ${styles.miniBarPurple}`} style={{ height: "16px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarPurple}`} style={{ height: "22px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarPurple}`} style={{ height: "28px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarPurple}`} style={{ height: "20px" }} />
                <div className={`${styles.miniBar} ${styles.miniBarMuted}`} style={{ height: "10px" }} />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: APPLICATIONS */}
          {/* ========================================================================= */}
          {activeTab === "applications" && (
            <section>
              {/* Controls Bar: Pill Tabs & Actions */}
              <div className={styles.controlsBar}>
                {/* Status Filter Pills (Matching "Class 302" Black pill in reference) */}
                <div className={styles.filterPillsGroup}>
                  <button
                    className={`${styles.filterPill} ${
                      appStatusFilter === "ALL" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setAppStatusFilter("ALL")}
                    suppressHydrationWarning
                  >
                    <span>All</span>
                    <span
                      className={`${styles.pillBadge} ${
                        appStatusFilter === "ALL" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {appCounts.all}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      appStatusFilter === "NEW" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setAppStatusFilter("NEW")}
                    suppressHydrationWarning
                  >
                    <span>New</span>
                    <span
                      className={`${styles.pillBadge} ${
                        appStatusFilter === "NEW" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {appCounts.new}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      appStatusFilter === "REVIEWED" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setAppStatusFilter("REVIEWED")}
                    suppressHydrationWarning
                  >
                    <span>In Review</span>
                    <span
                      className={`${styles.pillBadge} ${
                        appStatusFilter === "REVIEWED" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {appCounts.reviewed}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      appStatusFilter === "SHORTLISTED" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setAppStatusFilter("SHORTLISTED")}
                    suppressHydrationWarning
                  >
                    <span>Shortlisted</span>
                    <span
                      className={`${styles.pillBadge} ${
                        appStatusFilter === "SHORTLISTED" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {appCounts.shortlisted}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      appStatusFilter === "REJECTED" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setAppStatusFilter("REJECTED")}
                    suppressHydrationWarning
                  >
                    <span>Rejected</span>
                    <span
                      className={`${styles.pillBadge} ${
                        appStatusFilter === "REJECTED" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {appCounts.rejected}
                    </span>
                  </button>
                </div>

                {/* Right controls: Job Filter & View Switch */}
                <div className={styles.controlsRight}>
                  {/* Select dropdown filter with existing ID */}
                  <select
                    id="application-job-filter"
                    className={styles.selectDropdown}
                    value={appJobFilter}
                    onChange={(e) => setAppJobFilter(e.target.value)}
                    suppressHydrationWarning
                  >
                    <option value="ALL">All Jobs ({jobs.length})</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>

                  {/* Hidden select with existing ID for automated tests compatibility */}
                  <select
                    id="application-status-filter"
                    style={{ display: "none" }}
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <button
                    className={styles.actionIconBtn}
                    onClick={() => setViewMode(viewMode === "columns" ? "table" : "columns")}
                    title={viewMode === "columns" ? "Switch to Table View" : "Switch to Columns View"}
                    suppressHydrationWarning
                  >
                    {viewMode === "columns" ? <List size={16} /> : <LayoutGrid size={16} />}
                  </button>
                </div>
              </div>

              {/* View 1: COLUMNS BOARD (Direct representation of image UI) */}
              {viewMode === "columns" && (
                <div className={styles.columnsContainer}>
                  {/* Column 1: New */}
                  <div className={styles.columnCard}>
                    <div className={styles.columnHeader}>
                      <div className={styles.columnTitleGroup}>
                        <CheckCircle2 size={16} color="#10b981" />
                        <span className={styles.columnTitle}>New</span>
                      </div>
                      <span className={styles.columnCounterBadge}>
                        {applications.filter((a) => a.status === "NEW").length}
                      </span>
                    </div>

                    <div className={styles.columnList}>
                      {applications.filter((a) => a.status === "NEW").length === 0 ? (
                        <div style={{ textAlign: "center", padding: "1.5rem", color: "#94a3b8", fontSize: "0.82rem" }}>
                          No new applications
                        </div>
                      ) : (
                        applications
                          .filter((a) => a.status === "NEW")
                          .map((app) => (
                            <div
                              key={app.id}
                              className={styles.candidateRowCard}
                              onClick={() => setSelectedApplication(app)}
                            >
                              <div className={styles.candidateLeft}>
                                <div
                                  className={`${styles.initialsBadge} ${getBadgeColor(
                                    app.applicantName
                                  )}`}
                                >
                                  {getInitials(app.applicantName)}
                                </div>
                                <div className={styles.candidateMeta}>
                                  <span className={styles.candidateName}>
                                    {app.applicantName}
                                  </span>
                                  <span className={styles.candidateSubtitle}>
                                    {app.job?.title || "Candidate"} • {app.experience || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className={styles.candidateRightActions}>
                                <button className={styles.chevronBtn}>
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Column 2: In Review */}
                  <div className={styles.columnCard}>
                    <div className={styles.columnHeader}>
                      <div className={styles.columnTitleGroup}>
                        <Clock size={16} color="#3b82f6" />
                        <span className={styles.columnTitle}>In Review</span>
                      </div>
                      <span className={styles.columnCounterBadge}>
                        {applications.filter((a) => a.status === "REVIEWED").length}
                      </span>
                    </div>

                    <div className={styles.columnList}>
                      {applications.filter((a) => a.status === "REVIEWED").length === 0 ? (
                        <div style={{ textAlign: "center", padding: "1.5rem", color: "#94a3b8", fontSize: "0.82rem" }}>
                          No applications in review
                        </div>
                      ) : (
                        applications
                          .filter((a) => a.status === "REVIEWED")
                          .map((app) => (
                            <div
                              key={app.id}
                              className={styles.candidateRowCard}
                              onClick={() => setSelectedApplication(app)}
                            >
                              <div className={styles.candidateLeft}>
                                <div
                                  className={`${styles.initialsBadge} ${getBadgeColor(
                                    app.applicantName
                                  )}`}
                                >
                                  {getInitials(app.applicantName)}
                                </div>
                                <div className={styles.candidateMeta}>
                                  <span className={styles.candidateName}>
                                    {app.applicantName}
                                  </span>
                                  <span className={styles.candidateSubtitle}>
                                    {app.job?.title || "Candidate"} • {app.experience || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className={styles.candidateRightActions}>
                                <button className={styles.chevronBtn}>
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Column 3: Shortlisted */}
                  <div className={styles.columnCard}>
                    <div className={styles.columnHeader}>
                      <div className={styles.columnTitleGroup}>
                        <CheckCircle2 size={16} color="#8b5cf6" />
                        <span className={styles.columnTitle}>Shortlisted</span>
                      </div>
                      <span className={styles.columnCounterBadge}>
                        {applications.filter((a) => a.status === "SHORTLISTED").length}
                      </span>
                    </div>

                    <div className={styles.columnList}>
                      {applications.filter((a) => a.status === "SHORTLISTED").length === 0 ? (
                        <div style={{ textAlign: "center", padding: "1.5rem", color: "#94a3b8", fontSize: "0.82rem" }}>
                          No shortlisted candidates
                        </div>
                      ) : (
                        applications
                          .filter((a) => a.status === "SHORTLISTED")
                          .map((app) => (
                            <div
                              key={app.id}
                              className={styles.candidateRowCard}
                              onClick={() => setSelectedApplication(app)}
                            >
                              <div className={styles.candidateLeft}>
                                <div
                                  className={`${styles.initialsBadge} ${getBadgeColor(
                                    app.applicantName
                                  )}`}
                                >
                                  {getInitials(app.applicantName)}
                                </div>
                                <div className={styles.candidateMeta}>
                                  <span className={styles.candidateName}>
                                    {app.applicantName}
                                  </span>
                                  <span className={styles.candidateSubtitle}>
                                    {app.job?.title || "Candidate"} • {app.experience || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className={styles.candidateRightActions}>
                                <button className={styles.chevronBtn}>
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: DATA TABLE (With all existing IDs and test hooks) */}
              <div
                className={styles.tableContainer}
                style={{ display: viewMode === "table" ? "block" : "none" }}
              >
                <div className={styles.tableScrollArea}>
                  <table className={styles.modernTable} id="applications-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Applied Position</th>
                        <th>Experience</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                            {loading ? "Loading applications..." : "No job applications found."}
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map((app) => (
                          <tr key={app.id} id={`app-row-${app.id}`}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div
                                  className={`${styles.initialsBadge} ${getBadgeColor(
                                    app.applicantName
                                  )}`}
                                >
                                  {getInitials(app.applicantName)}
                                </div>
                                <div>
                                  <strong style={{ color: "#0f172a" }}>{app.applicantName}</strong>
                                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{app.email}</div>
                                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{app.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: "#0f172a" }}>{app.job?.title || "N/A"}</strong>
                              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                {app.job?.department}
                              </div>
                            </td>
                            <td>{app.experience || "Not stated"}</td>
                            <td>
                              <select
                                id={`app-status-select-${app.id}`}
                                className={styles.selectDropdown}
                                value={app.status}
                                onChange={(e) => handleAppStatusChange(app.id, e.target.value)}
                                suppressHydrationWarning
                              >
                                <option value="NEW">NEW</option>
                                <option value="REVIEWED">REVIEWED</option>
                                <option value="SHORTLISTED">SHORTLISTED</option>
                                <option value="REJECTED">REJECTED</option>
                              </select>
                            </td>
                            <td>
                              {new Date(app.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td>
                              <div className={styles.actionBtnGroup}>
                                <button
                                  id={`view-app-btn-${app.id}`}
                                  className={styles.actionButton}
                                  onClick={() => setSelectedApplication(app)}
                                  suppressHydrationWarning
                                >
                                  <Eye size={13} />
                                  <span>View</span>
                                </button>
                                <a
                                  id={`download-cv-btn-${app.id}`}
                                  className={styles.actionButton}
                                  href={`/api/admin/applications/${app.id}/resume`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download size={13} />
                                  <span>CV PDF</span>
                                </a>
                                <button
                                  id={`delete-app-btn-${app.id}`}
                                  className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                  onClick={() => handleDeleteApplication(app)}
                                  title="Delete Application & Resume"
                                  suppressHydrationWarning
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: JOBS */}
          {/* ========================================================================= */}
          {activeTab === "jobs" && (
            <section>
              <div className={styles.controlsBar}>
                {/* Status Filter Pills */}
                <div className={styles.filterPillsGroup}>
                  <button
                    className={`${styles.filterPill} ${
                      jobStatusFilter === "ALL" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setJobStatusFilter("ALL")}
                    suppressHydrationWarning
                  >
                    <span>All</span>
                    <span
                      className={`${styles.pillBadge} ${
                        jobStatusFilter === "ALL" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {jobCounts.all}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      jobStatusFilter === "PUBLISHED" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setJobStatusFilter("PUBLISHED")}
                    suppressHydrationWarning
                  >
                    <span>Published</span>
                    <span
                      className={`${styles.pillBadge} ${
                        jobStatusFilter === "PUBLISHED" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {jobCounts.published}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      jobStatusFilter === "CLOSED" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setJobStatusFilter("CLOSED")}
                    suppressHydrationWarning
                  >
                    <span>Closed</span>
                    <span
                      className={`${styles.pillBadge} ${
                        jobStatusFilter === "CLOSED" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {jobCounts.closed}
                    </span>
                  </button>

                  {/* Hidden select for automated tests */}
                  <select
                    id="job-status-filter"
                    style={{ display: "none" }}
                    value={jobStatusFilter}
                    onChange={(e) => setJobStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className={styles.controlsRight}>
                  <button
                    id="create-job-btn"
                    className={styles.primaryPillBtn}
                    onClick={openCreateJobModal}
                    suppressHydrationWarning
                  >
                    <Plus size={16} />
                    <span>New Job Posting</span>
                  </button>
                </div>
              </div>

              {/* Jobs Data Table */}
              <div className={styles.tableContainer}>
                <div className={styles.tableScrollArea}>
                  <table className={styles.modernTable} id="jobs-table">
                    <thead>
                      <tr>
                        <th>Job Title / Slug</th>
                        <th>Department</th>
                        <th>Location & Type</th>
                        <th>Status</th>
                        <th>Applicants</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                            {loading ? "Loading jobs..." : "No job postings found."}
                          </td>
                        </tr>
                      ) : (
                        filteredJobs.map((job) => (
                          <tr key={job.id} id={`job-row-${job.id}`}>
                            <td>
                              <strong style={{ color: "#0f172a" }}>{job.title}</strong>
                              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>/{job.linkSlug}</div>
                            </td>
                            <td>{job.department}</td>
                            <td>
                              <div>{job.location}</div>
                              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{job.employmentType}</div>
                            </td>
                            <td>
                              <select
                                id={`job-status-select-${job.id}`}
                                className={styles.selectDropdown}
                                value={job.status === "DRAFT" ? "CLOSED" : job.status}
                                onChange={(e) => handleJobStatusChange(job.id, e.target.value)}
                                suppressHydrationWarning
                              >
                                <option value="PUBLISHED">PUBLISHED</option>
                                <option value="CLOSED">CLOSED</option>
                              </select>
                            </td>
                            <td>
                              <span className={styles.columnCounterBadge}>
                                {job._count?.applications ?? 0}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actionBtnGroup}>
                                <button
                                  id={`edit-job-btn-${job.id}`}
                                  className={styles.actionButton}
                                  onClick={() => openEditJobModal(job)}
                                  suppressHydrationWarning
                                >
                                  <Edit size={13} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  id={`delete-job-btn-${job.id}`}
                                  className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                  onClick={() => handleDeleteJob(job)}
                                  suppressHydrationWarning
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ENQUIRIES */}
          {/* ========================================================================= */}
          {activeTab === "enquiries" && (
            <section>
              <div className={styles.controlsBar}>
                {/* Status Filter Pills */}
                <div className={styles.filterPillsGroup}>
                  <button
                    className={`${styles.filterPill} ${
                      enquiryStatusFilter === "ALL" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setEnquiryStatusFilter("ALL")}
                    suppressHydrationWarning
                  >
                    <span>All</span>
                    <span
                      className={`${styles.pillBadge} ${
                        enquiryStatusFilter === "ALL" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {enqCounts.all}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      enquiryStatusFilter === "NEW" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setEnquiryStatusFilter("NEW")}
                    suppressHydrationWarning
                  >
                    <span>New</span>
                    <span
                      className={`${styles.pillBadge} ${
                        enquiryStatusFilter === "NEW" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {enqCounts.new}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      enquiryStatusFilter === "READ" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setEnquiryStatusFilter("READ")}
                    suppressHydrationWarning
                  >
                    <span>Read</span>
                    <span
                      className={`${styles.pillBadge} ${
                        enquiryStatusFilter === "READ" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {enqCounts.read}
                    </span>
                  </button>

                  <button
                    className={`${styles.filterPill} ${
                      enquiryStatusFilter === "RESOLVED" ? styles.filterPillActive : ""
                    }`}
                    onClick={() => setEnquiryStatusFilter("RESOLVED")}
                    title="Resolved enquiries are automatically deleted after 3 days"
                    suppressHydrationWarning
                  >
                    <span>Resolved</span>
                    <span
                      className={`${styles.pillBadge} ${
                        enquiryStatusFilter === "RESOLVED" ? styles.pillBadgeActive : ""
                      }`}
                    >
                      {enqCounts.resolved}
                    </span>
                  </button>

                  {/* Hidden select for automated tests */}
                  <select
                    id="enquiry-status-filter"
                    style={{ display: "none" }}
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="READ">Read</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Auto-cleanup retention notice when Resolved filter is active */}
              {enquiryStatusFilter === "RESOLVED" && (
                <div className={styles.retentionNotice} id="resolved-retention-notice">
                  <div className={styles.retentionNoticeIcon}>
                    <Clock size={16} />
                  </div>
                  <div className={styles.retentionNoticeContent}>
                    <strong>Auto-cleanup note:</strong> Resolved enquiries are automatically deleted after 3 days.
                  </div>
                </div>
              )}

              {/* Enquiries Data Table */}
              <div className={styles.tableContainer}>
                <div className={styles.tableScrollArea}>
                  <table className={styles.modernTable} id="enquiries-table">
                    <thead>
                      <tr>
                        <th>Sender</th>
                        <th>Persona</th>
                        <th>Mobile</th>
                        <th>Services</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnquiries.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                            {loading ? "Loading enquiries..." : "No contact enquiries found."}
                          </td>
                        </tr>
                      ) : (
                        filteredEnquiries.map((enq) => (
                          <tr key={enq.id} id={`enquiry-row-${enq.id}`}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div
                                  className={`${styles.initialsBadge} ${getBadgeColor(
                                    enq.name
                                  )}`}
                                >
                                  {getInitials(enq.name)}
                                </div>
                                <div>
                                  <strong style={{ color: "#0f172a" }}>{enq.name}</strong>
                                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{enq.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{enq.persona}</span>
                            </td>
                            <td>{enq.mobile}</td>
                            <td>
                              <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                                {Array.isArray(enq.interests) ? enq.interests.join(", ") : "None"}
                              </span>
                            </td>
                            <td>
                              <select
                                id={`enquiry-status-select-${enq.id}`}
                                className={styles.selectDropdown}
                                value={enq.status || "NEW"}
                                onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                                suppressHydrationWarning
                              >
                                <option value="NEW">NEW</option>
                                <option value="READ">READ</option>
                                <option value="RESOLVED">RESOLVED</option>
                              </select>
                            </td>
                            <td>
                              {new Date(enq.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td>
                              <div className={styles.actionBtnGroup}>
                                <button
                                  id={`view-enquiry-btn-${enq.id}`}
                                  className={styles.actionButton}
                                  onClick={() => setSelectedEnquiry(enq)}
                                  suppressHydrationWarning
                                >
                                  <Eye size={13} />
                                  <span>Details</span>
                                </button>
                                <button
                                  id={`delete-enquiry-btn-${enq.id}`}
                                  className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                  onClick={() => handleDeleteEnquiry(enq)}
                                  title="Delete Enquiry"
                                  suppressHydrationWarning
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT JOB */}
      {/* ========================================================================= */}
      {jobModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingJob ? `Edit Job: ${editingJob.title}` : "Create Job Opening"}
              </h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setJobModalOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveJob} className={styles.formGrid}>
              <div className={styles.formRowTwo}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Job Title *</label>
                  <input
                    id="job-title-input"
                    className={styles.formInputText}
                    value={jobFormData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      if (!editingJob && (!jobFormData.linkSlug || jobFormData.linkSlug === jobFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
                        setJobFormData({
                          ...jobFormData,
                          title,
                          linkSlug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                        });
                      } else {
                        setJobFormData({ ...jobFormData, title });
                      }
                    }}
                    required
                  />
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>URL Slug *</label>
                  <input
                    id="job-slug-input"
                    className={styles.formInputText}
                    value={jobFormData.linkSlug}
                    onChange={(e) => setJobFormData({ ...jobFormData, linkSlug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRowTwo}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Department *</label>
                  <input
                    id="job-dept-input"
                    className={styles.formInputText}
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                    placeholder="Engineering / HR / Operations"
                    required
                  />
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Location *</label>
                  <input
                    id="job-location-input"
                    className={styles.formInputText}
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    placeholder="Bangalore / Remote"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRowTwo}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Employment Type</label>
                  <select
                    className={styles.formSelect}
                    value={jobFormData.employmentType}
                    onChange={(e) => setJobFormData({ ...jobFormData, employmentType: e.target.value })}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    id="job-form-status-select"
                    className={styles.formSelect}
                    value={jobFormData.status === "DRAFT" ? "CLOSED" : jobFormData.status}
                    onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value })}
                  >
                    <option value="PUBLISHED">PUBLISHED (Active on Careers)</option>
                    <option value="CLOSED">CLOSED (Inactive / Hidden)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Short Summary / Description *</label>
                <textarea
                  id="job-desc-input"
                  className={styles.formTextarea}
                  value={jobFormData.desc}
                  onChange={(e) => setJobFormData({ ...jobFormData, desc: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Overview *</label>
                <textarea
                  className={styles.formTextarea}
                  value={jobFormData.overview}
                  onChange={(e) => setJobFormData({ ...jobFormData, overview: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Key Responsibilities (one per line)</label>
                <textarea
                  className={styles.formTextarea}
                  value={jobFormData.responsibilities}
                  onChange={(e) => setJobFormData({ ...jobFormData, responsibilities: e.target.value })}
                  rows={3}
                />
              </div>

              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Requirements (one per line)</label>
                <textarea
                  className={styles.formTextarea}
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  rows={3}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setJobModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  id="job-save-submit-btn"
                  type="submit"
                  className={styles.primaryPillBtn}
                  disabled={submittingJob}
                >
                  {submittingJob ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW APPLICATION DETAILS */}
      {/* ========================================================================= */}
      {selectedApplication && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Candidate Application Details</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedApplication(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formRowTwo}>
                <div>
                  <span className={styles.formLabel}>Applicant:</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                    {selectedApplication.applicantName}
                  </div>
                </div>
                <div>
                  <span className={styles.formLabel}>Applied Position:</span>
                  <div style={{ color: "#0284c7", fontWeight: 600 }}>
                    {selectedApplication.job?.title || "N/A"}
                  </div>
                </div>
              </div>

              <div className={styles.formRowTwo}>
                <div>
                  <span className={styles.formLabel}>Email:</span>
                  <div>{selectedApplication.email}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Phone:</span>
                  <div>{selectedApplication.phone}</div>
                </div>
              </div>

              <div className={styles.formRowTwo}>
                <div>
                  <span className={styles.formLabel}>Experience:</span>
                  <div>{selectedApplication.experience || "Not specified"}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Location:</span>
                  <div>{selectedApplication.location || "Not specified"}</div>
                </div>
              </div>

              {selectedApplication.portfolio && (
                <div>
                  <span className={styles.formLabel}>Portfolio / LinkedIn:</span>
                  <div>
                    <a
                      href={selectedApplication.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0284c7", wordBreak: "break-all" }}
                    >
                      {selectedApplication.portfolio}
                    </a>
                  </div>
                </div>
              )}

              {selectedApplication.note && (
                <div>
                  <span className={styles.formLabel}>Cover Note:</span>
                  <p style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", color: "#334155", border: "1px solid #e2e8f0" }}>
                    {selectedApplication.note}
                  </p>
                </div>
              )}

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
                <span className={styles.formLabel}>Candidate CV / Resume:</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div>
                    <strong style={{ color: "#0f172a" }}>{selectedApplication.originalFileName}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {(selectedApplication.sizeBytes / (1024 * 1024)).toFixed(2)} MB • {selectedApplication.mimeType}
                    </div>
                  </div>
                  <a
                    id="modal-download-cv-btn"
                    className={styles.primaryPillBtn}
                    href={`/api/admin/applications/${selectedApplication.id}/resume`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download size={14} />
                    <span>Download CV</span>
                  </a>
                </div>
              </div>

              <div className={styles.modalFooter} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <button
                  type="button"
                  id="modal-delete-app-btn"
                  className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                  onClick={() => handleDeleteApplication(selectedApplication)}
                >
                  <Trash2 size={13} />
                  <span>Delete Application</span>
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW ENQUIRY DETAILS */}
      {/* ========================================================================= */}
      {selectedEnquiry && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Contact Enquiry Details</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedEnquiry(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formRowTwo}>
                <div>
                  <span className={styles.formLabel}>Sender:</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                    {selectedEnquiry.name}
                  </div>
                </div>
                <div>
                  <span className={styles.formLabel}>Persona:</span>
                  <div style={{ textTransform: "capitalize", color: "#0284c7", fontWeight: 600 }}>
                    {selectedEnquiry.persona}
                  </div>
                </div>
              </div>

              <div className={styles.formRowTwo}>
                <div>
                  <span className={styles.formLabel}>Email:</span>
                  <div>{selectedEnquiry.email}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Mobile:</span>
                  <div>{selectedEnquiry.mobile}</div>
                </div>
              </div>

              <div>
                <span className={styles.formLabel}>Selected Service Interests:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem" }}>
                  {Array.isArray(selectedEnquiry.interests) && selectedEnquiry.interests.length > 0 ? (
                    selectedEnquiry.interests.map((svc, i) => (
                      <span key={i} className={styles.pillBadge} style={{ background: "#e0f2fe", color: "#0369a1" }}>
                        {svc}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#94a3b8" }}>No specific services selected</span>
                  )}
                </div>
              </div>

              <div>
                <span className={styles.formLabel}>Message:</span>
                <p style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", color: "#334155", border: "1px solid #e2e8f0", whiteSpace: "pre-wrap" }}>
                  {selectedEnquiry.message}
                </p>
              </div>

              {selectedEnquiry.status === "RESOLVED" && (
                <div className={styles.retentionNotice} style={{ margin: "0.25rem 0" }}>
                  <div className={styles.retentionNoticeIcon}>
                    <Clock size={16} />
                  </div>
                  <div className={styles.retentionNoticeContent}>
                    <strong>Auto-cleanup note:</strong> This enquiry is marked as resolved and will be automatically deleted after 3 days.
                  </div>
                </div>
              )}

              <div className={styles.modalFooter} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                  onClick={() => handleDeleteEnquiry(selectedEnquiry)}
                >
                  <Trash2 size={13} />
                  <span>Delete Enquiry</span>
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
