import type { Tables } from "@/types/database.types";
import { DEFAULT_COOKIE_OPTIONS } from "@/utils/constants";
import { supabase } from "@/utils/database";
import type { Session, User } from "@supabase/supabase-js";
import type { AstroCookies } from "astro";

type SignInOptions = {
  cookies: AstroCookies;
  session: Session;
};

export async function signIn(options: SignInOptions): Promise<void> {
  const { cookies, session: { refresh_token, access_token } } = options;
  cookies.set("sb-access-token", access_token, DEFAULT_COOKIE_OPTIONS);
  cookies.set("sb-refresh-token", refresh_token, DEFAULT_COOKIE_OPTIONS);
  return;
}

type CurrentUserOptions = {
  cookies: AstroCookies;
};

export async function getCurrentUser(
  options: CurrentUserOptions,
): Promise<User | null> {
  console.log("[DEBUG] getCurrentUser()");
  const accessToken = options.cookies.get("sb-access-token")?.value;
  const refreshToken = options.cookies.get("sb-refresh-token")?.value;
  if (!accessToken || !refreshToken) return null;
  const { data: { user }, error } = await supabase.auth.setSession({
    refresh_token: refreshToken,
    access_token: accessToken,
  });

  if (error) {
    await signOut({ cookies: options.cookies });
  }

  console.log("[DEBUG]", "getCurrentUser", user?.id);
  return user;
}

export async function getProfileByEmail(email: string) {
  console.log("[DEBUG] getProfileByEmail()");
  const { data: existingUserProfile } = await supabase.from("profiles").select(
    "*",
  )
    .eq(
      "email",
      email,
    ).single();
  console.log("[DEBUG]", "getProfileByEmail", existingUserProfile?.id);
  return existingUserProfile;
}

type GetCurrentUserProfileOptions = {
  cookies: AstroCookies;
};

export async function getCurrentUserProfile(
  options: GetCurrentUserProfileOptions,
) {
  const { cookies } = options;
  console.log("[DEBUG] getCurrentUserProfile");
  const currentUser = await getCurrentUser({ cookies });
  if (!currentUser) return null;
  return await getProfileByEmail(currentUser.email!);
}

export function getUserDisplayName(profile: Tables<"profiles">): string {
  if (!profile.first_name && !profile.last_name) return profile.email;
  if (profile.first_name && !profile.last_name) return profile.first_name;
  return `${profile.first_name} ${profile.last_name}`;
}

type SignOutOptions = {
  cookies: AstroCookies;
};

export async function signOut(options: SignOutOptions): Promise<void> {
  console.log("[DEBUG] signOut()");
  await supabase.auth.signOut();
  options.cookies.delete("sb-access-token", DEFAULT_COOKIE_OPTIONS);
  options.cookies.delete("sb-refresh-token", DEFAULT_COOKIE_OPTIONS);
  return;
}
