const nodemailer = require("nodemailer");

const config = {
  host: process.env.EMAIL_HOST || "smtp.ukr.net",
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

console.log("📧 Email config:", {
  host: config.host,
  port: config.port,
  secure: config.secure,
  user: config.auth.user,
  pass: config.auth.pass ? "***HIDDEN***" : "❌ NOT SET",
});

const transporter = nodemailer.createTransport(config);

async function sendEmail({ to, subject, html }) {
  try {
    console.log("➡️ Sending email:", { to, subject });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
  }
}

module.exports = sendEmail;
