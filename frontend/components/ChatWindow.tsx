"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: Message[];
  loading: boolean;
  onSuggestion?: (text: string) => void;
}

const SUGGESTIONS = [
  { label: "Como configurar o Softphone?",               icon: "📞" },
  { label: "Como sincronizar o SharePoint com OneDrive?", icon: "☁️" },
  { label: "Como arquivar e-mails no Outlook?",           icon: "📧" },
  { label: "Como configurar o Microsoft Authenticator?",  icon: "🔐" },
];

export default function ChatWindow({ messages, loading, onSuggestion }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-10">

        {/* Avatar + saudação */}
        <div className="page-fade flex flex-col items-center gap-3 text-center" style={{ animationDelay: "80ms" }}>
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-teal-200 shadow-md">
            <img src="/avatar.png" alt="Lia" className="w-full h-full object-cover object-top" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Como posso ajudar?</h2>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Sou a Lia, assistente de suporte da FM2C.<br />Pergunte sobre qualquer procedimento interno.
          </p>
        </div>

        {/* Sugestões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
          {SUGGESTIONS.map(({ label, icon }, i) => (
            <button
              key={label}
              onClick={() => onSuggestion?.(label)}
              className="page-fade group text-left bg-white border border-gray-200 rounded-2xl px-4 py-3.5 hover:border-teal-400 hover:shadow-sm active:scale-[0.98] transition-all duration-150"
              style={{ animationDelay: `${180 + i * 60}ms` }}
            >
              <span className="mr-2 text-base">{icon}</span>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-5 sm:gap-6">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
