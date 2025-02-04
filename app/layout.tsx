import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthWrapper } from "./auth-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChefGPT",
  description: "Generated Recipes seamlessely with Creative/Generative AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen max-w-[100vw] min-w-[100vw] overflow-x-hidden overflow-y-auto`}
      >
        <AuthWrapper>
          <Navbar />
          <Toaster />
          <div className="flex justify-center pt-8">{children}</div>
        </AuthWrapper>
      </body>
    </html>
  );
}
