import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, DM_Sans, Noto_Sans_Ethiopic } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const ethiopicFont = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
});

export const metadata: Metadata = {
  title: {
    default: site.fullName,
    template: `%s | ${site.fullName}`,
  },
  description: site.description,
  applicationName: site.fullName,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} ${ethiopicFont.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
