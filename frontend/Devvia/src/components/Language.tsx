import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from './Icon';

/**
 * COMPONENTE: Language
 * 
 * Permite alternar el idioma de la aplicación entre Español e Inglés.
 * Refactorizado a componente funcional con useTranslation.
 */
export const Language: React.FC = () => {
  const { i18n } = useTranslation();

  /**
   * Cambia el idioma actual.
   */
  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      onClick={changeLanguage}
      className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors group"
      title="Cambiar Idioma"
    >
      <Icon 
        name="languages" 
        size={20} 
        className="text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors" 
      />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {i18n.language}
      </span>
    </button>
  );
};
