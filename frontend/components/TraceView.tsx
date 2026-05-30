"use client";

import type { TraceStep } from "@/lib/api";

interface Props {
  trace: TraceStep[];
  loading: boolean;
}

const NODE: Record<string, {
  iconBg: string; iconRing: string; iconColor: string;
  cardBg: string; cardBorder: string;
  connectorColor: string; dotColor: string;
}> = {
  question: {
    iconBg: "bg-teal-700",   iconRing: "ring-teal-200",   iconColor: "text-white",
    cardBg: "bg-teal-50",    cardBorder: "border-teal-200",
    connectorColor: "bg-teal-300",   dotColor: "bg-teal-500",
  },
  knowledge: {
    iconBg: "bg-violet-600", iconRing: "ring-violet-200", iconColor: "text-white",
    cardBg: "bg-violet-50",  cardBorder: "border-violet-200",
    connectorColor: "bg-violet-300", dotColor: "bg-violet-500",
  },
  context: {
    iconBg: "bg-teal-600",   iconRing: "ring-teal-200",   iconColor: "text-white",
    cardBg: "bg-teal-50",    cardBorder: "border-teal-200",
    connectorColor: "bg-teal-300",   dotColor: "bg-teal-500",
  },
  llm: {
    iconBg: "bg-indigo-600", iconRing: "ring-indigo-200", iconColor: "text-white",
    cardBg: "bg-indigo-50",  cardBorder: "border-indigo-200",
    connectorColor: "bg-indigo-300", dotColor: "bg-indigo-500",
  },
  sources: {
    iconBg: "bg-amber-500",  iconRing: "ring-amber-200",  iconColor: "text-white",
    cardBg: "bg-amber-50",   cardBorder: "border-amber-200",
    connectorColor: "bg-amber-300",  dotColor: "bg-amber-500",
  },
  done: {
    iconBg: "bg-green-600",  iconRing: "ring-green-200",  iconColor: "text-white",
    cardBg: "bg-green-50",   cardBorder: "border-green-200",
    connectorColor: "bg-green-300",  dotColor: "bg-green-500",
  },
};

const FALLBACK = NODE.done;

const STEP_META: Record<string, { fn: string; why: string }> = {
  question: {
    fn: "main.py → POST /chat",
    why: "Ponto de entrada do pipeline — a pergunta chega via HTTP e dispara todo o fluxo",
  },
  knowledge: {
    fn: "document_loader.load_documents()",
    why: "O modelo não lê arquivos — o texto é extraído dos .docx e mantido em memória desde a inicialização",
  },
  context: {
    fn: "GeminiService.ask() → _build_history()",
    why: "Histórico da conversa e todos os documentos são concatenados num único prompt antes da chamada",
  },
  llm: {
    fn: "client.models.generate_content()",
    why: "O Gemini recebe o contexto completo (RAG) e retorna a resposta estruturada em JSON",
  },
  sources: {
    fn: "json.loads(response.text)",
    why: "O modelo declara no próprio JSON quais documentos embasaram a resposta",
  },
  done: {
    fn: "main.py → ChatResponse",
    why: "Resposta serializada com answer, sources, trace e refs de imagens e enviada ao frontend",
  },
};

const CONNECTOR_LABELS: Record<string, string> = {
  question:  "pergunta (string)",
  knowledge: "textos extraídos dos .docx",
  context:   "prompt completo montado",
  llm:       "resposta JSON do modelo",
  sources:   "answer + fontes identificadas",
};

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const cls = `w-5 h-5 ${className ?? ""}`;
  switch (name) {
    case "chat":
      return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
    case "book":
      return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
    case "layers":
      return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" /></svg>;
    case "sparkle":
      return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>;
    case "document":
      return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
    case "check":
      return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default:
      return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>;
  }
};

