import React from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from './Language';
import { Mode } from './Mode';
import { Icon } from './Icon';

interface NavbarProps {
  isLoggedIn?: boolean;
  user?: any;
  onUserClick?: () => void;
}

/**
 * COMPONENTE: Navbar
 * 
 * Barra de navegación principal de la aplicación.
 * Refactorizado a componente funcional con useTranslation.
 */
export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, user, onUserClick }) => {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border-b border-white/20 px-4 py-3 flex items-center justify-between">
      {/* Logo y Navegación Principal */}
      <div className="flex items-center gap-4 md:gap-8">
        <a href="/" className="font-logo text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Devvia
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="/catalog" className="font-headings flex items-center gap-2 hover:text-blue-400 transition-colors">
            <Icon name="layout-grid" size={18} /> {t('NAV.CATALOG')}
          </a>
          <a href="/forum" className="font-headings flex items-center gap-2 hover:text-blue-400 transition-colors">
            <Icon name="message-square" size={18} /> {t('NAV.COMMUNITY')}
          </a>
          <a href="/portal" className="font-headings flex items-center gap-2 hover:text-blue-400 transition-colors">
            <Icon name="briefcase" size={18} /> {t('NAV.PORTAL')}
          </a>
        </div>

        {/* Mobile quick links */}
        <div className="flex lg:hidden items-center gap-4 opacity-70">
          <a href="/catalog" title={t('NAV.CATALOG')}><Icon name="layout-grid" size={20} /></a>
          <a href="/forum" title={t('NAV.COMMUNITY')}><Icon name="message-square" size={20} /></a>
          <a href="/portal" title={t('NAV.PORTAL')}><Icon name="briefcase" size={20} /></a>
        </div>
      </div>

      {/* Herramientas (Idioma, Modo) y Usuario */}
      <div className="flex items-center gap-2 md:gap-4">
        <Language />
        <Mode />
        
        {/* Botón de Perfil / Login */}
        <button 
          onClick={onUserClick}
          className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        >
          <span className="hidden sm:inline font-body text-sm font-semibold text-slate-900 dark:text-white">
            {isLoggedIn ? (user?.nombre || user?.email?.split('@')[0] || 'Usuario') : t('NAV.LOGIN')}
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shadow-blue-500/20">
            {isLoggedIn && user?.avatar ? (
              <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              <Icon name="user" size={18} className="text-white" />
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};
