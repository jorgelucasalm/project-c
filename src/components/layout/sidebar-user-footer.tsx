import Image from "next/image";
import { signOutAction } from "@/features/auth/actions";
import type { Profile } from "@/types/domain";

/** Mirrors the SideNavBar footer block (avatar + name + "Log out") from site.html. */
export function SidebarUserFooter({ profile }: { profile: Profile }) {
  const initials = profile.full_name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="p-lg border-t border-smoke flex items-center gap-sm">
      {profile.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt={profile.full_name}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover border border-smoke"
        />
      ) : (
        <span className="size-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-ui-label text-ui-label border border-smoke">
          {initials}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-ui-label text-ui-label text-on-surface truncate">
          {profile.full_name}
        </p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="font-body text-caption text-on-surface-variant hover:text-primary transition-colors"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
