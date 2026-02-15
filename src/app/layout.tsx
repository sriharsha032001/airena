import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { TimelineProvider } from "@/components/providers/timeline-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIrena – Multi-LLM Query Productivity App",
  description: "Compare AI models side-by-side. Get instant answers from ChatGPT, Gemini, and more in one workspace.",
  keywords: ["AI", "LLM", "ChatGPT", "Gemini", "comparison", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <AuthProvider>
          <TimelineProvider>
            <Navbar />
            <main id="main-content" className="pt-[var(--nav-height)] min-h-[calc(100vh-var(--nav-height))]">
              {children}
            </main>
            <Footer />
          </TimelineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
