import React, { useState } from 'react';
import { PostConfig } from '../types';
import { Sparkles, X, Wand2, RefreshCw, AlertCircle, Globe, Flame } from 'lucide-react';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGenerated: (data: { text: string; highlightText: string; systemTitle?: string }) => void;
}

const THEME_IDEAS = [
  '🌐 O que está acontecendo hoje na internet e no Brasil',
  '⚡ Cultura pop, polêmicas e comportamento viral nas redes',
  '🏢 Cotidiano: supermercado, Uber, reuniões inúteis e burocracia',
  '💔 Relacionamentos: stalk de 2017, vácuo e apego ansioso',
  '🌙 Madrugada: decisões péssimas, compras no impulso e insônia',
  '💊 Farmacologia: efeitos colaterais do Escitalopram e libido zero',
  '🛋️ No Consultório: gastar R$ 250 de terapia pra rir nervoso',
  '💾 Nostalgia Anos 2000: MSN Messenger, Orkut e Windows 98',
];

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyGenerated,
}) => {
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('Sarcástico, absurdo e existencial');
  const [useLiveSearch, setUseLiveSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    text: string;
    highlight: string;
    systemTitle?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedResult(null);

    try {
      if (useLiveSearch) {
        const res = await fetch('/api/generate-live-world-memes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: theme || 'notícias, cultura pop, internet e cotidiano de hoje',
            count: 1,
            searchFocus: 'brasil tendências virais',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.memes) && data.memes.length > 0) {
            const m = data.memes[0];
            setGeneratedResult({
              text: m.text,
              highlight: m.highlight || '',
              systemTitle: m.systemTitle || 'Observatório_Mundo.exe',
            });
            setIsLoading(false);
            return;
          }
        }
      }

      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme || 'observação do mundo e cotidiano',
          tone,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha no servidor de IA. Usando gerador criativo local.');
      }

      const data = await res.json();
      if (data && data.text) {
        setGeneratedResult({
          text: data.text,
          highlight: data.highlight || '',
          systemTitle: data.systemTitle || '',
        });
      } else {
        throw new Error('Formato inesperado.');
      }
    } catch (err: any) {
      console.warn('Fallback local para geração criativa:', err);
      // Smart offline fallback generator tailored to Depressivos 2000
      const offlineQuotes = [
        {
          text: 'Vendo a internet inteira discutir a nova trend da semana enquanto eu só queria que meu cérebro parasse de rodar o pensamento de 2014 em segundo plano.',
          highlight: 'pensamento de 2014',
          systemTitle: 'Observatório_Mundo.exe',
        },
        {
          text: 'A médica aumentou meu Escitalopram para 20mg.\n\nResultado: a ansiedade sumiu, mas a libido foi junto e agora sou oficialmente um monge tibetano.',
          highlight: 'libido foi junto',
          systemTitle: 'Bula_Interativa - escitalopram.exe',
        },
        {
          text: 'Fui stalkear um perfil de 2017 e meu dedo deu dois toques acidentais na foto do batizado do sobrinho da pessoa.\n\nJá estou com as malas prontas para morar no interior do Paraguai.',
          highlight: 'dois toques acidentais',
          systemTitle: 'Alerta de Stalking - fail.exe',
        },
        {
          text: 'Paguei R$ 250 de terapia pra psicóloga perguntar "e como você se sente sobre isso?" e eu responder "com vontade de reiniciar o Windows".',
          highlight: 'reiniciar o Windows',
          systemTitle: 'Terapia_TCC.exe',
        },
      ];

      const pick = offlineQuotes[Math.floor(Math.random() * offlineQuotes.length)];
      setGeneratedResult(pick);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyGenerated({
        text: generatedResult.text,
        highlightText: generatedResult.highlight,
        systemTitle: generatedResult.systemTitle,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181B22] border-2 border-purple-500/40 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-950/40 to-[#181B22]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/30 text-purple-300 rounded-xl border border-purple-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                Gerador de Frases com IA (Gemini)
              </h2>
              <p className="text-xs text-gray-400">
                Gere novas piadas existenciais e memes estilo Traumas.zip
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Sobre o que você quer reclamar hoje? (Tema)
            </label>
            <input
              type="text"
              placeholder="ex: acordar cedo pra trabalhar, dor nas costas, ex no orkut..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[#101217] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-500"
            />
          </div>

          {/* Live Search Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Motor de Observação do Mundo (Web ao Vivo)
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-mono px-1.5 py-0.5 rounded">Google Search</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Pesquisa acontecimentos reais de hoje, notícias, memes e cultura pop
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUseLiveSearch(!useLiveSearch)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                useLiveSearch ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  useLiveSearch ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-[11px] text-gray-400 block mb-1">
              Sugestões rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {THEME_IDEAS.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setTheme(idea)}
                  className="text-[11px] bg-[#222735] hover:bg-[#2F3649] text-purple-200 px-2.5 py-1 rounded-md border border-purple-500/20 transition"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consultando traumas e gerando...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-yellow-300" />
                <span>Gerar Frase Inédita</span>
              </>
            )}
          </button>

          {/* Result Box */}
          {generatedResult && (
            <div className="bg-[#12141A] border-2 border-purple-500/50 rounded-xl p-4 mt-2 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold border border-purple-500/40">
                  Frase Gerada
                </span>
                {generatedResult.highlight && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-400 text-black font-bold">
                    Destaque: {generatedResult.highlight}
                  </span>
                )}
              </div>

              <p className="text-white font-impact text-lg uppercase tracking-tight my-2 leading-snug">
                {generatedResult.text}
              </p>

              <button
                onClick={handleApply}
                className="w-full mt-3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md"
              >
                ✓ Aplicar no Meu Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
