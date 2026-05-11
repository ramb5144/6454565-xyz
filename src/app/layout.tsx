import type { Metadata } from "next";
import { Source_Serif_4, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "6454565 — A Review",
  description:
    "Essays and reporting on the questions of the moment, written with care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${display.variable} ${sans.variable}`}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
