import apiClient from './apiClient';

/**
 * SERVICIOS DE APLICACIÓN (REFINADOS)
 * 
 * Se han simplificado para trabajar con el interceptor que desempaqueta
 * automáticamente el payload 'data' del servidor.
 */

export const supportService = {
  chat: (payload: { mensaje: string, isOption: boolean }) => 
    apiClient.post('/api/support/chat', payload)
};

export const userService = {
  login: (credentials: any) => 
    apiClient.post('/api/users/login', credentials),
  register: (userData: any) => 
    apiClient.post('/api/users/register', userData),
  getProfile: () => 
    apiClient.get('/api/users/profile'),
  updateProfile: (data: any) => 
    apiClient.put('/api/users/profile', data),
  googleLogin: (profile: any) => 
    apiClient.post('/api/users/google-login', { profile })
};

export const forumService = {
  getPosts: () => 
    apiClient.get('/api/v1/forum'),
  getPostDetails: (id: string) => 
    apiClient.get(`/api/v1/forum/${id}`),
  createPost: (postData: any) =>
    apiClient.post('/api/v1/forum', postData),
  updatePost: (id: string, postData: any) =>
    apiClient.put(`/api/v1/forum/${id}`, postData),
  deletePost: (id: string) =>
    apiClient.delete(`/api/v1/forum/${id}`),
  addComment: (commentData: any) => 
    apiClient.post('/api/v1/forum/comment', commentData),
  updateComment: (id: string, text: string) => 
    apiClient.put(`/api/v1/forum/comment/${id}`, { text }),
  deleteComment: (id: string) => 
    apiClient.delete(`/api/v1/forum/comment/${id}`),
  ratePost: (id: string, stars: number) => 
    apiClient.post(`/api/v1/forum/rate/${id}`, { stars })
};

export const projectService = {
  getAll: () => 
    apiClient.get('/api/v1/projects'),
  getById: (id: string) => 
    apiClient.get(`/api/v1/projects/${id}`),
  create: (formData: FormData) => 
    apiClient.post('/api/v1/projects', formData),
  update: (id: string, data: any) => 
    apiClient.put(`/api/v1/projects/${id}`, data),
  remove: (id: string) => 
    apiClient.delete(`/api/v1/projects/${id}`),
  downloadZip: (id: string) => 
    apiClient.get(`/api/v1/projects/${id}/download`, { responseType: 'blob' })
};

export const productService = {
  getAll: () => 
    apiClient.get('/api/products'),
  create: (productData: any) => 
    apiClient.post('/api/products', productData)
};

export const orderService = {
  apply: (data: any) => 
    apiClient.post('/api/orders/apply', data),
  getMyOrders: () => 
    apiClient.get('/api/orders/my-orders'),
  deleteOrder: (id: string) => 
    apiClient.delete(`/api/orders/${id}`)
};

/**
 * SERVICIO DE EMPLEOS (PORTAL DE TALENTO)
 */
export const jobService = {
  getAll: () => 
    apiClient.get('/api/jobs'),
  getById: (id: string) => 
    apiClient.get(`/api/jobs/${id}`)
};
