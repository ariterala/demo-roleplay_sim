import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Navbar } from "~/components/navbar";
import { PostHogPageview } from "./posthog-pageview";
import { PostHogProvider } from "./posthog-provider";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PitchLab — Business Roleplay Simulator",
  description:
    "Practice high-stakes business conversations against AI opponents. Pitch to VCs, negotiate with clients, ace interviews, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PostHogProvider>
          <ThemeProvider>
            <Suspense>
              <PostHogPageview />
            </Suspense>
            <Navbar />
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
