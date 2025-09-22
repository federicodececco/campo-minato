import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabseKey);

export class LeaderBoardEntry {
  username: string;
  score: number;
  difficulty: string;
  stage: number | undefined;
  time: number;
  constructor(
    username: string,
    score: number,
    difficulty: string,
    time: number,
    stage?: number
  ) {
    this.username = username;
    this.score = score;
    this.difficulty = difficulty;
    this.stage = stage ? stage : undefined;
    this.time = time;
  }
}

export const saveScore = async (
  leaderBoardData: LeaderBoardEntry
): Promise<LeaderBoardEntry> => {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .insert([leaderBoardData])
      .select()
      .single();
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Errore nell inserimetno in classifica:", error);
    throw error;
  }
};

export const getLeaderBoard = async (maxEntries: number) => {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .order("score", { ascending: false })
      .limit(maxEntries);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error("Errore nel recupero dei dati della classifica:", e);
    throw e;
  }
};
