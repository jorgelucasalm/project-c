import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form";

export const metadata = {
  title: "Entrar — Sistema de Gestão de Aulas",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist-gray px-gutter">
      <div className="w-full max-w-[28rem] bg-surface-container-lowest border border-smoke rounded-lg p-lg md:p-xl">
        <div className="mb-xl text-center">
          <h1 className="font-headline text-headline text-primary">Gestão de Aulas</h1>
          <p className="font-body text-caption text-on-surface-variant mt-xs">
            English Academy
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
