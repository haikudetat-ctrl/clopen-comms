"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@clopen/types";
import { supabaseConfig } from "./config";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseConfig.url, supabaseConfig.anonKey);
}
