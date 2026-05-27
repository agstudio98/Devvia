import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../components/Icon';
import { X, Calendar, Clock, User, Star, MapPin, ChevronRight } from 'lucide-react';

/**
 * COMPONENTE EVENTS (REFACTORIZADO A FUNCIONAL)
 * 
 * Este componente gestiona la sección de eventos próximos.
 * Incluye un modal detallado con información de fecha, hora y descripción,
 * totalmente traducido para soportar múltiples idiomas.
 */
export const Events: React.FC = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedProject] = useState<any | null>(null);

  // Datos de los eventos vinculados a las llaves de traducción
  const events = [
    { id: 'E1', key: 'HOME.EVENTS_SECTION.DATA.E1' },
    { id: 'E2', key: 'HOME.EVENTS_SECTION.DATA.E2' },
    { id: 'E3', key: 'HOME.EVENTS_SECTION.DATA.E3' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 px-6 py-20 transition-colors duration-300 border-y border-slate-200 dark:border-white/5">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Encabezado */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-bold tracking-wider uppercase mb-6">
            {t('HOME.EVENTS_SECTION.BADGE')}
          </span>
          <h2 className="font-headings text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6">
            {t('HOME.EVENTS')}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
        </div>

        {/* Grilla de eventos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((e, i) => {
            const data = t(e.key, { returnObjects: true }) as any;
            return (
              <div 
                key={e.id} 
                className="group relative p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:bg-white dark:hover:bg-white/10 transition-all duration-500 shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:border-purple-500/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <span className="text-xl font-black text-purple-500 dark:text-purple-400 leading-none">{data.DATE.split(' ')[0]}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">{data.DATE.split(' ')[1]}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                      {data.TYPE}
                    </span>
                  </div>

                  <h3 className="font-headings text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                    {data.TITLE}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-8 opacity-60 dark:opacity-40">
                    <User size={16} className="text-purple-500" />
                    <p className="text-sm font-medium">{t('HOME.EVENTS_SECTION.BY')} {data.HOST}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProject(data)}
                  className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white/10 hover:bg-purple-500 dark:hover:bg-purple-500 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  {t('HOME.EVENTS_SECTION.JOIN')}
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <button className="text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 font-bold transition-colors flex items-center gap-2 mx-auto uppercase tracking-widest text-xs">
            {t('HOME.EVENTS_SECTION.CALENDAR')}
            <Icon name="layout-grid" size={16} />
          </button>
        </div>
      </div>

      {/* Modal de Detalle de Evento */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header del Modal */}
            <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600 p-8 flex items-end">
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                   <Star size={32} fill="currentColor" className="text-yellow-300" />
                </div>
                <h2 className="text-2xl font-headings font-black text-white leading-tight">
                  {t('HOME.EVENTS_SECTION.MODAL.TITLE')}
                </h2>
              </div>
            </div>

            <div className="p-10">
              <h3 className="text-3xl font-headings font-bold text-slate-900 dark:text-white mb-6">
                {selectedEvent.TITLE}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('HOME.EVENTS_SECTION.MODAL.DATE_LABEL')}</p>
                    <p className="font-bold text-slate-700 dark:text-white">{selectedEvent.FULL_DATE}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('HOME.EVENTS_SECTION.MODAL.TIME_LABEL')}</p>
                    <p className="font-bold text-slate-700 dark:text-white">{selectedEvent.TIME}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('HOME.EVENTS_SECTION.MODAL.HOST_LABEL')}</p>
                    <p className="font-bold text-slate-700 dark:text-white">{selectedEvent.HOST}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('HOME.EVENTS_SECTION.MODAL.TYPE_LABEL')}</p>
                    <p className="font-bold text-slate-700 dark:text-white">{selectedEvent.TYPE}</p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{t('HOME.EVENTS_SECTION.MODAL.INFO')}</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedEvent.DESC}
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-2xl font-bold transition-all border border-slate-200 dark:border-white/10"
                >
                  {t('HOME.EVENTS_SECTION.MODAL.CLOSE')}
                </button>
                <button 
                  className="flex-[2] py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                >
                  {t('HOME.EVENTS_SECTION.MODAL.REGISTER')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
