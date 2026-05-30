export interface AgentSettings {
  tone: "formal" | "neutral" | "friendly";
  responseStyle: "concise" | "balanced" | "detailed";
  useEmojis: boolean;
  endWithHelp: boolean;
  useNumberedSteps: boolean;
  highlightKeyTerms: boolean;
}

export const DEFAULT_SETTINGS: AgentSettings = {
  tone: "neutral",
  responseStyle: "balanced",
  useEmojis: false,
  endWithHelp: false,
  useNumberedSteps: true,
  highlightKeyTerms: true,
};

const STORAGE_KEY = "lpp-agent-settings";

export function loadSettings(): AgentSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: AgentSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
