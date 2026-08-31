import { requireRole } from "@/features/auth/session";
import { listPlans } from "@/services/plans";
import { PlanRowActions } from "@/components/plans/plan-row-actions";
import { AddPlanButton } from "@/components/plans/add-plan-button";
import { formatCentsToBRL } from "@/lib/format";

export const metadata = { title: "Planos — Sistema de Gestão de Aulas" };

export default async function PlansPage() {
  await requireRole(["admin"]);
  const plans = await listPlans();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-smoke pb-lg">
        <div>
          <h2 className="font-headline text-headline text-on-surface mb-base">Planos</h2>
          <p className="font-body text-body text-on-surface-variant">
            Preços, duração das aulas e quantidade por ciclo.
          </p>
        </div>
        <AddPlanButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        {plans.length === 0 && (
          <p className="font-body text-body text-on-surface-variant">Nenhum plano cadastrado.</p>
        )}
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-surface-container-lowest border border-smoke rounded-lg p-lg flex flex-col gap-sm"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-headline text-subheading text-primary">{plan.name}</h3>
              <span
                className={`font-ui-label text-caption px-2 py-1 rounded border border-smoke ${
                  plan.status === "active"
                    ? "bg-surface-container-highest text-on-surface"
                    : "bg-error-container text-on-error-container"
                }`}
              >
                {plan.status === "active" ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="font-headline text-headline-sm text-primary">
              {formatCentsToBRL(plan.price_cents)}
            </p>
            <p className="font-body text-caption text-on-surface-variant">
              {plan.lesson_duration_minutes} min por aula · {plan.lessons_per_cycle} aulas/ciclo
            </p>
            <div className="mt-sm border-t border-smoke pt-sm">
              <PlanRowActions plan={plan} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
