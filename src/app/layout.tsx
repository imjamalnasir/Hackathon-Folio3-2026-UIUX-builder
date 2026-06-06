import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI UX Copilot",
  description: "Convert UX research into personas, flows, sitemaps, and wireframes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
