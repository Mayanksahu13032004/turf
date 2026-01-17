import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./_components/LayoutWrapper";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turf Booking System",
  description: "Book your favorite turfs easily!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrapping LayoutWrapper in Suspense here applies a global boundary.
            This fixes the "missing-suspense-with-csr-bailout" error 
            for the /success page and all other pages automatically.
        */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
          </div>
        }>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Suspense>
      </body>
    </html>
  );
}