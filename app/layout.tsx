import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";
import { plusJakarta } from "@/fonts/fonts";
import ScrollToTopButton from "./components/ScrollToTopButton";


export const metadata: Metadata = {
  title: "SchoMetrics",
  description: "SchoMetrics Plataforma Ambiental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${plusJakarta.className}`}>
        <ScrollToTopButton />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
