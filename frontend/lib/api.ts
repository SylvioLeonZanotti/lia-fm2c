import type { AgentSettings } from "./settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export { API_URL };

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  images?: string[];   // full image URLs ready to use in <img src>
}

export interface TraceStep {
  id: string;
  icon: string;
  label: string;
  detail?: string;
  duration_ms?: number;
  status: "done" | "warning" | "info";
}

export interface ChatResult {
  answer: string;
  sources: string[];
  trace: TraceStep[];
  images: string[];
}

export async function sendMessage(
  question: string,
  history: Message[],
  settings?: AgentSettings
): Promise<ChatResult> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history, settings }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Erro ${res.status}`);
  }

  const data = await res.json();
  const rawImages: { doc: string; idx: number }[] = data.images ?? [];
  const imageUrls = rawImages.map(
    ({ doc, idx }) => `${API_URL}/image?doc=${encodeURIComponent(doc)}&idx=${idx}`
  );

  return {
    answer: data.answer as string,
    sources: (data.sources ?? []) as string[],
    trace: (data.trace ?? []) as TraceStep[],
    images: imageUrls,
  };
}

export async function fetchDocContent(name: string): Promise<string> {
  const res = await fetch(`${API_URL}/document?name=${encodeURIComponent(name)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `Erro ${res.status}`);
  }
  const data = await res.json();
  return (data as { content: string }).content;
}
