import { createClient } from "@supabase/supabase-js";
import type { Database } from "@clopen/types";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are required");
}

export const supabase = createClient<Database>(url, anonKey);
