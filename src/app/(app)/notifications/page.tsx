import { requireProfile } from "@/features/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Notificações — Sistema de Gestão de Aulas" };

const TYPE_LABELS: Record<string, string> = {
  LESSON_REMINDER: "Lembrete de aula",
  LESSON_CREATED: "Aula agendada",
  LESSON_CANCELED: "Aula cancelada",
  LESSON_RESCHEDULED: "Aula reagendada",
  TRIAL_BOOKED: "Aula experimental confirmada",
  PLAN_EXPIRING: "Plano expirando",
};

const STATUS_STYLES: Record<string, string> = {
  sent: "bg-surface-container-highest text-on-surface",
  pending: "bg-secondary-fixed text-on-secondary-fixed",
  failed: "bg-error-container text-on-error-container",
};

export default async function NotificationsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <div>
        <h2 className="font-headline text-headline text-on-surface mb-base">Notificações</h2>
        <p className="font-body text-body text-on-surface-variant">
          Lembretes e atualizações sobre suas aulas.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-smoke rounded-lg overflow-hidden">
        {!notifications || notifications.length === 0 ? (
          <p className="p-lg text-center font-body text-body text-on-surface-variant">
            Você ainda não tem notificações.
          </p>
        ) : (
          <ul className="divide-y divide-smoke">
            {notifications.map((n) => (
              <li key={n.id} className="p-md flex items-center justify-between gap-md">
                <div>
                  <p className="font-ui-label text-ui-label text-on-surface">
                    {TYPE_LABELS[n.type] ?? n.type}
                  </p>
                  <p className="font-body text-caption text-on-surface-variant">
                    {formatDateTime(n.created_at)} · canal: {n.channel}
                  </p>
                </div>
                <span
                  className={`font-ui-label text-caption px-2 py-1 rounded border border-smoke ${STATUS_STYLES[n.status]}`}
                >
                  {n.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
