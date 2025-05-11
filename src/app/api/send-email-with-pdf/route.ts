// app/api/send-email-with-pdf/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Buffer } from "buffer";

// Define the structure of the request body
interface EmailRequestBody {
  email: string;
  session_id: string;
  pdf: string; // base64 encoded PDF data
}

export async function POST(req: Request) {
  try {
    const body: EmailRequestBody = await req.json();
    const { email, session_id, pdf } = body;

    if (!email || !session_id || !pdf) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Decode base64 PDF (strip the data URI scheme)
    const pdfBuffer = Buffer.from(pdf.split(',')[1], 'base64');

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Ensure your Gmail credentials are set in .env
        pass: process.env.EMAIL_PASS,  // Ensure your Gmail credentials are set in .env
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Successful - Turf Booking",
      html: `<p>Your payment was successful. Please find your booking receipt attached.</p><p><strong>Session ID:</strong> ${session_id}</p>`,
      attachments: [
        {
          filename: `Booking_${session_id}.pdf`,
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error sending email", error: error.message }, { status: 500 });
  }
}
