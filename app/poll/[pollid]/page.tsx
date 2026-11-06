import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";

export default async function PollPage({
  params,
  searchParams,
}: {
  params: { pollId: string };
  searchParams: { voted?: string };
}) {
  const poll = (await kv.get(`poll:${params.pollId}`)) as any;
  if (!poll) notFound();

  const total = poll.votes.reduce((a: number, b: number) => a + b, 0);

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <h1 style={{ color: "#38bdf8" }}>{poll.question}</h1>
      {searchParams.voted && (
        <p style={{ background: "#065f46", padding: 10, borderRadius: 8 }}>Terima kasih sudah voting!</p>
      )}

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {poll.options.map((opt: string, i: number) => {
          const count = poll.votes[i] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={i} style={{ background: "#1e293b", padding: 14, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>{opt}</span>
                <span>{count} ({pct}%)</span>
              </div>
              <div style={{ height: 8, background: "#334155", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "#0ea5e9" }} />
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 24, opacity: 0.7 }}>Total suara: {total}</p>
      <p style={{ fontSize: 13, opacity: 0.5 }}>Dibuat oleh @{poll.handle}</p>
    </main>
  );
}
