import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@clopen/types";
import { supabaseConfig } from "./config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}
