// src/api/admin.js
import axiosInstance from './axiosConfig';

export const adminAPI = {
  // ============================================
  // AUTHENTIFICATION
  // ============================================
  
  login: (email, password, deviceName) => 
    axiosInstance.post('/auth/login', { email, password, device_name: deviceName }),
  
  logout: () => 
    axiosInstance.post('/auth/logout'),
  
  getMe: () => 
    axiosInstance.get('/auth/me'),

  // ============================================
  // GESTION DES UTILISATEURS
  // ============================================
  
  getUsers: (params) => 
    axiosInstance.get('/admin/users', { params }),
  
  getClients: () => 
    axiosInstance.get('/admin/users/clients'),
  
  getDrivers: () => 
    axiosInstance.get('/admin/users/drivers'),
  
  createUser: (data) => 
    axiosInstance.post('/admin/users', data),
  
  createDriver: (data) => 
    axiosInstance.post('/admin/users/drivers', data),
  
  getUser: (id) => 
    axiosInstance.get(`/admin/users/${id}`),
  
  updateUser: (id, data) => 
    axiosInstance.put(`/admin/users/${id}`, data),
  
  updateUserStatus: (id, data) => 
    axiosInstance.put(`/admin/users/${id}/status`, data),
  
  updateUserRole: (id, data) => 
    axiosInstance.put(`/admin/users/${id}/role`, data),
  
  deleteUser: (id) => 
    axiosInstance.delete(`/admin/users/${id}`),

  // ============================================
  // CHAUFFEURS EN ATTENTE
  // ============================================
  
  getPendingDrivers: () => 
    axiosInstance.get('/admin/pending-drivers'),
  
  approveDriver: (id, data) => 
    axiosInstance.post(`/admin/pending-drivers/${id}/approve`, data),
  
  rejectDriver: (id, data) => 
    axiosInstance.post(`/admin/pending-drivers/${id}/reject`, data),

  // ============================================
  // GESTION DES COURSES
  // ============================================
  
  getRides: (params) => 
    axiosInstance.get('/admin/rides', { params }),
  
  getRide: (id) => 
    axiosInstance.get(`/admin/rides/${id}`),
  
  updateRide: (id, data) => 
    axiosInstance.put(`/admin/rides/${id}`, data),

  // ============================================
  // STATISTIQUES GLOBALES
  // ============================================
  
  getOverviewStats: () => 
    axiosInstance.get('/admin/stats/overview'),
  
  getRevenueStats: (params) => 
    axiosInstance.get('/admin/stats/revenue', { params }),
  
  getRidesStats: (params) => 
    axiosInstance.get('/admin/stats/rides', { params }),
  
  getDriversStats: () => 
    axiosInstance.get('/admin/stats/drivers'),
  
  getRidesDashboardStats: (params) => 
    axiosInstance.get('/admin/rides/stats', { params }),

  // ============================================
  // PARAMÈTRES
  // ============================================
  
  getSettings: () => 
    axiosInstance.get('/admin/settings'),
  
  updateTarifs: (data) => 
    axiosInstance.put('/admin/settings/tarifs/update', data),

  // ============================================
  // GESTION DES MESSAGES DE CONTACT
  // ============================================
  
  /**
   * Récupérer tous les messages de contact
   * @param {Object} params - Filtres (status, search, page, per_page)
   */
  getContactMessages: (params) => 
    axiosInstance.get('/admin/contact', { params }),
  
  /**
   * Récupérer les statistiques des messages de contact
   */
  getContactStats: () => 
    axiosInstance.get('/admin/contact/stats'),
  
  /**
   * Récupérer un message de contact spécifique
   * @param {number} id - ID du message
   */
  getContactMessage: (id) => 
    axiosInstance.get(`/admin/contact/${id}`),
  
  /**
   * Marquer un message comme lu
   * @param {number} id - ID du message
   */
  markContactAsRead: (id) => 
    axiosInstance.put(`/admin/contact/${id}/read`),
  
  /**
   * Marquer un message comme traité
   * @param {number} id - ID du message
   */
  markContactAsProcessed: (id) => 
    axiosInstance.put(`/admin/contact/${id}/processed`),
  
  /**
   * Archiver un message
   * @param {number} id - ID du message
   */
  archiveContactMessage: (id) => 
    axiosInstance.put(`/admin/contact/${id}/archive`),
  
  /**
   * Répondre à un message de contact
   * @param {number} id - ID du message
   * @param {Object} data - Contient subject et reply_message
   */
  replyToContactMessage: (id, data) => 
    axiosInstance.post(`/admin/contact/${id}/reply`, data),
  
  /**
   * Supprimer un message de contact
   * @param {number} id - ID du message
   */
  deleteContactMessage: (id) => 
    axiosInstance.delete(`/admin/contact/${id}`),

  // ============================================
  // GESTION DES TICKETS SUPPORT
  // ============================================
  
  /**
   * Récupérer tous les tickets support
   * @param {Object} params - Filtres (status, user_type, priority, search, page, per_page)
   */
  getSupportTickets: (params) => 
    axiosInstance.get('/admin/support', { params }),
  
  /**
   * Récupérer les statistiques des tickets support
   */
  getSupportStats: () => 
    axiosInstance.get('/admin/support/stats'),
  
  /**
   * Récupérer un ticket support spécifique
   * @param {number} id - ID du ticket
   */
  getSupportTicket: (id) => 
    axiosInstance.get(`/admin/support/${id}`),
  
  /**
   * Mettre à jour le statut d'un ticket
   * @param {number} id - ID du ticket
   * @param {Object} data - Contient status
   */
  updateSupportStatus: (id, data) => 
    axiosInstance.put(`/admin/support/${id}/status`, data),
  
  /**
   * Répondre à un ticket support
   * @param {number} id - ID du ticket
   * @param {Object} data - Contient subject et reply_message
   */
  replyToSupportTicket: (id, data) => 
    axiosInstance.post(`/admin/support/${id}/reply`, data),
  
  /**
   * Télécharger la pièce jointe d'un ticket
   * @param {number} id - ID du ticket
   */
  downloadSupportAttachment: (id) => 
    axiosInstance.get(`/admin/support/${id}/download`, { responseType: 'blob' }),
  
  /**
   * Supprimer un ticket support
   * @param {number} id - ID du ticket
   */
  deleteSupportTicket: (id) => 
    axiosInstance.delete(`/admin/support/${id}`),
};