import axios from 'axios';

/**
 * CLIENTE API BASE (REFINADO)
 * 
 * Gestiona la comunicación con el backend y desempaqueta automáticamente
 * las respuestas siguiendo el nuevo estándar del servidor.
 */

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de Respuesta
 * 
 * Si el servidor responde con el formato { success: true, data: ... },
 * este interceptor extrae automáticamente 'data' para que los componentes
 * no tengan que cambiar su lógica interna.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene nuestro formato estándar, devolvemos solo el payload
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
