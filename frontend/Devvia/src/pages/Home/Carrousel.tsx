import React from 'react';
import { withTranslation } from 'react-i18next';
import type { WithTranslation } from 'react-i18next';

/**
 * Interfaz State
 * Define la estructura del estado local del componente Carrousel.
 */
interface State {
  // Índice de la imagen que se está mostrando actualmente.
  current: number;
}

/**
 * Clase CarrouselComponent
 * Responsabilidad: Mostrar un carrusel de imágenes con rotación automática y soporte multi-idioma.
 * Utiliza componentes de clase para demostrar el manejo del ciclo de vida de React.
 */
class CarrouselComponent extends React.Component<WithTranslation, State> {
  // Inicialización del estado: empezamos con la primera imagen (índice 0).
  state: State = { current: 0 };
  
  // Referencia al intervalo de tiempo para poder limpiarlo al desmontar el componente.
  private interval: ReturnType<typeof setInterval> | undefined;
  
  // Lista de URLs de imágenes (provenientes de Unsplash) para el carrusel.
  images = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop"
  ];

  /**
   * Método componentDidMount
   * Se ejecuta después de que el componente se inserta en el DOM.
   * Aquí iniciamos el temporizador que cambiará la imagen cada 5 segundos.
   */
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(s => ({ current: (s.current + 1) % this.images.length }));
    }, 5000);
  }

  /**
   * Método componentWillUnmount
   * Se ejecuta justo antes de que el componente se destruya.
   * Es crucial limpiar el intervalo para evitar fugas de memoria y errores de actualización de estado.
   */
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * Método render
   * Define la estructura visual del carrusel.
   */
  render() {
    // Obtenemos la función de traducción 't' de las props proporcionadas por withTranslation.
    const { t } = this.props;
    
    return (
      <section className="py-20 px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Contenedor principal del carrusel con bordes redondeados y sombras */}
        <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          
          {/* Mapeo de las imágenes para renderizar cada slide */}
          {this.images.map((img, i) => (
            <div 
              key={i} 
              // Gestión de visibilidad mediante opacidad y transiciones suaves
              className={`absolute inset-0 transition-opacity duration-1000 ${i === this.state.current ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Imagen de fondo del slide */}
              <img src={img} className="w-full h-full object-cover" alt={t('HOME.CARROUSEL.ALT')} />
              
              {/* Overlay oscuro para mejorar la legibilidad del texto */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-12 text-center">
                <div className="max-w-xl">
                  {/* Título y descripción traducidos */}
                  <h3 className="font-logo text-3xl md:text-5xl font-bold mb-4 text-white">{t('HOME.CARROUSEL.TITLE')}</h3>
                  <p className="font-body text-lg text-white/80">
                    {t('HOME.CARROUSEL.DESC')}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Indicadores de posición (puntos inferiores) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {this.images.map((_, i) => (
              <div 
                key={i} 
                // Estilo dinámico para resaltar el indicador de la imagen actual
                className={`w-2 h-2 rounded-full transition-all ${i === this.state.current ? 'bg-white w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
}

/**
 * Exportación del componente envuelto en withTranslation
 * HOC (Higher-Order Component) que inyecta las capacidades de traducción en CarrouselComponent.
 */
export const Carrousel = withTranslation()(CarrouselComponent);

