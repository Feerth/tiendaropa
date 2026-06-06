import type { Metadata } from "next";
import { StoreHeader } from "@/components/store/Header";
import { StoreFooter } from "@/components/store/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { PromoBanner } from "@/components/store/PromoBanner";
import { getWhatsAppNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "NOVASK — Zapatillas",
  description: "Zapatillas para los que marcan tendencia. Estilo urbano con las mejores marcas. Envíos a todo Perú.",
  openGraph: {
    title: "NOVASK — Zapatillas",
    description: "Zapatillas para los que marcan tendencia.",
    type: "website",
  },
};

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const phoneNumber = await getWhatsAppNumber();

  return (
    <>
      <StoreHeader />
      <PromoBanner />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsAppButton phoneNumber={phoneNumber} />
    </>
  );
}
