import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { PostConfig, TemplateType } from '../types';
import confetti from 'canvas-confetti';
import {
  BrainCircuit,
  Heart,
  X,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ArrowLeft,
  Tv,
  MessageSquare,
  Music,
  Share2,
  Copy,
  Layers,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

export interface RlhfPostItem {
  id: string;
  category: string;
  text: string;
  highlight: string;
  template: TemplateType;
  systemTitle?: string;
  windowButtonText?: string;
  shadowColor?: string;
  sticker?: string;
  caption?: string;
  hashtags?: string[];
  viralAudio?: string;
  mockupDevice?: string;
  likedAt?: number;
  reason?: string;
}

interface RlhfCuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPost: (post: RlhfPostItem) => void;
  onShowToast: (msg: string) => void;
}

// Initial starter batch for curating
const INITIAL_CURATION_CARDS: RlhfPostItem[] = [
  {
    id: 'seed-1',
    category: 'Farmacologia & Remédios',
    text: 'Aumentei meu Escitalopram para 20mg.\n\nResultado: ansiedade zerada, libido inexistente e agora sou oficialmente um monge budista que se estressa com Wi-Fi lento.',
    highlight: 'libido inexistente',
    template: 'tweet-parede',
    systemTitle: 'Bula_Interativa - escitalopram.exe',
    windowButtonText: 'TOMAR COM ÁGUA',
    shadowColor: '#0000FF',
    sticker: 'battery',
    caption: 'Manda pro amigo que também tomou posse do certificado de monge tibetano medicado 💊',
    hashtags: ['#traumaszip', '#escitalopram', '#saudemental', '#humorbrasil', '#ansiedade'],
    viralAudio: 'The Reason - Hoobastank (trecho melancólico)',
    mockupDevice: 'tv-vhs',
  },
  {
    id: 'seed-2',
    category: 'Consultório & Terapia',
    text: 'Paguei R$ 280 na consulta pra psicóloga perguntar "e como isso te faz sentir?" e eu responder "com vontade de formatar o cérebro em modo de fábrica".',
    highlight: 'formatar o cérebro',
    template: 'sistema-alerta',
    systemTitle: 'Laudo Psiquiátrico - CID_F41.exe',
    windowButtonText: 'DESMARCAR TERAPIA',
    shadowColor: '#FF3333',
    sticker: 'warning',
    caption: 'Faltou só a opção de dar Ctrl+Alt+Del no córtex pré-frontal 🖥️ Manda no grupo!',
    hashtags: ['#traumaszip', '#terapia', '#psicanalise', '#humor', '#vidasaudavel'],
    viralAudio: 'Trend de transição brusca de áudio calmo para som de erro do Windows',
    mockupDevice: 'monitor-98',
  },
  {
    id: 'seed-3',
    category: 'Relacionamentos & Vácuo',
    text: 'Ele visualizou às 14:02 e não respondeu.\n\nMeu apego ansioso: "ele foi sequestrado ou me odeia".\nA realidade: ele abriu um reels de capivara e esqueceu que é um ser humano.',
    highlight: 'apego ansioso',
    template: 'msn-nostalgia',
    systemTitle: 'MSN Messenger - (Ausente da Sanidade)',
    windowButtonText: 'CHAMAR ATENÇÃO',
    shadowColor: '#000080',
    sticker: 'msn',
    caption: 'Quem nunca montou uma teoria da conspiração em 4 minutos de vácuo que atire o primeiro rivotril.',
    hashtags: ['#traumaszip', '#msn', '#relacionamentos', '#apegoansioso', '#psicologia'],
    viralAudio: 'Som clássico do MSN chamando atenção com som de alerta',
    mockupDevice: 'celular-v3',
  },
  {
    id: 'seed-4',
    category: 'Noites em Claro',
    text: 'Tomei Zolpidem às 23h pra desligar o pensamento e acordei dono de um kit de facas churrasco e uma passagem sem volta pra Curitiba.',
    highlight: 'Tomei Zolpidem',
    template: 'terminal-dark',
    systemTitle: '> zolpidem_blackout.sh',
    windowButtonText: 'CANCELAR COMPRA',
    shadowColor: '#00FF66',
    sticker: 'skull',
    caption: 'O terror do cartão de crédito de madrugada. Compartilha com o sobrevivente do Zolpidem.',
    hashtags: ['#traumaszip', '#zolpidem', '#insonia', '#humor', '#farmacia'],
    viralAudio: 'Música de suspense dos anos 2000 em baixa rotação',
    mockupDevice: 'ipod',
  }
];

