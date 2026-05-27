import React from 'react';
import { withTranslation } from 'react-i18next';
import type { WithTranslation } from 'react-i18next';
import { Icon } from '../../components/Icon';
import { Users, Star } from 'lucide-react';

/**
 * COMPONENTE WHO (REFACTORIZADO)
 * 
 * Presenta la identidad, misión y esencia de Devvia.
 * Totalmente internacionalizado para soportar múltiples idiomas.
 */
class WhoComponent extends React.Component<WithTranslation> {
  render() {
    const { t } = this.props;
    
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 px-6 py-20 transition-colors duration-300">
        
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna Visual */}
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition duration-1000"></div>
            
            <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-sm bg-white/5">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt={t('HOME.WHO.IMAGE_ALT')} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              
              {/* Insignia con estadísticas */}
              <div className="absolute bottom-8 right-8 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-1000 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">+500</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('HOME.WHO.STATS.COMMUNITY')}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-emerald-500/20 dark:border-emerald-500/30 rounded-tl-3xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-blue-500/20 dark:border-blue-500/30 rounded-br-3xl"></div>
          </div>

          {/* Columna de Texto */}
          <div className="order-1 lg:order-2 space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold tracking-wider uppercase mb-6">
                {t('HOME.WHO.BADGE')}
              </span>
              <h2 className="font-headings text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-none mb-8">
                {t('HOME.WHO.TITLE')}
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"></div>
            </div>

            <div className="space-y-6">
              <p className="font-body text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                {t('HOME.WHO.DESC')}
              </p>
              
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md relative overflow-hidden group hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity text-slate-900 dark:text-white">
                  <Star size={60} />
                </div>
                <p className="font-body text-lg text-slate-600 dark:text-slate-400 leading-relaxed italic relative z-10">
                  "{t('HOME.WHO.MISSION')}"
                </p>
              </div>
            </div>

            {/* Estadísticas Clave */}
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <p className="text-3xl font-black text-slate-900 dark:text-white">100%</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold">{t('HOME.WHO.STATS.COMMITMENT')}</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{t('HOME.WHO.STATS.GLOBAL_VAL')}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold">{t('HOME.WHO.STATS.REACH')}</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  }
}

export const Who = withTranslation()(WhoComponent);
