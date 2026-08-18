import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  if (!supabase) {
    const error = new Error("Supabase is not configured for this environment.");
    console.warn("SUPABASE CONFIG MISSING:", error.message);
    return { data: null, error };
  }

  const { data, error } = await supabase.from("tournaments").select("*");

  console.log("SUPABASE TOURNAMENTS:", data);
  console.log("SUPABASE ERROR:", error);

  return { data, error };
}