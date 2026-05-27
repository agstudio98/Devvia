import React from 'react';
import { withTranslation } from 'react-i18next';
import type { WithTranslation } from 'react-i18next';
import { Icon } from '../../components/Icon';

/**
 * Clase SlogansComponent
 * Responsabilidad: Renderizar una sección de beneficios o "slogans" que destacan las características clave de la plataforma.
 * Muestra tres pilares fundamentales utilizando iconos y textos descriptivos.
 */
class SlogansComponent extends React.Component<WithTranslation> {
  /**
   * Método render
   * Define la estructura visual de la sección de slogans.
   */
  render() {
    const { t } = this.props;
    
    // Estructura de datos para los slogans, extrayendo las traducciones correspondientes.
    const slogans: { icon: 'rocket' | 'users' | 'briefcase', title: string, desc: string }[] = [
      { icon: 'rocket', title: t('HOME.SLOGANS.S1.TITLE'), desc: t('HOME.SLOGANS.S1.DESC') },
      { icon: 'users', title: t('HOME.SLOGANS.S2.TITLE'), desc: t('HOME.SLOGANS.S2.DESC') },
      { icon: 'briefcase', title: t('HOME.SLOGANS.S3.TITLE'), desc: t('HOME.SLOGANS.S3.DESC') }
    ];

    return (
      <section className="py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Mapeo de los slogans para renderizar cada tarjeta informativa */}
        {slogans.map((s, i) => (
          <div 
            key={i} 
            // Tarjeta con efecto de desenfoque de fondo y transición en hover
            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all text-center group"
          >
            {/* Contenedor del icono con efecto de escalado en hover */}
            <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Icon name={s.icon} size={32} className="text-blue-400" />
            </div>
            {/* Título y descripción del slogan */}
            <h3 className="font-headings text-xl font-bold mb-2">{s.title}</h3>
            <p className="font-body text-sm opacity-60">{s.desc}</p>
          </div>
        ))}
      </section>
    );
  }
}

/**
 * Exportación del componente envuelto en withTranslation para soporte multi-idioma.
 */
export const Slogans = withTranslation()(SlogansComponent);


