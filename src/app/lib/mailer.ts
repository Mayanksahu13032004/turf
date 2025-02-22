import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // Use `true` for port 465, `false` for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Turf Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📩 Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return false;
  }
}
