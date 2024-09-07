import { getCurrentUserProfile } from "@/utils/auth";
import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  const currentUserProfile = await getCurrentUserProfile({ cookies });
  if (!currentUserProfile) {
    return new Response("User is not logged in", { status: 404 });
  }

  const userAvatarStore = getStore({
    name: "UserAvatar",
    consistency: "strong",
  });
  const userAvatarBlob = await userAvatarStore.get(
    currentUserProfile.id.toString(),
    {
      type: "stream",
    },
  );

  if (!userAvatarBlob) {
    return new Response("Avatar not found", { status: 404 });
  }

  return new Response(userAvatarBlob);
};
