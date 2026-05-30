"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/api";
import SourcePanel from "./SourcePanel";

interface Props {
  message: Message;
}

const MD_COMPONENTS = {
  p:      ({ children }: React.PropsWithChildren) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }: React.PropsWithChildren) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em:     ({ children }: React.PropsWithChildren) => <em className="italic">{children}</em>,
  ul:     ({ children }: React.PropsWithChildren) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
  ol:     ({ children }: React.PropsWithChildren) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
  li:     ({ children }: React.PropsWithChildren) => <li className="leading-relaxed">{children}</li>,
  h1:     ({ children }: React.PropsWithChildren) => <h1 className="text-base font-bold mb-2">{children}</h1>,
  h2:     ({ children }: React.PropsWithChildren) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
  h3:     ({ children }: React.PropsWithChildren) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
  a:      ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement> & React.PropsWithChildren) =>
            <a href={href} className="text-teal-700 underline underline-offset-2" target="_blank" rel="noopener noreferrer">{children}</a>,
  code:   ({ children }: React.PropsWithChildren) =>
            <code className="bg-gray-100 text-gray-800 rounded px-1.5 py-0.5 text-xs font-mono">{children}</code>,
};

function useTypewriter(fullText: string, skip: boolean) {
  const [displayed, setDisplayed] = useState(skip ? fullText : "");
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;
    let pos = 0;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      pos = Math.min(pos + 10, fullText.length);
      setDisplayed(fullText.slice(0, pos));
      if (pos < fullText.length) { id = setTimeout(tick, 16); }
      else { setDone(true); }
    };
    tick();
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { displayed, done };
}

function splitInlineImages(content: string): Array<{ type: "text"; text: string } | { type: "image"; n: number }> {
  const parts = content.split(/(\[IMAGEM \d+\])/g);
  return parts.map((part) => {
    const m = part.match(/^\[IMAGEM (\d+)\]$/);
    if (m) return { type: "image", n: parseInt(m[1]) };
    return { type: "text", text: part };
  });
}

function InlineImage({ url }: { url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block my-3">
      <img
        src={url}
        alt="Ilustração"
        className="rounded-xl border border-gray-100 shadow-sm max-w-full hover:shadow-md transition-shadow cursor-zoom-in"
      />
    </a>
  );
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const [openSource, setOpenSource] = useState<string | null>(null);

  const { displayed, done } = useTypewriter(message.content, isUser);
  const content = done ? message.content : displayed;
  const images = message.images ?? [];

  const toggleSource = (src: string) =>
    setOpenSource((prev) => (prev === src ? null : src));

  /* ── Mensagem do usuário ── */
  if (isUser) {
    return (
      <div className="message-enter flex justify-end">
        <div className="max-w-[88%] sm:max-w-[75%] bg-gray-100 text-gray-800 rounded-3xl rounded-br-md px-4 sm:px-5 py-3 text-sm leading-relaxed">
          <span className="whitespace-pre-wrap">{message.content}</span>
        </div>
      </div>
    );
  }

  /* ── Mensagem da Lia ── sem bubble, só avatar + texto */
  return (
    <div className="message-enter flex flex-col gap-2">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden ring-2 ring-teal-100 mt-0.5">
          <img src="/avatar.png" alt="Lia" className="w-full h-full object-cover object-top" />
        </div>

        {/* Texto sem bubble */}
        <div className="flex-1 min-w-0 text-sm text-gray-800 leading-relaxed pt-1">
          {(() => {
            const shownUrls = new Set<string>();
            return splitInlineImages(content).map((seg, i) => {
              if (seg.type === "image") {
                const url = images[seg.n - 1];
                if (!url || shownUrls.has(url)) return null;
                shownUrls.add(url);
                return <InlineImage key={i} url={url} />;
              }
              return seg.text ? (
                <ReactMarkdown key={i} components={MD_COMPONENTS}>{seg.text}</ReactMarkdown>
              ) : null;
            });
          })()}
          {!done && (
            <span className="cursor inline-block w-0.5 h-3.5 bg-teal-600 ml-0.5 align-middle rounded-sm" />
          )}
        </div>
      </div>

      {/* Fontes */}
      {done && message.sources && message.sources.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-11">
          {message.sources.map((src) => {
            const isOpen = openSource === src;
            return (
              <button
                key={src}
                onClick={() => toggleSource(src)}
                className={`inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 border transition-colors ${
                  isOpen
                    ? "bg-teal-700 text-white border-teal-700"
                    : "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100 hover:border-teal-300"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                {src}
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            );
          })}
        </div>
      )}

      {openSource && (
        <div className="pl-11">
          <SourcePanel name={openSource} onClose={() => setOpenSource(null)} />
        </div>
      )}
    </div>
  );
}
