import { abilities, badges, baseStats, evolution, job, moves, party, quests, school, trainer } from "@/data/dex";

// Static: prerendered at build time.
export async function GET() {
  return Response.json({ trainer, job, moves, abilities, baseStats, badges, school, quests, evolution, party });
}
