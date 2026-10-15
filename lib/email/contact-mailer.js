import { getTransporter } from "./transporter";

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Send a notification email for a newly received contact enquiry.
 * Returns { success: boolean, status: string, error?: string }
 */
export async function sendContactNotification({
  id,
  persona,
  interests,
  name,
  email,
  mobile,
  message,
  createdAt,
  transporterOverride = null,
}) {
  const transporter = transporterOverride || getTransporter();

  if (!transporter) {
    // SMTP is not configured yet in this environment
    return {
      success: false,
      status: "SKIPPED",
      error: "SMTP server configuration is not set in environment variables.",
    };
  }

  // Routing based on enquiry category:
  // - Employer / Business -> info@staff-spectrum.com
  // - Job Seeker, Student / HR Professional -> Hr@staff-spectrum.com
  let toAddress;
  if (persona === "employer") {
    toAddress = process.env.CONTACT_EMPLOYER_EMAIL || "info@staff-spectrum.com";
  } else if (persona === "jobseeker" || persona === "student") {
    toAddress = process.env.CONTACT_HR_EMAIL || "Hr@staff-spectrum.com";
  } else {
    toAddress =
      process.env.CONTACT_NOTIFICATION_EMAIL || "info@staff-spectrum.com";
  }

  const fromAddress =
    process.env.EMAIL_FROM || '"Staffspectrum Website" <no-reply@staff-spectrum.com>';

  const personaLabels = {
    employer: "Employer / Business",
    jobseeker: "Job Seeker",
    student: "Student / HR Professional",
  };
  const readablePersona = personaLabels[persona] || persona;
  const formattedInterests =
    Array.isArray(interests) && interests.length > 0
      ? interests.join(", ")
      : "None selected";

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMobile = escapeHtml(mobile);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const safeInterests = escapeHtml(formattedInterests);
  const safePersona = escapeHtml(readablePersona);

  const subject = `[Staffspectrum Enquiry] New message from ${name} (${readablePersona})`;

  const textContent = `
New Contact Enquiry Received

Enquiry ID: ${id || "N/A"}
Date: ${createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}

Category: ${readablePersona}
Interested In: ${formattedInterests}

Name: ${name}
Email: ${email}
Phone: ${mobile}

Message:
${message}
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0b132b; color: #ffffff; padding: 24px 32px; border-bottom: 3px solid #007CC4; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .content { padding: 32px; }
    .field-row { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
    .field-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
    .field-value { font-size: 15px; color: #0f172a; margin-top: 4px; font-weight: 500; }
    .message-box { background: #f8fafc; border-left: 4px solid #007CC4; padding: 16px; border-radius: 4px; margin-top: 20px; font-size: 14px; color: #334155; }
    .footer { background: #f1f5f9; padding: 16px 32px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Staffspectrum — New Enquiry</h2>
    </div>
    <div class="content">
      <div class="field-row">
        <div class="field-label">Interest Category</div>
        <div class="field-value">${safePersona}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Selected Services</div>
        <div class="field-value">${safeInterests}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Contact Name</div>
        <div class="field-value">${safeName}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${safeEmail}" style="color: #007CC4; text-decoration: none;">${safeEmail}</a></div>
      </div>
      <div class="field-row">
        <div class="field-label">Phone Number</div>
        <div class="field-value"><a href="tel:${safeMobile}" style="color: #007CC4; text-decoration: none;">${safeMobile}</a></div>
      </div>
      <div class="field-label" style="margin-top: 20px;">Message</div>
      <div class="message-box">
        ${safeMessage}
      </div>
    </div>
    <div class="footer">
      This is an automated notification from the Staffspectrum website enquiry system.
    </div>
  </div>
</body>
</html>
`.trim();

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      status: "SENT",
    };
  } catch (error) {
    // Sanitize error to avoid leaking sensitive connection data or passwords
    const safeErrorMsg = (error.message || "Unknown SMTP error").slice(0, 250);
    return {
      success: false,
      status: "FAILED",
      error: safeErrorMsg,
    };
  }
}