function Connector({ step, delay }: { step: TraceStep; delay: number }) {
  const cfg = NODE[step.id] ?? FALLBACK;
  const label = CONNECTOR_LABELS[step.id];

  return (
    <div className="relative w-full flex justify-center" style={{ height: 64 }}>
      <div className="flex flex-col items-center">
        <div
          className={`relative w-0.5 flex-1 ${cfg.connectorColor} connector-grow overflow-hidden`}
          style={{ animationDelay: `${delay}ms` }}
        >
          <div className={`dot-flow ${cfg.dotColor}`} style={{ animationDelay: `${delay + 100}ms` }} />
        </div>
        <div className="node-enter" style={{ animationDelay: `${delay + 200}ms` }}>
          <svg width="12" height="8" viewBox="0 0 12 8" className={cfg.dotColor.replace("bg-", "fill-")}>
            <path d="M6 8L0 0h12z" />
          </svg>
        </div>
      </div>

      {label && (
        <span
          className={`hidden sm:block node-enter absolute left-1/2 top-1/2 -translate-y-1/2 ml-3 text-xs font-mono px-2.5 py-1 rounded-full border ${cfg.cardBorder} bg-white text-gray-400 whitespace-nowrap`}
          style={{ animationDelay: `${delay + 150}ms` }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function FlowNode({ step, index }: { step: TraceStep; index: number }) {
  const cfg = NODE[step.id] ?? FALLBACK;
  const meta = STEP_META[step.id];
  const delay = index * 200;

  return (
    <div className="node-enter w-full" style={{ animationDelay: `${delay}ms` }}>
      <div className={`rounded-2xl border px-3 sm:px-5 py-3 sm:py-4 shadow-sm ${cfg.cardBg} ${cfg.cardBorder}`}>
        <div className="flex items-start gap-4">

          <div className={`relative flex-shrink-0 w-11 h-11 rounded-full ring-4 ${cfg.iconRing} ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center`}>
            <Icon name={step.icon} />
            {step.id === "llm" && (
              <span className={`absolute inset-0 rounded-full ring-4 ${cfg.iconRing} animate-ping opacity-40`} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-gray-800">{step.label}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                {step.duration_ms !== undefined && (
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${cfg.cardBorder} bg-white text-gray-500`}>
                    {step.duration_ms} ms
                  </span>
                )}
                {step.status === "done" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100" />
                )}
                {step.status === "warning" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-100" />
                )}
              </div>
            </div>

            {meta && (
              <div className="mt-2 flex items-center gap-1.5 bg-white/70 border border-gray-200 rounded-md px-2 py-0.5 min-w-0 overflow-hidden">
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                <code className="text-xs font-mono text-gray-500 truncate">{meta.fn}</code>
              </div>
            )}

            {meta && (
              <p className="mt-2 text-xs text-gray-500 italic leading-relaxed">{meta.why}</p>
            )}

            {step.detail && (
              <div className={`mt-3 pt-3 border-t ${cfg.cardBorder}`}>
                <p className="text-xs text-gray-600 leading-relaxed">{step.detail}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFlow() {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {["Aguardando pergunta…", "Buscando documentos…", "Montando contexto…", "Consultando Gemini…"].map((label, i) => (
        <div key={i} className="w-full flex flex-col items-center">
          <div className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 flex items-start gap-4 animate-pulse">
            <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 pt-0.5">
              <div className="h-3.5 w-40 bg-gray-200 rounded mb-3" />
              <div className="h-2.5 w-48 bg-gray-100 rounded mb-1.5" />
              <div className="h-2.5 w-64 bg-gray-100 rounded" />
            </div>
          </div>
          {i < 3 && (
            <div className="flex flex-col items-center" style={{ height: 64 }}>
              <div className="w-0.5 flex-1 bg-gray-200 relative overflow-hidden">
                <div className="dot-flow bg-teal-400" />
              </div>
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-gray-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-4">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-700 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Nenhuma consulta realizada</p>
        <p className="text-xs text-gray-400 mt-1">Faça uma pergunta na aba <strong>Chat</strong> e volte aqui para ver o fluxo completo</p>
      </div>
    </div>
  );
}

export default function TraceView({ trace, loading }: Props) {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-6">
          Processando consulta
        </p>
        <LoadingFlow />
      </div>
    );
  }

  if (trace.length === 0) return <EmptyState />;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-6">
        Fluxo da última consulta
      </p>

      <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        {trace.map((step, i) => {
          const isLast = i === trace.length - 1;
          const connectorDelay = i * 200 + 180;

          return (
            <div key={step.id} className="w-full flex flex-col items-center">
              <FlowNode step={step} index={i} />
              {!isLast && <Connector step={step} delay={connectorDelay} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
