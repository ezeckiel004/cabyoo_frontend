// src\api\admin.js
import axiosInstance from './axiosConfig';

export const adminAPI = {
  // Authentification
  login: (email, password, deviceName) => 
    axiosInstance.post('/auth/login', { email, password, device_name: deviceName }),
  
  logout: () => 
    axiosInstance.post('/auth/logout'),
  
  getMe: () => 
    axiosInstance.get('/auth/me'),
  
  // Gestion des utilisateurs
  getUsers: (params) => 
    axiosInstance.get('/admin/users', { params }),
  
  getClients: () => 
    axiosInstance.get('/admin/users/clients'),
  
  getDrivers: () => 
    axiosInstance.get('/admin/users/drivers'),
  
  // NOUVELLE MÉTHODE - Créer un utilisateur (client, chauffeur ou admin)
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
  
  // Chauffeurs en attente
  getPendingDrivers: () => 
    axiosInstance.get('/admin/pending-drivers'),
  
  approveDriver: (id, data) => 
    axiosInstance.post(`/admin/pending-drivers/${id}/approve`, data),
  
  rejectDriver: (id, data) => 
    axiosInstance.post(`/admin/pending-drivers/${id}/reject`, data),
  
  // Gestion des courses (VISUALISATION SEULEMENT)
  getRides: (params) => 
    axiosInstance.get('/admin/rides', { params }),
  
  getRide: (id) => 
    axiosInstance.get(`/admin/rides/${id}`),
  
  updateRide: (id, data) => 
    axiosInstance.put(`/admin/rides/${id}`, data),
  
  // Statistiques
  getOverviewStats: () => 
    axiosInstance.get('/admin/stats/overview'),
  
  getRevenueStats: (params) => 
    axiosInstance.get('/admin/stats/revenue', { params }),
  
  getRidesStats: (params) => 
    axiosInstance.get('/admin/stats/rides', { params }),
  
  getDriversStats: () => 
    axiosInstance.get('/admin/stats/drivers'),
  
  // Statistiques courses
  getRidesDashboardStats: (params) => 
    axiosInstance.get('/admin/rides/stats', { params }),
  
  // Paramètres
  getSettings: () => 
    axiosInstance.get('/admin/settings'),
  
  updateTarifs: (data) => 
    axiosInstance.put('/admin/settings/tarifs/update', data),
};