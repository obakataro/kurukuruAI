export async function onRequestPost({ request, env }) {
  const { base, prompt, count } = await request.json();

  const text = `ベース: ${base.join(", ")}\n指示: ${prompt}\n関連単語を${count}個出して。`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }]}],
      }),
    }
  );

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const words = raw.split(/[,、\\n]/).map(t => t.trim()).filter(t => t);

  return new Response(JSON.stringify({ words }), {
    headers: { "Content-Type": "application/json" }
  });
}
