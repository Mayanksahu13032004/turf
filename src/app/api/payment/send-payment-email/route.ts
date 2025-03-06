import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userID, session_id, email } = body;

    if (!userID || !session_id || !email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Successful - Turf Booking",
      html: `<p>Your payment was successful.</p><p><strong>Session ID:</strong> ${session_id}</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error sending email", error: error.message }, { status: 500 });
  }
}
