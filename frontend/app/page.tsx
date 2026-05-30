"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import TraceView from "@/components/TraceView";
import SettingsModal from "@/components/SettingsModal";
import LiaIntro from "@/components/LiaIntro";
import { sendMessage, type Message, type TraceStep } from "@/lib/api";
import { loadSettings, saveSettings, type AgentSettings } from "@/lib/settings";

const TABS = [
  { id: "chat",  label: "Chat" },
  { id: "trace", label: "Fluxo" },
];

export default function Home() {
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AgentSettings>(loadSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("lia_intro_seen");
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem("lia_intro_seen", "1");
    setShowIntro(false);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setTrace([]);
    setLoading(true);
    setError(null);

    try {
      const result = await sendMessage(text, messages, settings);
      setMessages([...newHistory, {
        role: "assistant",
        content: result.answer,
        sources: result.sources,
        images: result.images,
      }]);
      setTrace(result.trace);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setMessages(newHistory);
    } finally {
      setLoading(false);
    }
  }, [messages, settings]);

  const handleSaveSettings = (s: AgentSettings) => {
    setSettings(s);
    saveSettings(s);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {showIntro && <LiaIntro onDone={handleIntroDone} />}
      <Header onSettings={() => setShowSettings(true)} />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">×</button>
        </div>
      )}

      {tab === "chat" ? (
        <>
          <ChatWindow messages={messages} loading={loading} onSuggestion={handleSend} />
          <ChatInput onSend={handleSend} disabled={loading} />
        </>
      ) : (
        <TraceView trace={trace} loading={loading} />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
