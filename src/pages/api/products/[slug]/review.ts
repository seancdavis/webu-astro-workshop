import { getCurrentUserProfile } from "@/utils/auth";
import { supabase } from "@/utils/database";
import { productPath } from "@/utils/routes";
import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

export const prerender = false;

export const POST: APIRoute = async (
  { params, redirect, cookies, request },
) => {
  const product = await getEntry("product", params.slug as string);

  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  console.log("[DEBUG] POST review", product);

  // Get the user and return 401 if not logged in and with a profile record in
  // the public schema.
  const currentUserProfile = await getCurrentUserProfile({ cookies });
  console.log("[DEBUG] POST review", currentUserProfile);
  if (!currentUserProfile) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get form data
  const formData = await request.formData();
  const rating = formData.get("rating") as string;
  const comment = formData.get("comment") as string;

  if (!rating) {
    return new Response("Rating is required", { status: 400 });
  }

  // Save review to Supabase
  const { error } = await supabase.from("reviews").insert({
    product_id: product.id,
    user_id: currentUserProfile.id,
    rating: parseInt(rating, 10),
    comment,
  });

  if (error) {
    console.error("Error saving review:", error);
    return new Response("Error saving review", { status: 500 });
  }

  return redirect(productPath(product), 303);
};
