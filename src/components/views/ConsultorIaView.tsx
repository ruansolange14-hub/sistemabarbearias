import React, { useState, useRef, useEffect } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Bot,
  Sparkles,
  Send,
  User,
  Clock,
  ArrowRight,
  TrendingUp,
  Scissors,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const ConsultorIaView: React.FC = () => {
  const { config, chatMessages, sendChatMessage, isGeneratingAi } = useBarber();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isGeneratingAi]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isGeneratingAi) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendChatMessage(msg);
  };

  const quickPrompts = [
    'Como preencher os 21 horários vagos de amanhã?',
    'Qual o melhor pacote promocional para o meio de semana?',
    'Como aumentar o ticket médio dos clientes de barba?',
    'Analisar minhas metas financeiras deste mês',
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16 flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#161a25] border border-[#242c3f] p-4 rounded-xl flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center text-white shadow-md shadow-blue-950/40 border border-blue-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-white">
                Consultor IA
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              analisa os dados da sua barbearia em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#121622] border border-[#222a3d] px-3 py-1.5 rounded-xl">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white">
            {config.tokensIA}{' '}
            <span className="text-slate-400 font-normal">tokens</span>
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-[#131722] border border-[#232a3d] rounded-2xl p-4 md:p-6 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isUser
                    ? 'bg-blue-700 text-white'
                    : 'bg-gradient-to-br from-blue-700 to-blue-950 text-white border border-blue-600/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-blue-700 text-white font-medium rounded-tr-none'
                    : 'bg-[#182133] text-slate-200 border border-blue-800/40 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.texto}</div>
                <span
                  className={`text-[10px] block mt-2 ${
                    isUser ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isGeneratingAi && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center text-white text-xs border border-blue-600/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#182133] border border-blue-800/40 rounded-2xl rounded-tl-none p-4 text-xs text-blue-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Consultor analisando dados da Barbearia do manel...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              setInputMessage(prompt);
            }}
            className="text-[11px] bg-[#161a25] hover:bg-[#1f2638] text-slate-300 hover:text-blue-300 border border-[#242c3f] hover:border-blue-700/50 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all shadow-2xs flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form matching exact user prompt */}
      <div className="flex-shrink-0 space-y-1.5">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ou escreva sua pergunta..."
            className="w-full bg-[#161a25] border border-[#242c3f] focus:border-blue-500 rounded-xl pl-4 pr-12 py-3 text-xs md:text-sm text-white placeholder-slate-400 shadow-sm focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isGeneratingAi}
            className="absolute right-2 p-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-blue-700 text-white rounded-lg transition-all"
            title="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[11px] text-slate-500 text-center">
          Análises: <strong className="text-slate-400">2 tokens</strong> · Dúvidas sobre a plataforma: <strong className="text-emerald-400 font-normal">grátis</strong>
        </div>
      </div>
    </div>
  );
};
