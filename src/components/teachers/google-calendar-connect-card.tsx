"use client";

import { useTransition } from "react";
import { CalendarCheck, CalendarX } from "lucide-react";
import { disconnectGoogleCalendarAction } from "@/lib/google-calendar/actions";
import { useRouter } from "next/navigation";

interface GoogleCalendarConnectCardProps {
  status: { configured: boolean; connected: boolean };
}

export function GoogleCalendarConnectCard({ status }: GoogleCalendarConnectCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="bg-surface-container-lowest border border-smoke rounded-lg p-lg flex items-center justify-between gap-md flex-wrap">
      <div className="flex items-center gap-md">
        {status.connected ? (
          <CalendarCheck className="size-6 text-primary" />
        ) : (
          <CalendarX className="size-6 text-on-surface-variant" />
        )}
        <div>
          <p className="font-ui-label text-ui-label text-primary">Google Calendar</p>
          <p className="font-body text-caption text-on-surface-variant">
            {!status.configured
              ? "Integração não configurada neste ambiente."
              : status.connected
                ? "Conectado — as aulas são sincronizadas automaticamente."
                : "Não conectado. As aulas continuam funcionando normalmente pelo Supabase."}
          </p>
        </div>
      </div>
      {status.configured &&
        (status.connected ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await disconnectGoogleCalendarAction();
                router.refresh();
              })
            }
            className="border border-smoke text-on-surface-variant font-ui-label text-ui-label px-md py-sm rounded-[4px] hover:bg-mist-gray transition-colors"
          >
            Desconectar
          </button>
        ) : (
          <a
            href="/api/google-calendar/connect"
            className="bg-primary text-on-primary font-ui-label text-ui-label px-md py-sm rounded-[4px] hover:opacity-90 transition-opacity"
          >
            Conectar
          </a>
        ))}
    </div>
  );
}
