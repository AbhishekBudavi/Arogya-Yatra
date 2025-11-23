// utils/api.js
import axios from "axios";

// ------------------------------
//  Create Axios instance
// ------------------------------
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: send and receive cookies automatically
});

// ------------------------------
// Request Interceptor
// ------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    //  For cookie-based JWT, we don't manually attach any token
    // The browser automatically sends cookies when withCredentials = true
    return config;
  },
  (error) => {
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// ------------------------------
//  Response Interceptor
// ------------------------------
axiosInstance.interceptors.response.use(
  (response) => response, //  Return successful response directly
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.warn("Unauthorized (401): User not authenticated");
        // Optionally redirect user to login
        // window.location.href = "/login";
      } else if (status === 403) {
        console.warn(" Forbidden (403): Access denied");
      } else if (status === 500) {
        console.error("Server Error (500):", data);
      } else {
        console.error(`HTTP Error (${status}):`, data);
      }
    } else {
      console.error("Network or Axios Error:", error.message);
    }

    return Promise.reject(error);
  }
);
// ------------------------------
//  Helper Methods
// ------------------------------
export const getRequest = (url, config = {}) => axiosInstance.get(url, config);
export const postRequest = (url, data, config = {}) => axiosInstance.post(url, data, config);
export const putRequest = (url, data, config = {}) => axiosInstance.put(url, data, config);
export const deleteRequest = (url, config = {}) => axiosInstance.delete(url, config);


export const medicalHistoryAPI = {
  get: async () => {
    try {
      const response = await axiosInstance.get('/patient/medical-history');
      return response.data;
    } catch (error) {
      console.error('Error fetching medical history:', error);
      throw error.response?.data || { message: 'Failed to fetch medical history' };
    }
  },

  create: async (data) => {
    try {
      const response = await axiosInstance.post('/patient/medical-history', data);
      return response.data;
    } catch (error) {
      console.error('Error creating medical history:', error);
      throw error.response?.data || { message: 'Failed to create medical history' };
    }
  },

  update: async (data) => {
    try {
      const response = await axiosInstance.put('/patient/medical-history', data);
      return response.data;
    } catch (error) {
      console.error('Error updating medical history:', error);
      throw error.response?.data || { message: 'Failed to update medical history' };
    }
  },
};

// ------------------------------
// Appointment API helpers
// ------------------------------
export const appointmentAPI = {
  // Get all appointments for hospital
  getHospitalAppointments: async (hospitalId, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.date && { date: filters.date }),
      });
      
      const response = await axiosInstance.get(`/appointments/hospital/${hospitalId}/appointments?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hospital appointments:', error);
      throw error.response?.data || { message: 'Failed to fetch appointments' };
    }
  },

  // Get doctors for a hospital
  getHospitalDoctors: async (hospitalId) => {
    try {
      const response = await axiosInstance.get(`/hospital/doctors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hospital doctors:', error);
      throw error.response?.data || { message: 'Failed to fetch doctors' };
    }
  },

  // Get doctor availability for a specific date
  getDoctorAvailability: async (doctorId, hospitalId, appointmentDate) => {
    try {
      const response = await axiosInstance.get(`/appointments/slots`, {
        params: {
          doctor_id: doctorId,
          hospital_id: hospitalId,
          appointment_date: appointmentDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      throw error.response?.data || { message: 'Failed to fetch available slots' };
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error.response?.data || { message: 'Failed to update appointment status' };
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId, cancellationReason = '') => {
    try {
      const response = await axiosInstance.delete(`/appointments/${appointmentId}/cancel`, {
        data: { cancellation_reason: cancellationReason },
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error.response?.data || { message: 'Failed to cancel appointment' };
    }
  },

  // Get appointment details
  getAppointmentDetails: async (appointmentId) => {
    try {
      const response = await axiosInstance.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      throw error.response?.data || { message: 'Failed to fetch appointment details' };
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId, appointmentDate, appointmentTime) => {
    try {
      const response = await axiosInstance.put(`/appointments/${appointmentId}/reschedule`, {
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error.response?.data || { message: 'Failed to reschedule appointment' };
    }
  },
};

// ------------------------------
// Authentication & Patient helpers
// ------------------------------
// NOTE: endpoint paths assume backend mounts controllers under /api
//
export const authAPI = {
  sendOTP: async (mobile) => {
    return postRequest('/auth/send-otp', { mobile });
  },
  verifyOTP: async (mobile, otp) => {
    return postRequest('/auth/verify-otp', { mobile, otp });
  },
  // After verifyOTP the server sets a temporary cookie (patientAuthToken). No token needed here.
};

export const patientAPI = {
  // Fetch patients linked to phone using temporary token cookie set by verifyOTP
  getPatientsByPhone: async () => {
    return getRequest('/patient/by-phone');
  },
  // Select a patient (server will upgrade the temporary token to a permanent one)
  selectPatient: async (patient_id) => {
    return postRequest('/patient/select', { patient_id });
  },
  // Get currently selected patient (requires patientAuthToken cookie)
  getSelectedPatient: async () => {
    return getRequest('/patient/selected');
  },
};

// ------------------------------
// Hospital helpers
// ------------------------------
export const hospitalAPI = {
  register: async (hospitalData) => {
    try {
      const response = await axiosInstance.post('/hospital/register', hospitalData);
      return response.data;
    } catch (error) {
      console.error('Error registering hospital:', error);
      throw error.response?.data || { message: 'Failed to register hospital' };
    }
  },

  login: async (admin_mobile_number, password) => {
    try {
      const response = await axiosInstance.post('/hospital/login', {
        admin_mobile_number,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in hospital:', error);
      throw error.response?.data || { message: 'Failed to login hospital' };
    }
  },

  getDashboard: async () => {
    try {
      const response = await axiosInstance.get('/hospital/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching hospital dashboard:', error);
      throw error.response?.data || { message: 'Failed to fetch hospital dashboard' };
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/hospital/logout');
      return response.data;
    } catch (error) {
      console.error('Error logging out hospital:', error);
      throw error.response?.data || { message: 'Failed to logout hospital' };
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/hospital/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
      throw error.response?.data || { message: 'Failed to fetch hospital profile' };
    }
  },
};

export const api = axiosInstance;
export default axiosInstance;
