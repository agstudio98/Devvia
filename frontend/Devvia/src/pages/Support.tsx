import React from 'react';
import { Chat } from './Support/Chat';
import { useTranslation } from 'react-i18next';

/**
 * COMPONENTE SUPPORT PAGE (REDISEÑO TOTAL)
 * 
 * Se ha eliminado todo el sistema de filtros, historial de sesiones y reclamos.
 * Ahora la página se centra exclusivamente en la experiencia del Chatbot Inteligente.
 */
export const SupportPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 min-h-screen">
      {/* CABECERA */}
      <header className="mb-12 text-center">
        <h1 className="font-headings text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          {t('SUPPORT_BOT.HEADER')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
          {t('SUPPORT_BOT.SUBTITLE')}
        </p>
      </header>

      {/* CHATBOT INTELIGENTE (OCUPA TODO EL ANCHO) */}
      <div className="h-[700px]">
        <Chat />
      </div>
      
      {/* NOTA DE PIE (OPCIONAL) */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          {t('SUPPORT_BOT.ASSISTANT_NAME')} — Powered by AI
        </p>
      </div>
    </div>
  );
};
