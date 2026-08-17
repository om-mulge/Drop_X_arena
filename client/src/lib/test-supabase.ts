import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*");

  console.log("SUPABASE TOURNAMENTS:", data);
  console.log("SUPABASE ERROR:", error);

  return { data, error };
}