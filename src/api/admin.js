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
  
  // Récupérer l'utilisateur connecté
  getMe: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        return axiosInstance.get('/auth/me');
      }
      throw error;
    }
  },

  // Mettre à jour le profil
  updateProfile: (data) => {
    if (data instanceof FormData) {
      return axiosInstance.post('/auth/update-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosInstance.post('/auth/update-profile', data);
  },
  
  // ✅ NOUVEAU: Supprimer l'avatar
  deleteAvatar: () => 
    axiosInstance.delete('/auth/avatar'),
  
  // Changer le mot de passe
  updatePassword: (data) => 
    axiosInstance.post('/auth/update-password', data),

  // ============================================
  // GESTION DES UTILISATEURS
  // ============================================
  
  getUsers: (params) => 
    axiosInstance.get('/admin/users', { params }),
  
  getClients: () => 
    axiosInstance.get('/admin/users/clients'),
  
  getDrivers: () => 
    axiosInstance.get('/admin/users/drivers'),
  
  createUser: (data) => {
    if (data.role === 'chauffeur') {
      return axiosInstance.post('/admin/users/drivers', data);
    }
    return axiosInstance.post('/admin/users', data);
  },
  
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
  
  getOverviewStats: (params) => 
    axiosInstance.get('/admin/stats/overview', { params }),
  
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
  
  getSettingsByGroup: (group) => 
    axiosInstance.get(`/admin/settings/${group}`),
  
  createSetting: (data) => 
    axiosInstance.post('/admin/settings', data),
  
  updateSetting: (id, data) => 
    axiosInstance.put(`/admin/settings/${id}`, data),
  
  updateTarifs: (data) => 
    axiosInstance.put('/admin/settings/tarifs/update', data),
  
  updateGeneralSettings: (data) => 
    axiosInstance.put('/admin/settings/general/update', data),
  
  updatePaymentsSettings: (data) => 
    axiosInstance.put('/admin/settings/payments/update', data),
  
  updateNotificationsSettings: (data) => 
    axiosInstance.put('/admin/settings/notifications/update', data),

  // ============================================
  // GESTION DES MESSAGES DE CONTACT
  // ============================================
  
  getContactMessages: (params) => 
    axiosInstance.get('/admin/contact', { params }),
  
  getContactStats: () => 
    axiosInstance.get('/admin/contact/stats'),
  
  getContactMessage: (id) => 
    axiosInstance.get(`/admin/contact/${id}`),
  
  markContactAsRead: (id) => 
    axiosInstance.put(`/admin/contact/${id}/read`),
  
  markContactAsProcessed: (id) => 
    axiosInstance.put(`/admin/contact/${id}/processed`),
  
  archiveContactMessage: (id) => 
    axiosInstance.put(`/admin/contact/${id}/archive`),
  
  replyToContactMessage: (id, data) => 
    axiosInstance.post(`/admin/contact/${id}/reply`, data),
  
  deleteContactMessage: (id) => 
    axiosInstance.delete(`/admin/contact/${id}`),

  // ============================================
  // GESTION DES TICKETS SUPPORT
  // ============================================
  
  getSupportTickets: (params) => 
    axiosInstance.get('/admin/support', { params }),
  
  getSupportStats: () => 
    axiosInstance.get('/admin/support/stats'),
  
  getSupportTicket: (id) => 
    axiosInstance.get(`/admin/support/${id}`),
  
  updateSupportStatus: (id, data) => 
    axiosInstance.put(`/admin/support/${id}/status`, data),
  
  replyToSupportTicket: (id, data) => 
    axiosInstance.post(`/admin/support/${id}/reply`, data),
  
  downloadSupportAttachment: (id) => 
    axiosInstance.get(`/admin/support/${id}/download`, { responseType: 'blob' }),
  
  deleteSupportTicket: (id) => 
    axiosInstance.delete(`/admin/support/${id}`),

  // ============================================
  // GESTION DES INVESTISSEMENTS
  // ============================================
  
  getInvestments: (params) => 
    axiosInstance.get('/admin/investments', { params }),
  
  getInvestmentsStats: () => 
    axiosInstance.get('/admin/investments/stats'),
  
  getInvestment: (id) => 
    axiosInstance.get(`/admin/investments/${id}`),
  
  updateInvestment: (id, data) => 
    axiosInstance.put(`/admin/investments/${id}`, data),
  
  markInvestmentContacted: (id) => 
    axiosInstance.post(`/admin/investments/${id}/contacted`),
  
  archiveInvestment: (id) => 
    axiosInstance.post(`/admin/investments/${id}/archive`),
  
  deleteInvestment: (id) => 
    axiosInstance.delete(`/admin/investments/${id}`),
  
  exportInvestments: (params) => 
    axiosInstance.get('/admin/investments/export', { params, responseType: 'blob' }),

  // ============================================
  // GESTION DES ANNONCES PUBLICITAIRES
  // ============================================
  
  getAdvertisements: () => 
    axiosInstance.get('/admin/advertisements'),
  
  getActiveAdvertisements: () => 
    axiosInstance.get('/advertisements/active'),
  
  createAdvertisement: (data) => {
    if (data instanceof FormData) {
      return axiosInstance.post('/admin/advertisements', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosInstance.post('/admin/advertisements', data);
  },
  
  getAdvertisement: (id) => 
    axiosInstance.get(`/admin/advertisements/${id}`),
  
  updateAdvertisement: (id, data) => {
    if (data instanceof FormData) {
      return axiosInstance.post(`/admin/advertisements/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosInstance.put(`/admin/advertisements/${id}`, data);
  },
  
  deleteAdvertisement: (id) => 
    axiosInstance.delete(`/admin/advertisements/${id}`),
  
  toggleAdvertisementActive: (id) => 
    axiosInstance.post(`/admin/advertisements/${id}/toggle`),
  
  updateAdvertisementsOrder: (advertisements) => 
    axiosInstance.post('/admin/advertisements/update-order', { advertisements }),
};