import { supabase } from "./supabase";

export async function getLawyers(category: string) {
  let query = supabase.from("lawyers").select("*");

  if (category !== "general") {
    query = query.contains("specializations", [category]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching lawyers:", error);
    return [];
  }

  return data;
}