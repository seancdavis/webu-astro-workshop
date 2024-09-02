import { supabase } from "@/utils/database";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ redirect, url, request }) => {
  console.log(url.href);
  // const REQUEST_ORIGIN = url.origin;

  // Get form data
  const formData = await request.formData();
  const token = formData.get("token") as string;

  const { data: { session }, error } = await supabase.auth.verifyOtp({
    email: "scdavis41@gmail.com",
    token,
    type: "email",
  });

  console.log({ session, error });

  return new Response("OK", { status: 200 });
};
