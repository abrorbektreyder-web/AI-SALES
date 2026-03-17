import "./globals.css";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AI SALES PILOT | Premium Dashboard",
  description: "AI-powered sales analysis and coaching platform",
};

import AuthCheck from "@/components/AuthCheck";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#09090b] text-slate-100 min-h-screen antialiased selection:bg-blue-600/30 selection:text-blue-200`}
      >
        <AuthCheck>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </AuthCheck>
      </body>
    </html>
  );
}
