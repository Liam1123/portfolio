import { connection } from "next/server";
import { bumpCounter, readCounter } from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rate-limit";

// "SEEN" counter: how many times the Pokédex has been opened.
export async function GET() {
  await connection();
  return Response.json({ seen: readCounter("opened") });
}

export async function POST(req: Request) {
  if (rateLimited(`enc:${clientIp(req)}`, 10, 60_000)) {
    return Response.json({ seen: readCounter("opened") });
  }
  return Response.json({ seen: bumpCounter("opened") });
}
