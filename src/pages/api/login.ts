import { getProfileByEmail } from "@/utils/auth";
import { supabase } from "@/utils/database";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ redirect, url, request }) => {
  const REQUEST_ORIGIN = url.origin;

  const formData = await request.formData();
  const email = formData.get("email") as string;

  const existingUserProfile = await getProfileByEmail(email);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${REQUEST_ORIGIN}/login`,
    },
  });

  // console.log({ data, error });
  // TODO: Handle `over_email_send_rate_limit` error

  return redirect(
    existingUserProfile
      ? `/login/verify-otp?email=${email}`
      : `/login/confirm-email`,
  );
};
