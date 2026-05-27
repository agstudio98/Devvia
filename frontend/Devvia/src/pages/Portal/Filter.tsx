import React, { useState } from 'react';
import { Search, MapPin, Tag, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * INTERFAZ DE PROPS
 */
interface FilterProps {
  categories: Record<string, string[]>;
  locations: string[];
  onFilterChange: (query: string, location: string, tags: string[]) => void;
  onClose?: () => void;
}

/**
 * COMPONENTE DE FILTROS PARA EL PORTAL DE EMPLEO (Refactorizado a Componente Funcional)
 * 
 * Permite filtrar empleos por texto, ubicación y etiquetas (tecnologías).
 * Organiza las etiquetas en categorías expandibles.
 */
export const Filter: React.FC<FilterProps> = ({ 
  categories = {}, 
  locations = [], 
  onFilterChange, 
  onClose 
}) => {
  const { t } = useTranslation();

  // ESTADOS LOCALES
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    Object.keys(categories).slice(0, 1) // Iniciamos con la primera categoría expandida
  );

  /**
   * NOTIFICAR CAMBIOS AL COMPONENTE PADRE
   */
  const emitChange = (q: string, l: string, tags: string[]) => {
    onFilterChange(q, l, tags);
  };

  /**
   * MANEJADORES DE ENTRADA
   */
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    emitChange(value, location, selectedTags);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocation(value);
    emitChange(query, value, selectedTags);
  };

  /**
   * SELECCIONAR / DESELECCIONAR ETIQUETAS
   */
  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag) 
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    emitChange(query, location, newTags);
  };

  /**
   * EXPANDIR / COLAPSAR CATEGORÍAS DE ETIQUETAS
   */
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  /**
   * REINICIAR TODOS LOS FILTROS
   */
  const resetFilters = () => {
    setQuery('');
    setLocation('');
    setSelectedTags([]);
    emitChange('', '', []);
  };

  return (
    <div className="space-y-8 bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl shadow-xl">
      {/* Cabecera Mobile */}
      <div className="flex items-center justify-between lg:hidden mb-2">
        <h2 className="text-xl font-headings font-bold">{t('PORTAL.FILTERS.TITLE')}</h2>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Búsqueda por Texto */}
      <div>
        <h3 className="font-headings font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <Search size={18} className="text-blue-400" /> {t('PORTAL.FILTERS.SEARCH')}
        </h3>
        <div className="relative">
          <input 
            type="text" 
            value={query}
            onChange={handleQueryChange}
            placeholder={t('PORTAL.FILTERS.SEARCH_PLACEHOLDER')} 
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-4 py-3 outline-none focus:border-blue-400 transition-all text-sm text-slate-900 dark:text-white" 
          />
        </div>
      </div>

      {/* Selector de Ubicación */}
      <div>
        <h3 className="font-headings font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <MapPin size={18} className="text-emerald-400" /> {t('PORTAL.FILTERS.LOCATION')}
        </h3>
        <select 
          value={location}
          onChange={handleLocationChange}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-400 transition-all text-sm appearance-none cursor-pointer text-slate-900 dark:text-white"
        >
          <option value="" className="bg-white dark:bg-slate-900">{t('PORTAL.FILTERS.ALL_LOCATIONS')}</option>
          {locations.map(loc => (
            <option key={loc} value={loc} className="bg-white dark:bg-slate-900">{loc}</option>
          ))}
        </select>
      </div>

      {/* Etiquetas / Tecnologías */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headings font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
            <Tag size={18} className="text-purple-400" /> {t('PORTAL.FILTERS.TAGS')}
          </h3>
          {selectedTags.length > 0 && (
            <button 
              onClick={resetFilters}
              className="text-[10px] uppercase tracking-widest font-bold text-blue-400 hover:text-white transition-colors"
            >
              {t('PORTAL.FILTERS.CLEAR')}
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {Object.entries(categories).map(([cat, tags]) => (
            <div key={cat} className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
              <button 
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all"
              >
                <span className="text-sm font-bold opacity-80 text-slate-900 dark:text-white">{cat}</span>
                {expandedCategories.includes(cat) ? <ChevronUp size={16} /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>
              
              {expandedCategories.includes(cat) && (
                <div className="p-4 flex flex-wrap gap-1.5 animate-in slide-in-from-top-2 duration-200">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all border ${
                        selectedTags.includes(tag)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-400 opacity-60 hover:opacity-100 text-slate-600 dark:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Etiquetas Seleccionadas (Badge list) */}
      {selectedTags.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-white/10">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold">
                {tag} <X size={12} className="cursor-pointer" onClick={() => toggleTag(tag)} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botón Aplicar (Solo visible en mobile) */}
      <div className="lg:hidden pt-4">
        <button 
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          {t('PORTAL.FILTERS.VIEW_RESULTS')}
        </button>
      </div>
    </div>
  );
};
