import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from './Icon';

/**
 * COMPONENTE: Footer
 * 
 * Pie de página global de la aplicación.
 * Refactorizado a componente funcional utilizando el hook useTranslation.
 */
export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-white/10 pt-16 pb-10 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Logo & Slogan */}
          <div className="lg:col-span-2">
            <h3 className="font-logo text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-2">
              <Icon name="rocket" size={32} />
              Devvia
            </h3>
            <p className="font-body text-base opacity-70 max-w-sm mb-8 leading-relaxed">
              {t('HOME.FOOTER.SLOGAN')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-300 dark:border-white/10">
                <Icon name="github" size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-300 dark:border-white/10">
                <Icon name="twitter" size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-300 dark:border-white/10">
                <Icon name="linkedin" size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-300 dark:border-white/10">
                <Icon name="instagram" size={20} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-headings font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">{t('HOME.FOOTER.PLATFORM')}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="/catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.CATALOG')}</a></li>
              <li><a href="/portal" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.JOBS')}</a></li>
              <li><a href="/forum" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.COMMUNITY')}</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-headings font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">{t('HOME.FOOTER.RESOURCES')}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.BLOG')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.DOCS')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.HELP')}</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-headings font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">{t('HOME.FOOTER.LEGAL')}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.TERMS')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('HOME.FOOTER.PRIVACY')}</a></li>
            </ul>
          </div>

        </div>

        {/* Newsletter Section */}
        <div className="border-y border-slate-200 dark:border-white/10 py-12 mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center lg:text-left">
            <h4 className="font-headings text-xl font-bold text-slate-900 dark:text-white mb-2">{t('HOME.FOOTER.NEWSLETTER')}</h4>
            <p className="text-sm opacity-60">{t('HOME.FOOTER.NEWSLETTER_DESC')}</p>
          </div>
          <form className="flex w-full max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="email@example.com" 
              className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all whitespace-nowrap">
              {t('HOME.FOOTER.SUBSCRIBE')}
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 text-xs opacity-50 font-body">
          <p>© {currentYear} Devvia. {t('HOME.FOOTER.COPYRIGHT')}</p>
          <div className="flex items-center gap-2">
            <span>{t('HOME.FOOTER.DEVELOPED')}</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Ag Studio's</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
