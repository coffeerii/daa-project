import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase env variables are missing.");
    return null;
  }

  if (
    supabaseUrl.includes("your_supabase_project_url") ||
    supabaseAnonKey.includes("your_supabase_anon_key")
  ) {
    console.warn("Supabase env variables still contain placeholder values.");
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
}