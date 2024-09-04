import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
