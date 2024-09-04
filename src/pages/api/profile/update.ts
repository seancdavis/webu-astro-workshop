import { getCurrentUserProfile } from "@/utils/auth";
import { supabase } from "@/utils/database";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ redirect, url, request }) => {
  const currentUserProfile = await getCurrentUserProfile();
  if (!currentUserProfile) {
    // TODO: Set feedback message
    return redirect("/login");
  }

  const formData = await request.formData();
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;

  const { error } = await supabase.from("profiles").update({
    first_name,
    last_name,
  }).eq("id", currentUserProfile.id);

  if (error) {
    console.error(error);
    // TODO: Replace with feedback and redirect
    throw new Error("Something went wrong");
  }

  // TODO: Set feedback message
  return redirect("/user/profile");
};
