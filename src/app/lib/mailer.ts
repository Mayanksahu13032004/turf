import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Transporter Configuration
// Using service: 'gmail' is the most reliable way to handle Gmail's specific needs
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be a 16-digit App Password
  },
});

export const sendVerificationEmail = async (
  to: string,
  token: string,
  who: string
) => {
  console.log("--- 📧 Email Debug Start ---");
  
  // 1. Check if Environment Variables are loaded
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ ERROR: EMAIL_USER or EMAIL_PASS is missing in .env file");
    return { success: false, error: "Missing Credentials" };
  }

  const verifyLink = `http://localhost:3000/verify-email${who}?token=${token}`;

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Email Verification</h1>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyLink}" style="padding: 10px 20px; background: blue; color: white; text-decoration: none;">Verify Now</a>
        <p>Or copy this link: ${verifyLink}</p>
      </div>
    `,
  };

  try {
    console.log(`⏳ Attempting to send email to: ${to}`);
    
    // 2. Perform a test handshake before sending
    await transporter.verify();
    console.log("✅ SMTP Connection Verified");

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email Sent Successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log("--- 📧 Email Debug End ---");
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ EMAIL ERROR DETECTED:');
    
    // Check for specific Gmail errors
    if (error.code === 'EAUTH') {
      console.error("👉 CAUSE: Authentication Failed. You likely need an 'App Password'.");
    } else if (error.code === 'ESOCKET') {
      console.error("👉 CAUSE: Connection/Network issue. Check your port and firewall.");
    }
    
    console.error('Full Error Object:', error);
    console.log("--- 📧 Email Debug End ---");
    throw error; // Throw so the API route can handle the response
  }
};