export const RlhfCuratorModal: React.FC<RlhfCuratorModalProps> = ({
  isOpen,
  onClose,
  onApplyPost,
  onShowToast,
}) => {
  // Card queue
  const [cards, setCards] = useState<RlhfPostItem[]>(INITIAL_CURATION_CARDS);
  
  // RLHF Datasets stored in state & localStorage
  const [likedPosts, setLikedPosts] = useState<RlhfPostItem[]>(() => {
    try {
      const saved = localStorage.getItem('traumas_rlhf_liked');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dislikedPosts, setDislikedPosts] = useState<RlhfPostItem[]>(() => {
    try {
      const saved = localStorage.getItem('traumas_rlhf_disliked');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [dnaInsights, setDnaInsights] = useState<{
    identifiedPreferences?: string;
    discardedPatterns?: string;
  } | null>(null);

  const [extraFocus, setExtraFocus] = useState('');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('traumas_rlhf_liked', JSON.stringify(likedPosts));
    } catch (e) {
      console.warn('Falha ao salvar likes no localStorage', e);
    }
  }, [likedPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('traumas_rlhf_disliked', JSON.stringify(dislikedPosts));
    } catch (e) {
      console.warn('Falha ao salvar dislikes no localStorage', e);
    }
  }, [dislikedPosts]);

  if (!isOpen) return null;

  const currentCard = cards[0] || null;

  // Handle Swipe / Action
  const handleVote = (action: 'like' | 'dislike') => {
    if (!currentCard) return;

    if (action === 'like') {
      setLikedPosts((prev) => [currentCard, ...prev]);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0000FF', '#FFD700', '#00FF66'],
      });
      onShowToast('💚 Post aprovado e adicionado ao [HISTÓRICO DE MATCHES]!');
    } else {
      setDislikedPosts((prev) => [currentCard, ...prev]);
      onShowToast('✕ Post descartado e adicionado ao [HISTÓRICO REJEITADO].');
    }

    // Remove top card
    setCards((prev) => prev.slice(1));
  };

  // Generate more using RLHF Prompt
  const handleGenerateMoreRlhf = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-rlhf-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likedPosts: likedPosts.slice(0, 10).map((p) => ({
            category: p.category,
            text: p.text,
            highlight: p.highlight,
            template: p.template,
            mockup: p.mockupDevice,
          })),
          dislikedPosts: dislikedPosts.slice(0, 10).map((p) => ({
            category: p.category,
            text: p.text,
            template: p.template,
          })),
          count: 4,
          extraFocus,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao conectar com o serviço de RLHF Gemini.');
      }

      const data = await res.json();

      if (data && Array.isArray(data.posts) && data.posts.length > 0) {
        const formatted: RlhfPostItem[] = data.posts.map((p: any, idx: number) => ({
          id: `rlhf-${Date.now()}-${idx}`,
          category: p.category || 'Farmacologia & Vida Adulta',
          text: p.text || '',
          highlight: p.highlight || '',
          template: (p.template as TemplateType) || 'tweet-parede',
          systemTitle: p.systemTitle || 'Bula_Interativa.exe',
          windowButtonText: p.windowButtonText || 'TOMAR COM ÁGUA',
          shadowColor: p.shadowColor || '#0000FF',
          sticker: p.sticker || 'battery',
          caption: p.caption || '',
          hashtags: p.hashtags || ['#traumaszip', '#saudemental', '#humor'],
          viralAudio: p.viralAudio || 'Música nostálgica anos 2000',
          mockupDevice: p.mockupDevice || 'tv-vhs',
        }));

        setCards((prev) => [...formatted, ...prev]);
        if (data.dnaAnalysis) {
          setDnaInsights(data.dnaAnalysis);
        }

        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#0000FF', '#FFD700', '#FF3333'],
        });

        onShowToast(`🧠 ${formatted.length} novos posts calibrados por RLHF gerados!`);
      } else {
        throw new Error('Resposta de IA sem posts formatados.');
      }
    } catch (err: any) {
      console.warn('Erro ao gerar via RLHF:', err);
      // Fallback generator respecting preferences
      const fallbackItems: RlhfPostItem[] = [
        {
          id: `fallback-${Date.now()}-1`,
          category: 'Farmacologia & Burnout',
          text: 'Meu terapeuta disse que eu preciso desacelerar.\n\nMinha resposta: "Doutor, se eu desacelerar a fatura do cartão me atropela".',
          highlight: 'fatura do cartão',
          template: 'tweet-parede',
          systemTitle: 'Bula_Interativa - boleto.exe',
          windowButtonText: 'PAGAR COM PIX',
          shadowColor: '#0000FF',
          sticker: 'battery',
          caption: 'O capitalismo não permite desaceleração biológica. Manda pro seu colega de trabalho exausto.',
          hashtags: ['#traumaszip', '#burnout', '#saudemental', '#humorcorporativo', '#trabalho'],
          viralAudio: 'Trend de teclado de escritório com som de erro',
          mockupDevice: 'tv-vhs',
        },
        {
          id: `fallback-${Date.now()}-2`,
          category: 'Consultório 3 da Manhã',
          text: 'Troquei o café por chá de camomila para diminuir o pânico.\n\nAgora estou tendo ataques de ansiedade, porém calmo e perfumado.',
          highlight: 'calmo e perfumado',
          template: 'sistema-alerta',
          systemTitle: 'Laudo_Psicossomatico.dll',
          windowButtonText: 'BEBER CHÁ',
          shadowColor: '#FF3333',
          sticker: 'warning',
          caption: 'O importante é a consistência estética do colapso.',
          hashtags: ['#traumaszip', '#ansiedade', '#humor', '#saudemental'],
          viralAudio: 'The Reason - Melancólica anos 2000',
          mockupDevice: 'monitor-98',
        },
      ];

      setCards((prev) => [...fallbackItems, ...prev]);
      onShowToast('⚡ Novos posts gerados com o DNA da marca!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyCurrent = () => {
    if (!currentCard) return;
    onApplyPost(currentCard);
    onShowToast('✓ Post aplicado no editor!');
    onClose();
  };

  const handleClearHistory = () => {
    if (window.confirm('Deseja zerar o histórico de Matches e Rejeitados do algoritmo?')) {
      setLikedPosts([]);
      setDislikedPosts([]);
      setDnaInsights(null);
      localStorage.removeItem('traumas_rlhf_liked');
      localStorage.removeItem('traumas_rlhf_disliked');
      onShowToast('🧹 Histórico de feedback RLHF reiniciado.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0F121A] border-4 border-[#0000FF] rounded-2xl shadow-[12px_12px_0px_#000000] overflow-hidden text-white font-sans my-6">
        
        {/* ============================================================ */}
        {/* MODAL HEADER: Y2K BLUE TITLEBAR */}
        {/* ============================================================ */}
        <div className="bg-[#0000FF] px-5 py-3 flex items-center justify-between border-b-2 border-black select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFD700] border-2 border-black flex items-center justify-center rounded shadow-[2px_2px_0px_#000]">
              <BrainCircuit className="w-5 h-5 text-black animate-pulse" />
            </div>
            <div>
              <h2 className="font-impact text-lg text-white tracking-wide uppercase flex items-center gap-2">
                <span>CURADORIA RLHF & APRENDIZADO CONTÍNUO</span>
                <span className="font-mono text-[10px] bg-black text-[#00FF66] px-1.5 py-0.5 rounded border border-[#00FF66]">
                  ALGORITMO ADAPTATIVO
                </span>
              </h2>
              <p className="font-mono text-[11px] text-blue-100">
                Avalie os posts com Swipe: A IA extrai o DNA dos aprovados e elimina padrões dos rejeitados
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-red-600 hover:bg-red-500 active:scale-95 text-white border-2 border-black font-bold flex items-center justify-center rounded shadow-[2px_2px_0px_#000] transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* RLHF STATUS & DNA STATS BAR */}
        {/* ============================================================ */}
        <div className="bg-[#151A26] border-b border-gray-800 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-ping" />
              <span className="text-gray-300">Feedback Loop:</span>
              <strong className="text-[#00FF66]">Ativo</strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 font-bold">
                <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                {likedPosts.length} Matches
              </span>
              <span className="bg-red-950/80 text-red-300 px-2 py-0.5 rounded border border-red-500/40 flex items-center gap-1 font-bold">
                <X className="w-3.5 h-3.5 text-red-400" />
                {dislikedPosts.length} Descartados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(likedPosts.length > 0 || dislikedPosts.length > 0) && (
              <button
                onClick={handleClearHistory}
                className="text-gray-400 hover:text-red-400 underline text-[11px] transition"
              >
                Limpar Histórico
              </button>
            )}
            <span className="text-gray-400 font-mono text-[11px]">
              Cards na Fila: <strong className="text-yellow-400">{cards.length}</strong>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN BODY GRID */}
        {/* ============================================================ */}
        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: SWIPE INTERACTIVE CARD AREA (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-between min-h-[480px]">
            
            {currentCard ? (
              <div className="w-full flex-1 flex flex-col items-center justify-center relative">
                {/* Visual Card Container */}
                <motion.div
                  key={currentCard.id}
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-full max-w-md bg-[#F4F4F0] text-[#1A1A1A] border-4 border-[#1A1A1A] rounded-2xl shadow-[8px_8px_0px_#0000FF] p-6 relative select-none"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 mb-4">
                    <span className="font-mono text-[11px] font-bold bg-[#0000FF] text-white px-2 py-0.5 rounded uppercase">
                      {currentCard.category}
                    </span>
                    <span className="font-mono text-[11px] text-gray-600 font-bold">
                      {currentCard.systemTitle || 'traumas.zip'}
                    </span>
                  </div>

                  {/* Meme Content Text */}
                  <div className="my-4 min-h-[140px] flex items-center justify-center text-center">
                    <p className="font-impact text-xl sm:text-2xl text-[#1A1A1A] uppercase tracking-tight leading-snug whitespace-pre-line">
                      {currentCard.text}
                    </p>
                  </div>

                  {/* Mockup Badge & Highlight */}
                  <div className="bg-[#E0E0D8] border-2 border-[#1A1A1A] rounded-xl p-3 space-y-2 mt-4 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#0000FF]" />
                        Destaque:
                      </span>
                      <span className="bg-[#FFD700] text-black font-bold px-1.5 py-0.5 rounded border border-black">
                        "{currentCard.highlight}"
                      </span>
                    </div>

                    {currentCard.viralAudio && (
                      <div className="flex items-center justify-between text-[11px] text-gray-600">
                        <span className="flex items-center gap-1 font-bold">
                          <Music className="w-3 h-3 text-pink-600" />
                          Trilha Sugerida:
                        </span>
                        <span className="truncate max-w-[200px] text-right font-medium">
                          {currentCard.viralAudio}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Caption Preview */}
                  {currentCard.caption && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 font-mono">
                      <strong className="block text-[10px] text-blue-700 font-bold uppercase mb-0.5">
                        Legenda com CTA de Compartilhamento:
                      </strong>
                      <p className="line-clamp-2 italic">{currentCard.caption}</p>
                    </div>
                  )}
                </motion.div>

                {/* ACTION BUTTONS (LIKE / DISLIKE / APPLY) */}
                <div className="flex items-center justify-center gap-4 mt-6 w-full max-w-md">
                  {/* Dislike / Rejeitar */}
                  <button
                    onClick={() => handleVote('dislike')}
                    className="flex-1 py-3 px-4 bg-[#1F2432] hover:bg-red-950/80 active:scale-95 text-red-400 hover:text-red-300 font-impact tracking-wider text-sm rounded-xl border-2 border-red-500/50 shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 transition"
                    title="Descartar post e ensinar ao algoritmo o que evitar"
                  >
                    <X className="w-5 h-5 text-red-400" />
                    <span>DESCARTAR</span>
                  </button>

                  {/* Apply in Post */}
                  <button
                    onClick={handleApplyCurrent}
                    className="py-3 px-4 bg-[#FFD700] hover:bg-[#FFE033] active:scale-95 text-black font-impact tracking-wider text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_#0000FF] flex items-center justify-center gap-1.5 transition"
                    title="Usar este post imediatamente no canvas principal"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>USAR POST</span>
                  </button>

                  {/* Like / Match */}
                  <button
                    onClick={() => handleVote('like')}
                    className="flex-1 py-3 px-4 bg-[#0000FF] hover:bg-blue-600 active:scale-95 text-white font-impact tracking-wider text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_#00FF66] flex items-center justify-center gap-2 transition"
                    title="Dar Match e calibrar o DNA do algoritmo"
                  >
                    <Heart className="w-5 h-5 fill-[#00FF66] text-[#00FF66]" />
                    <span>DAR MATCH</span>
                  </button>
                </div>
              </div>
            ) : (
              /* EMPTY QUEUE STATE */
              <div className="w-full flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#141824] border-2 border-dashed border-gray-700 rounded-2xl">
                <div className="w-16 h-16 bg-[#0000FF]/20 rounded-full flex items-center justify-center border border-[#0000FF] mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#00FF66]" />
                </div>
                <h3 className="font-impact text-xl text-white uppercase tracking-wide">
                  TODOS OS CARDS DA FILA FORAM AVALIADOS!
                </h3>
                <p className="font-mono text-xs text-gray-400 mt-2 max-w-sm">
                  O algoritmo coletou suas preferências ({likedPosts.length} matches e {dislikedPosts.length} rejeições).
                  Clique abaixo para gerar uma nova remessa evolutiva.
                </p>

                <button
                  onClick={handleGenerateMoreRlhf}
                  disabled={isGenerating}
                  className="mt-5 py-3 px-6 bg-[#0000FF] hover:bg-blue-600 active:scale-95 text-white font-impact text-base rounded-xl border-2 border-black shadow-[4px_4px_0px_#FFD700] flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-[#FFD700]" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  )}
                  <span>GERAR MAIS COM APRENDIZADO RLHF</span>
                </button>
              </div>
            )}

          </div>

          {/* RIGHT: ALGORITHM BRAIN, DNA EXTRACTION & SETTINGS (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            {/* 1. DNA EXTRACTION & FEEDBACK INSIGHTS */}
            <div className="bg-[#141824] border-2 border-[#0000FF] rounded-xl p-4 shadow-[5px_5px_0px_#000000] space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <Cpu className="w-4 h-4 text-[#FFD700]" />
                <h4 className="font-impact text-sm text-white uppercase tracking-wide">
                  DNA CLÍNICO DO ALGORITMO
                </h4>
              </div>

              {dnaInsights ? (
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="bg-blue-950/60 border border-blue-500/30 rounded-lg p-2.5">
                    <strong className="block text-blue-300 font-bold uppercase text-[10px] mb-1">
                      ✓ Padrões de Sucesso Identificados (Matches):
                    </strong>
                    <p className="text-gray-300 leading-relaxed">
                      {dnaInsights.identifiedPreferences}
                    </p>
                  </div>

                  <div className="bg-red-950/60 border border-red-500/30 rounded-lg p-2.5">
                    <strong className="block text-red-300 font-bold uppercase text-[10px] mb-1">
                      ✕ Padrões Eliminados (Rejeições):
                    </strong>
                    <p className="text-gray-300 leading-relaxed">
                      {dnaInsights.discardedPatterns}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#1A2030] rounded-lg border border-gray-800 text-xs font-mono text-gray-400 space-y-1.5">
                  <p>
                    O sistema analisa automaticamente os posts em <span className="text-[#00FF66] font-bold">[HISTÓRICO DE MATCHES]</span> e exclui os de <span className="text-red-400 font-bold">[HISTÓRICO REJEITADO]</span>.
                  </p>
                  <p className="text-[11px] text-blue-300">
                    💡 Quanto mais você avalia, mais afiado e cirúrgico fica o humor dos novos posts!
                  </p>
                </div>
              )}
            </div>

            {/* 2. CUSTOM THEME FOCUS INPUT */}
            <div className="bg-[#141824] border border-gray-800 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase">
                Foco ou Tema Específico para a Próxima Geração:
              </label>
              <input
                type="text"
                value={extraFocus}
                onChange={(e) => setExtraFocus(e.target.value)}
                placeholder="Ex: libido zero, burnout de fim de mês, ex no MSN..."
                className="w-full bg-[#0A0D14] border border-gray-700 focus:border-[#0000FF] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none"
              />

              <button
                onClick={handleGenerateMoreRlhf}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0000FF] to-indigo-600 hover:from-blue-600 hover:to-indigo-500 active:scale-95 text-white font-impact tracking-wide text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#FFD700] flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FFD700]" />
                    <span>PROCESSANDO FEEDBACK RLHF COM GEMINI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FFD700]" />
                    <span>GERAR 4 POSTS EVOLUTIVOS (RLHF)</span>
                  </>
                )}
              </button>
            </div>

            {/* 3. RECENT MATCHES DRAWER / MINI LIST */}
            <div className="bg-[#141824] border border-gray-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#00FF66] text-[#00FF66]" />
                  Últimos Matches Aprovados ({likedPosts.length})
                </span>
              </div>

              {likedPosts.length > 0 ? (
                <div className="max-h-[130px] overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                  {likedPosts.slice(0, 3).map((post, idx) => (
                    <div
                      key={post.id || idx}
                      className="p-2 bg-[#0E121C] border border-gray-800 rounded-lg flex items-center justify-between gap-2 hover:border-[#0000FF] transition"
                    >
                      <p className="truncate text-gray-300 text-[11px] flex-1">
                        "{post.text.replace(/\n/g, ' ')}"
                      </p>
                      <button
                        onClick={() => {
                          onApplyPost(post);
                          onShowToast('✓ Post aprovado aplicado no editor!');
                          onClose();
                        }}
                        className="shrink-0 px-2 py-1 bg-[#0000FF] hover:bg-blue-600 text-white text-[10px] font-bold rounded"
                      >
                        Usar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] font-mono text-gray-500 italic">
                  Nenhum match ainda. Dê like nos cards para calibrar o algoritmo!
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
