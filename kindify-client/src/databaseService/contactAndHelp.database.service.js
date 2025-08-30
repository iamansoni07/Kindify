import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:3000/api";

const getToken = () => {
    const rawToken = localStorage.getItem('token');
    return rawToken ? JSON.parse(rawToken) : null;
};

const contactAndHelpDatabaseService = {
    submitContactForm: async (formData) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const response = await axios.post(`${API_URL}/contact/${formData.type}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error submitting contact form:", error);
            throw error;
        }
    },
};

export default contactAndHelpDatabaseService;