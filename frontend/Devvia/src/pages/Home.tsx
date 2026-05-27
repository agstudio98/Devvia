import React from 'react';
import { Main } from './Home/Main';
import { Who } from './Home/Who';
import { Slogans } from './Home/Slogans';
import { Top } from './Home/Top';
import { Events } from './Home/Events';
import { Jobs } from './Home/Jobs';
import { Carrousel } from './Home/Carrousel';

/**
 * INTERFAZ DE PROPIEDADES
 * Define los datos necesarios que el componente padre debe proveer.
 * @property isLoggedIn - Indica si el usuario ha iniciado sesión.
 * @property user - Objeto que contiene la información del usuario actual.
 */
interface Props {
  isLoggedIn: boolean;
  user: any;
}

/**
 * COMPONENTE HOME (Orquestador de la Landing Page)
 * 
 * Este componente actúa como el contenedor principal de la página de inicio.
 * Su responsabilidad única (SRP) es la composición y disposición de las 
 * distintas secciones que conforman la experiencia del usuario al aterrizar.
 * 
 * Se ha convertido de Clase a Componente Funcional para alinearse con 
 * los estándares modernos de React y mejorar la legibilidad.
 */
export const Home: React.FC<Props> = ({ isLoggedIn, user }) => {
  /**
   * RENDERIZADO DEL COMPONENTE
   * Las secciones se presentan en un orden lógico para guiar al usuario
   * desde el mensaje principal (Hero) hasta las oportunidades laborales (Jobs).
   */
  return (
    <div className="animate-in fade-in duration-700">
      {/* Sección Hero y Bienvenida Principal */}
      <Main />
      
      {/* Mensajes Clave y Propuesta de Valor */}
      <Slogans />
      
      {/* Información sobre la Organización/Comunidad */}
      <Who />
      
      {/* Contenido Destacado o Tendencias */}
      <Top />
      
      {/* Carrusel de Imágenes o Logros */}
      <Carrousel />
      
      {/* Próximos Eventos y Noticias */}
      <Events />
      
      {/* Panel de Empleos: Requiere estado de sesión para interacciones */}
      <Jobs isLoggedIn={isLoggedIn} user={user} />
    </div>
  );
};
