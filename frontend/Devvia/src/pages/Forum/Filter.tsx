import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * INTERFAZ DE PROPS
 */
interface FilterProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

/**
 * COMPONENTE DE FILTRO PARA EL FORO (Refactorizado a Componente Funcional)
 * 
 * Proporciona una barra de búsqueda en tiempo real para filtrar publicaciones.
 */
export const Filter: React.FC<FilterProps> = ({ onSearch, searchQuery }) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4 mb-10 relative">
      <div className="relative flex-1 group">
        <Search 
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
          size={20} 
        />
        <input 
          type="text" 
          placeholder={t('FORUM.UI.SEARCH_PLACEHOLDER')} 
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] pl-16 pr-6 py-4 outline-none focus:border-blue-500 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none text-slate-900 dark:text-white font-medium" 
        />
      </div>
      <button className="hidden sm:flex px-8 py-4 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 font-bold text-slate-600 dark:text-white/70 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none items-center gap-2">
        {t('FORUM.UI.FILTER_BTN')}
      </button>
    </div>
  );
};
