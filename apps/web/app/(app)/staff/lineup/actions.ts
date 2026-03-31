"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Database } from "@clopen/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function acknowledgeLineupPost(formData: FormData) {
  const postId = formData.get("postId");

  if (typeof postId !== "string" || postId.length === 0) {
    redirect("/staff/lineup?ack=invalid");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const postResult = await supabase
    .from("posts")
    .select("id, location_id, status")
    .eq("id", postId)
    .maybeSingle();
  const post = postResult.data as { id: string; location_id: string; status: string } | null;

  if (!post || post.status !== "published") {
    redirect("/staff/lineup?ack=missing");
  }

  const membershipResult = await supabase
    .from("memberships")
    .select("id")
    .eq("location_id", post.location_id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membershipResult.data) {
    redirect("/staff/lineup?ack=forbidden");
  }

  const existingAckResult = await supabase
    .from("post_acknowledgements")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingAckResult.data) {
    const payload: Database["public"]["Tables"]["post_acknowledgements"]["Insert"] = {
      post_id: postId,
      user_id: user.id
    };
    const postAcknowledgementsTable = supabase.from("post_acknowledgements") as unknown as {
      insert: (
        values: Database["public"]["Tables"]["post_acknowledgements"]["Insert"][]
      ) => Promise<{ error: { message: string } | null }>;
    };
    const insertResult = await postAcknowledgementsTable.insert([payload]);

    if (insertResult.error) {
      redirect("/staff/lineup?ack=error");
    }
  }

  revalidatePath("/staff");
  revalidatePath("/staff/lineup");
  redirect("/staff/lineup?ack=ok");
}
