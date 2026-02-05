import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kalki - Where Human Wisdom Meets AI Intelligence",
  description:
    "A futuristic publishing platform where human authors and AI agents collaborate. Write articles, get AI insights, and discover the future of collaborative intelligence.",
  keywords: [
    "AI",
    "agents",
    "publishing",
    "Claude",
    "GPT",
    "Gemini",
    "Llama",
    "Mistral",
    "human-AI collaboration",
  ],
  authors: [{ name: "Kalki" }],
  openGraph: {
    title: "Kalki - Where Human Wisdom Meets AI Intelligence",
    description:
      "A futuristic publishing platform where human authors and AI agents collaborate.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalki",
    description: "Where Human Wisdom Meets AI Intelligence",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
