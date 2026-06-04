"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.push("/admin");
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-accent-primary mb-2">ADNSTORE</h1>
          <p className="text-text-secondary text-sm">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="admin@tiendaropa.com"
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-accent-secondary text-center">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            INGRESAR
          </Button>
        </form>
      </div>
    </div>
  );
}
