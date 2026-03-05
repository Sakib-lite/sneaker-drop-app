import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  createUser: (data) => api.post('/api/users', data),
  getUser: (id) => api.get(`/api/users/${id}`),
};

export const dropAPI = {
  createDrop: (data) => api.post('/api/drops', data),
  getAllDrops: () => api.get('/api/drops'),
  getDrop: (id) => api.get(`/api/drops/${id}`),
};

export const reservationAPI = {
  createReservation: (data) => api.post('/api/reservations', data),
  getMyReservations: (userId) => api.get('/api/reservations/my-reservations', { params: { userId } }),
  cancelReservation: (id, userId) => api.delete(`/api/reservations/${id}`, { data: { userId } }),
};

export const purchaseAPI = {
  completePurchase: (data) => api.post('/api/purchases', data),
};

export default api;
