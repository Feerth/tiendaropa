import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Envíos a todo Perú — NOVASK",
  description: "Envíos a todo el Perú por Olva Courier. Recibe tus zapatillas en 2 a 5 días hábiles.",
};

export default function EnviosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-5xl md:text-7xl text-text-primary mb-4">
        ENVÍOS A TODO PERÚ
      </h1>
      <p className="text-text-secondary text-lg mb-12">
        Enviamos tus zapatillas a cualquier ciudad del Perú.
      </p>

      <div className="grid gap-6">
        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Cobertura</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Realizamos envíos a <strong className="text-text-primary">todo el Perú</strong> a través de 
            Olva Courier. Llegamos a Lima metropolitana, provincias y zonas rurales.
          </p>
        </section>

        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Tiempos de entrega</h2>
          <div className="space-y-3 text-sm text-text-secondary">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span>Lima metropolitana</span>
              <span className="font-mono text-accent-primary">2 - 3 días hábiles</span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span>Provincias (capitales)</span>
              <span className="font-mono text-accent-primary">3 - 4 días hábiles</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Zonas rurales / alejadas</span>
              <span className="font-mono text-accent-primary">4 - 5 días hábiles</span>
            </div>
          </div>
        </section>

        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Costos de envío</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              El costo de envío se calcula en base a tu ubicación y se te informará antes de confirmar el pedido.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              Para compras mayores a S/ 300, el envío <strong className="text-text-primary">es gratis</strong> a Lima metropolitana.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              Los envíos a provincia tienen una tarifa fija de S/ 15 a S/ 25 dependiendo de la ubicación.
            </li>
          </ul>
        </section>

        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Seguimiento</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Una vez realizado el envío, te compartiremos el número de tracking de Olva Courier 
            para que puedas seguir tu pedido en tiempo real desde su página web.
          </p>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/productos"
          className="inline-block px-8 py-3 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all font-display tracking-wider"
        >
          COMENZAR A COMPRAR
        </Link>
      </div>
    </div>
  );
}
