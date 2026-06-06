import type { Metadata } from "next";
import { Button } from "@/components/shared/Button";

export const metadata: Metadata = {
  title: "Contacto — NOVASK",
  description: "Contáctanos por WhatsApp. Consulta por productos, tallas, disponibilidad y más. Te atendemos al instante.",
  openGraph: {
    title: "Contacto — NOVASK",
    description: "Contáctanos por WhatsApp.",
    type: "website",
  },
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51931869696";

export default function ContactoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-5xl md:text-7xl text-text-primary mb-6">
        CONTACTO
      </h1>
      <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto leading-relaxed">
        Escríbenos por WhatsApp y te atenderemos al instante. 
        Consulta por productos, tallas, disponibilidad y más.
      </p>

      <div className="space-y-4">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="w-full sm:w-auto">
            ESCRIBIR POR WHATSAPP
          </Button>
        </a>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-6 mt-8 text-left">
          <h2 className="font-display text-xl text-text-primary mb-4">INFORMACIÓN</h2>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <span className="w-20 text-text-muted shrink-0">WhatsApp:</span>
              <span>+51 931 869 696</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-20 text-text-muted shrink-0">Horario:</span>
              <span>Lun - Sáb, 10:00 AM - 8:00 PM</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-20 text-text-muted shrink-0">Envíos:</span>
              <span>A todo el Perú</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-20 text-text-muted shrink-0">Pago:</span>
              <span>Transferencia bancaria / Contraentrega</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
