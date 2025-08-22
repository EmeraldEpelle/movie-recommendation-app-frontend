import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await apiCall('/auth/verify');
          setUser(response.user);
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: userData,
      });

      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiCall('/users/profile', {
        method: 'PUT',
        body: profileData,
      });

      setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Movie-related API calls
  const addToFavorites = async (movieData) => {
    try {
      const response = await apiCall('/users/favorites', {
        method: 'POST',
        body: movieData,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      const response = await apiCall(`/users/favorites/${movieId}`, {
        method: 'DELETE',
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const addToWatchlist = async (movieData) => {
    try {
      const response = await apiCall('/users/watchlist', {
        method: 'POST',
        body: movieData,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await apiCall(`/users/watchlist/${movieId}`, {
        method: 'DELETE',
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const rateMovie = async (movieId, rating, review = '') => {
    try {
      const response = await apiCall('/users/ratings', {
        method: 'POST',
        body: { movieId, rating, review },
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getFavorites = async () => {
    try {
      const response = await apiCall('/users/favorites');
      return { success: true, data: response.favorites };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getWatchlist = async () => {
    try {
      const response = await apiCall('/users/watchlist');
      return { success: true, data: response.watchlist };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getRatings = async () => {
    try {
      const response = await apiCall('/users/ratings');
      return { success: true, data: response.ratings };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    rateMovie,
    getFavorites,
    getWatchlist,
    getRatings,
    apiCall,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

