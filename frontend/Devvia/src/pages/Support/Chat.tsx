import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, Loader2, Sparkles, RefreshCcw, 
  HelpCircle, Bot, User, MessageSquare
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';

/**
 * COMPONENTE DE CHAT
 * 
 * Interfaz de soporte minimalista centrada en navegación fluida e IA.
 */
export const Chat: React.FC = () => {
  const { t } = useTranslation();
  const { chat, loading, options, showInput, sendMessage, resetChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chat, loading]);

  /**
   * Renderiza el texto de forma segura, traduciendo si es una key de i18n
   */
  const renderMessageText = (text: string) => {
    if (!text) return "";
    try {
      return text.startsWith('SUPPORT_BOT.') ? t(text) : text;
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0a0b14] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl relative">
      
      {/* HEADER DEL BOT */}
      <div className="p-8 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between relative z-10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Bot size={32} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-[#0a0b14] rounded-full"></div>
          </div>
          <div>
            <h2 className="font-headings font-black text-slate-900 dark:text-white uppercase tracking-tighter italic text-xl">
              {t('SUPPORT_BOT.ASSISTANT_NAME')}
            </h2>
            <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1.5">
              <MessageSquare size={10} /> {t('SUPPORT_BOT.STATUS_ONLINE')}
            </p>
          </div>
        </div>
        
        <button 
          onClick={resetChat}
          className="p-3 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 rounded-xl transition-all text-slate-400 dark:text-white/20 active:scale-90 flex items-center gap-2 group"
          title={t('SUPPORT_BOT.RESET_CHAT')}
        >
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
             {t('SUPPORT_BOT.RESET_CHAT')}
          </span>
          <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-blue-500/10"
      >
        {Array.isArray(chat) && chat.map((msg, i) => {
          if (!msg) return null;
          return (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white' : 'bg-blue-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>

                <div className={`p-6 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-white/5 text-slate-700 dark:text-blue-100/80 border border-slate-100 dark:border-white/5 rounded-tl-none'
                }`}>
                  {renderMessageText(msg.text)}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase text-slate-400 tracking-widest">
              <Loader2 className="animate-spin" size={14} />
              {t('SUPPORT_BOT.THINKING')}
            </div>
          </div>
        )}

        {/* ETIQUETAS SUGERIDAS */}
        {!loading && Array.isArray(options) && options.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4 animate-in fade-in slide-in-from-left-4 duration-700">
             <div className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                <HelpCircle size={12} /> {t('SUPPORT_BOT.CHOOSE_OPTION')}
             </div>
             {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => sendMessage(opt, true)}
                  className="px-6 py-3 bg-white dark:bg-white/5 hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black transition-all shadow-sm hover:shadow-blue-500/20 hover:scale-105 active:scale-95 flex items-center gap-2 dark:text-white"
                >
                  {t(`SUPPORT_BOT.OPTIONS.${opt}`)}
                </button>
             ))}
          </div>
        )}
      </div>

      {/* INPUT INTELIGENTE */}
      {showInput && (
        <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-white/[0.01]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as any).message;
              if (input && input.value && input.value.trim()) {
                sendMessage(input.value);
                input.value = '';
              }
            }}
            className="flex gap-4"
          >
            <input 
              name="message"
              type="text" 
              placeholder={t('SUPPORT_BOT.PLACEHOLDER')}
              autoComplete="off"
              className="flex-1 px-8 py-5 rounded-[1.5rem] bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 ring-blue-500/50 transition-all dark:text-white font-bold"
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-16 h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl shadow-blue-500/20 transition-all active:scale-90 disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.05] pointer-events-none -z-0">
         <Bot size={400} />
      </div>

    </div>
  );
};
