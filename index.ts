// Supabase Edge Function: receives a visitor's question and asks OpenAI.
// The key lives in Supabase secrets (OPENAI_API_KEY), never in the website.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const INSTRUCTIONS = `You are Media Israel Assistant, a helpful technical
support assistant for livestreaming and media production.

Help users with vMix, OBS Studio, cameras, video capture cards,
audio mixers, microphones, livestreaming, internet settings,
video editing, Premiere Pro, and budget-friendly production setups.

Give clear, practical, step-by-step instructions for beginners.
Ask a short clarifying question when important details are missing.
Consider affordable equipment and solutions available in Nigeria.
Never claim to have changed settings or operated equipment yourself.
Stay focused on media production and related technical questions.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { message, history } = await req.json();
    if (typeof message !== "string" || !message.trim()) return json({ error: "Please enter a question." }, 400);
    if (message.length > 4000) return json({ error: "Please keep your question under 4,000 characters." }, 400);

    const past = (Array.isArray(history) ? history : [])
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}` },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "system", content: INSTRUCTIONS }, ...past, { role: "user", content: message.trim() }],
      }),
    });
    const data = await res.json();
    if (!res.ok) { console.error("OpenAI error:", JSON.stringify(data)); return json({ error: "The assistant could not respond. Please try again." }, 500); }
    return json({ reply: data.choices?.[0]?.message?.content || "Please try asking your question again." });
  } catch (e) {
    console.error(e);
    return json({ error: "The assistant could not respond. Please try again." }, 500);
  }
});
