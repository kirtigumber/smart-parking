// ===================================================================
// SMART PARK - REST API SERVICE LAYER (Spring Boot Integration)
// Phase 3: JWT Bearer token attached to all protected requests
// Base URL: http://localhost:8080/api
// ===================================================================

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:8080/api`;
    }
  }
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getApiBaseUrl();

// Retrieve JWT token from localStorage
const getToken = () => localStorage.getItem('smart_park_token');

// Build headers — attaches Authorization: Bearer <token> when available
const getHeaders = (requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || errorJson.error || errorMsg;
    } catch {
      // fallback to status text
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  // --- AUTH (Phase 3) ---
  async login(email, password) {
    try {
      const cleanEmail = email ? email.trim() : '';
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email: cleanEmail, password })
      });
      return await handleResponse(res);
    } catch (err) {
      if (!err.status && (err.name === 'TypeError' || err.message?.includes('fetch'))) {
        const connErr = new Error(`Cannot reach Spring Boot backend at ${API_BASE_URL}. Ensure the backend is running on port 8080.`);
        connErr.status = 503;
        throw connErr;
      }
      throw err;
    }
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  // --- PARKING LOCATIONS ---
  async getLocations(search = '', category = 'All') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/parking-lots${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getLocationById(id) {
    const res = await fetch(`${API_BASE_URL}/parking-lots/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createLocation(locationData) {
    const res = await fetch(`${API_BASE_URL}/parking-lots`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(locationData)
    });
    return handleResponse(res);
  },

  async updateLocation(id, locationData) {
    const res = await fetch(`${API_BASE_URL}/parking-lots/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(locationData)
    });
    return handleResponse(res);
  },

  async deleteLocation(id) {
    const res = await fetch(`${API_BASE_URL}/parking-lots/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  // --- PARKING SLOTS ---
  async getSlotsForLocation(locationId) {
    const res = await fetch(`${API_BASE_URL}/parking-lots/${locationId}/slots`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createSlot(slotData) {
    const res = await fetch(`${API_BASE_URL}/parking-slots`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(slotData)
    });
    return handleResponse(res);
  },

  async updateSlot(id, slotData) {
    const res = await fetch(`${API_BASE_URL}/parking-slots/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(slotData)
    });
    return handleResponse(res);
  },

  async deleteSlot(id) {
    const res = await fetch(`${API_BASE_URL}/parking-slots/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  async updateSlotStatus(slotId, status) {
    const res = await fetch(`${API_BASE_URL}/parking-slots/${slotId}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async updateSlotStatusByNumber(locationId, slotNumber, status, vehicle = null) {
    const res = await fetch(`${API_BASE_URL}/parking-slots/${locationId}/${slotNumber}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status, vehicle })
    });
    return handleResponse(res);
  },

  // --- RESERVATIONS ---
  async getReservations() {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  async getReservationById(bookingId) {
    const res = await fetch(`${API_BASE_URL}/reservations/${bookingId}`, {
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  async getUserReservations(email) {
    const res = await fetch(`${API_BASE_URL}/reservations/user/${encodeURIComponent(email)}`, {
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  async createReservation(reservationData) {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(reservationData)
    });
    return handleResponse(res);
  },

  async cancelReservation(bookingId) {
    const res = await fetch(`${API_BASE_URL}/reservations/${bookingId}/cancel`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  async verifyQrTicket(bookingId) {
    const res = await fetch(`${API_BASE_URL}/reservations/verify/${encodeURIComponent(bookingId)}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async admitVehicle(bookingId) {
    const res = await fetch(`${API_BASE_URL}/reservations/verify/${encodeURIComponent(bookingId)}/admit`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  // --- USERS & ADMIN ---
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(true)
    });
    return handleResponse(res);
  },

  async updateProfile(email, profileData) {
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getHeaders(true)
    });
    return handleResponse(res);
  }
};
