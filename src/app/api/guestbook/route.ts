import { connection } from "next/server";
import { z } from "zod";
import { addGuest, countGuests, listGuests } from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rate-limit";

const STARTERS = ["BULBASAUR", "CHARMANDER", "SQUIRTLE", "PIKACHU"] as const;

const Entry = z.object({
  name: z.string().trim().min(1).max(10),
  message: z.string().trim().min(1).max(140),
  starter: z.enum(STARTERS),
  // Honeypot: real users never fill this in.
  website: z.string().max(0).optional(),
});

export async function GET() {
  await connection();
  return Response.json({ entries: listGuests(20), total: countGuests() });
}

export async function POST(req: Request) {
  if (rateLimited(`gb:${clientIp(req)}`, 3, 60_000)) {
    return Response.json({ error: "Slow down, trainer! Try again in a minute." }, { status: 429 });
  }
  const parsed = Entry.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "That entry doesn't look right." }, { status: 400 });
  }
  const { name, message, starter } = parsed.data;
  const entry = addGuest(name.toUpperCase(), message, starter);
  return Response.json({ entry, total: countGuests() }, { status: 201 });
}
