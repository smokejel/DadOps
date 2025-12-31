import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "DadOps - Financial Command Center for Expecting Dads",
  description: "Know what the hospital will actually cost. Track your baby prep budget. Stop getting blindsided by bills.",
  keywords: "expecting fathers, baby budget, hospital costs, pregnancy planning, paternity planning",
  openGraph: {
    title: "DadOps - Financial Command Center for Expecting Dads",
    description: "Join the waitlist for the financial planning tool built for dads.",
    url: "https://dadops.one",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DadOps - Financial Command Center for Expecting Dads",
    description: "Join the waitlist for the financial planning tool built for dads.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
