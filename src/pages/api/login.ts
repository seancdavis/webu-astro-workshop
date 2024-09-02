import { supabase } from "@/utils/database";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ redirect, url, request }) => {
  const REQUEST_ORIGIN = url.origin;

  const formData = await request.formData();
  const email = formData.get("email") as string;

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${REQUEST_ORIGIN}/api/otp-login`,
    },
  });

  return redirect(`/login/verify-otp?email=${email}`);
};
