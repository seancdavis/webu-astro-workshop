import { supabase } from "@/utils/database";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ redirect }) => {
  await supabase.auth.signOut();
  return redirect("/");
};
