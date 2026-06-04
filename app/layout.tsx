import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/shared/Toast";

export const metadata: Metadata = {
  title: "ADNSTORE — Ropa y Zapatillas",
  description: "Tienda online de ropa y zapatillas. Estilo urbano con las mejores marcas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary font-body antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
