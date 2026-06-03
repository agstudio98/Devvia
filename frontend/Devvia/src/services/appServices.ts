import apiClient from './apiClient';

/**
 * SERVICIOS DE APLICACIÓN (REFINADOS)
 * 
 * Se han simplificado para trabajar con el interceptor que desempaqueta
 * automáticamente el payload 'data' del servidor.
 */

export const supportService = {
  chat: (payload: { mensaje: string, isOption: boolean }) => 
    apiClient.post('/support/chat', payload)
};

export const userService = {
  login: (credentials: any) => 
    apiClient.post('/users/login', credentials),
  register: (userData: any) => 
    apiClient.post('/users/register', userData),
  getProfile: () => 
    apiClient.get('/users/profile'),
  updateProfile: (data: any) => 
    apiClient.put('/users/profile', data),
  googleLogin: (profile: any) => 
    apiClient.post('/users/google-login', { profile })
};

export const forumService = {
  getPosts: () => 
    apiClient.get('/forum'),
  getPostDetails: (id: string) => 
    apiClient.get(`/forum/${id}`),
  createPost: (postData: any) =>
    apiClient.post('/forum', postData),
  updatePost: (id: string, postData: any) =>
    apiClient.put(`/forum/${id}`, postData),
  deletePost: (id: string) =>
    apiClient.delete(`/forum/${id}`),
  addComment: (commentData: any) => 
    apiClient.post('/forum/comment', commentData),
  updateComment: (id: string, text: string) => 
    apiClient.put(`/forum/comment/${id}`, { text }),
  deleteComment: (id: string) => 
    apiClient.delete(`/forum/comment/${id}`),
  ratePost: (id: string, stars: number) => 
    apiClient.post(`/forum/rate/${id}`, { stars })
};

export const projectService = {
  getAll: () => 
    apiClient.get('/projects'),
  getById: (id: string) => 
    apiClient.get(`/projects/${id}`),
  create: (formData: FormData) => 
    apiClient.post('/projects', formData),
  update: (id: string, data: any) => 
    apiClient.put(`/projects/${id}`, data),
  remove: (id: string) => 
    apiClient.delete(`/projects/${id}`),
  downloadZip: (id: string) => 
    apiClient.get(`/projects/${id}/download`, { responseType: 'blob' })
};

export const productService = {
  getAll: () => 
    apiClient.get('/products'),
  create: (productData: any) => 
    apiClient.post('/products', productData)
};

export const orderService = {
  apply: (data: any) => 
    apiClient.post('/orders/apply', data),
  getMyOrders: () => 
    apiClient.get('/orders/my-orders'),
  deleteOrder: (id: string) => 
    apiClient.delete(`/orders/${id}`)
};

/**
 * SERVICIO DE EMPLEOS (PORTAL DE TALENTO)
 */
export const jobService = {
  getAll: () => 
    apiClient.get('/jobs'),
  getById: (id: string) => 
    apiClient.get(`/jobs/${id}`)
};
