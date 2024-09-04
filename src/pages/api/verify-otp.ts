import { supabase } from "@/utils/database";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ redirect, url, request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  console.log({ email, token });

  const { data: { session }, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !session) {
    console.error(error);
    throw new Error("Invalid OTP");
  }

  return redirect("/");
};
