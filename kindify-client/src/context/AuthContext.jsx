import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if token is expired
    const isTokenExpired = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };

    // Get valid token from storage
    const getValidToken = () => {
        const token = authService.getToken();
        if (!token || isTokenExpired(token)) {
            authService.logout();
            return null;
        }
        return token;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = getValidToken();
                if (!token) {
                    setLoading(false);
                    return;
                }
                const data = await authService.getUserProfile();
                setUser(data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError(err.message);
                authService.logout(); // Clear invalid token
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials, role) => {
        try {
            setError(null);
            const data = await authService.login(credentials, role);
            setUser(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const googleAuth = async (googleToken, role) => {
        try {
            setError(null);
            const data = await authService.googleAuth(googleToken, role);
            setUser(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        googleAuth,
        logout,
        isAuthenticated: !!user,
        refreshToken: getValidToken
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 