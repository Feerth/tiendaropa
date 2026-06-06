import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagos con QR — NOVASK",
  description: "Aceptamos Yape, Plin y transferencia bancaria. Paga fácil y seguro desde tu celular.",
};

export default function PagosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-5xl md:text-7xl text-text-primary mb-4">
        PAGOS CON QR
      </h1>
      <p className="text-text-secondary text-lg mb-12">
        Aceptamos los métodos de pago más populares del Perú.
      </p>

      <div className="grid gap-6">
        <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-accent-primary mb-3">Yape</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Escanea nuestro código QR desde la app de Yape. El pago se refleja al instante.
            Solo necesitas tener saldo disponible en tu billetera Yape.
          </p>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-accent-primary mb-3">Plin</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            También puedes pagar con Plin escaneando nuestro código QR desde tu app.
            Recibimos Plin de todos los bancos del Perú.
          </p>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-accent-primary mb-3">Transferencia bancaria</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Si prefieres transferencia, contáctanos por WhatsApp y te enviamos 
            nuestros datos bancarios (BCP, Interbank, BBVA).
          </p>
        </div>
      </div>

      <div className="mt-8 bg-bg-card border border-border-subtle rounded-xl p-6">
        <h3 className="font-display text-xl text-text-primary mb-2">Importante</h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-accent-primary mt-0.5">•</span>
            Una vez realizado el pago, presiona el botón &quot;YA PAGUÉ — AVISAR POR WHATSAPP&quot; para notificarnos.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-primary mt-0.5">•</span>
            Te confirmaremos tu pago en máximo 2 horas hábiles.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-primary mt-0.5">•</span>
            Si tienes dudas, escríbenos por WhatsApp antes de pagar.
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/productos"
          className="inline-block px-8 py-3 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all font-display tracking-wider"
        >
          IR A LA TIENDA
        </Link>
      </div>
    </div>
  );
}
