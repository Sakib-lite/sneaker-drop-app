import { createContext, useContext, useState, useEffect } from 'react';
import { dropAPI, reservationAPI, purchaseAPI, userAPI } from '../services/api';
import socketService from '../services/socket';
import { useSnackbar } from 'notistack';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [drops, setDrops] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const socket = socketService.connect();

    socketService.on('STOCK_UPDATE', (data) => {
      setDrops((prevDrops) =>
        prevDrops.map((drop) =>
          drop.id === data.dropId
            ? { ...drop, availableStock: data.availableStock }
            : drop
        )
      );
    });

    socketService.on('PURCHASE_COMPLETED', (data) => {
      setDrops((prevDrops) =>
        prevDrops.map((drop) =>
          drop.id === data.dropId
            ? {
                ...drop,
                availableStock: data.availableStock,
                recentPurchasers: data.recentPurchasers || drop.recentPurchasers,
              }
            : drop
        )
      );
    });

    socketService.on('NEW_DROP', (data) => {
      setDrops((prevDrops) => [data.drop, ...prevDrops]);
      enqueueSnackbar(`New drop available: ${data.drop.name}`, { variant: 'info' });
    });

    return () => {
      socketService.disconnect();
    };
  }, [enqueueSnackbar]);

  const loginUser = async (username) => {
    try {
      setLoading(true);
      const { data } = await userAPI.createUser({ username });
      setUser(data.data);
      localStorage.setItem('userId', data.data.id);
      localStorage.setItem('username', data.data.username);
      enqueueSnackbar(`Welcome, ${username}!`, { variant: 'success' });
      return data.data;
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Failed to create user', { variant: 'error' });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchDrops = async () => {
    try {
      setLoading(true);
      const { data } = await dropAPI.getAllDrops();
      setDrops(data.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch drops', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async (userId) => {
    try {
      const { data } = await reservationAPI.getMyReservations(userId);
      setReservations(data.data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  const createReservation = async (dropId) => {
    if (!user) {
      enqueueSnackbar('Please login first', { variant: 'warning' });
      return;
    }

    try {
      const { data } = await reservationAPI.createReservation({
        userId: user.id,
        dropId,
      });
      enqueueSnackbar('Reserved successfully!', { variant: 'success' });
      await fetchReservations(user.id);
      return data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reserve';
      enqueueSnackbar(message, { variant: 'error' });
      throw error;
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      await reservationAPI.cancelReservation(reservationId, user.id);
      enqueueSnackbar('Reservation cancelled', { variant: 'info' });
      await fetchReservations(user.id);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const completePurchase = async (dropId) => {
    try {
      const { data } = await purchaseAPI.completePurchase({
        userId: user.id,
        dropId,
      });
      enqueueSnackbar('Purchase completed! 🎉', { variant: 'success' });
      await fetchReservations(user.id);
      await fetchDrops();
      return data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to purchase';
      enqueueSnackbar(message, { variant: 'error' });
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    drops,
    reservations,
    loading,
    loginUser,
    fetchDrops,
    fetchReservations,
    createReservation,
    cancelReservation,
    completePurchase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
