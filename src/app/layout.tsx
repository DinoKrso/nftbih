import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "NFTBIH",
  description: "Shareable linkovi za NFC kartice, sa analitikom otvaranja po klijentu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bs" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
