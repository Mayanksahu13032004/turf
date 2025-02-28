import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  // Use the App Password generated above
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyLink = `http://localhost:3000/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Your App" <your-email@gmail.com>',
    to,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
