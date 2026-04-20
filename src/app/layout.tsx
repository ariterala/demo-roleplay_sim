import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "~/components/navbar";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PitchLab — Business Roleplay Simulator",
  description:
    "Practice real-world business scenarios through interactive roleplay. Built for high school students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
