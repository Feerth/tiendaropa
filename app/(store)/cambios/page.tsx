import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cambios y devoluciones — NOVASK",
  description: "Política de cambios y devoluciones de NOVASK. Cambios por talla dentro de los 7 días.",
};

export default function CambiosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-5xl md:text-7xl text-text-primary mb-4">
        CAMBIOS Y DEVOLUCIONES
      </h1>
      <p className="text-text-secondary text-lg mb-12">
        Queremos que estés 100% satisfecho con tu compra.
      </p>

      <div className="space-y-8">
        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Cambios por talla</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Si la talla no te quedó bien, puedes solicitar un cambio dentro de los 
            <strong className="text-text-primary"> 7 días calendario</strong> después de recibir tu pedido.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              El producto debe estar sin uso, en su empaque original y con todas las etiquetas.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              El cambio está sujeto a disponibilidad de stock en la nueva talla.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              El costo de envío del cambio corre por cuenta del cliente.
            </li>
          </ul>
        </section>

        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Producto defectuoso o error</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Si recibiste un producto en mal estado o con algún defecto de fábrica, 
            o si te enviamos un producto o talla incorrecta, 
            escríbenos inmediatamente por WhatsApp.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              El cambio o reembolso será sin costo adicional para ti.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              Envíanos una foto del producto para evaluar el caso.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-primary mt-0.5">•</span>
              Procesaremos tu cambio en un máximo de 3 días hábiles.
            </li>
          </ul>
        </section>

        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Devoluciones y reembolsos</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Aceptamos devoluciones solo en caso de producto defectuoso o error en el envío. 
            No realizamos reembolsos por cambio de opinión una vez confirmado el pedido.
          </p>
        </section>

        <section className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-2xl text-text-primary mb-3">Proceso de cambio</h2>
          <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
            <li>Contáctanos por WhatsApp indicando tu número de pedido y el motivo del cambio.</li>
            <li>Te indicaremos la dirección de envío y los pasos a seguir.</li>
            <li>Envía el producto con su empaque original y etiquetas.</li>
            <li>Una vez recibido y revisado, gestionamos tu cambio en 2-3 días hábiles.</li>
          </ol>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/contacto"
          className="inline-block px-8 py-3 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all font-display tracking-wider"
        >
          CONTACTAR POR WHATSAPP
        </Link>
      </div>
    </div>
  );
}
