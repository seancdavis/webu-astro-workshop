import { getCurrentUserProfile } from "@/utils/auth";
import { supabase } from "@/utils/database";
import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ redirect, url, request }) => {
  const currentUserProfile = await getCurrentUserProfile();
  if (!currentUserProfile) {
    // TODO: Set feedback message
    return redirect("/login");
  }

  const formData = await request.formData();
  const image = formData.get("avatar_file") as File;

  const userAvatarStore = getStore({
    name: "UserAvatar",
    consistency: "strong",
  });
  await userAvatarStore.set(currentUserProfile.id.toString(), image);

  const { error } = await supabase.from("profiles").update({ has_avatar: true })
    .eq("id", currentUserProfile.id);

  if (error) {
    console.error(error);
    // TODO: Replace with feedback and redirect
    throw new Error("Invalid OTP");
  }

  // TODO: Set feedback message
  return redirect("/user/profile");
};
