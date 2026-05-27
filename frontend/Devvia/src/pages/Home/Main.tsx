import React from 'react';
import { withTranslation } from 'react-i18next';
import type { WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';

/**
 * Clase MainComponent
 * Responsabilidad: Renderizar la sección Hero (principal) de la página de inicio.
 * Esta sección es la primera impresión del usuario y debe comunicar la propuesta de valor de Devvia.
 * Utiliza una estética moderna con gradientes, desenfoques y animaciones sutiles.
 */
class MainComponent extends React.Component<WithTranslation> {
  /**
   * Método render
   * Define la estructura visual de la sección Hero.
   */
  render() {
    const { t } = this.props;
    
    return (
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 px-6 transition-colors duration-300">
        
        {/* Elementos decorativos de fondo: Grilla y luces radiales */}
        <div className="absolute inset-0 z-0">
          {/* Grilla sutil que aporta textura visual */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Fondos radiales brillantes (Glows) para dar profundidad y color */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Contenido principal centrado */}
        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          
          {/* Bloque del Logo Hero con animaciones de entrada */}
          <div className="group relative mb-12 animate-in fade-in zoom-in duration-1000">
            {/* Brillo de fondo del logo que reacciona al cursor (hover) */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-10 dark:opacity-25 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex flex-col items-center text-center">
              {/* Contenedor del icono del logo */}
              <div className="mb-8 p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-xl group-hover:border-blue-500/50 transition-all duration-500">
                <div className="relative">
                  <Icon name="rocket" size={80} className="text-blue-500 dark:text-blue-400 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" />
                  {/* Icono decorativo secundario con animación de pulso */}
                  <div className="absolute -top-2 -right-2">
                    <Icon name="star" size={32} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Logo textual con gradiente personalizado */}
              <h1 className="font-logo text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white">
                Dev
                <span className="bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-500 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  via
                </span>
              </h1>
              
              {/* Línea de subrayado animada y estilizada */}
              <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full mt-4 blur-[1px]"></div>
            </div>
          </div>

          {/* Slogan y Propuesta de Valor */}
          <div className="text-center space-y-8 max-w-2xl animate-in slide-in-from-bottom-10 duration-1000 delay-300">
            <p className="font-headings text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 leading-tight">
              {t('HOME.MAIN.SLOGAN')}
            </p>
            <p className="font-body text-lg text-slate-600 dark:text-slate-400 opacity-80 max-w-xl mx-auto">
              {t('HOME.MAIN.DESC')}
            </p>

            {/* Llamadas a la acción (CTAs) */}
            <div className="flex items-center justify-center pt-8">
              {/* Botón: Explorar Catálogo */}
              <Link 
                to="/catalog"
                className="px-12 py-5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-headings font-bold text-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 group"
              >
                {t('HOME.MAIN.EXPLORE')}
                <Icon name="layout-grid" size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Indicador de scroll sutil en la parte inferior */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-400 to-transparent"></div>
        </div>
      </section>
    );
  }
}

/**
 * Exportación del componente envuelto en withTranslation para soporte multi-idioma.
 */
export const Main = withTranslation()(MainComponent);
