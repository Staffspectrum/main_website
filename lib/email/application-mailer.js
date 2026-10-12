import { getTransporter } from "./transporter";
import { createResumeDownloadToken } from "../security/resume-token";

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function resolveBaseUrl(request, explicitBaseUrl) {
  if (explicitBaseUrl) {
    return explicitBaseUrl.replace(/\/+$/, "");
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, "");
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }
  try {
    if (request?.headers) {
      const host =
        request.headers.get("x-forwarded-host") ||
        request.headers.get("host");
      const proto =
        request.headers.get("x-forwarded-proto") || "https";
      if (host) {
        return `${proto}://${host}`;
      }
    }
  } catch {}
  return "https://staff-spectrum.com";
}

/**
 * Send an email notification to HR for a newly received job application.
 * Returns { success: boolean, status: string, error?: string }
 */
export async function sendApplicationNotification({
  application,
  job,
  baseUrl,
  request,
  transporterOverride = null,
}) {
  const transporter = transporterOverride || getTransporter();

  if (!transporter) {
    return {
      success: false,
      status: "SKIPPED",
      error: "SMTP server configuration is not set in environment variables.",
    };
  }

  const toAddress = process.env.CONTACT_HR_EMAIL || "Hr@staff-spectrum.com";
  const fromAddress =
    process.env.EMAIL_FROM || '"Staff Spectrum Careers" <no-reply@staff-spectrum.com>';

  const hostUrl = resolveBaseUrl(request, baseUrl);

  // Generate secure download link with cryptographic token (never expose private R2 bucket or credentials)
  let secureCvUrl = `${hostUrl}/admin/applications`;
  try {
    const token = await createResumeDownloadToken({
      applicationId: application.id,
      r2ObjectKey: application.r2ObjectKey,
    });
    secureCvUrl = `${hostUrl}/api/admin/applications/${encodeURIComponent(application.id)}/resume?token=${encodeURIComponent(token)}`;
  } catch (tokenErr) {
    console.error("[Application Mailer] Token generation warning:", tokenErr?.message);
    secureCvUrl = `${hostUrl}/api/admin/applications/${encodeURIComponent(application.id)}/resume`;
  }

  const jobTitle = job?.title || "Career Opening";
  const jobDept = job?.department ? ` (${job.department})` : "";
  const applicantName = application.applicantName || "Applicant";
  const safeName = escapeHtml(applicantName);
  const safeEmail = escapeHtml(application.email || "");
  const safePhone = escapeHtml(application.phone || "");
  const safeLocation = escapeHtml(application.location || "Not specified");
  const safeExperience = escapeHtml(application.experience || "Not specified");
  const safePortfolio = application.portfolio ? escapeHtml(application.portfolio) : null;
  const safeNote = application.note ? escapeHtml(application.note).replace(/\n/g, "<br/>") : null;
  const safeFileName = escapeHtml(application.originalFileName || "resume.pdf");
  const formattedFileSize = formatBytes(application.sizeBytes);
  const formattedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) + " IST"
    : new Date().toLocaleString();

  const subject = `[Job Application] New Application for ${jobTitle} - ${applicantName}`;

  const textContent = `
New Job Application Received

Position: ${jobTitle}${jobDept}
Applicant: ${applicantName}
Email: ${application.email}
Phone: ${application.phone}
Location: ${application.location || "Not specified"}
Experience: ${application.experience || "Not specified"}
Portfolio: ${application.portfolio || "N/A"}
CV File: ${application.originalFileName || "resume.pdf"} (${formattedFileSize})
Submitted: ${formattedDate}

Note:
${application.note || "No cover note provided."}

Secure CV Download Link:
${secureCvUrl}

(Note: This link is cryptographically signed and valid for 7 days. The CV is streamed securely from private storage without exposing storage credentials.)
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0b132b; color: #ffffff; padding: 24px 32px; border-bottom: 3px solid #007CC4; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .badge { display: inline-block; background: rgba(0, 124, 196, 0.2); color: #38bdf8; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 6px; }
    .content { padding: 32px; }
    .field-row { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
    .field-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
    .field-value { font-size: 15px; color: #0f172a; margin-top: 4px; font-weight: 500; }
    .cv-card { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-top: 24px; text-align: center; }
    .cv-title { font-size: 14px; font-weight: 600; color: #0369a1; margin-bottom: 6px; }
    .cv-meta { font-size: 12px; color: #64748b; margin-bottom: 16px; }
    .btn-download { display: inline-block; background-color: #007CC4; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; text-decoration: none; box-shadow: 0 2px 4px rgba(0, 124, 196, 0.2); }
    .message-box { background: #f8fafc; border-left: 4px solid #007CC4; padding: 14px 16px; border-radius: 4px; margin-top: 6px; font-size: 14px; color: #334155; }
    .footer { background: #f1f5f9; padding: 16px 32px; font-size: 12px; color: #64748b; text-align: center; }
    .security-notice { font-size: 11px; color: #94a3b8; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Staff Spectrum — Job Application</h2>
      <div class="badge">${escapeHtml(jobTitle)}${escapeHtml(jobDept)}</div>
    </div>
    <div class="content">
      <div class="field-row">
        <div class="field-label">Applicant Name</div>
        <div class="field-value">${safeName}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${safeEmail}" style="color: #007CC4; text-decoration: none;">${safeEmail}</a></div>
      </div>
      <div class="field-row">
        <div class="field-label">Phone Number</div>
        <div class="field-value"><a href="tel:${safePhone}" style="color: #007CC4; text-decoration: none;">${safePhone}</a></div>
      </div>
      <div class="field-row">
        <div class="field-label">Location</div>
        <div class="field-value">${safeLocation}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Experience</div>
        <div class="field-value">${safeExperience}</div>
      </div>
      ${safePortfolio ? `
      <div class="field-row">
        <div class="field-label">Portfolio / LinkedIn</div>
        <div class="field-value"><a href="${safePortfolio}" target="_blank" rel="noopener noreferrer" style="color: #007CC4; text-decoration: none;">${safePortfolio}</a></div>
      </div>` : ""}
      ${safeNote ? `
      <div class="field-row">
        <div class="field-label">Cover Note</div>
        <div class="message-box">${safeNote}</div>
      </div>` : ""}

      <div class="cv-card">
        <div class="cv-title">Candidate CV / Resume Attached</div>
        <div class="cv-meta">${safeFileName} &bull; ${formattedFileSize}</div>
        <a href="${secureCvUrl}" class="btn-download" target="_blank" rel="noopener noreferrer">
          View / Download Resume (Secure)
        </a>
        <div class="security-notice">
          Cryptographically signed link valid for 7 days. CV is streamed directly from private storage.
        </div>
      </div>
    </div>
    <div class="footer">
      This is an automated notification from the Staff Spectrum Careers recruitment system.
    </div>
  </div>
</body>
</html>
`.trim();

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: application.email,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      status: "SENT",
    };
  } catch (error) {
    const safeErrorMsg = (error.message || "Unknown SMTP error").slice(0, 250);
    return {
      success: false,
      status: "FAILED",
      error: safeErrorMsg,
    };
  }
}
