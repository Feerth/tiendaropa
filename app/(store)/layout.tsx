import { StoreHeader } from "@/components/store/Header";
import { StoreFooter } from "@/components/store/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getWhatsAppNumber } from "@/lib/whatsapp";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const phoneNumber = await getWhatsAppNumber();

  return (
    <>
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsAppButton phoneNumber={phoneNumber} />
    </>
  );
}
