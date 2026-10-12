import nodemailer from "nodemailer";

async function main() {
  console.log("=== Staff Spectrum — SMTP Diagnostic Test ===");

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || user;
  const to = process.env.CONTACT_HR_EMAIL || user;

  console.log(`Host:    ${host || "(missing)"}`);
  console.log(`Port:    ${port} (secure: ${secure})`);
  console.log(`User:    ${user || "(missing)"}`);
  console.log(`Pass:    ${pass ? "****** (" + pass.length + " characters)" : "(missing)"}`);
  console.log(`From:    ${from}`);
  console.log(`Test To: ${to}\n`);

  if (!host || !user || !pass) {
    console.error("❌ Error: SMTP_HOST, SMTP_USER, and SMTP_PASS must all be set in .env.local");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
  });

  try {
    console.log("1. Verifying SMTP connection with provider...");
    await transporter.verify();
    console.log("✅ SMTP Connection Successful!\n");

    console.log(`2. Sending test notification email to ${to}...`);
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Staff Spectrum — SMTP Configuration Test",
      text: "Congratulations! Your Gmail SMTP configuration is working correctly.",
      html: "<p>Congratulations! Your <strong>Gmail SMTP</strong> configuration is working correctly on Staff Spectrum.</p>",
    });

    console.log(`✅ Test email sent successfully! Message ID: ${info.messageId}`);
    console.log(`Check your inbox at: ${to}`);
  } catch (err) {
    console.error("\n❌ SMTP Connection Failed:");
    console.error(err.message);

    if (err.message && err.message.includes("535")) {
      console.log("\n💡 Gmail Tip:");
      console.log("- You cannot use your normal Gmail login password.");
      console.log("- You MUST generate a 16-character Google 'App Password'.");
      console.log("- Go to: https://myaccount.google.com/apppasswords");
    }
    process.exit(1);
  }
}

main();
