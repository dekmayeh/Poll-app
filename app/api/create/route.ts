import { NextRequest, NextResponse } from "next/server";
import { BskyAgent } from "@atproto/api";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { handle, appPassword, question, options } = await req.json();

    if (!handle || !appPassword || !question || !options || options.length < 2) {
      return NextResponse.json({ error: "Data tidak lengkap (minimal 2 pilihan)" }, { status: 400 });
    }

    const agent = new BskyAgent({ service: "https://bsky.social" });
    await agent.login({ identifier: handle, password: appPassword });

    const pollId = uuidv4().slice(0, 8);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-app.vercel.app";

    // Format post
    let text = `${question}\n\n`;
    options.forEach((opt: string, i: number) => {
      text += `${i + 1}️⃣ \( {opt}\n \){baseUrl}/vote/\( {pollId}/ \){i}\n\n`;
    });
    text += `📊 Lihat hasil: \( {baseUrl}/poll/ \){pollId}`;

    // Post ke Bluesky
    const post = await agent.post({
      text,
      createdAt: new Date().toISOString(),
    });

    // Simpan di KV
    const pollData = {
      id: pollId,
      question,
      options,
      votes: options.map(() => 0),
      postUri: post.uri,
      createdAt: new Date().toISOString(),
      handle,
    };

    await kv.set(`poll:${pollId}`, pollData);

    return NextResponse.json({ pollId, postUri: post.uri });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Gagal membuat poll" }, { status: 500 });
  }
}
