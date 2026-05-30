"use client";

import { useState, useRef, type KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="bg-white px-4 pb-4 pt-3">
      <div className="max-w-3xl mx-auto">
        <div className={`
          flex items-end gap-3 bg-white border rounded-3xl px-4 py-3
          shadow-sm transition-all duration-200
          ${disabled ? "border-gray-200 opacity-70" : "border-gray-300 focus-within:border-teal-500 focus-within:shadow-md"}
        `}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Escreva sua mensagem…"
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none max-h-40 leading-relaxed py-0.5"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Enviar"
            className={`
              flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150
              ${canSend
                ? "bg-teal-700 hover:bg-teal-800 active:scale-95 shadow-sm"
                : "bg-gray-100 cursor-not-allowed"}
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-4 h-4 ${canSend ? "text-white" : "text-gray-400"}`}
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
