import React from 'react';
import { Icon } from './Icon';

/**
 * COMPONENTE: Support (Flotante)
 * 
 * Botón flotante persistente en toda la aplicación que redirige a la página de soporte.
 * Refactorizado a componente funcional.
 */
export const Support: React.FC = () => {
  return (
    <a 
      href="/support"
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 group border border-white/20"
      title="Soporte y Ayuda"
    >
      <Icon 
        name="headset" 
        className="text-white group-hover:rotate-12 transition-transform" 
        size={28} 
      />
    </a>
  );
};
