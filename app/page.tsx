"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [handle, setHandle] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const addOption = () => {
    if (options.length < 4) setOptions([...options, ""]);
  };

  const updateOption = (i: number, val: string) => {
    const newOpts = [...options];
    newOpts[i] = val;
    setOptions(newOpts);
  };

  const createPoll = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handle.trim(),
          appPassword: appPassword.trim(),
          question: question.trim(),
          options: options.map((o) => o.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat poll");
      router.push(`/poll/${data.pollId}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", color: "#38bdf8" }}>Bluesky Poll</h1>
      <p style={{ textAlign: "center", opacity: 0.8 }}>Buat polling & post otomatis ke Bluesky</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
        <input
          placeholder="Handle Bluesky (contoh: kamu.bsky.social)"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "white" }}
        />
        <input
          type="password"
          placeholder="App Password (bukan password utama)"
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "white" }}
        />
        <textarea
          placeholder="Pertanyaan polling..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          style={{ padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "white" }}
        />

        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Pilihan ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "white" }}
          />
        ))}

        {options.length < 4 && (
          <button onClick={addOption} style={{ padding: 10, background: "#334155", color: "white", border: "none", borderRadius: 8 }}>
            + Tambah pilihan
          </button>
        )}

        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        <button
          onClick={createPoll}
          disabled={loading}
          style={{
            padding: 14,
            background: loading ? "#475569" : "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            marginTop: 8,
          }}
        >
          {loading ? "Membuat & posting..." : "Buat Poll & Post ke Bluesky"}
        </button>
      </div>

      <p style={{ marginTop: 32, fontSize: 13, opacity: 0.6, textAlign: "center" }}>
        App Password dibuat di Settings → Privacy and security → App Passwords.
        Password utama kamu tidak pernah dikirim ke server ini.
      </p>
    </main>
  );
            }
