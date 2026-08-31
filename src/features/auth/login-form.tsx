"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { signInAction } from "@/features/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("redirectTo", redirectTo);

    startTransition(async () => {
      const result = await signInAction({ error: null }, formData);
      if (result.error) setServerError(result.error);
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-md" noValidate>
      <div className="flex flex-col gap-base">
        <Label htmlFor="email" className="font-ui-label text-ui-label text-on-surface-variant">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@academy.com"
          className="rounded-[4px] border-smoke bg-surface-container-lowest font-body text-body"
          {...register("email")}
        />
        {errors.email && (
          <p className="font-caption text-caption text-error">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-base">
        <Label htmlFor="password" className="font-ui-label text-ui-label text-on-surface-variant">
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="rounded-[4px] border-smoke bg-surface-container-lowest font-body text-body"
          {...register("password")}
        />
        {errors.password && (
          <p className="font-caption text-caption text-error">{errors.password.message}</p>
        )}
      </div>
      {serverError && (
        <p className="font-body text-caption text-error bg-error-container rounded-[4px] px-sm py-2">
          {serverError}
        </p>
      )}
      <Button
        type="submit"
        disabled={isPending}
        className="bg-primary text-on-primary font-ui-label text-ui-label rounded-[4px] py-sm hover:opacity-90"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
