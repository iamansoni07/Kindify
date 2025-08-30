import axios from 'axios';

// The base URL should match your backend server
const API_URL = import.meta.env.VITE_BACKEND_URI + '/user';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const authService = {
    login: async (credentials, role) => {
        try {
            const response = await api.post(`/login/${role}`, credentials);

            if (response.data.token) {
                localStorage.setItem('token', JSON.stringify(response.data.token));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during login' };
        }
    },

    register: async (userData, role) => {
        try {
            const response = await api.post(`/register/${role}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during registration' };
        }
    },

    // Google OAuth methods
    googleAuth: async (googleToken, role) => {
        try {
            const response = await api.post(`/google-auth/${role}`, {
                googleToken,
                role
            });

            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during Google authentication' };
        }
    },

    verifyOtp: async ({ email, otp, role }) => {
        try {
            const response = await api.post(`/register/${role}/otp-verify`, { email, otp });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to verify OTP' };
        }
    },

    resendOtp: async (email, role) => {
        try {
            const response = await api.post(`/resend-otp/${role}`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to resend OTP' };
        }
    },

    forgotPassword: async (email, role) => {
        try {
            const response = await api.post(`/forgot-password/${role}`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to request password reset' };
        }
    },
    
    resetPassword: async (email, otp, newPassword, role) => {
        try {
            const response = await api.post(`/reset-password/${role}`, { email, otp, newPassword });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to reset password' };
        }
    },
    
    logout: () => {
        localStorage.removeItem('token');
    },

    updatePhoneProfileImage: async (data) => {
        try {
            const response = await api.post(`/update-phone-image`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile image' };
        }
    },

    getToken: () => {
        const rawToken = localStorage.getItem('token');
        const token = rawToken ? JSON.parse(rawToken) : null;
        return token;
    },

    getUserProfile: async () => {
        try {
            const rawToken = localStorage.getItem('token');
            const token = rawToken ? JSON.parse(rawToken) : null;
            if (!token) {
                throw new Error('No user is currently logged in');
            }
            const response = await api.get(`/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch user profile' };
        }
    }
};

export default authService; 