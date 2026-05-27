import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from './Forum/Filter';
import { ForumMain } from './Forum/Main';

/**
 * INTERFAZ DE PROPIEDADES
 */
interface Props {
  isLoggedIn: boolean;
  user: any;
}

/**
 * COMPONENTE FORUM (Orquestador de la Comunidad)
 * 
 * Gestiona el estado de búsqueda y distribuye la lógica entre Filter y ForumMain.
 * Refactorizado a Componente Funcional para mayor consistencia.
 */
export const Forum: React.FC<Props> = ({ isLoggedIn, user }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Encabezado dinámico */}
      <div className="mb-10">
        <h1 className="font-headings text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {t('FORUM.UI.TITLE')}
        </h1>
        <p className="text-slate-500 dark:text-white/40 font-medium">
          {t('FORUM.UI.SUBTITLE')}
        </p>
      </div>
      
      {/* Barra de Búsqueda */}
      <Filter 
        onSearch={setSearchQuery} 
        searchQuery={searchQuery} 
      />
      
      {/* Listado de Publicaciones */}
      <ForumMain 
        searchQuery={searchQuery}
      />
    </div>
  );
};
