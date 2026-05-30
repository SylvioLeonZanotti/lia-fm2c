"use client";

import { useEffect, useState } from "react";
import { fetchDocContent } from "@/lib/api";

interface Props {
  name: string;
  onClose: () => void;
}

export default function SourcePanel({ name, onClose }: Props) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(null);
    setError(null);
    fetchDocContent(name)
      .then(setContent)
      .catch((e: Error) => setError(e.message));
  }, [name]);

  return (
    <div className="mt-2 ml-10 rounded-xl border border-teal-100 bg-teal-50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-teal-100 border-b border-teal-200">
        <div className="flex items-center gap-2 text-sm font-medium text-teal-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          {name}
        </div>
        <button
          onClick={onClose}
          className="text-teal-500 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-200"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3 max-h-72 overflow-y-auto">
        {!content && !error && (
          <div className="flex items-center gap-2 text-sm text-teal-600 py-2">
            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Carregando documento...
          </div>
        )}
        {error && (
          <p className="text-sm text-red-600 py-2">{error}</p>
        )}
        {content && (
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
