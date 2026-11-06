import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(
  req: NextRequest,
  { params }: { params: { pollId: string; option: string } }
) {
  const { pollId, option } = params;
  const optIndex = parseInt(option, 10);

  if (isNaN(optIndex)) {
    return NextResponse.redirect(new URL(`/poll/${pollId}`, req.url));
  }

  const poll = await kv.get(`poll:${pollId}`) as any;
  if (!poll) {
    return new NextResponse("Poll tidak ditemukan", { status: 404 });
  }

  // Simple anti-double vote (bisa diperbaiki dengan cookie/IP)
  const voterKey = `voted:\( {pollId}: \){req.headers.get("x-forwarded-for") || "anon"}`;
  const already = await kv.get(voterKey);
  if (!already) {
    poll.votes[optIndex] = (poll.votes[optIndex] || 0) + 1;
    await kv.set(`poll:${pollId}`, poll);
    await kv.set(voterKey, "1", { ex: 60 * 60 * 24 * 7 }); // 7 hari
  }

  return NextResponse.redirect(new URL(`/poll/${pollId}?voted=1`, req.url));
}
