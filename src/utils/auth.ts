import type { Tables } from "@/types/database.types";
import { supabase } from "@/utils/database";

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfileByEmail(email: string) {
  const { data: existingUserProfile } = await supabase.from("profiles").select(
    "*",
  )
    .eq(
      "email",
      email,
    ).single();
  return existingUserProfile;
}

export async function getCurrentUserProfile() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  return await getProfileByEmail(currentUser.email!);
}

export function getUserDisplayName(profile: Tables<"profiles">): string {
  if (!profile.first_name && !profile.last_name) return profile.email;
  if (profile.first_name && !profile.last_name) return profile.first_name;
  return `${profile.first_name} ${profile.last_name}`;
}
