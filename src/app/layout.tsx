import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { TimelineProvider } from "@/components/providers/timeline-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "AIrena – Multi-LLM Query Productivity App",
  description: "Minimal, professional AI research workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <AuthProvider>
          <TimelineProvider>
            <Navbar />
            <main className="pt-16 min-h-[80vh]">{children}</main>
            <Footer />
          </TimelineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
