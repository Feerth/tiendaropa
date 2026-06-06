import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cómo comprar — NOVASK",
  description: "Guía paso a paso para comprar en NOVASK. Elige, paga y recibe tus zapatillas en todo el Perú.",
};

export default function ComoComprarPage() {
  const steps = [
    {
      num: "01",
      title: "Elige tus zapatillas",
      desc: "Navega por nuestro catálogo y selecciona el modelo que más te guste. Elige tu talla y color favorito.",
    },
    {
      num: "02",
      title: "Agrégalas al carrito",
      desc: "Selecciona la cantidad deseada y agrega los productos a tu carrito de compras. Puedes revisar tu pedido antes de confirmar.",
    },
    {
      num: "03",
      title: "Completa tus datos",
      desc: "Ingresa tu nombre, teléfono y dirección de envío. Si tienes alguna nota especial, agrégalo en el formulario.",
    },
    {
      num: "04",
      title: "Confirma tu pedido",
      desc: "Revisa el resumen de tu compra y confirma el pedido. Te llegará un número de seguimiento.",
    },
    {
      num: "05",
      title: "Realiza el pago",
      desc: "Te mostramos nuestro código QR para que pagues con Yape o Plin. También puedes pagar por transferencia bancaria.",
    },
    {
      num: "06",
      title: "Recibe tu pedido",
      desc: "Una vez confirmado el pago, preparamos y enviamos tu pedido. Lo recibirás en la puerta de tu casa en 2 a 5 días hábiles.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-5xl md:text-7xl text-text-primary mb-4">
        CÓMO COMPRAR
      </h1>
      <p className="text-text-secondary text-lg mb-12">
        Comprar en NOVASK es fácil y seguro. Sigue estos pasos:
      </p>

      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-6">
            <span className="font-display text-4xl text-accent-primary leading-none shrink-0 w-16">
              {step.num}
            </span>
            <div className="border-b border-border-subtle pb-8 flex-1">
              <h2 className="font-display text-2xl text-text-primary mb-2">
                {step.title}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-bg-card border border-border-subtle rounded-xl p-6 text-center">
        <p className="text-text-secondary text-sm mb-4">
          ¿Listo para empezar? Explora nuestra colección.
        </p>
        <Link
          href="/productos"
          className="inline-block px-8 py-3 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all font-display tracking-wider"
        >
          VER COLECCIÓN
        </Link>
      </div>
    </div>
  );
}
