import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

/**
 * COMPONENTE: Mode
 * 
 * Permite alternar entre el modo claro y oscuro de la aplicación.
 * Refactorizado a componente funcional utilizando useState y useEffect.
 */
export const Mode: React.FC = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  /**
   * Sincroniza la clase 'dark' en el elemento raíz del documento.
   */
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  /**
   * Alterna el estado del modo oscuro.
   */
  const toggleMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button 
      onClick={toggleMode}
      className="p-2 rounded-full hover:bg-white/10 transition-colors"
      title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      <span className="text-xl">
        {isDark ? (
          <Icon name="sun" size={20} className="text-amber-400" />
        ) : (
          <Icon name="moon" size={20} className="text-slate-700" />
        )}
      </span>
    </button>
  );
};
