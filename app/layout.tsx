import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bluesky Poll",
  description: "Buat polling interaktif di Bluesky",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0, background: "#0f172a", color: "#e2e8f0" }}>
        {children}
      </body>
    </html>
  );
}
