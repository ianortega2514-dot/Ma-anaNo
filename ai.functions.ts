import { createServerFn } from "@tanstack/react-start";
import { TRAMITES } from "@/data/tramites";

const CATALOG = TRAMITES.map((tramite) => `${tramite.id}: ${tramite.name}. ${tramite.short}`).join("\n");
const IDS = new Set(TRAMITES.map((tramite) => tramite.id));

type ExplainInput = {
  name: string;
  level: string;
  headline: string;
  reason: string;
  summary: string;
  missing: string[];
  ready: string[];
  warnings: string[];
  channel: string;
};

function clip(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export const explainCase = createServerFn({ method: "POST" })
  .validator((input: ExplainInput) => ({
    name: clip(String(input?.name ?? ""), 120),
    level: clip(String(input?.level ?? ""), 20),
    headline: clip(String(input?.headline ?? ""), 80),
    reason: clip(String(input?.reason ?? ""), 500),
    summary: clip(String(input?.summary ?? ""), 300),
    missing: (input?.missing ?? []).slice(0, 8).map((item) => clip(String(item), 160)),
    ready: (input?.ready ?? []).slice(0, 8).map((item) => clip(String(item), 160)),
    warnings: (input?.warnings ?? []).slice(0, 6).map((item) => clip(String(item), 240)),
    channel: clip(String(input?.channel ?? ""), 200),
  }))
  .handler(async ({ data }) => ask(explainPrompt(data), 320));

export const routeCase = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => ({
    text: clip(String(input?.text ?? ""), 280),
  }))
  .handler(async ({ data }) => {
    if (data.text.length < 4) return { ok: false as const, error: "Escribe un poco más." };
    const result = await ask(routePrompt(data.text), 80);
    if (!result.ok) return result;
    const id = pickId(result.text);
    if (!id) {
      return {
        ok: false as const,
        error: "Eso todavía no está en el mostrador. Elige uno de la lista: el sello solo sale si el trámite está comprobado.",
      };
    }
    return { ok: true as const, id };
  });

function routePrompt(text: string) {
  return [
    {
      role: "system" as const,
      content:
        "Eres el mostrador de MañanaNo. Encajas una frase en UN id de la lista. Responde solo JSON: {\"id\":\"...\"} o {\"id\":null}. No inventes trámites ni des instrucciones. Si no encaja claro, id null.",
    },
    { role: "user" as const, content: `Lista:\n${CATALOG}\n\nFrase: ${text}` },
  ];
}

function explainPrompt(data: ExplainInput) {
  return [
    {
      role: "system" as const,
      content:
        "Explicas un expediente ya calculado de un trámite en España. Usa SOLO el JSON. No añadas papeles, tasas, plazos, leyes ni enlaces que no estén escritos. Español de España, de tú, directo y amable. Máximo 120 palabras. Sin títulos markdown. Cierra con qué hacer hoy.",
    },
    { role: "user" as const, content: JSON.stringify(data) },
  ];
}

function pickId(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]) as { id?: unknown };
      if (typeof parsed.id === "string" && IDS.has(parsed.id)) return parsed.id;
      return null;
    } catch {
      /* fall through */
    }
  }
  for (const id of IDS) {
    if (text.includes(id)) return id;
  }
  return null;
}

async function ask(messages: { role: "system" | "user"; content: string }[], maxTokens: number) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { ok: false as const, error: "Ahora mismo no puedo contarlo con palabras. El sello y la lista sí valen." };
  }
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(20000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: maxTokens,
        messages,
      }),
    });
    if (!res.ok) return { ok: false as const, error: "No he podido consultar. Prueba otra vez en un momento." };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Ha vuelto vacío. El sello sigue siendo la respuesta." };
    return { ok: true as const, text };
  } catch {
    return { ok: false as const, error: "No he podido consultar. Prueba otra vez en un momento." };
  }
}
