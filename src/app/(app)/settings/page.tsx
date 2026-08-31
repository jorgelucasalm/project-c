import { requireProfile } from "@/features/auth/session";

export const metadata = { title: "Configurações — Sistema de Gestão de Aulas" };

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador(a)",
  teacher: "Professor(a)",
  student: "Aluno(a)",
};

export default async function SettingsPage() {
  const profile = await requireProfile();

  return (
    <>
      <div>
        <h2 className="font-headline text-headline text-on-surface mb-base">Configurações</h2>
        <p className="font-body text-body text-on-surface-variant">
          Dados da sua conta no Sistema de Gestão de Aulas.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-smoke rounded-lg p-lg max-w-lg flex flex-col gap-md">
        <div>
          <p className="font-ui-label text-caption text-on-surface-variant">Nome</p>
          <p className="font-body text-body text-primary">{profile.full_name}</p>
        </div>
        <div>
          <p className="font-ui-label text-caption text-on-surface-variant">Email</p>
          <p className="font-body text-body text-primary">{profile.email}</p>
        </div>
        <div>
          <p className="font-ui-label text-caption text-on-surface-variant">Perfil</p>
          <p className="font-body text-body text-primary">{ROLE_LABELS[profile.role]}</p>
        </div>
      </div>
    </>
  );
}
