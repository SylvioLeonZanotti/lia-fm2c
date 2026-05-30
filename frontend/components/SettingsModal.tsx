"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { type AgentSettings, DEFAULT_SETTINGS } from "@/lib/settings";

interface Props {
  settings: AgentSettings;
  onSave: (s: AgentSettings) => void;
  onClose: () => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-teal-700" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SegmentedControl<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; description: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 transition-all ${
            value === opt.value
              ? "border-teal-600 bg-teal-50 text-teal-700 shadow-sm"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <span className="text-xs font-semibold">{opt.label}</span>
          <span className={`text-[10px] leading-tight text-center ${
            value === opt.value ? "text-teal-500" : "text-gray-400"
          }`}>
            {opt.description}
          </span>
        </button>
      ))}
    </div>
  );
}

const TOGGLE_ICONS: Record<string, React.ReactNode> = {
  emoji: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
  help: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  ),
  steps: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  bold: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 000-8.25H6.75zM6 12v8.25H12a4.5 4.5 0 000-9H6z" />
    </svg>
  ),
};

function Row({
  label, description, icon, children,
}: {
  label: string; description: string; icon: keyof typeof TOGGLE_ICONS; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-gray-400">
          {TOGGLE_ICONS[icon]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{title}</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4">{children}</div>
    </div>
  );
}

function buildPreview(s: AgentSettings): string {
  const greet = s.useEmojis ? "✅ " : "";
  const body = s.responseStyle === "concise"
    ? "Acesse **Arquivo → Ferramentas → Limpar Itens Antigos**. Selecione a pasta e o período desejado."
    : s.responseStyle === "detailed"
    ? "Para arquivar e-mails no Outlook, acesse a aba **Arquivo** no canto superior esquerdo da tela. Em seguida, clique em **Ferramentas** e selecione **Limpar Itens Antigos**. Marque a pasta desejada e escolha o período de arquivamento (3, 6 meses ou 1 ano)."
    : "Abra o Outlook e vá em **Arquivo → Ferramentas → Limpar Itens Antigos**. Selecione a pasta e o período, depois clique em **OK**.";

  const tone = s.tone === "formal"
    ? "Seguem as instruções para realizar o procedimento:"
    : s.tone === "friendly"
    ? "Oi! Veja como fazer isso rapidinho:"
    : "Siga os passos abaixo:";

  const steps = s.useNumberedSteps
    ? "\n\n1. Abra o Outlook\n2. Acesse o menu **Arquivo**\n3. Clique em **Ferramentas**"
    : "\n\n- Abra o Outlook\n- Acesse o menu **Arquivo**\n- Clique em **Ferramentas**";

  const end = s.endWithHelp
    ? (s.useEmojis ? "\n\n💬 Precisa de mais ajuda? Estou à disposição!" : "\n\nPrecisa de mais ajuda? Estou à disposição!")
    : "";

  return `${greet}${tone}\n\n${body}${steps}${end}`;
}

export default function SettingsModal({ settings, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<AgentSettings>(settings);
  const [isClosing, setIsClosing] = useState(false);

  const set = <K extends keyof AgentSettings>(key: K, value: AgentSettings[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => { setIsClosing(true); setTimeout(onClose, 200); };
  const handleSave = () => { onSave(draft); handleClose(); };
  const handleReset = () => setDraft(DEFAULT_SETTINGS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${isClosing ? "backdrop-exit" : "backdrop-enter"}`}
        onClick={handleClose}
      />

      <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-gray-50 shadow-2xl overflow-hidden ${isClosing ? "modal-exit" : "modal-enter"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Personalizar Agente</h2>
              <p className="text-xs text-gray-400">Ajuste como o assistente se comunica</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — two-column layout */}
        <div className="flex-1 overflow-hidden flex">

          {/* Left: controls */}
          <div className="flex-1 overflow-y-auto px-5 py-5 border-r border-gray-100">
            <Section title="Tom da conversa">
              <div className="py-3">
                <SegmentedControl
                  value={draft.tone}
                  onChange={(v) => set("tone", v)}
                  options={[
                    { value: "formal",   label: "Formal",   description: "Técnico e respeitoso" },
                    { value: "neutral",  label: "Neutro",   description: "Direto e equilibrado" },
                    { value: "friendly", label: "Amigável", description: "Próximo e acolhedor" },
                  ]}
                />
              </div>
            </Section>

            <Section title="Profundidade da resposta">
              <div className="py-3">
                <SegmentedControl
                  value={draft.responseStyle}
                  onChange={(v) => set("responseStyle", v)}
                  options={[
                    { value: "concise",  label: "Direto",      description: "Objetivo, sem contexto extra" },
                    { value: "balanced", label: "Equilibrado", description: "Detalhes sem excessos" },
                    { value: "detailed", label: "Detalhado",   description: "Completo com contexto" },
                  ]}
                />
              </div>
            </Section>

            <Section title="Comportamento">
              <Row label="Usar emojis" description="Adiciona emojis para tornar as respostas mais visuais" icon="emoji">
                <Toggle checked={draft.useEmojis} onChange={(v) => set("useEmojis", v)} />
              </Row>
              <Row label="Finalizar com oferta de ajuda" description='Encerra com "Precisa de mais ajuda? Estou à disposição!"' icon="help">
                <Toggle checked={draft.endWithHelp} onChange={(v) => set("endWithHelp", v)} />
              </Row>
              <Row label="Passos numerados" description="Usa listas numeradas em procedimentos passo a passo" icon="steps">
                <Toggle checked={draft.useNumberedSteps} onChange={(v) => set("useNumberedSteps", v)} />
              </Row>
              <Row label="Destacar termos-chave" description="Coloca em negrito nomes de botões, menus e opções" icon="bold">
                <Toggle checked={draft.highlightKeyTerms} onChange={(v) => set("highlightKeyTerms", v)} />
              </Row>
            </Section>
          </div>

          {/* Right: live preview */}
          <div className="w-96 flex-shrink-0 flex flex-col px-5 py-5 bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Preview</p>

            <div className="flex-1 flex flex-col bg-gray-50 rounded-2xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-3 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Como o agente vai responder
              </p>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5 ring-2 ring-teal-200">
                  <img src="/avatar.png" alt="Lia" className="w-full h-full object-cover object-top" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 border border-gray-100 shadow-sm flex-1 min-w-0">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="text-xs text-gray-700 leading-relaxed mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      ul: ({ children }) => <ul className="text-xs text-gray-700 space-y-0.5 pl-3 list-disc mb-2 last:mb-0">{children}</ul>,
                      ol: ({ children }) => <ol className="text-xs text-gray-700 space-y-0.5 pl-3 list-decimal mb-2 last:mb-0">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    }}
                  >
                    {buildPreview(draft)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-gray-100 gap-3">
          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Restaurar padrões
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-sm rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium transition-colors shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
