import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildwithprakhar.app"),
  title: "Prakhar Nagpal — Software Engineer",
  description:
    "Master of Computing @ NUS. ex-Senior SWE @ Bajaj Finserv. I build scalable, secure systems.",
  openGraph: {
    title: "Prakhar Nagpal — Software Engineer",
    description:
      "Scalable systems, applied AI, secure platforms, and polished engineering craft.",
    url: "https://buildwithprakhar.app",
    siteName: "Prakhar Nagpal",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-fg">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
