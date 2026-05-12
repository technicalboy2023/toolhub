import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ToolsHub — Premium Browser Tools",
    template: "%s | ToolsHub",
  },
  description:
    "A premium collection of fast, private, browser-based tools. Process images, PDFs, text, and more — all locally on your device.",
  keywords: [
    "online tools",
    "image tools",
    "pdf tools",
    "text tools",
    "free online tools",
    "browser tools",
    "privacy tools",
  ],
  openGraph: {
    title: "ToolsHub — Premium Browser Tools",
    description:
      "A premium collection of fast, private, browser-based tools. All processing happens locally on your device.",
    siteName: "ToolsHub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolsHub — Premium Browser Tools",
    description:
      "A premium collection of fast, private, browser-based tools. All processing happens locally on your device.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ToolsHub",
  url: "https://toolhub.app",
  description:
    "A premium collection of fast, private, browser-based tools. Process images, PDFs, text, and more — all locally on your device.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <script type="application/ld+json" suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider>
          <TooltipProvider>
            <Navbar />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <Footer />
            <Toaster
              position="bottom-center"
              richColors
              closeButton
              toastOptions={{
                className: "glass-card rounded-2xl",
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}